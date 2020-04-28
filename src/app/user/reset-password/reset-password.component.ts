// angular
import { Component, OnInit, ViewChild, ElementRef, ComponentFactoryResolver, OnDestroy, ComponentRef, PLATFORM_ID, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, Data } from '@angular/router';
// material
import { MatButton } from '@angular/material/button';
// rxjs
import { Subject, Observable } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
// ngrx
import { Store, select } from '@ngrx/store';
// custom
import { PlaceholderDirective } from '@app/shared/directives';
import { LoggerService, SeoService } from '@app/shared/services';
import * as fromApp from '@app/store';
import { AlertComponent } from '@app/shared/components';
import * as fromResetPassword from './store';
import * as ResetPasswordActions from './store/actions';
import * as ResetPasswordModels from './store/models';
import { IDirtyCheckGuard } from '@app/shared/guards';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy, IDirtyCheckGuard {

  form: FormGroup;
  private _token: string;
  private _onDestroy$: Subject<void> = new Subject<void>();
  private _isSubmitted = false;
  private readonly _PASSWORD_VALIDATOR = [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(100)
  ];
  private alertComponentRef: ComponentRef<AlertComponent>;
  @ViewChild(PlaceholderDirective, { static: true }) alert: PlaceholderDirective;
  @ViewChild('password', { static: true }) password: ElementRef;
  @ViewChild('submitButton', { static: true }) submitButton: MatButton;
  isLoading$: Observable<boolean> = this._store$.pipe(takeUntil(this._onDestroy$), select(fromResetPassword.selectLoading));

  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
    private _formBuilder: FormBuilder,
    private _logger: LoggerService,
    private _store$: Store<fromApp.AppState>,
    private _seoService: SeoService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private _platformId) {

    this._seoService.config({ title: 'Reset password', url: 'user/reset-password/:id' });

  }

  ngOnInit(): void {

    this._getToken();
    this._getUnsuccessfulMessage();
    this._initForm();

  }

  ngOnDestroy(): void {

    this._onDestroy$.next();
    this._onDestroy$.complete();

  }

  private _initForm(): void {

    this.form = this._formBuilder.group({
      user: this._formBuilder.group({
        password: [null,
          {
            validators: this._PASSWORD_VALIDATOR

          },
        ],
        repeatedPassword: [null,
          {
            validators: this._PASSWORD_VALIDATOR

          },
        ]
      })
    }, { updateOn: 'blur' });

    if (isPlatformBrowser(this._platformId)) {
      this.passwordElement.focus({ preventScroll: true });
    }

  };

  get userGroup(): AbstractControl {

    return this.form.get('user');

  }

  get passwordControl(): AbstractControl {

    return this.form.get('user.password');

  }

  get repeatedPasswordControl(): AbstractControl {

    return this.form.get('user.repeatedPassword');

  }

  get passwordElement() {

    if (isPlatformBrowser(this._platformId)) {
      return this.password.nativeElement;
    }

  }

  get submitButtonElement(): HTMLElement {

    if (isPlatformBrowser(this._platformId)) {
      return this.submitButton._elementRef.nativeElement;
    }

  }

  onSubmit(): void {

    this._isSubmitted = true;
    const data: ResetPasswordModels.ResetPasswordStart = Object.assign({ token: this._token }, this.form.get('user').value);

    if (!this.form.valid) {
      return;
    }
    if (data.password.localeCompare(data.repeatedPassword) !== 0) {
      return;
    }

    this._store$.dispatch(ResetPasswordActions.resetPasswordStart({ data }));

  }

  onTriggerClick(): void {

    if (isPlatformBrowser(this._platformId)) {
      this.submitButtonElement.click();
    }

  }

  private _getUnsuccessfulMessage(): void {

    this._store$
      .pipe(
        takeUntil(this._onDestroy$),
        select(fromResetPassword.selectError),
        filter(res => res !== null)
      )
      .subscribe((res) => this._showAlertMessage(res, true));

  }

  canDeactivate(): boolean {

    if (!this._isSubmitted && this.form.dirty) {
      return confirm('Are you shure ?');
    }

    return true;

  }

  private _getToken(): void {

    this._activatedRoute.data
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(
        (data: Data) => this._token = data.token);

  }

  private _showAlertMessage(message: string, hasError: boolean): void {

    if (message !== undefined) {
      const alertComponent = this._componentFactoryResolver.resolveComponentFactory(AlertComponent);
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

  hasPasswordControlErrorRequired = (control: AbstractControl): boolean =>
    control.hasError('required') && (control.dirty || control.touched);

  hasControlErrorLengtgh = (control: AbstractControl): boolean =>
    !(control.hasError('minLength') && control.hasError('maxLength')) && (control.dirty || control.touched)

}
