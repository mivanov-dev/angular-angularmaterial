// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// custom
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
  ],
  exports: [RouterModule, UserRoutingModule],
})
export class UserModule { }
