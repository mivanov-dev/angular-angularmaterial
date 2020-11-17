// angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// custom
import { ResetPasswordComponent } from './reset-password.component';
import { SharedModule } from '../../shared/shared.module';
import { DirtyCheckGuard } from '../../shared/guards';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ResetPasswordComponent,
        canDeactivate: [DirtyCheckGuard]
      }
    ]),
    SharedModule,
  ]
})
export class ResetPasswordModule { }
