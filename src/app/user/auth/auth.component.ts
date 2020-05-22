// angular
import { Component, OnInit, ViewChild, ElementRef, ComponentFactoryResolver, OnDestroy, Inject, ComponentRef, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, FormGroupDirective } from '@angular/forms';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
// material
import { MatButton } from '@angular/material/button';
// rxjs
import { Subject, Observable, pipe } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
// ngrx
import { Store, select } from '@ngrx/store';
// custom
import { PlaceholderDirective } from '@app/shared/directives';
import { LoggerService, SeoService } from '@app/shared/services';
import * as fromApp from '@app/store';
import * as AuthActions from './store/actions';
import * as fromAuth from './store';
import { AlertComponent } from '@app/shared/components';
import { environment } from '@env/environment';
import { IDirtyCheckGuard } from '@app/shared/guards';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy, IDirtyCheckGuard {

  authMode: string;
  form: FormGroup;
  fileOptions = {
    // Core
    name: 'filepond',
    maxFiles: 1,
    maxParallelUploads: 1,
    checkValidity: true,
    class: 'filepond',
    // FilePondPluginFileValidateType
    acceptedFileTypes: ['image/jpeg'],
    fileValidateTypeLabelExpectedTypesMap: { 'image/jpeg': '.jpg' },
    // FilePondPluginImagePreview
    allowImagePreview: true,
    imagePreviewTransparencyIndicator: '#f00',
    // FilePondPluginImageExifOrientation
    allowImageExifOrientation: true,
    // FilePondPluginFileValidateSize
    maxFileSize: '1MB',
    // FilePondPluginImageValidateSize
    imageValidateSizeMinWidth: 100,
    imageValidateSizeMaxWidth: 400,
    imageValidateSizeMinHeight: 100,
    imageValidateSizeMaxHeight: 400,
    // server
    server: {
      url: environment.cloudinary.server,
      process: {
        url: environment.cloudinary.url.uploadImage,
        method: 'POST',
        withCredentials: false,
        onload: null,
        onerror: (res) => console.error(res),
        ondata: (fd: any) => {

          fd = new FormData();
          fd.append('file', this.filepond.getFile().file);
          fd.append('unsigned', true);
          fd.append('upload_preset', environment.cloudinary.presets);
          return fd;

        }
      },
    }
  };
  pondFiles: [];
  private onDestroy$: Subject<void> = new Subject<void>();
  private isSubmitted = false;
  private readonly _EMAIL_VALIDATOR = [
    Validators.required,
    Validators.email,
    Validators.minLength(10),
    Validators.maxLength(100)
  ];
  private readonly _PASSWORD_VALIDATOR = [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(100)
  ];
  private alertComponentRef: ComponentRef<AlertComponent>;
  private isSwitchedAuthModeFromHere: boolean;
  private isConfirmedChanges = false;
  isLoading$: Observable<boolean> = this.store$.pipe(takeUntil(this.onDestroy$), select(fromAuth.selectLoading));
  @ViewChild(PlaceholderDirective, { static: true }) alert: PlaceholderDirective;
  @ViewChild('email', { static: true }) email: ElementRef;
  @ViewChild('submitButton', { static: true }) submitButton: MatButton;
  @ViewChild('filepond') filepond: any;
  @ViewChild('formDirective') formDirective: FormGroupDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private formBuilder: FormBuilder,
    private logger: LoggerService,
    private store$: Store<fromApp.AppState>,
    private seoService: SeoService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId) {

    this.seoService.config({ title: 'Auth', url: 'user/auth' });

  }

  ngOnInit(): void {

    this._initForm();
    this._getSuccessfulMessage();
    this._getUnsuccessfulMessage();
    this._onChangeAuthMode();

  }

  ngOnDestroy(): void {

    this.store$.dispatch(AuthActions.resetOnSuccessfulLogin());
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  private _initForm(): void {

    this.form = this.formBuilder.group({
      user: this.formBuilder.group({
        email: [null,
          {
            validators: this._EMAIL_VALIDATOR

          }
        ],
        password: [null,
          {
            validators: this._PASSWORD_VALIDATOR

          }
        ],
        remember: [null]
      })
    }, { updateOn: 'blur' });

    if (isPlatformBrowser(this.platformId)) {
      this.emailElement.focus({ preventScroll: true });
    }

  }

  get userGroup(): AbstractControl {

    return this.form.get('user');

  }

  get emailControl(): AbstractControl {

    return this.form.get('user').get('email');

  }

  get passwordControl(): AbstractControl {

    return this.form.get('user.password');

  }

  get emailElement(): HTMLElement {

    if (isPlatformBrowser(this.platformId)) {
      return this.email.nativeElement;
    }

  }

  get fileElement(): HTMLElement {

    if (isPlatformBrowser(this.platformId)) {
      return this.document.getElementsByName('filepond')[1];
    }

  }

  get submitButtonElement(): HTMLElement {

    if (isPlatformBrowser(this.platformId)) {
      return this.submitButton._elementRef.nativeElement;
    }

  }

  private _editForm(): void {

    this._resetForm();

    if (this.authMode === 'register') {
      (this.userGroup as FormGroup).removeControl('remember');
    }
    else {
      (this.userGroup as FormGroup).addControl('remember', new FormControl(null));
    }

  }

  private _resetForm(): void {

    if (this.formDirective) {
      this.formDirective.resetForm();
    }

    this.form.reset();
    if (isPlatformBrowser(this.platformId)) {
      this.emailElement.focus({ preventScroll: true });
    }
    this.isSubmitted = false;

  }

  onSubmit(): void {

    this.isSubmitted = true;

    if (this.form.invalid) {
      return;
    }
    if (this.authMode === 'register') {
      const file = JSON.parse(this.fileElement.getAttribute('value'));
      let data = this.userGroup.value;

      if (new Object(file).hasOwnProperty('url')) {
        data = Object.assign({ file: file.url }, data);
      }

      this.store$.dispatch(AuthActions.registerStart({ data }));
    }
    else {
      this.store$.dispatch(AuthActions.loginStart({ data: this.userGroup.value }));
    }

  }

  onTriggerSubmit = (): void => this.submitButtonElement.click();

  private _getSuccessfulMessage(): void {

    this.store$
      .pipe(
        takeUntil(this.onDestroy$),
        select(fromAuth.selectRegister),
        filter(res => res !== null)
      )
      .subscribe((res) => {

        this._showAlertMessage(res.message, false);
        this.switchAuthModeTo('login');

      });

  }

  private _getUnsuccessfulMessage(): void {

    this.store$
      .pipe(
        takeUntil(this.onDestroy$),
        select(fromAuth.selectError),
        filter(res => res !== null)
      )
      .subscribe((res) => this._showAlertMessage(res, true));

  }

  canDeactivate(): boolean {

    if (!this.isSubmitted && this.form.dirty) {
      this.isConfirmedChanges = confirm('Are you shure ?');
      return this.isConfirmedChanges;
    }

    return true;

  }

  private _onChangeAuthMode() {

    this.store$
      .pipe(
        takeUntil(this.onDestroy$),
        select(fromAuth.selectAuthMode)
      )
      .subscribe(res => {

        if (this.isSwitchedAuthModeFromHere && this.isConfirmedChanges) {
          this.authMode = res.mode;
          this._editForm();
        }
        else if (!this.isSwitchedAuthModeFromHere && !this.isConfirmedChanges) {
          if (this.canDeactivate()) {
            this.authMode = res.mode;
            this._editForm();
          }
        }
        else {
          this.authMode = res.mode;
          this._editForm();
        }

        this.isSwitchedAuthModeFromHere = false;
        this.isConfirmedChanges = false;

      });

  }

  private _showAlertMessage(message: string, hasError: boolean): void {

    if (message !== undefined) {
      const alertComponent = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
      const viewCntrRef = this.alert.viewCntrRef;
      viewCntrRef.clear();
      this.alertComponentRef = viewCntrRef.createComponent(alertComponent);
      this.alertComponentRef.instance.message = message;
      this.alertComponentRef.instance.hasError = hasError;
      this.alertComponentRef.instance.close
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((res: boolean) => {

          if (res) {
            this.alertComponentRef.destroy();
          }

        });
    }

  }

  switchAuthModeTo(mode: string): void {

    if (this.canDeactivate()) {
      this.isSwitchedAuthModeFromHere = true;
      this.store$.dispatch(AuthActions.switchModeTo({ authMode: { mode } }));
    }

  }


  hasEmailControlErrorRequired = (control: AbstractControl): boolean =>
    (control.hasError('required') || control.hasError('email')) && (control.dirty || control.touched)


  hasPasswordControlErrorRequired = (control: AbstractControl): boolean =>
    control.hasError('required') && (control.dirty || control.touched)


  hasControlErrorLengtgh = (control: AbstractControl): boolean =>
    !(control.hasError('minLength') && control.hasError('maxLength')) && (control.dirty || control.touched)

}
