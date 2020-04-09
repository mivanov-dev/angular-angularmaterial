// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// custom
import { MaterialModule } from '@app/material.module';
import { LayoutModule } from '@app/layout.module';
import { FilepondModule } from '@app/filepond.module';
import { AlertComponent, CapsLockComponent } from './components';
import { PlaceholderDirective, TemplateRendererDirective, ConfirmEqualValidatorDirective, ImageFallbackDirective } from './directives';

// Without services
@NgModule({
  declarations: [
    AlertComponent,
    PlaceholderDirective,
    TemplateRendererDirective,
    ConfirmEqualValidatorDirective,
    CapsLockComponent,
    ImageFallbackDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LayoutModule,
    FilepondModule
  ],
  exports: [
    AlertComponent,
    PlaceholderDirective,
    TemplateRendererDirective,
    ConfirmEqualValidatorDirective,
    ImageFallbackDirective,
    CapsLockComponent,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LayoutModule,
    FilepondModule,
    CommonModule,
  ],
  entryComponents: [AlertComponent],
})
export class SharedModule {

  constructor() { }

}