import React from 'react';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Tooltip } from '@mui/material';
import { t } from 'i18next';
import { AllDisplayMessages } from '../SendMessage/MessagesHelper';
import UserIcon from '../../assets/user.jpg';
import { UserBubbleContent, CopyIconUserContent, UserBubble } from './Messages.styles';
import { showSnackbar } from '../../App';

type UserMessageBubbleProps = {
  value: AllDisplayMessages;
};
export type UserBubbleContentProps = {
  content: string;
};

export const UserMessageBubble = ({ value }: UserMessageBubbleProps) => {
  const { content } = value;

  const color = '#757171';
  const delay = 2000;

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSnackbar.value = true;
      setTimeout(() => {
        showSnackbar.value = false;
      }, delay);
    } catch (error) {
      console.log('error copying data');
    }
  };

  return (
    <UserBubble direction="row" columnGap={2}>
      <UserBubbleContent elevation={3} content={content}>
        <Typography variant="body1">{content}</Typography>
        <Tooltip title={t('copy-tooltip')}>
          <CopyIconUserContent content={content} onClick={() => copyText(content)}>
            <ContentCopyIcon sx={{ width: '12px', height: '12px', color: { color } }} />
          </CopyIconUserContent>
        </Tooltip>
      </UserBubbleContent>
      <img alt="user" src={UserIcon} />
    </UserBubble>
  );
};
