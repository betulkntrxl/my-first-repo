import { styled } from '@mui/system';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { UserBubbleContentProps } from './UserMessageBubble';
import { CopyIconcontentProps, SystemBubbleContentProps } from './SystemMessageBubble';

export const MessagesBox = styled(Stack)`
  width: 100%;
  height: 100%;
  position: relative;

  // position: relative;
  // height: calc(100% - 130px);
  // height: calc(100% - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 10px);

  // top: 66px;
  left: 0;
  right: 0;
  //bottom: 92px;
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
  padding: 6px 7px;
  margin: 20px 0;
  border-radius: 5px;
  overflow-wrap: break-word;
  width: auto;
  gap: 5px;
  white-space: pre-wrap;
`;

export const CopyContent = styled('div')`
  margin: 5px 0;
  border: none;
  overflow-wrap: break-word;
  cursor: pointer;
  width: auto;
  align-items: flex-end;
  white-space: pre-wrap;
`;

export const UserBubbleContent = styled(BubbleContent)<UserBubbleContentProps>`
  background-color: gainsboro;
  display: ${({ content }) => (content?.length === 0 ? 'none' : 'flex')};
`;
export const CopyIconUserContent = styled(CopyContent)<UserBubbleContentProps>`
  background-color: gainsboro;
  display: flex;
`;

export const CopyIconSystemContent = styled(CopyContent)<CopyIconcontentProps>`
  background-color: #e5f2f9;
  display: ${({ icondisplayvalue }) => icondisplayvalue};
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
    margin-bottom: 16px;
  }
`;
