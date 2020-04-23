// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// custom
import { FilepondModule, LayoutModule, MaterialModule } from './modules';
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
    FilepondModule,
    LayoutModule,
    MaterialModule,
  ],
  exports: [
    AlertComponent,
    PlaceholderDirective,
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
  entryComponents: [AlertComponent],
})
export class SharedModule {

  constructor() { }

}