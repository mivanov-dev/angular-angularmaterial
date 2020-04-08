// angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// custom
import { ResetPasswordComponent } from '@app/user/reset-password/reset-password.component';
import { SharedModule } from '@app/shared/shared.module';
import { DirtyCheckGuard } from '@app/shared/guards';

@NgModule({
    declarations: [ResetPasswordComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: ResetPasswordComponent,
                canDeactivate: [DirtyCheckGuard]
            }
        ]),
        SharedModule,
    ],
    exports: [RouterModule],
})
export class ResetPasswordModule {

    constructor() { }

}