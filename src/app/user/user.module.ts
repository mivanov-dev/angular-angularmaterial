// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// custom
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { SharedModule } from '@app/shared/shared.module';
import { userFormValidator, UserFormValidatorToken } from './validators';

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
  ],
  providers: [
    {
      provide: UserFormValidatorToken,
      useValue: userFormValidator
    }
  ]
})
export class UserModule { }
