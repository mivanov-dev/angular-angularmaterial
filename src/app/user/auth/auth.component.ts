// angular
import {
  Component, OnInit, ViewChild,
  OnDestroy, Inject,
  ViewContainerRef, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import {
  FormGroup, FormBuilder,
  FormControl, AbstractControl, FormGroupDirective
} from '@angular/forms';
import { DOCUMENT } from '@angular/common';
// material
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
// rxjs
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
// ngrx
import { Store } from '@ngrx/store';
// custom
import { AlertService, SeoService } from '@app/shared/services';
import * as fromApp from '../../store';
import * as AuthActions from './store/actions';
import * as AuthModels from './store/models';
import * as fromAuth from './store/reducer';
import { environment } from 'src/environments/environment';
import { DirtyCheck } from '@app/shared/guards';
import { UserFormValidatorToken, UserFormValidator } from '../validators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy, DirtyCheck, AfterViewInit {

  authMode?: string;
  form: FormGroup;
  isLoading = false;
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
        onerror: (res: any) => console.error(res),
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
  pondFiles: [] = [];
  hidePassword = true;
  isEnabledOtp = false;
  submitButtonElement?: HTMLButtonElement;
  @ViewChild('alertContainer', { static: false, read: ViewContainerRef }) alertContainer?: ViewContainerRef;
  @ViewChild('emailInput', { static: false, read: MatInput }) emailInput?: MatInput;
  @ViewChild('submitButton', { static: false, read: MatButton }) submitButton?: MatButton;
  @ViewChild('filepond', { static: false }) filepond?: any;
  @ViewChild('formDirective', { static: false, read: FormGroupDirective }) formDirective?: FormGroupDirective;
  private onDestroy$: Subject<void> = new Subject<void>();
  private isSubmitted = false;
  private isSwitchedAuthModeFromHere?: boolean;
  private isConfirmedChanges = false;

  constructor(
    private formBuilder: FormBuilder,
    private store$: Store<fromApp.AppState>,
    private seoService: SeoService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    @Inject(UserFormValidatorToken) private userFormValidator: UserFormValidator) {

    this.seoService.config({ title: 'Auth', url: 'user/auth' });
    this.form = this.initForm();

  }

  get userGroup(): AbstractControl | null {
    return this.form.get('user');
  }

  get emailControl(): AbstractControl | null {
    return this.form.get('user.email');
  }

  get passwordControl(): AbstractControl | null {
    return this.form.get('user.password');
  }

  get otpControl(): AbstractControl | null {
    return this.form.get('user.otpCode');
  }

  ngOnInit(): void {

    this.subscribeRegister();
    this.subscribeError();
    this.subscribeAuthMode();
    this.subscribeLoading();
    this.subscribeLogin();

  }

  ngAfterViewInit(): void {

    this.submitButtonElement = this.submitButton?._elementRef.nativeElement as HTMLButtonElement;
    // https://stackoverflow.com/a/54794081
    this.emailInput?.focus({ preventScroll: true });
    this.cdr.detectChanges();

  }

  ngOnDestroy(): void {

    // this.store$.dispatch(AuthActions.resetOnSuccessfulLogin());
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  private initForm(): FormGroup {

    const fg = this.formBuilder.group({
      user: this.formBuilder.group({
        email: [null, { validators: this.userFormValidator.EMAIL_VALIDATOR }],
        password: [null, { validators: this.userFormValidator.PASSWORD_VALIDATOR }],
        otpCode: [null],
        remember: [null]
      })
    }, { updateOn: 'blur' });

    return fg;

  }

  private editForm(): void {

    this.resetForm();

    if (this.authMode === 'register') {
      if (this.isEnabledOtp) {
        (this.userGroup as FormGroup).removeControl('otpCode');
      }
      (this.userGroup as FormGroup).removeControl('remember');
    }
    else {
      if (this.isEnabledOtp) {
        (this.userGroup as FormGroup).addControl('otpCode', new FormControl(null, { validators: this.userFormValidator.OTP_VALIDATOR }));
      }
      (this.userGroup as FormGroup).addControl('remember', new FormControl(null));
    }

  }

  private resetForm(): void {

    if (this.formDirective) {
      this.formDirective.resetForm();
    }

    this.form.reset();
    this.emailInput?.focus({ preventScroll: true });
    this.hidePassword = true;
    this.isSubmitted = false;
    this.isEnabledOtp = false;

  }

  onSubmit(): void {

    this.isSubmitted = true;

    if (this.form.invalid) {
      return;
    }
    if (this.authMode === 'register') {

      const filepondValue = (this.document.getElementsByName('filepond')[1] as HTMLInputElement).value;
      const file = JSON.parse(filepondValue ? filepondValue : '{}');
      let data = this.userGroup?.value;

      if (new Object(file).hasOwnProperty('url')) {
        data = Object.assign({ file: file.url }, data);
      }

      this.store$.dispatch(AuthActions.registerStart({ data }));
    }
    else {
      this.store$.dispatch(AuthActions.loginStart({ data: this.userGroup?.value }));
    }

  }

  onTriggerSubmit(): void {

    this.submitButtonElement?.click();

  }

  private subscribeRegister(): void {

    this.store$.select(fromAuth.selectRegister)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((res): res is AuthModels.Register => res !== null)
      )
      .subscribe((res) => {

        this.showAlertMessage(res.message, false);
        this.switchModeTo('login');

      });

  }

  private subscribeError(): void {

    this.store$.select(fromAuth.selectError)
      .pipe(
        takeUntil(this.onDestroy$),
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

  private subscribeAuthMode(): void {

    this.store$.select(fromAuth.selectAuthMode)
      .pipe(
        takeUntil(this.onDestroy$)
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

  private subscribeLoading(): void {

    this.store$.select(fromAuth.selectLoading)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => this.isLoading = res);

  }

  private subscribeLogin(): void {

    this.store$.select(fromAuth.selectLogin)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => {
        if (res?.otp) {
          this.isEnabledOtp = true;
          this.showAlertMessage(res.otp.message, false);
        }
      });

  }

  private showAlertMessage(message: string, hasError: boolean): void {

    if (this.alertContainer) {
      this.alertService.showMessage(this.alertContainer, message, hasError);
    }

  }

  switchModeTo(mode: AuthModels.AuthModeType): void {

    if (this.canDeactivate()) {
      this.isSwitchedAuthModeFromHere = true;
      this.store$.dispatch(AuthActions.switchModeTo({ authMode: { mode } }));
    }

  }


  hasEmailControlErrorRequired(control: AbstractControl | null): boolean {

    if (control) {
      return (control.hasError('required') || control.hasError('email'))
        && (control.dirty || control.touched);
    }

    return false;

  }


  hasPasswordControlErrorRequired(control: AbstractControl | null): boolean {

    if (control) {
      return control.hasError('required') && (control.dirty || control.touched);
    }

    return false;

  }


  hasControlErrorLengtgh(control: AbstractControl | null): boolean {

    if (control) {
      return !(control.hasError('minLength') && control.hasError('maxLength'))
        && (control.dirty || control.touched);
    }

    return false;

  }

}
