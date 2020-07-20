// angular
import {
  Component, OnInit, ViewChild, ElementRef,
  OnDestroy, Inject,
  PLATFORM_ID, ViewContainerRef
} from '@angular/core';
import {
  FormGroup, FormBuilder, Validators,
  FormControl, AbstractControl, FormGroupDirective
} from '@angular/forms';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
// material
import { MatButton } from '@angular/material/button';
// rxjs
import { Subject, Observable } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
// ngrx
import { Store, select } from '@ngrx/store';
// custom
import { LoggerService, SeoService, AlertService } from '../../shared/services';
import * as fromApp from '../../store';
import * as AuthActions from './store/actions';
import * as fromAuth from './store';
import { environment } from '../../../environments/environment';
import { DirtyCheck } from '../../shared/guards';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy, DirtyCheck {

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
  isLoading$: Observable<boolean>;
  hidePassword = true;
  @ViewChild('alertContainer', { read: ViewContainerRef }) alertContainer: ViewContainerRef;
  @ViewChild('email', { static: true }) email: ElementRef;
  @ViewChild('submitButton', { static: true }) submitButton: MatButton;
  @ViewChild('filepond') filepond: any;
  @ViewChild('formDirective') formDirective: FormGroupDirective;
  private onDestroy$: Subject<void> = new Subject<void>();
  private isSubmitted = false;
  private readonly EMAIL_VALIDATOR = [
    Validators.required,
    Validators.email,
    Validators.minLength(10),
    Validators.maxLength(100)
  ];
  private readonly PASSWORD_VALIDATOR = [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(100)
  ];
  private isSwitchedAuthModeFromHere: boolean;
  private isConfirmedChanges = false;

  constructor(
    private formBuilder: FormBuilder,
    private logger: LoggerService,
    private store$: Store<fromApp.AppState>,
    private seoService: SeoService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId,
    private alertService: AlertService) {

    this.seoService.config({ title: 'Auth', url: 'user/auth' });
    this.isLoading$ = this.store$.pipe(takeUntil(this.onDestroy$), select(fromAuth.selectLoading));

  }

  ngOnInit(): void {

    this.initForm();
    this.getSuccessfulMessage();
    this.getUnsuccessfulMessage();
    this.onChangeAuthMode();

  }

  ngOnDestroy(): void {

    this.store$.dispatch(AuthActions.resetOnSuccessfulLogin());
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  private initForm(): void {

    this.form = this.formBuilder.group({
      user: this.formBuilder.group({
        email: [null,
          {
            validators: this.EMAIL_VALIDATOR
          }
        ],
        password: [null,
          {
            validators: this.PASSWORD_VALIDATOR
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

  private editForm(): void {

    this.resetForm();

    if (this.authMode === 'register') {
      (this.userGroup as FormGroup).removeControl('remember');
    }
    else {
      (this.userGroup as FormGroup).addControl('remember', new FormControl(null));
    }

  }

  private resetForm(): void {

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

  onTriggerSubmit(): void {

    this.submitButtonElement.click();

  }

  private getSuccessfulMessage(): void {

    this.store$
      .pipe(
        takeUntil(this.onDestroy$),
        select(fromAuth.selectRegister),
        filter(res => res !== null)
      )
      .subscribe((res) => {

        this.showAlertMessage(res.message, false);
        this.switchAuthModeTo('login');

      });

  }

  private getUnsuccessfulMessage(): void {

    this.store$
      .pipe(
        takeUntil(this.onDestroy$),
        select(fromAuth.selectError),
        filter(res => res !== null)
      )
      .subscribe((res) => this.showAlertMessage(res, true));

  }

  canDeactivate(): boolean {

    if (!this.isSubmitted && this.form.dirty) {
      this.isConfirmedChanges = confirm('Are you shure ?');
      return this.isConfirmedChanges;
    }

    return true;

  }

  private onChangeAuthMode(): void {

    this.store$
      .pipe(
        takeUntil(this.onDestroy$),
        select(fromAuth.selectAuthMode)
      )
      .subscribe(res => {

        if (this.isSwitchedAuthModeFromHere && this.isConfirmedChanges) {
          this.authMode = res.mode;
          this.editForm();
        }
        else if (!this.isSwitchedAuthModeFromHere && !this.isConfirmedChanges) {
          if (this.canDeactivate()) {
            this.authMode = res.mode;
            this.editForm();
          }
        }
        else {
          this.authMode = res.mode;
          this.editForm();
        }

        this.isSwitchedAuthModeFromHere = false;
        this.isConfirmedChanges = false;

      });

  }

  private showAlertMessage(message: string, hasError: boolean): void {

    if (this.alertContainer) {
      this.alertService.showMessage(this.alertContainer, message, hasError);
    }

  }

  switchAuthModeTo(mode: string): void {

    if (this.canDeactivate()) {
      this.isSwitchedAuthModeFromHere = true;
      this.store$.dispatch(AuthActions.switchModeTo({ authMode: { mode } }));
    }

  }


  hasEmailControlErrorRequired(control: AbstractControl): boolean {

    return (control.hasError('required') || control.hasError('email'))
      && (control.dirty || control.touched);

  }


  hasPasswordControlErrorRequired(control: AbstractControl): boolean {

    return control.hasError('required') && (control.dirty || control.touched);

  }


  hasControlErrorLengtgh(control: AbstractControl): boolean {

    return !(control.hasError('minLength') && control.hasError('maxLength'))
      && (control.dirty || control.touched);

  }

}
