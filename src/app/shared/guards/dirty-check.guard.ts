// angular
import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
// rxjs
import { Observable } from 'rxjs';

export interface IDirtyCheckGuard {
    canDeactivate: () => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
}

@Injectable()
export class DirtyCheckGuard implements CanDeactivate<IDirtyCheckGuard> {

    canDeactivate(
        dcg: IDirtyCheckGuard,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot) {

        return dcg.canDeactivate ? dcg.canDeactivate() : true;

    }

}