// angular
import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
// rxjs
import { Observable } from 'rxjs';

export interface DirtyCheck {
  canDeactivate: () => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
}

@Injectable()
export class DirtyCheckGuard implements CanDeactivate<DirtyCheck> {

  canDeactivate(
    dcg: DirtyCheck,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return dcg.canDeactivate ? dcg.canDeactivate() : true;

  }

}
