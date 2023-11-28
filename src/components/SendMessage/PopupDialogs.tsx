import React from 'react';
import { useTranslation } from 'react-i18next';

import MetricsClient from '../../clients/MetricsClient';
import OKDialog from '../OKDialog/OkDialog';
import ContinueCancelDialog from '../ContinueCancelDialog/ContinueCancelDialog';
import {
  openResetChatSession,
  openSessionExpired,
  openAPIRateLimit,
  openAPITimeout,
  openAPIError,
  openInputTooLarge,
  disabledBool,
  disabledInput,
} from './SendMessage';

const PopupDialogs = () => {
  const { t } = useTranslation();

  const handleResetChatSessionClose = () => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: 'ChatApp Reset Chat Closed',
    });

    openResetChatSession.value = false;
  };

  const handleResetChatSessionContinue = () => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: 'ChatApp Reset Chat Continue',
    });

    openResetChatSession.value = false;
    // refresh the page
    window.location.href = '/';
  };

  const handleSessionExpiredClose = () => {
    openSessionExpired.value = false;
    // enable send box
    disabledBool.value = false;
    disabledInput.value = false;
  };

  const handleSessionExpiredContinue = () => {
    openSessionExpired.value = false;
    // redirect to login
    window.location.href = '/';
  };

  const handleAPIRateLimitClose = () => {
    openAPIRateLimit.value = false;
    // enable send box
    disabledBool.value = false;
    disabledInput.value = false;
  };

  const handleAPITimeoutClose = () => {
    openAPITimeout.value = false;
    // enable send box
    disabledBool.value = false;
    disabledInput.value = false;
  };

  const handleAPIErrorClose = () => {
    openAPIError.value = false;
    // enable send box
    disabledBool.value = false;
    disabledInput.value = false;
  };

  const handleInputTooLargeClose = () => {
    openInputTooLarge.value = false;
    // enable send box
    disabledBool.value = false;
    disabledInput.value = false;
  };

  return (
    <>
      <ContinueCancelDialog
        {...{
          handleClose: handleResetChatSessionClose,
          openDialog: openResetChatSession.value,
          handleContinue: handleResetChatSessionContinue,
          headerText: t('popup-messages.reset-chat-header'),
          bodyText: t('popup-messages.reset-chat-body'),
        }}
      />

      <ContinueCancelDialog
        {...{
          handleClose: handleSessionExpiredClose,
          openDialog: openSessionExpired.value,
          handleContinue: handleSessionExpiredContinue,
          headerText: t('popup-messages.session-expired-header'),
          bodyText: t('popup-messages.session-expired-body'),
        }}
      />

      <OKDialog
        {...{
          handleClose: handleAPIErrorClose,
          openDialog: openAPIError.value,
          headerText: t('popup-messages.unexpected-error-header'),
          bodyText: t('popup-messages.unexpected-error-body'),
        }}
      />

      <OKDialog
        {...{
          handleClose: handleAPITimeoutClose,
          openDialog: openAPITimeout.value,
          headerText: t('popup-messages.api-timeout-header'),
          bodyText: t('popup-messages.api-timeout-body'),
        }}
      />

      <OKDialog
        {...{
          handleClose: handleAPIRateLimitClose,
          openDialog: openAPIRateLimit.value,
          headerText: t('popup-messages.server-busy-header'),
          bodyText: t('popup-messages.server-busy-body'),
        }}
      />

      <OKDialog
        {...{
          handleClose: handleInputTooLargeClose,
          openDialog: openInputTooLarge.value,
          headerText: t('popup-messages.input-too-large-header'),
          bodyText: t('popup-messages.input-too-large-body'),
        }}
      />
    </>
  );
};
export default PopupDialogs;
