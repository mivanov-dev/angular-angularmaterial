// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// custom
import { PageNotFoundComponent } from './page-not-found.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: PageNotFoundComponent
      }
    ]),
    SharedModule
  ],
})
export class PageNotFoundModule { }
