// angular
import {
    Injectable, ViewContainerRef,
    ComponentFactoryResolver, Injector
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlertService {

    constructor(private cfr: ComponentFactoryResolver,
                private injector: Injector) { }

    showMessage(vcr: ViewContainerRef, message: string, hasError: boolean) {

        if (message !== undefined) {
            vcr.clear();

            import('../components')
                .then(({ AlertComponent }) => {

                    const alertFactory = this.cfr.resolveComponentFactory(AlertComponent);
                    const alertComponentRef = vcr.createComponent(alertFactory, null, this.injector);
                    alertComponentRef.instance.message = message;
                    alertComponentRef.instance.hasError = hasError;
                    alertComponentRef.instance.close
                        .subscribe((res: boolean) => {

                            if (res) {
                                alertComponentRef.destroy();
                            }

                        });

                });
        }

    }

}
