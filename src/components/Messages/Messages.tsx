import React, { useEffect, useRef } from 'react';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { allMessagesToDisplay } from '../SendMessage/SendMessage';
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
  }, [allMessagesToDisplay.value]);

  const renderMessages = allMessagesToDisplay.value.map(
    value =>
      (value.role === 'user' && <UserMessageBubble key={value.id} value={value} />) ||
      (value.role === 'system' && <SystemMessageBubble key={value.id} value={value} />),
  );

  return (
    <MessagesBox ref={bottomRef} justifyContent="flex-end">
      <CardContent
        sx={{
          paddingBottom: 0,
        }}
      >
        <Stack direction="column" sx={{ height: '100vh' }}>
          <AppGuidelines />
          {renderMessages}
        </Stack>
      </CardContent>
    </MessagesBox>
  );
};

export default Messages;
