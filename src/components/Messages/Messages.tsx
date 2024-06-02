import React, { useEffect, useRef } from 'react';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { allMessagesToDisplay, heightChange } from '../SendMessage/SendMessage';
import { AppGuidelines } from './AppGuidelines';
import { MessagesBox } from './Messages.styles';
import { UserMessageBubble } from './UserMessageBubble';
import { SystemMessageBubble } from './SystemMessageBubble';

const Messages = () => {
  const bottomRef: any = useRef();

  const scrollToBottom = () => {
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
      }
    }, 200);
    return null;
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessagesToDisplay.value, heightChange.value]);

  const renderMessages = allMessagesToDisplay.value.map(
    value =>
      (value.role === 'user' && <UserMessageBubble key={value.id} value={value} />) ||
      (value.role === 'system' && <SystemMessageBubble key={value.id} value={value} />),
  );

  return (
    <MessagesBox ref={bottomRef}>
      <CardContent
        sx={{
          paddingBottom: 0,
          height: '100%',
        }}
      >
        <Stack direction="column" sx={{ height: '100%' }} justifyContent="flex-end">
          <AppGuidelines />
          {renderMessages}
        </Stack>
      </CardContent>
    </MessagesBox>
  );
};

export default Messages;
