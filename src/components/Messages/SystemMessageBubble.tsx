import React from 'react';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Tooltip } from '@mui/material';
import { t } from 'i18next';
import { AllDisplayMessages } from '../SendMessage/MessagesHelper';
import SystemIcon from '../../assets/system.jpg';
import BotThinking from '../../assets/typing.gif';
import { displayValue, icondisplayvalue } from '../SendMessage/SendMessage';
import {
  BotThinkingImg,
  SystemBubble,
  SystemBubbleContent,
  CopyIconSystemContent,
} from './Messages.styles';
import { copyText, PromptType } from './MessageUtils';

type SystemBubbleProps = {
  value: AllDisplayMessages;
};

export type CopyIconcontentProps = {
  icondisplayvalue: string;
};

export type SystemBubbleContentProps = {
  displayvalue: string;
};

export const SystemMessageBubble = ({ value }: SystemBubbleProps) => {
  const { content } = value;
  const color = '#87a7b9';

  const renderBotThinking = (
    <BotThinkingImg style={{ width: '70px' }} data-testid="bot">
      <img alt="assistant" src={BotThinking} />
    </BotThinkingImg>
  );

  return (
    <SystemBubble direction="row" columnGap={2}>
      <img alt="assistant" src={SystemIcon} />
      {content.length > 0 ? (
        <SystemBubbleContent elevation={3} displayvalue={displayValue.value}>
          <Typography variant="body1">{content}</Typography>
          <Tooltip title={t('copy-tooltip')} data-testid="tooltip">
            <CopyIconSystemContent
              icondisplayvalue={icondisplayvalue.value}
              onClick={() => copyText(PromptType.SYSTEM, content)}
              aria-label="copy-system-text"
              data-testid="system"
            >
              <ContentCopyIcon
                sx={{ width: '12px', height: '12px', color: { color } }}
                data-testid="system-copy"
              />
            </CopyIconSystemContent>
          </Tooltip>
        </SystemBubbleContent>
      ) : (
        renderBotThinking
      )}
    </SystemBubble>
  );
};
