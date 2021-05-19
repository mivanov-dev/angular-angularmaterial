// ngrx
import { createFeatureSelector, createSelector } from '@ngrx/store';
// custom
import { key, State } from './reducer';

export const getError = (state: State) => { if (!state.loading) { return state.error; } };
export const getLoading = (state: State) => state.loading;
export const getSetup = (state: State) => state.setup;
export const getVerify = (state: State) => state.verify;

const featureSelector = createFeatureSelector<State>(key);

export const selectError = createSelector(featureSelector, getError);
export const selectLoading = createSelector(featureSelector, getLoading);
export const selectSetup = createSelector(featureSelector, getSetup);
export const selectVerify = createSelector(featureSelector, getVerify);
