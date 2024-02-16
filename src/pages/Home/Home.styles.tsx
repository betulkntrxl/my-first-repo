import styled from '@emotion/styled';
import Box from '@mui/material/Box';

export const MainBox = styled(Box)`
  height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
`;

export const MessagesBox = styled(Box)`
  flex-grow: 1;
  overflow: auto;
  padding: 34px 16px 16px;
`;

export const SendMessageBox = styled(Box)`
  box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.1);
  height: 78px;
`;
