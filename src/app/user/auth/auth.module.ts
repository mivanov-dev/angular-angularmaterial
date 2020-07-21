// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// custom
import { AuthComponent } from './auth.component';
import { SharedModule } from '../../shared/shared.module';
import { DirtyCheckGuard } from '../../shared/guards';
import { SocialAuthComponent } from './components/social-auth/social-auth.component';

@NgModule({
  declarations: [AuthComponent, SocialAuthComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AuthComponent,
        canDeactivate: [DirtyCheckGuard]
      }
    ]),
    SharedModule,
  ],
  exports: [RouterModule],
})
export class AuthModule { }
