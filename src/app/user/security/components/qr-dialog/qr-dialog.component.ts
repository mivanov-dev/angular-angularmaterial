// angular
import {
  Component, ElementRef, Inject, NgModule,
  OnDestroy, OnInit, ViewChild
} from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup,
  FormGroupDirective, FormsModule, ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
// material
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
// flex-layout
import { FlexLayoutModule } from '@angular/flex-layout';
// ngrx
import { Store } from '@ngrx/store';
// rxjs
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// qrcode
import * as qrcode from 'qrcode';
// custom
import * as fromApp from '@app/store';
import * as fromAuth from '../../../auth/store/reducer';
import * as AuthModels from '../../../auth/store/models';
import * as AuthActions from '../../../auth/store/actions';
import * as fromQr from '../../store/reducer';
import * as QrActions from '../../store/actions';
import * as QrModels from '../../store/models';
import { LoggerService } from '@app/shared/services';

@Component({
  selector: 'app-qr-dialog',
  templateUrl: './qr-dialog.component.html',
  styleUrls: ['./qr-dialog.component.scss']
})
export class QrDialogComponent implements OnInit, OnDestroy {

  form: FormGroup;
  setup?: QrModels.Setup | null;
  image?: string | null;
  codeElement?: HTMLInputElement;
  user?: AuthModels.Login | null;
  isLoading = false;
  @ViewChild('secretKey', { static: false, read: ElementRef }) secretKey?: ElementRef<HTMLElement>;
  @ViewChild('formDirective', { static: false, read: FormGroupDirective }) formDirective?: FormGroupDirective;
  private onDestroy$: Subject<void> = new Subject<void>();
  private isSubmitted = false;

  get codeControl(): AbstractControl | null {

    return this.form.get('code');

  }

  constructor(public dialogRef: MatDialogRef<QrDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              private store$: Store<fromApp.AppState>,
              private logger: LoggerService) {

    this.form = this.initForm();

  }

  async ngOnInit(): Promise<void> {

    this.subscribeSetup();
    this.subscribeLogin();
    this.subscribeLoading();

    this.store$.dispatch(QrActions.setupStart({ data: { enable: this.data.check } }));

  }

  ngOnDestroy(): void {

    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  private initForm(): FormGroup {

    return this.formBuilder.group({
      code: [null],
    }, { updateOn: 'blur' });

  }

  onSubmit(): void {

    this.isSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const secretKey = this.secretKey?.nativeElement.innerText;
    this.dialogRef.close({ secretKey, code: this.codeControl?.value });

  }

  hasCodeControlErrorRequired(control: AbstractControl | null): boolean {

    if (control) {
      return control.hasError('required');
    }

    return false;

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

        if (res) {
          this.setup = res;
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


  private async drawQrImage(res: QrModels.Setup): Promise<void> {

    try {
      const data = await qrcode.toDataURL(res.url, { errorCorrectionLevel: 'H' });
      this.image = data;
    } catch (error) {
      this.logger.error(error);
    }

  }

  onClose(): void {

    this.store$.dispatch(QrActions.reset());

    if (this.user) {
      this.store$.dispatch(AuthActions.updateLogin({ data: { ...this.user, is2FAenabled: false } }));
    }

    this.dialogRef.close();

  }

}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule
  ],
  declarations: [QrDialogComponent]
})
class QrDialogModule { }
