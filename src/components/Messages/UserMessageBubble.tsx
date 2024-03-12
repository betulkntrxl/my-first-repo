import React from 'react';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Tooltip } from '@mui/material';
import { t } from 'i18next';
import { AllDisplayMessages } from '../SendMessage/MessagesHelper';
import UserIcon from '../../assets/user.jpg';
import { UserBubbleContent, CopyIconUserContent, UserBubble } from './Messages.styles';

import { copyText } from './MessageUtils';

type UserMessageBubbleProps = {
  value: AllDisplayMessages;
};
export type UserBubbleContentProps = {
  content: string;
};

export const UserMessageBubble = ({ value }: UserMessageBubbleProps) => {
  const { content } = value;
  const color = '#757171';

  return (
    <UserBubble direction="row" columnGap={2}>
      <UserBubbleContent elevation={3} content={content}>
        <Typography variant="body1">{content}</Typography>
        <Tooltip title={t('copy-tooltip')}>
          <CopyIconUserContent
            content={content}
            onClick={() => copyText(content)}
            aria-label="copy-user-text"
            data-testid="user"
          >
            <ContentCopyIcon sx={{ width: '12px', height: '12px', color: { color } }} />
          </CopyIconUserContent>
        </Tooltip>
      </UserBubbleContent>
      <img alt="user" src={UserIcon} />
    </UserBubble>
  );
};
