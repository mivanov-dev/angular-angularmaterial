// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// custom
import { AuthComponent } from './auth.component';
import { SharedModule } from '@app/shared/shared.module';
import { DirtyCheckGuard } from '@app/shared/guards';
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
  ]
})
export class AuthModule { }
