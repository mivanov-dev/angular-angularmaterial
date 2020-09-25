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
    },
    {
      path: 'auth',
      loadChildren: () => import('./auth').then(m => m.AuthModule),
    },
    {
      path: 'forgot-password',
      loadChildren: () => import('./forgot-password').then(m => m.ForgotPasswordModule),
    },
    {
      path: 'reset-password/:id',
      loadChildren: () => import('./reset-password').then(m => m.ResetPasswordModule),
      resolve: {
        token: TokenResolver
      }
    },
    {
      path: 'profile',
      loadChildren: () => import('./profile').then(m => m.ProfileModule),
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
