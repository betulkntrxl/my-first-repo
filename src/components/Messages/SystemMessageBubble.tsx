import React from 'react';
import Typography from '@mui/material/Typography';
import { AllDisplayMessages } from '../SendMessage/MessagesHelper';
import SystemIcon from '../../assets/system.jpg';
import BotThinking from '../../assets/typing.gif';
import { displayValue } from '../SendMessage/SendMessage';
import { BotThinkingImg, SystemBubble, SystemBubbleContent } from './Messages.styles';

type SystemBubbleProps = {
  value: AllDisplayMessages;
};

export type SystemBubbleContentProps = {
  displayvalue: string;
};

export const SystemMessageBubble = ({ value }: SystemBubbleProps) => {
  const { content } = value;

  const renderBotThinking = (
    <BotThinkingImg style={{ width: '70px' }}>
      <img alt="assistant" src={BotThinking} />
    </BotThinkingImg>
  );

  return (
    <SystemBubble direction="row" columnGap={2}>
      <img alt="assistant" src={SystemIcon} />
      {content.length > 0 ? (
        <SystemBubbleContent elevation={3} displayvalue={displayValue.value}>
          <Typography variant="body1">{content}</Typography>
        </SystemBubbleContent>
      ) : (
        renderBotThinking
      )}
    </SystemBubble>
  );
};
