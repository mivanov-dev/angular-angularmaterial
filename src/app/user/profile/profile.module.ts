// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// custom
import { ProfileComponent } from './profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthGuard } from '../auth/guards/auth.guard';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      }
    ]),
    SharedModule,
  ],
  exports: [RouterModule],
})
export class ProfileModule { }
