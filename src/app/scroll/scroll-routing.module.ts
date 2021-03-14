import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ScrollComponent } from './scroll.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: ScrollComponent,
      children: [
        {
          path: '',
          redirectTo: '/cdk',
          pathMatch: 'full'
        },
        {
          path: 'cdk',
          loadChildren: () => import('./cdk').then(m => m.CdkModule)
        }
      ]
    }
  ])],
  exports: [RouterModule]
})
export class ScrollRoutingModule { }
