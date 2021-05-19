// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// custom
import { SecurityComponent } from './security.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthGuard } from '../auth/guards/auth.guard';

@NgModule({
    declarations: [SecurityComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: SecurityComponent,
                canActivate: [AuthGuard]
            }
        ]),
        SharedModule,
    ]
})
export class SecurityModule { }
