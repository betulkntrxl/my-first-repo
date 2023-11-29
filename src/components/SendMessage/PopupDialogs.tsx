import React from 'react';
import { useTranslation } from 'react-i18next';

import OKDialog from '../OKDialog/OkDialog';
import ContinueCancelDialog from '../ContinueCancelDialog/ContinueCancelDialog';
import {
  PopupDialogCloseHandlers,
  PopupDialogContinueHandlers,
  openResetChatSession,
  openSessionExpired,
  openAPIRateLimit,
  openAPITimeout,
  openAPIError,
  openInputTooLarge,
} from './PopupDialogHandlers';

const PopupDialogs = () => {
  const { t } = useTranslation();

  return (
    <>
      <ContinueCancelDialog
        {...{
          handleClose: PopupDialogCloseHandlers.closeResetChatDialog,
          openDialog: openResetChatSession.value,
          handleContinue: PopupDialogContinueHandlers.continueResetChatDialog,
          headerText: t('popup-messages.reset-chat-header'),
          bodyText: t('popup-messages.reset-chat-body'),
        }}
      />

      <ContinueCancelDialog
        {...{
          handleClose: PopupDialogCloseHandlers.closeSessionExpiredDialog,
          openDialog: openSessionExpired.value,
          handleContinue: PopupDialogContinueHandlers.continueSessionExpiredDialog,
          headerText: t('popup-messages.session-expired-header'),
          bodyText: t('popup-messages.session-expired-body'),
        }}
      />

      <OKDialog
        {...{
          handleClose: PopupDialogCloseHandlers.closeAPIGeneralErrorDialog,
          openDialog: openAPIError.value,
          headerText: t('popup-messages.unexpected-error-header'),
          bodyText: t('popup-messages.unexpected-error-body'),
        }}
      />

      <OKDialog
        {...{
          handleClose: PopupDialogCloseHandlers.closeAPITimeoutDialog,
          openDialog: openAPITimeout.value,
          headerText: t('popup-messages.api-timeout-header'),
          bodyText: t('popup-messages.api-timeout-body'),
        }}
      />

      <OKDialog
        {...{
          handleClose: PopupDialogCloseHandlers.closeAPIRateLimitDialog,
          openDialog: openAPIRateLimit.value,
          headerText: t('popup-messages.server-busy-header'),
          bodyText: t('popup-messages.server-busy-body'),
        }}
      />

      <OKDialog
        {...{
          handleClose: PopupDialogCloseHandlers.closeInputTooLargeDialog,
          openDialog: openInputTooLarge.value,
          headerText: t('popup-messages.input-too-large-header'),
          bodyText: t('popup-messages.input-too-large-body'),
        }}
      />
    </>
  );
};
export default PopupDialogs;
