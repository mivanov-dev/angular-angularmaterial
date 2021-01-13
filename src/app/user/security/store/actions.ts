// ngrx
import { createAction, props } from '@ngrx/store';
// custom
import * as QrModels from './models';

export enum ActionTypes {
  SETUP_START = '[QR] Qr Setup Start',
  SETUP = '[QR] Qr Setup',
  SETUP_ERROR = '[QR] Qr Setup Error',
  VERIFY_START = '[QR] Qr Verify Start',
  VERIFY = '[QR] Qr Verify',
  VERIFY_ERROR = '[QR] Qr Verify Error',
  RESET = '[QR] Qr Reset',
}

export const setupStart = createAction(
  ActionTypes.SETUP_START,
  props<{ data: QrModels.SetupStart }>()
);
export const setup = createAction(
  ActionTypes.SETUP,
  props<{ data: QrModels.Setup }>()
);
export const setupError = createAction(
  ActionTypes.SETUP_ERROR,
  props<QrModels.Error>()
);
export const verifyStart = createAction(
  ActionTypes.VERIFY_START,
  props<{ data: QrModels.VerifyStart }>()
);
export const verify = createAction(
  ActionTypes.VERIFY,
  props<{ data: QrModels.Verify }>()
);
export const verifyError = createAction(
  ActionTypes.VERIFY_ERROR,
  props<QrModels.Error>()
);
export const reset = createAction(
  ActionTypes.RESET,
);
