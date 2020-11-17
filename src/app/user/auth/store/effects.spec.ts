// angular
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
// ngrx
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
// jasmine
import { cold, hot } from 'jasmine-marbles';
// custom
import { AuthService } from '../services/auth.service';
import { AuthEffects } from './effects';
import * as AuthModels from './models';
import * as AuthActions from './actions';

describe('user-auth-effects', () => {

  let authEffects: AuthEffects;
  let actions$: any;
  let router: any;
  let authService: any;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate'])
        },
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', ['login$', 'setLogoutTimer'])
        },
      ]
    });

    authEffects = TestBed.inject(AuthEffects);
    actions$ = TestBed.inject(Actions);
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);

  });

  describe('loginStart$', () => {

    it('successful', () => {

      const req: AuthModels.LoginStart = { email: 'email', password: 'password', remember: true };
      const res: AuthModels.Login = { email: 'email', expires: 1000, redirect: true, image: 'image', role: 'user' };

      const startAction = AuthActions.loginStart({ data: req });
      const endAction = AuthActions.login({ data: res });

      actions$ = hot('-a', { a: startAction });
      const res$ = cold('-a|', { a: res });
      const exprecred$ = cold('--b', { b: endAction });

      authService.setLogoutTimer.and.returnValue();
      authService.login$.and.returnValue(res$);

      expect(authEffects.loginStart$).toBeObservable(exprecred$);

    });

  });

});
