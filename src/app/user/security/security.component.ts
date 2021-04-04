// angular
import {
  Component, OnDestroy, OnInit,
  ViewChild, ViewContainerRef
} from '@angular/core';
// material
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// ngrx
import { Store } from '@ngrx/store';
// rxjs
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// custom
import * as fromApp from '@app/store';
import * as fromAuth from '../auth/store/reducer';
import * as AuthModels from '../auth/store/models';
import * as AuthActions from '../auth/store/actions';
import * as fromQr from './store/reducer';
import * as QrActions from './store/actions';
import * as QrModels from './store/models';
import { AlertService, SeoService } from 'src/app/shared/services';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit, OnDestroy {

  setup?: QrModels.Setup | null;
  user?: AuthModels.LoggedUser | null;
  is2FAenabled?: boolean;
  isLoading = false;
  isDialogOpened = false;
  @ViewChild('alertContainer', { static: false, read: ViewContainerRef }) alertContainer?: ViewContainerRef;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private store$: Store<fromApp.AppState>,
    private alertService: AlertService,
    private seoService: SeoService) {

    this.seoService.config({ title: 'Security', url: 'user/security' });

  }

  async ngOnInit(): Promise<void> {

    this.subscribeLogin();
    this.subscribeVerify();
    this.subscribeError();
    this.subscribeLoading();

  }

  ngOnDestroy(): void {

    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  async setupQr(check: boolean): Promise<void> {

    const { QrDialogComponent } = await import(
      /* webpackPrefetch: true */
      './components/qr-dialog');

    if (check) {
      this.isDialogOpened = true;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = { check };
      dialogConfig.width = '350px';
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.role = 'dialog';
      const dialogRef = this.dialog.open(QrDialogComponent, dialogConfig);

      dialogRef.afterClosed()
        .subscribe((res: { secretKey: string, code: string } | null) => {

          this.isDialogOpened = false;

          if (res) {
            this.verifyQr(res);
          }

        });
    }
    else {
      this.store$.dispatch(QrActions.setupStart({ data: { enable: false } }));

      if (this.user) {
        this.store$.dispatch(AuthActions.updateLogin({ data: { user: { ...this.user, is2FAenabled: false } } }));
      }
    }

  }

  verifyQr(res: { secretKey: string, code: string }): void {

    if (res.secretKey && res.code) {
      this.store$.dispatch(QrActions.verifyStart({ data: { secretKey: res.secretKey, code: res.code } }));
    }

  }

  private subscribeVerify(): void {

    this.store$.select(fromQr.selectVerify)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {

        if (res && this.user) {
          this.showAlertMessage(res.message, false);
          this.store$.dispatch(AuthActions.updateLogin({ data: { user: { ...this.user, is2FAenabled: true } } }));
        }

      });

  }

  private subscribeError(): void {

    this.store$.select(fromQr.selectError)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {

        if (res && this.user) {
          this.showAlertMessage(res, true);
          this.store$.dispatch(AuthActions.updateLogin({ data: { user: { ...this.user, is2FAenabled: false } } }));
        }

      });

  }

  private subscribeLogin(): void {

    this.store$.select(fromAuth.selectLogin)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => {

        if (res?.user) {
          this.user = res.user;
          this.is2FAenabled = res.user.is2FAenabled;
        }

      });

  }

  private subscribeLoading(): void {

    this.store$.select(fromQr.selectLoading)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => {
        this.isLoading = res;
      });

  }

  private showAlertMessage(message: string, hasError: boolean): void {

    if (this.alertContainer) {
      this.alertService.showMessage(this.alertContainer, message, hasError);
    }

  }

}
