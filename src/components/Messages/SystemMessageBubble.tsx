import React from 'react';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Tooltip } from '@mui/material';
import { AllDisplayMessages } from '../SendMessage/MessagesHelper';
import SystemIcon from '../../assets/system.jpg';
import BotThinking from '../../assets/typing.gif';
import { displayValue, iconDisplayValue } from '../SendMessage/SendMessage';
import {
  BotThinkingImg,
  SystemBubble,
  SystemBubbleContent,
  CopyIconSystemContent,
} from './Messages.styles';
import { showSnackbar } from '../../App';

type SystemBubbleProps = {
  value: AllDisplayMessages;
};

export type CopyIconcontentProps = {
  iconDisplayvalue: string;
};

export type SystemBubbleContentProps = {
  displayvalue: string;
};

export const SystemMessageBubble = ({ value }: SystemBubbleProps) => {
  const { content } = value;
  const color = '#87a7b9';
  const delay = 2000;
  const renderBotThinking = (
    <BotThinkingImg style={{ width: '70px' }}>
      <img alt="assistant" src={BotThinking} />
    </BotThinkingImg>
  );
  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);

    showSnackbar.value = true;
    setTimeout(() => {
      showSnackbar.value = false;
    }, delay);
  };

  return (
    <SystemBubble direction="row" columnGap={2}>
      <img alt="assistant" src={SystemIcon} />
      {content.length > 0 ? (
        <SystemBubbleContent elevation={3} displayvalue={displayValue.value}>
          <Typography variant="body1">{content}</Typography>
          <Tooltip title="Copy Text">
            <CopyIconSystemContent
              iconDisplayvalue={iconDisplayValue.value}
              onClick={() => copyText(content)}
            >
              <ContentCopyIcon sx={{ width: '12px', height: '12px', color: { color } }} />
            </CopyIconSystemContent>
          </Tooltip>
        </SystemBubbleContent>
      ) : (
        renderBotThinking
      )}
    </SystemBubble>
  );
};
