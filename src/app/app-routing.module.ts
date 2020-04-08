// angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
// custom
import { HomeComponent } from './home';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    data: {
      animation: 'home'
    }
  }, {
    path: 'home',
    component: HomeComponent,
    data: {
      animation: 'home'
    }
  }, {
    path: 'user',
    loadChildren: () => import('./user').then(m => m.UserModule)
  }, {
    path: 'page-not-found',
    loadChildren: () => import('./page-not-found').then(m => m.PageNotFoundModule),
    data: {
      animation: 'page-not-found'
    }
  }, {
    path: '**',
    redirectTo: 'page-not-found',
    data: {
      animation: 'page-not-found'
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
