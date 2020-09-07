// angular
import {
  Component, OnInit, ViewChild, ElementRef,
  OnDestroy, Inject,
  PLATFORM_ID, ViewContainerRef, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
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
import * as fromResetPassword from './store';
import * as ResetPasswordActions from './store/actions';
import { DirtyCheck } from '../../shared/guards';
import { UserFormValidator, UserFormValidatorToken } from '../validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy, DirtyCheck, AfterViewInit {

  form: FormGroup;
  isLoading$: Observable<boolean>;
  hidePassword = true;
  hideRepeatedPassword = true;
  passwordElement?: HTMLElement;
  submitButtonElement?: HTMLElement;
  @ViewChild('alertContainer', { read: ViewContainerRef }) alertContainer?: ViewContainerRef;
  @ViewChild('password', { static: true }) password?: ElementRef;
  @ViewChild('submitButton', { static: true }) submitButton?: MatButton;
  private token?: string | undefined;
  private onDestroy$: Subject<void> = new Subject<void>();
  private isSubmitted = false;

  constructor(private formBuilder: FormBuilder,
              private logger: LoggerService,
              private store$: Store<fromApp.AppState>,
              private seoService: SeoService,
              private activatedRoute: ActivatedRoute,
              private alertService: AlertService,
              private cdr: ChangeDetectorRef,
              @Inject(PLATFORM_ID) private platformId: any,
              @Inject(UserFormValidatorToken) private userFormValidator: UserFormValidator) {

    this.seoService.config({ title: 'Reset password', url: 'user/reset-password/:id' });
    this.isLoading$ = this.store$.select(fromResetPassword.selectLoading).pipe(takeUntil(this.onDestroy$));
    this.form = this.initForm();

  }

  get userGroup(): AbstractControl | null {

    return this.form.get('user');

  }

  get passwordControl(): AbstractControl | null {

    return this.form.get('user.password');

  }

  get repeatedPasswordControl(): AbstractControl | null {

    return this.form.get('user.repeatedPassword');

  }

  ngOnInit(): void {

    this.getToken();
    this.getUnsuccessfulMessage();

  }

  ngAfterViewInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.passwordElement = this.password?.nativeElement as HTMLElement;
      this.submitButtonElement = this.submitButton?._elementRef.nativeElement as HTMLElement;
      // https://stackoverflow.com/a/54794081
      this.passwordElement?.focus({ preventScroll: true });
      this.cdr.detectChanges();
    }

  }

  ngOnDestroy(): void {

    this.store$.dispatch(ResetPasswordActions.reset());
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  private initForm(): FormGroup {

    return this.formBuilder.group({
      user: this.formBuilder.group({
        password: [null,
          {
            validators: this.userFormValidator.PASSWORD_VALIDATOR
          },
        ],
        repeatedPassword: [null,
          {
            validators: this.userFormValidator.PASSWORD_VALIDATOR
          },
        ]
      })
    }, { updateOn: 'blur' });

  }

  onSubmit(): void {

    this.isSubmitted = true;
    const data: fromResetPassword.ResetPasswordStart = Object.assign({ token: this.token }, this.userGroup?.value);

    if (!this.form.valid) {
      return;
    }
    if (data.password.localeCompare(data.repeatedPassword) !== 0) {
      return;
    }

    this.store$.dispatch(ResetPasswordActions.resetPasswordStart({ data }));

  }

  onTriggerClick(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.submitButtonElement?.click();
    }

  }

  private getUnsuccessfulMessage(): void {

    this.store$.select(fromResetPassword.selectError)
      .pipe(
        takeUntil(this.onDestroy$),
        filter(res => res !== null)
      )
      .subscribe((res) => this.showAlertMessage(res, true));

  }

  canDeactivate(): boolean {

    if (!this.isSubmitted && this.form.dirty) {
      return confirm('Are you shure ?');
    }

    return true;

  }

  private getToken(): void {

    this.activatedRoute.data
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: Data) => this.token = data.token);

  }

  private showAlertMessage(message: string, hasError: boolean): void {

    if (this.alertContainer) {
      this.alertService.showMessage(this.alertContainer, message, hasError);
    }

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
