// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// custom
import { CdkComponent } from './cdk.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [CdkComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CdkComponent
      }
    ]),
    SharedModule,
  ]
})
export class CdkModule { }
