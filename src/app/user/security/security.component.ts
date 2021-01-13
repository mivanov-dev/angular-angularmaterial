// angular
import {
  Component, ElementRef, OnDestroy, OnInit,
  ViewChild, ViewContainerRef
} from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup,
  FormGroupDirective
} from '@angular/forms';
// ngrx
import { Store } from '@ngrx/store';
// rxjs
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
// custom
import * as fromApp from '@app/store';
import * as fromAuth from '../auth/store/reducer';
import * as AuthModels from '../auth/store/models';
import * as fromQr from './store/reducer';
import * as QrActions from './store/actions';
import * as QrModels from './store/models';
import { AlertService, LoggerService, SeoService } from 'src/app/shared/services';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit, OnDestroy {

  form: FormGroup;
  setup?: QrModels.Setup | null;
  image?: string | null;
  codeElement?: HTMLInputElement;
  user?: AuthModels.Login | null;
  isLoading = false;
  @ViewChild('alertContainer', { read: ViewContainerRef }) alertContainer?: ViewContainerRef;
  @ViewChild('secretKey', { read: ElementRef }) secretKey?: ElementRef;
  @ViewChild('formDirective') formDirective?: FormGroupDirective;
  private onDestroy$: Subject<void> = new Subject<void>();
  private isSubmitted = false;
  private qrCode: any;

  constructor(
    private formBuilder: FormBuilder,
    private store$: Store<fromApp.AppState>,
    private alertService: AlertService,
    private logger: LoggerService,
    private seoService: SeoService) {

    this.seoService.config({ title: 'Security', url: 'user/security' });
    this.form = this.initForm();

  }

  get codeControl(): AbstractControl | null {

    return this.form.get('code');

  }

  async ngOnInit(): Promise<void> {

    this.subscribeSetup();
    this.subscribeLogin();
    this.subscribeVerify();
    this.subscribeError();
    this.subscribeLoading();

    this.qrCode = await import(
      /* webpackMode: "lazy" */
      'qrcode'
    );

  }

  ngOnDestroy(): void {

    this.store$.dispatch(QrActions.reset());
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  private initForm(): FormGroup {

    return this.formBuilder.group({
      code: [null],
    }, { updateOn: 'blur' });

  }

  setupQr(check: boolean): void {

    if (check) {
      this.resetForm();
    }

    this.store$.dispatch(QrActions.setupStart({ data: { enable: check } }));

  }

  onSubmit(): void {

    this.isSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const secretKey = (this.secretKey?.nativeElement as HTMLElement).innerText;
    this.store$.dispatch(QrActions.verifyStart({ data: { secretKey, code: this.codeControl?.value } }));

  }

  hasCodeControlErrorRequired(control: AbstractControl | null): boolean {

    if (control) {
      return control.hasError('required');
    }

    return false;

  }

  private subscribeVerify(): void {

    this.store$.select(fromQr.selectVerify)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((res): res is QrModels.Verify => res !== null)
      )
      .subscribe((res) => this.showAlertMessage(res.message, false));

  }

  private subscribeError(): void {

    this.store$.select(fromQr.selectError)
      .pipe(
        takeUntil(this.onDestroy$),
        filter(res => res !== null)
      )
      .subscribe((res) => this.showAlertMessage(res, true));

  }

  private subscribeLogin(): void {

    this.store$.select(fromAuth.selectLogin)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => this.user = res);

  }

  private subscribeSetup(): void {

    this.store$.select(fromQr.selectSetup)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {
        this.setup = res;
        if (res) {
          this.drawQrImage(res);
        }
      });

  }

  private subscribeLoading(): void {

    this.store$.select(fromQr.selectLoading)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => {
        if (!res) {
          this.isSubmitted = false;
        }
        this.isLoading = res;
      });

  }

  private showAlertMessage(message: string, hasError: boolean): void {

    if (this.alertContainer) {
      this.alertService.showMessage(this.alertContainer, message, hasError);
    }

  }

  private resetForm(): void {

    if (this.formDirective) {
      this.formDirective.resetForm();
    }

    this.form.reset();

  }

  private async drawQrImage(res: QrModels.Setup): Promise<void> {

    try {
      const data = await this.qrCode.toDataURL(res.url, { errorCorrectionLevel: 'H' });
      this.image = data;
    } catch (error) {
      this.logger.error(error);
    }

  }

}
