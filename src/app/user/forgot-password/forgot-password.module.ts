// angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// custom
import { ForgotPasswordComponent } from '@app/user/forgot-password/forgot-password.component';
import { SharedModule } from '@app/shared/shared.module';
import { DirtyCheckGuard } from '@app/shared/guards';

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
export class ForgotPasswordModule {

  constructor() { }

}