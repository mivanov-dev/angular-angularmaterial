// angular
import {
  Component, OnInit, ViewChild,
  OnDestroy, Inject,
  ViewContainerRef, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
// material
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
// rxjs
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
// ngrx
import { Store } from '@ngrx/store';
// custom
import { SeoService, AlertService } from '@app/shared/services';
import * as fromApp from '@app/store';
import * as fromResetPassword from './store/reducer/';
import * as ResetPasswordActions from './store/actions';
import * as ResetPasswordModels from './store/models';
import { DirtyCheck } from '@app/shared/guards';
import { UserFormValidator, UserFormValidatorToken } from '../validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy, DirtyCheck, AfterViewInit {

  form: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideRepeatedPassword = true;
  submitButtonElement?: HTMLElement;
  @ViewChild('alertContainer', { static: false, read: ViewContainerRef }) alertContainer?: ViewContainerRef;
  @ViewChild('passwordInput', { static: false, read: MatInput }) passwordInput?: MatInput;
  @ViewChild('submitButton', { static: false, read: MatButton }) submitButton?: MatButton;
  private token?: string | undefined;
  private onDestroy$: Subject<void> = new Subject<void>();
  private isSubmitted = false;

  constructor(private formBuilder: FormBuilder,
              private store$: Store<fromApp.AppState>,
              private seoService: SeoService,
              private activatedRoute: ActivatedRoute,
              private alertService: AlertService,
              private cdr: ChangeDetectorRef,
              @Inject(UserFormValidatorToken) private userFormValidator: UserFormValidator) {

    this.seoService.config({ title: 'Reset password', url: 'user/reset-password/:id' });
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

    this.subscribeRouteData();
    this.subscribeError();
    this.subscribeLoading();

  }

  ngAfterViewInit(): void {

    this.submitButtonElement = this.submitButton?._elementRef.nativeElement as HTMLElement;
    // https://stackoverflow.com/a/54794081
    this.passwordInput?.focus({ preventScroll: true });
    this.cdr.detectChanges();

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
    const data: ResetPasswordModels.ResetPasswordStart = Object.assign({ token: this.token }, this.userGroup?.value);

    if (!this.form.valid) {
      return;
    }
    if (data.password.localeCompare(data.repeatedPassword) !== 0) {
      return;
    }

    this.store$.dispatch(ResetPasswordActions.resetPasswordStart({ data }));

  }

  onTriggerClick(): void {

    this.submitButtonElement?.click();

  }

  private subscribeError(): void {

    this.store$.select(fromResetPassword.selectError)
      .pipe(
        takeUntil(this.onDestroy$),
        filter(res => res !== null)
      )
      .subscribe((res) => this.showAlertMessage(res, true));

  }

  private subscribeLoading(): void {

    this.store$.select(fromResetPassword.selectLoading)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => this.isLoading = res);

  }

  canDeactivate(): boolean {

    if (!this.isSubmitted && this.form.dirty) {
      return confirm('Are you shure ?');
    }

    return true;

  }

  private subscribeRouteData(): void {

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
