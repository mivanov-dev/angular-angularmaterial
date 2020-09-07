// angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// custom
import { UserComponent } from './user.component';
import { TokenResolver } from './reset-password/resolvers';

const routes: Routes = [{
  path: '',
  component: UserComponent,
  children: [
    {
      path: '',
      redirectTo: '/auth',
      pathMatch: 'full',
      data: {
        animation: 'user-auth'
      }
    }, {
      path: 'auth',
      loadChildren: () => import('./auth').then(m => m.AuthModule),
      data: {
        animation: 'auth'
      },
    }, {
      path: 'forgot-password',
      loadChildren: () => import('./forgot-password').then(m => m.ForgotPasswordModule),
      data: {
        animation: 'forgot-password'
      }
    }, {
      path: 'reset-password/:id',
      loadChildren: () => import('./reset-password').then(m => m.ResetPasswordModule),
      data: {
        animation: 'reset-password'
      },
      resolve: {
        token: TokenResolver
      }
    }, {
      path: 'profile',
      loadChildren: () => import('./profile').then(m => m.ProfileModule),
      data: {
        animation: 'reset-password'
      }
    }
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UserRoutingModule { }
