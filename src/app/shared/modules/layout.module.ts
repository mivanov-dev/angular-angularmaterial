// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// flex-layout
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule
  ],
  exports: [
    FlexLayoutModule
  ]
})
export class LayoutModule { }
