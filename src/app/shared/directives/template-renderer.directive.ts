// angular
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appTemplateRenderer]'
})
export class TemplateRendererDirective {

  private hasView = true;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef) { }

  @Input() set appTemplateRenderer(tmpl) {

    if (tmpl && this.hasView) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      this.hasView = false;
    } else if (!tmpl && !this.hasView) {
      this.viewContainerRef.clear();
      this.hasView = true;
    }

  }

}
