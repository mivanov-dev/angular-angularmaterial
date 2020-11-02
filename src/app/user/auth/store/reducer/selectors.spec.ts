// custom
import { State } from './reducer';
import {
    selectLogin, selectRegister, selectError, selectLoading, selectAuthMode,
    getLogin, getRegister, getError, getLoading, getAuthMode
} from './selectors';
import * as models from '../models';

const defaultState: State = {
    login: null,
    register: null,
    error: null,
    loading: false,
    authMode: { mode: 'login' }
};

describe('user-auth-selectors', () => {

    describe('with default data', () => {

        it('login should be "null"', () => {

            const login = getLogin(defaultState);

            expect(login)
                .toBeNull();
            expect(selectLogin.projector({ login }))
                .toBeNull();

        });
        it('register should be "null"', () => {

            const register = getRegister(defaultState);

            expect(register)
                .toBeNull();
            expect(selectRegister.projector({ register }))
                .toBeNull();

        });
        it('error should be "null"', () => {

            const error = getError(defaultState);

            expect(error)
                .toBeNull();
            expect(selectError.projector(defaultState, error))
                .toBeNull();

        });
        it('loading should be "false"', () => {

            const loading = getLoading(defaultState);

            expect(loading)
                .toBeFalsy();
            expect(selectLoading.projector({ loading }))
                .toBeFalsy();

        });
        it('authMode.mode should be "login"', () => {

            const authMode = getAuthMode(defaultState);

            expect(authMode)
                .toEqual(jasmine.objectContaining({ mode: 'login' }));
            expect(selectAuthMode.projector({ authMode }))
                .toEqual(jasmine.objectContaining({ mode: 'login' }));

        });

    });

    describe('with custom data', () => {

        describe('authMode.mode', () => {

            it('mode should be "register"', () => {

                const state: State = { ...defaultState, authMode: { mode: 'register' } };
                const authMode = getAuthMode(state);

                expect(authMode)
                    .toBe(state.authMode);
                expect(authMode)
                    .toEqual(jasmine.objectContaining({ mode: 'register' }));
                expect(selectAuthMode.projector({ authMode }))
                    .toEqual(jasmine.objectContaining({ mode: 'register' }));

            });
            it('mode should be "login"', () => {

                const state: State = { ...defaultState, authMode: { mode: 'login' } };
                const authMode = getAuthMode(state);

                expect(authMode)
                    .toBe(state.authMode);
                expect(authMode)
                    .toEqual(jasmine.objectContaining({ mode: 'login' }));
                expect(selectAuthMode.projector({ authMode }))
                    .toEqual(jasmine.objectContaining({ mode: 'login' }));

            });

        });

        describe('error', () => {

            it('when loading is "true" error should be "undefined"', () => {

                const state: State = { ...defaultState, loading: true };
                const error = getError(state);
                const loading = getLoading(state);

                expect(error).toEqual(undefined);
                expect(selectError.projector(state, error)).toEqual(undefined);
                expect(loading).toBeTrue();
                expect(selectLoading.projector({ loading })).toBeTrue();

            });
            it('when loading is "false" error should be different from "undefined"', () => {

                const state: State = { ...defaultState, error: 'New error', loading: false };
                const error = getError(state);
                const loading = getLoading(state);

                expect(error).toEqual('New error');
                expect(selectError.projector(state, error)).toEqual('New error');
                expect(loading).toBeFalse();
                expect(selectLoading.projector({ loading })).toBeFalse();

            });


        });

    });

});
