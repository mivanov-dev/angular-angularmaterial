// angular
import {
  Component, OnInit, ViewChild,
  OnDestroy, Inject,
  ViewContainerRef, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
// material
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
// rxjs
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
// ngrx
import { Store } from '@ngrx/store';
// custom
import { DirtyCheck } from '@app/shared/guards';
import { SeoService, AlertService } from '@app/shared/services';
import * as fromApp from '@app/store';
import * as fromForgotPassword from './store/reducer';
import * as ForgotPasswordActions from './store/actions';
import * as ForgotPasswordModels from './store/models';
import { UserFormValidatorToken, UserFormValidator } from '../validators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy, DirtyCheck, AfterViewInit {

  form: FormGroup;
  isLoading = false;
  emailElement?: HTMLElement;
  submitButtonElement?: HTMLElement;
  @ViewChild('alertContainer', { read: ViewContainerRef }) alertContainer?: ViewContainerRef;
  @ViewChild('emailInput', { static: false, read: MatInput }) emailInput?: MatInput;
  @ViewChild('submitButton', { static: false, read: MatButton }) submitButton?: MatButton;
  private onDestroy$: Subject<void> = new Subject<void>();
  private isSubmitted = false;

  constructor(private formBuilder: FormBuilder,
              private store$: Store<fromApp.AppState>,
              private seoService: SeoService,
              private alertService: AlertService,
              private cdr: ChangeDetectorRef,
              @Inject(UserFormValidatorToken) private userFormValidator: UserFormValidator) {

    this.seoService.config({ title: 'Forgot password', url: 'user/forgot-password' });
    this.form = this.initForm();

  }

  get userGroup(): AbstractControl | null {
    return this.form.get('user');
  }

  get emailControl(): AbstractControl | null {
    return this.form.get('user.email');
  }

  ngOnInit(): void {

    this.subscribeForgotPassword();
    this.subscribeError();
    this.subscribeLoading();

  }
  ngAfterViewInit(): void {

    this.submitButtonElement = this.submitButton?._elementRef.nativeElement as HTMLElement;
    // https://stackoverflow.com/a/54794081
    this.emailInput?.focus({ preventScroll: true });
    this.cdr.detectChanges();

  }

  ngOnDestroy(): void {

    this.store$.dispatch(ForgotPasswordActions.reset());
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  private initForm(): FormGroup {

    const fb = this.formBuilder.group({
      user: this.formBuilder.group({
        email: [null,
          {
            validators: this.userFormValidator.EMAIL_VALIDATOR
          },
        ]
      })
    }, { updateOn: 'blur' });

    return fb;

  }

  onSubmit(): void {

    this.isSubmitted = true;
    const data = this.userGroup?.value;

    if (!this.form.valid) {
      return;
    }
    this.store$.dispatch(ForgotPasswordActions.forgotPasswordStart({ data }));

  }

  onTriggerClick(): void {
    this.submitButtonElement?.click();
  }

  private subscribeForgotPassword(): void {

    this.store$.select(fromForgotPassword.selectForgotPassword)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((res): res is ForgotPasswordModels.ForgotPassword => res !== null)
      )
      .subscribe((res) => this.showAlertMessage(res.message, false));

  }

  private subscribeError(): void {

    this.store$.select(fromForgotPassword.selectError)
      .pipe(
        takeUntil(this.onDestroy$),
        filter(res => res !== null)
      )
      .subscribe((res) => this.showAlertMessage(res, true));

  }

  private subscribeLoading(): void {

    this.store$.select(fromForgotPassword.selectLoading)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => this.isLoading = res);

  }

  canDeactivate(): boolean {

    if (!this.isSubmitted && this.form.dirty) {
      return confirm('Are you shure ?');
    }
    return true;

  }

  private showAlertMessage(message: string, hasError: boolean): void {

    if (this.alertContainer) {
      this.alertService.showMessage(this.alertContainer, message, hasError);
    }

  }

  hasEmailControlErrorRequired(control: AbstractControl | null): boolean {

    if (control) {
      return (control.hasError('required') || control.hasError('email')) && (control.dirty || control.touched);
    }
    return false;

  }

  hasControlErrorLengtgh(control: AbstractControl | null): boolean {

    if (control) {
      return !(control.hasError('minLength') && control.hasError('maxLength')) && (control.dirty || control.touched);
    }
    return false;

  }
}
