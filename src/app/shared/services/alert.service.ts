// angular
import {
  Injectable, ViewContainerRef,
  NgModuleFactory,
  Compiler,
  Injector,
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlertService {

  constructor(private compiler: Compiler,
              private injector: Injector) { }

  async showMessage(viewContainerRef: ViewContainerRef, message: string, hasError: boolean): Promise<void> {

    if (message !== undefined) {
      viewContainerRef.clear();

      /**
       * Read❗
       * https://webpack.js.org/api/module-methods/#magic-comments
       */

      const { AlertComponent, AlertModule } = await import(
        /* webpackMode: "lazy" */
        /* webpackChunkName: "alert" */
        `../components`
      );

      let moduleFactory;

      if (AlertModule instanceof NgModuleFactory) {
        moduleFactory = AlertModule;
      }
      else {
        moduleFactory = await this.compiler.compileModuleAsync(AlertModule);
      }
      const moduleRef = moduleFactory.create(this.injector);

      const alertFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(AlertComponent);
      viewContainerRef.clear();

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
