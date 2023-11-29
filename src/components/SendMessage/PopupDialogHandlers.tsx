import { signal } from '@preact/signals-react';
import { TraceSeverity } from '../../clients/models/MetricsModel';
import MetricsClient from '../../clients/MetricsClient';

import { disabledBool, disabledInput } from './SendMessage';
import { APITimeout } from '../ConfigurationMenu/ConfigurationMenu';

export const openResetChatSession = signal<boolean>(false);
export const openSessionExpired = signal<boolean>(false);
export const openAPIRateLimit = signal<boolean>(false);
export const openAPITimeout = signal<boolean>(false);
export const openAPIError = signal<boolean>(false);
export const openInputTooLarge = signal<boolean>(false);

const PopupDialogOpenHandlers = {
  openResetChatDialog: () => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: 'ChatApp Reset Chat Clicked',
    });
    openResetChatSession.value = true;
  },
  openSessionExpiredDialog: () => {
    openSessionExpired.value = true;
  },
  openAPIRateLimitDialog: () => {
    // Tracking in app insights
    MetricsClient.sendTrace({
      message: 'ChatApp Rate Limit Hit',
      severity: TraceSeverity.ERROR,
    });

    openAPIRateLimit.value = true;
  },
  openAPITimeoutDialog: () => {
    // Tracking in app insights
    MetricsClient.sendTrace({
      message: 'ChatApp Timeout',
      severity: TraceSeverity.ERROR,
      properties: { APITimeout },
    });

    openAPITimeout.value = true;
  },
  openAPIGeneralErrorDialog: () => {
    // Tracking in app insights
    MetricsClient.sendTrace({
      message: 'ChatApp Unexplained Error',
      severity: TraceSeverity.ERROR,
    });

    openAPIError.value = true;
  },
  openInputTooLargeDialog: () => {
    // Tracking in app insights
    MetricsClient.sendTrace({
      message: 'ChatApp Input Too Large',
      severity: TraceSeverity.ERROR,
    });

    openInputTooLarge.value = true;
  },
};

const PopupDialogCloseHandlers = {
  closeResetChatDialog: () => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: 'ChatApp Reset Chat Closed',
    });

    openResetChatSession.value = false;
  },
  closeSessionExpiredDialog: () => {
    openSessionExpired.value = false;
    // enable send box
    disabledBool.value = false;
    disabledInput.value = false;
  },
  closeAPIRateLimitDialog: () => {
    openAPIRateLimit.value = false;
    // enable send box
    disabledBool.value = false;
    disabledInput.value = false;
  },
  closeAPITimeoutDialog: () => {
    openAPITimeout.value = false;
    // enable send box
    disabledBool.value = false;
    disabledInput.value = false;
  },
  closeAPIGeneralErrorDialog: () => {
    openAPIError.value = false;
    // enable send box
    disabledBool.value = false;
    disabledInput.value = false;
  },
  closeInputTooLargeDialog: () => {
    openSessionExpired.value = false;
    // redirect to login
    window.location.href = '/';
  },
};

const PopupDialogContinueHandlers = {
  continueResetChatDialog: () => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: 'ChatApp Reset Chat Continue',
    });

    openResetChatSession.value = false;
    // refresh the page
    window.location.href = '/';
  },
  continueSessionExpiredDialog: () => {
    openSessionExpired.value = false;
    // redirect to login
    window.location.href = '/';
  },
};

export { PopupDialogOpenHandlers, PopupDialogCloseHandlers, PopupDialogContinueHandlers };
