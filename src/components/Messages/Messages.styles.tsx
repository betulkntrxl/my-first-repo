import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { UserBubbleContentProps } from './UserMessageBubble';
import { SystemBubbleContentProps } from './SystemMessageBubble';

export const MessagesBox = styled(Box)`
  width: 100%;
  position: fixed;
  top: 66px;
  left: 0;
  right: 0;
  bottom: 90px;
  overflow: auto;
  overflow-y: auto;
  background-color: transparent;
  border-radius: 0;
`;

export const Bubble = styled(Stack)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  & img {
    width: 40px;
    height: 40px;
    margin-top: 20px;
  }
`;

export const UserBubble = styled(Bubble)`
  justify-content: flex-end;
`;

export const SystemBubble = styled(Bubble)`
  justify-content: flex-start;
`;

export const BubbleContent = styled(Paper)`
  padding: 6px 10px;
  margin: 20px 0;
  border-radius: 5px;
  overflow-wrap: break-word;
  width: auto;
  max-width: calc(100% - 70px);
  white-space: pre-wrap;
`;

export const UserBubbleContent = styled(BubbleContent)<UserBubbleContentProps>`
  background-color: gainsboro;
  display: ${({ content }) => (content?.length === 0 ? 'none' : 'block')};
`;

export const SystemBubbleContent = styled(BubbleContent)<SystemBubbleContentProps>`
  background-color: #e5f2f9;
  display: ${({ displayvalue }) => displayvalue};
`;

export const BotThinkingImg = styled('div')`
  width: 70px;
  & img {
    width: 100%;
    height: auto;
    margin-top: 26px;
  }
`;
