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
  openNotAuthorizedForModel,
  openContentFilter,
} from './PopupDialogHandlers';
import { model } from '../ConfigurationMenu/ConfigurationMenu';
import { GPT_MODELS } from '../../clients/models/PromptModel';

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
          bodyText:
            model.value === GPT_MODELS.GPT_3_5_TURBO_16K
              ? t('popup-messages.input-too-large-35turbo-16k-body')
              : t('popup-messages.input-too-large-gpt4-32K-body'),
        }}
      />

      <OKDialog
        {...{
          handleClose: PopupDialogCloseHandlers.closeNotAuthorizedDialog,
          openDialog: openNotAuthorizedForModel.value,
          headerText: t('popup-messages.not-authorized-header'),
          bodyText: t('popup-messages.not-authorized-body'),
        }}
      />

      <OKDialog
        {...{
          handleClose: PopupDialogCloseHandlers.closeContentFilterDialog,
          openDialog: openContentFilter.value,
          headerText: t('popup-messages.content-filter-header'),
          bodyText: t('popup-messages.content-filter-body'),
        }}
      />
    </>
  );
};
export default PopupDialogs;
