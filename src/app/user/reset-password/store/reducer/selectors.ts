import { createFeatureSelector, createSelector } from '@ngrx/store';
import { key, State } from './reducer';

export const getError = (state: State) => state.error;
export const getLoading = (state: State) => state.loading;

const featureSelector = createFeatureSelector<State>(key);

export const selectError = createSelector(featureSelector, getError);
export const selectLoading = createSelector(featureSelector, getLoading);
