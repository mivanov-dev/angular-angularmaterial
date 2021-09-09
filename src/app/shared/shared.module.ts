// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// custom
import { FilepondModule, LayoutModule, MaterialModule } from './modules';
import { CapsLockComponent } from './components';
import {
  TemplateRendererDirective,
  ConfirmEqualValidatorDirective,
  ImageFallbackDirective
} from './directives';

// Without services
@NgModule({
  declarations: [
    TemplateRendererDirective,
    ConfirmEqualValidatorDirective,
    ImageFallbackDirective,
    CapsLockComponent,
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
    // modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FilepondModule,
    LayoutModule,
    MaterialModule,
    // directives
    TemplateRendererDirective,
    ConfirmEqualValidatorDirective,
    ImageFallbackDirective,
    // components
    CapsLockComponent,
  ],
})
export class SharedModule { }
