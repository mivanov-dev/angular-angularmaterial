// angular
import {
  Component, OnInit, ViewChild, ElementRef, ComponentFactoryResolver,
  OnDestroy, PLATFORM_ID, Inject, ViewContainerRef, Injector
} from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
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
import { LoggerService, SeoService } from '@app/shared/services';
import * as fromApp from '@app/store';
import * as fromResetPassword from './store';
import * as ResetPasswordActions from './store/actions';
import * as ResetPasswordModels from './store/models';
import { IDirtyCheckGuard } from '@app/shared/guards';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy, IDirtyCheckGuard {

  form: FormGroup;
  private token: string;
  private onDestroy$: Subject<void> = new Subject<void>();
  private isSubmitted = false;
  private readonly _PASSWORD_VALIDATOR = [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(100)
  ];
  @ViewChild('alertContainer', { read: ViewContainerRef })
  alertContainer: ViewContainerRef;
  @ViewChild('password', { static: true })
  password: ElementRef;
  @ViewChild('submitButton', { static: true })
  submitButton: MatButton;
  isLoading$: Observable<boolean> = this.store$.pipe(takeUntil(this.onDestroy$), select(fromResetPassword.selectLoading));

  constructor(private cfr: ComponentFactoryResolver,
              private formBuilder: FormBuilder,
              private logger: LoggerService,
              private store$: Store<fromApp.AppState>,
              private seoService: SeoService,
              private activatedRoute: ActivatedRoute,
              @Inject(PLATFORM_ID) private platformId,
              private injector: Injector) {

    this.seoService.config({ title: 'Reset password', url: 'user/reset-password/:id' });

  }

  ngOnInit(): void {

    this._getToken();
    this._getUnsuccessfulMessage();
    this._initForm();

  }

  ngOnDestroy(): void {

    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  private _initForm(): void {

    this.form = this.formBuilder.group({
      user: this.formBuilder.group({
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

    if (isPlatformBrowser(this.platformId)) {
      this.passwordElement.focus({ preventScroll: true });
    }

  }

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

    if (isPlatformBrowser(this.platformId)) {
      return this.password.nativeElement;
    }

  }

  get submitButtonElement(): HTMLElement {

    if (isPlatformBrowser(this.platformId)) {
      return this.submitButton._elementRef.nativeElement;
    }

  }

  onSubmit(): void {

    this.isSubmitted = true;
    const data: ResetPasswordModels.ResetPasswordStart = Object.assign({ token: this.token }, this.form.get('user').value);

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
      this.submitButtonElement.click();
    }

  }

  private _getUnsuccessfulMessage(): void {

    this.store$
      .pipe(
        takeUntil(this.onDestroy$),
        select(fromResetPassword.selectError),
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

  private _getToken(): void {

    this.activatedRoute.data
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (data: Data) => this.token = data.token);

  }

  private _showAlertMessage(message: string, hasError: boolean) {

    if (message !== undefined) {
      this.alertContainer.clear();

      import('../../shared/components')
        .then(({ AlertComponent }) => {

          const alertFactory = this.cfr.resolveComponentFactory(AlertComponent);
          const alertComponentRef = this.alertContainer.createComponent(alertFactory, null, this.injector);
          alertComponentRef.instance.message = message;
          alertComponentRef.instance.hasError = hasError;
          alertComponentRef.instance.close
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((res: boolean) => {

              if (res) {
                alertComponentRef.destroy();
              }

            });

        });
    }

  }

  hasPasswordControlErrorRequired = (control: AbstractControl): boolean =>
    control.hasError('required') && (control.dirty || control.touched)

  hasControlErrorLengtgh = (control: AbstractControl): boolean =>
    !(control.hasError('minLength') && control.hasError('maxLength')) && (control.dirty || control.touched)

}
