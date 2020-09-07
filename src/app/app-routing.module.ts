// angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules, ExtraOptions } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
    data: {
      animation: 'home'
    }
  }, {
    path: 'home',
    loadChildren: () => import('./home').then(m => m.HomeModule),
    data: {
      animation: 'home'
    }
  }, {
    path: 'user',
    loadChildren: () => import('./user').then(m => m.UserModule),
    data: {
      animation: 'user'
    }
  }, {
    path: 'page-not-found',
    loadChildren: () => import('./page-not-found').then(m => m.PageNotFoundModule),
    data: {
      animation: 'page-not-found'
    }
  }, {
    path: '**',
    redirectTo: '/page-not-found',
    data: {
      animation: 'page-not-found'
    }
  }
];

const options: ExtraOptions = {
  useHash: true,
  preloadingStrategy: PreloadAllModules,
  onSameUrlNavigation: 'reload'
};

@NgModule({
  imports: [
    RouterModule.forRoot(routes, options)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
