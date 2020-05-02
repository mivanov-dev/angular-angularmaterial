import { createFeatureSelector, createSelector } from '@ngrx/store';
import { key, State } from './reducer';

export const getError = (state: State) => { if (!state.loading) { return state.error; } };
export const getLoading = (state: State) => state.loading;
export const getLogin = (state: State) => state.login;
export const getRegister = (state: State) => state.register;
export const getAuthMode = (state: State) => state.authMode;

const featureSelector = createFeatureSelector<State>(key);

export const selectError = createSelector(featureSelector, getError);
export const selectLoading = createSelector(featureSelector, getLoading);
export const selectLogin = createSelector(featureSelector, getLogin);
export const selectRegister = createSelector(featureSelector, getRegister);
export const selectAuthMode = createSelector(featureSelector, getAuthMode);
