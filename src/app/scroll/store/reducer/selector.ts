// ngrx
import { createFeatureSelector, createSelector } from '@ngrx/store';
// custom
import { adapter, key, State } from './reducer';

export const getError = (state: State) => { if (!state.loading) { return state.error; } };
export const getLoading = (state: State) => state.loading;

const featureSelector = createFeatureSelector<State>(key);

export const selectLoading = createSelector(featureSelector, getLoading);
export const selectError = createSelector(featureSelector, getError);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectAllComments = createSelector(featureSelector, selectAll);
