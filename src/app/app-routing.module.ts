// angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules, ExtraOptions } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./home').then(m => m.HomeModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./user').then(m => m.UserModule),
  },
  {
    path: 'page-not-found',
    loadChildren: () => import('./page-not-found').then(m => m.PageNotFoundModule),
  },
  {
    path: 'scroll',
    loadChildren: () => import('./scroll').then(m => m.ScrollModule)
  },
  {
    path: '**',
    redirectTo: '/page-not-found',
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
