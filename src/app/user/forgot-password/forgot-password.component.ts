// angular
import {
  Component, OnInit, ViewChild, ElementRef,
  OnDestroy, Inject,
  PLATFORM_ID, ViewContainerRef, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
// material
import { MatButton } from '@angular/material/button';
// rxjs
import { Subject, Observable } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
// ngrx
import { Store, select } from '@ngrx/store';
// custom
import { DirtyCheck } from '../../shared/guards';
import { SeoService, AlertService } from '../../shared/services';
import * as fromApp from '../../store';
import * as fromForgotPassword from './store';
import * as ForgotPasswordActions from './store/actions';
import { UserFormValidatorToken, UserFormValidator } from '../validators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy, DirtyCheck, AfterViewInit {

  form: FormGroup;
  isLoading$: Observable<boolean>;
  emailElement?: HTMLElement;
  submitButtonElement?: HTMLElement;
  @ViewChild('alertContainer', { read: ViewContainerRef }) alertContainer?: ViewContainerRef;
  @ViewChild('email', { static: true }) email?: ElementRef;
  @ViewChild('submitButton', { static: true }) submitButton?: MatButton;
  private onDestroy$: Subject<void> = new Subject<void>();
  private isSubmitted = false;

  constructor(private formBuilder: FormBuilder,
              private store$: Store<fromApp.AppState>,
              private seoService: SeoService,
              private alertService: AlertService,
              private cdr: ChangeDetectorRef,
              @Inject(PLATFORM_ID) private platformId: any,
              @Inject(UserFormValidatorToken) private userFormValidator: UserFormValidator) {

    this.seoService.config({ title: 'Forgot password', url: 'user/forgot-password' });
    this.isLoading$ = this.store$.select(fromForgotPassword.selectLoading).pipe(takeUntil(this.onDestroy$));
    this.form = this.initForm();

  }

  get userGroup(): AbstractControl | null {

    return this.form.get('user');

  }

  get emailControl(): AbstractControl | null {

    return this.form.get('user.email');

  }

  ngOnInit(): void {

    this.getSuccessfulMessage();
    this.getUnsuccessfulMessage();

  }
  ngAfterViewInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.emailElement = this.email?.nativeElement as HTMLElement;
      this.submitButtonElement = this.submitButton?._elementRef.nativeElement as HTMLElement;
      // https://stackoverflow.com/a/54794081
      this.emailElement.focus({ preventScroll: true });
      this.cdr.detectChanges();
    }

  }

  ngOnDestroy(): void {

    this.store$.dispatch(ForgotPasswordActions.reset());
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  private initForm(): FormGroup {

    return this.formBuilder.group({
      user: this.formBuilder.group({
        email: [null,
          {
            validators: this.userFormValidator.EMAIL_VALIDATOR
          },
        ]
      })
    }, { updateOn: 'blur' });

  }

  onSubmit(): void {

    this.isSubmitted = true;
    const data = this.userGroup?.value;

    if (!this.form.valid) { return; }

    this.store$.dispatch(ForgotPasswordActions.forgotPasswordStart({ data }));

  }

  onTriggerClick(): void {

    this.submitButtonElement?.click();

  }

  private getSuccessfulMessage(): void {

    this.store$.select(fromForgotPassword.selectForgotPassword)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((res): res is fromForgotPassword.ForgotPassword => res !== null)
      )
      .subscribe((res) => {
        this.showAlertMessage(res.message, false);
      });

  }

  private getUnsuccessfulMessage(): void {

    this.store$.select(fromForgotPassword.selectError)
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
