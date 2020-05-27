// angular
import {
  Component, OnInit, ViewChild, ElementRef,
  OnDestroy, Inject,
  PLATFORM_ID, ViewContainerRef
} from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
// material
import { MatButton } from '@angular/material/button';
// rxjs
import { Subject, Observable } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
// ngrx
import { Store, select } from '@ngrx/store';
// custom
import { IDirtyCheckGuard } from '@app/shared/guards';
import { SeoService, AlertService } from '@app/shared/services';
import * as fromApp from '@app/store';
import * as fromForgotPassword from './store';
import * as ForgotPasswordActions from './store/actions';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy, IDirtyCheckGuard {

  form: FormGroup;
  private onDestroy$: Subject<void> = new Subject<void>();
  private isSubmitted = false;
  private readonly _EMAIL_VALIDATOR = [
    Validators.required,
    Validators.email,
    Validators.minLength(10),
    Validators.maxLength(100)
  ];
  @ViewChild('alertContainer', { read: ViewContainerRef })
  alertContainer: ViewContainerRef;
  @ViewChild('email', { static: true })
  email: ElementRef;
  @ViewChild('submitButton', { static: true })
  submitButton: MatButton;
  isLoading$: Observable<boolean> = this.store$.pipe(takeUntil(this.onDestroy$), select(fromForgotPassword.selectLoading));

  constructor(private formBuilder: FormBuilder,
              private store$: Store<fromApp.AppState>,
              private seoService: SeoService,
              @Inject(PLATFORM_ID) private platformId,
              private alertService: AlertService) {

    this.seoService.config({ title: 'Forgot password', url: 'user/forgot-password' });

  }

  ngOnInit(): void {

    this._getSuccessfulMessage();
    this._getUnsuccessfulMessage();
    this._initForm();

  }

  ngOnDestroy(): void {

    this.store$.dispatch(ForgotPasswordActions.reset());
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  private _initForm(): void {

    this.form = this.formBuilder.group({
      user: this.formBuilder.group({
        email: [null,
          {
            validators: this._EMAIL_VALIDATOR

          },
        ]
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

  get emailElement(): HTMLElement {

    if (isPlatformBrowser(this.platformId)) {
      return this.email.nativeElement;
    }

  }

  get submitButtonElement(): HTMLElement {

    if (isPlatformBrowser(this.platformId)) {
      return this.submitButton._elementRef.nativeElement;
    }

  }

  onSubmit(): void {

    this.isSubmitted = true;
    const data = this.userGroup.value;

    if (!this.form.valid) { return; }

    this.store$.dispatch(ForgotPasswordActions.forgotPasswordStart({ data }));

  }

  onTriggerClick = (): void => this.submitButtonElement.click();

  private _getSuccessfulMessage() {

    this.store$
      .pipe(
        takeUntil(this.onDestroy$),
        select(fromForgotPassword.selectForgotPassword),
        filter(res => res !== null)
      )
      .subscribe((res) => {
        this._showAlertMessage(res.message, false);
      });

  }

  private _getUnsuccessfulMessage(): void {

    this.store$
      .pipe(
        takeUntil(this.onDestroy$),
        select(fromForgotPassword.selectError),
        filter(res => res !== null)
      )
      .subscribe((res) => this._showAlertMessage(res, true));

  }

  canDeactivate(): boolean {

    if (!this.isSubmitted && this.form.dirty) {
      return confirm('Are you shure ?');
    }

    return true;

  }

  private _showAlertMessage(message: string, hasError: boolean) {

    this.alertService.showMessage(this.alertContainer, message, hasError);

  }

  hasEmailControlErrorRequired = (control: AbstractControl): boolean =>
    (control.hasError('required') || control.hasError('email')) && (control.dirty || control.touched)

  hasControlErrorLengtgh = (control: AbstractControl): boolean =>
    !(control.hasError('minLength') && control.hasError('maxLength')) && (control.dirty || control.touched)

}
