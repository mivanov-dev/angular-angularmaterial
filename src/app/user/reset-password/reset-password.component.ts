// angular
import {
  Component, OnInit, ViewChild, ElementRef,
  OnDestroy, Inject,
  PLATFORM_ID, ViewContainerRef
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
import { LoggerService, SeoService, AlertService } from '../../shared/services';
import * as fromApp from '../../store';
import * as fromResetPassword from './store';
import * as ResetPasswordActions from './store/actions';
import * as ResetPasswordModels from './store/models';
import { DirtyCheck } from '../../shared/guards';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy, DirtyCheck {

  form: FormGroup;
  isLoading$: Observable<boolean>;
  hidePassword = true;
  hideRepeatedPassword = true;
  @ViewChild('alertContainer', { read: ViewContainerRef }) alertContainer: ViewContainerRef;
  @ViewChild('password', { static: true }) password: ElementRef;
  @ViewChild('submitButton', { static: true }) submitButton: MatButton;
  private token: string;
  private onDestroy$: Subject<void> = new Subject<void>();
  private isSubmitted = false;
  private readonly _PASSWORD_VALIDATOR = [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(100)
  ];

  constructor(private formBuilder: FormBuilder,
              private logger: LoggerService,
              private store$: Store<fromApp.AppState>,
              private seoService: SeoService,
              private activatedRoute: ActivatedRoute,
              @Inject(PLATFORM_ID) private platformId,
              private alertService: AlertService) {

    this.seoService.config({ title: 'Reset password', url: 'user/reset-password/:id' });
    this.isLoading$ = this.store$.pipe(takeUntil(this.onDestroy$), select(fromResetPassword.selectLoading));

  }

  ngOnInit(): void {

    this.getToken();
    this.getUnsuccessfulMessage();
    this.initForm();

  }

  ngOnDestroy(): void {

    this.store$.dispatch(ResetPasswordActions.reset());
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  private initForm(): void {

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

  get passwordElement(): HTMLElement {

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

  private getUnsuccessfulMessage(): void {

    this.store$
      .pipe(
        takeUntil(this.onDestroy$),
        select(fromResetPassword.selectError),
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

    this.alertService.showMessage(this.alertContainer, message, hasError);

  }

  hasPasswordControlErrorRequired(control: AbstractControl): boolean {

    return control.hasError('required') && (control.dirty || control.touched);

  }

  hasControlErrorLengtgh(control: AbstractControl): boolean {

    return !(control.hasError('minLength') && control.hasError('maxLength')) && (control.dirty || control.touched);

  }

}
