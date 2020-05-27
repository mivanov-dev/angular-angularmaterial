// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// custom
import { FilepondModule, LayoutModule, MaterialModule } from './modules';
import { CapsLockComponent } from './components';
import {
  TemplateRendererDirective, ConfirmEqualValidatorDirective, ImageFallbackDirective
} from './directives';

// Without services
@NgModule({
  declarations: [
    TemplateRendererDirective,
    ConfirmEqualValidatorDirective,
    CapsLockComponent,
    ImageFallbackDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FilepondModule,
    LayoutModule,
    MaterialModule,
  ],
  exports: [
    TemplateRendererDirective,
    ConfirmEqualValidatorDirective,
    ImageFallbackDirective,
    CapsLockComponent,
    // modules
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LayoutModule,
    FilepondModule,
    CommonModule,
  ],
})
export class SharedModule { }
