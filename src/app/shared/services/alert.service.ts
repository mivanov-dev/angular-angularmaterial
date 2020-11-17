// angular
import {
  Injectable, ViewContainerRef,
  ComponentFactoryResolver,
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlertService {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  async showMessage(viewContainerRef: ViewContainerRef, message: string, hasError: boolean): Promise<void> {

    if (message !== undefined) {
      viewContainerRef.clear();

      /**
       * Read❗
       * https://webpack.js.org/api/module-methods/#magic-comments
       */

      const { AlertComponent } = await import(
        /* webpackMode: "lazy" */
        `../components`
      );

      const alertFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
      const alertComponentRef = viewContainerRef.createComponent(alertFactory);
      alertComponentRef.instance.message = message;
      alertComponentRef.instance.hasError = hasError;
      alertComponentRef.instance.close
        .subscribe((res: boolean) => {

          if (res) {
            alertComponentRef.destroy();
          }

        });

    }

  }

}
