// angular
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
// ngrx
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
// jasmine
import { cold, hot } from 'jasmine-marbles';
// custom
import { AuthService } from '@app/user/auth/services/auth.service';
import { AuthEffects } from './effects';
import * as AuthModels from './models';
import * as AuthActions from './actions';

describe('loginStart$', () => {

    let authEffects: AuthEffects;
    let _actions$: any;
    let _router: any;
    let _authService: any;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                AuthEffects,
                provideMockActions(() => _actions$),
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
        _actions$ = TestBed.inject(Actions);
        _router = TestBed.inject(Router);
        _authService = TestBed.inject(AuthService);

    });

    describe('login', () => {

        it('successful', () => {

            const req: AuthModels.LoginStart = { email: 'email', password: 'password', remember: true };
            const res: AuthModels.Login = { email: 'email', expires: 1000, redirect: true, image: 'image' };

            const startAction = AuthActions.loginStart({ data: req });
            const endAction = AuthActions.login({ data: res });

            _actions$ = hot('-a', { a: startAction });
            const res$ = cold('-a|', { a: res });
            const exprecred$ = cold('--b', { b: endAction });

            _authService.setLogoutTimer.and.returnValue();
            _authService.login$.and.returnValue(res$);

            expect(authEffects.loginStart$).toBeObservable(exprecred$);

        });

    })

});