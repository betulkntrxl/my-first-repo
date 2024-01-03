import { signal } from '@preact/signals-react';
import { TraceSeverity } from '../../clients/models/MetricsModel';
import MetricsClient from '../../clients/MetricsClient';

import { messageInputDisabled } from './SendMessage';
import { APITimeout } from '../ConfigurationMenu/ConfigurationMenu';
import { GPT_MODELS } from '../../clients/models/PromptModel';

export const openNotAuthorizedForModel = signal<boolean>(false);
export const openResetChatSession = signal<boolean>(false);
export const openSessionExpired = signal<boolean>(false);
export const openAPIRateLimit = signal<boolean>(false);
export const openAPITimeout = signal<boolean>(false);
export const openAPIError = signal<boolean>(false);
export const openInputTooLarge = signal<boolean>(false);
export const openContentFilter = signal<boolean>(false);

const PopupDialogOpenHandlers = {
  openNotAuthorizedDialog: (model: GPT_MODELS) => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: `ChatApp Not Authorized to use model ${model}`,
    });
    openNotAuthorizedForModel.value = true;
  },
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
  openContentFilterDialog: () => {
    // Tracking in app insights
    MetricsClient.sendTrace({
      message: 'ChatApp Content Filter',
      severity: TraceSeverity.ERROR,
    });

    openContentFilter.value = true;
  },
};

const PopupDialogCloseHandlers = {
  closeNotAuthorizedDialog: () => {
    openNotAuthorizedForModel.value = false;
    // enable send box
    messageInputDisabled.value = false;
  },
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
    messageInputDisabled.value = false;
  },
  closeAPIRateLimitDialog: () => {
    openAPIRateLimit.value = false;
    // enable send box
    messageInputDisabled.value = false;
  },
  closeAPITimeoutDialog: () => {
    openAPITimeout.value = false;
    // enable send box
    messageInputDisabled.value = false;
  },
  closeAPIGeneralErrorDialog: () => {
    openAPIError.value = false;
    // enable send box
    messageInputDisabled.value = false;
  },
  closeInputTooLargeDialog: () => {
    openInputTooLarge.value = false;
    // enable send box
    messageInputDisabled.value = false;
  },
  closeContentFilterDialog: () => {
    openContentFilter.value = false;
    // enable send box
    messageInputDisabled.value = false;
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
