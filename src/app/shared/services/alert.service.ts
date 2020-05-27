// angular
import {
    Injectable, ViewContainerRef,
    ComponentFactoryResolver,
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlertService {

    constructor(private cfr: ComponentFactoryResolver) { }

    async showMessage(vcr: ViewContainerRef, message: string, hasError: boolean) {

        if (message !== undefined) {
            vcr.clear();

            /**
             * Read❗
             * https://webpack.js.org/api/module-methods/#magic-comments
             */

            const { AlertComponent } = await import(
                /* webpackPrefetch: true */
                /* webpackMode: "lazy" */
                `../components`
            );

            const alertFactory = this.cfr.resolveComponentFactory(AlertComponent);
            const alertComponentRef = vcr.createComponent(alertFactory);
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
