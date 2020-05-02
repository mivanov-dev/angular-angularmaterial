// angular
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ComponentFactoryResolver, ComponentRef, PLATFORM_ID, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
// material
import { MatButton } from '@angular/material/button';
// rxjs
import { Subject, Observable } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
// ngrx
import { Store, select } from '@ngrx/store';
// custom
import { IDirtyCheckGuard } from '@app/shared/guards';
import { PlaceholderDirective } from '@app/shared/directives';
import { SeoService } from '@app/shared/services';
import * as fromApp from '@app/store';
import * as fromForgotPassword from './store';
import * as ForgotPasswordActions from './store/actions';
import { AlertComponent } from '@app/shared/components';
import { isPlatformBrowser } from '@angular/common';

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
  private alertComponentRef: ComponentRef<AlertComponent>;
  @ViewChild(PlaceholderDirective, { static: true }) alert: PlaceholderDirective;
  @ViewChild('email', { static: true }) email: ElementRef;
  @ViewChild('submitButton', { static: true }) submitButton: MatButton;
  isLoading$: Observable<boolean> = this.store$.pipe(takeUntil(this.onDestroy$), select(fromForgotPassword.selectLoading));

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private formBuilder: FormBuilder,
              private store$: Store<fromApp.AppState>,
              private seoService: SeoService,
              @Inject(PLATFORM_ID) private platformId) {

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

  private _showAlertMessage(message: string, hasError: boolean): void {

    if (message !== undefined) {
      const alertComponent = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
      const viewCntrRef = this.alert.viewCntrRef;
      viewCntrRef.clear();
      this.alertComponentRef = viewCntrRef.createComponent(alertComponent);
      this.alertComponentRef.instance.message = message;
      this.alertComponentRef.instance.hasError = hasError;
      this.alertComponentRef.instance.close
        .subscribe((res: boolean) => {

          if (res) {
            this.alertComponentRef.destroy();
          }

        });
    }

  }

  hasEmailControlErrorRequired = (control: AbstractControl): boolean =>
    (control.hasError('required') || control.hasError('email')) && (control.dirty || control.touched)

  hasControlErrorLengtgh = (control: AbstractControl): boolean =>
    !(control.hasError('minLength') && control.hasError('maxLength')) && (control.dirty || control.touched)

}
