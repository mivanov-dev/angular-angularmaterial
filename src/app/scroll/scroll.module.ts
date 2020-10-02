// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// custom
import { ScrollRoutingModule } from './scroll-routing.module';
import { ScrollComponent } from './scroll.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ScrollComponent],
  imports: [
    CommonModule,
    ScrollRoutingModule,
    SharedModule
  ]
})
export class ScrollModule { }
