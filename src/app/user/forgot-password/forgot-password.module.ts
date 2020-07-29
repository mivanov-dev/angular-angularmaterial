// angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// custom
import { ForgotPasswordComponent } from '../../user/forgot-password/forgot-password.component';
import { SharedModule } from '../../shared/shared.module';
import { DirtyCheckGuard } from '../../shared/guards';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ForgotPasswordComponent,
        canDeactivate: [DirtyCheckGuard]
      }
    ]),
    SharedModule,
  ],
  exports: [RouterModule],
})
export class ForgotPasswordModule { }
