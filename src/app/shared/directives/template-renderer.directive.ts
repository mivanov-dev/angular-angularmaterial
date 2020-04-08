// angular
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appTemplateRenderer]'
})
export class TemplateRendererDirective {

  private _hasView = true;

  constructor(
    private _templateRef: TemplateRef<any>,
    private _viewContainerRef: ViewContainerRef) { }

  @Input() set appTemplateRenderer(tmpl) {

    if (tmpl && this._hasView) {
      this._viewContainerRef.createEmbeddedView(this._templateRef);
      this._hasView = false;
    } else if (!tmpl && !this._hasView) {
      this._viewContainerRef.clear();
      this._hasView = true;
    }

  }

}
