import React from 'react';
import Typography from '@mui/material/Typography';
import { AllDisplayMessages } from '../SendMessage/MessagesHelper';
import UserIcon from '../../assets/user.jpg';
import { UserBubbleContent, UserBubble } from './Messages.styles';

type UserMessageBubbleProps = {
  value: AllDisplayMessages;
};
export type UserBubbleContentProps = {
  content: string;
};

export const UserMessageBubble = ({ value }: UserMessageBubbleProps) => {
  const { content } = value;

  return (
    <UserBubble direction="row" columnGap={2}>
      <UserBubbleContent elevation={3} content={content}>
        <Typography variant="body1">{content}</Typography>
      </UserBubbleContent>
      <img alt="user" src={UserIcon} />
    </UserBubble>
  );
};
