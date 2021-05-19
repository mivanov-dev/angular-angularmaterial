// angular
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
// rxjs
import { Observable } from 'rxjs';

@Injectable()
export class TokenResolver implements Resolve<string> {

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot,
          routerStateSnapshot: RouterStateSnapshot): Observable<string> | Promise<string> | string {
    return activatedRouteSnapshot.params.id.toString();
  }

}
