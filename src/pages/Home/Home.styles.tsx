import styled from '@emotion/styled';
import Box from '@mui/material/Box';

export const MainBox = styled(Box)`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const MessagesBox = styled(Box)`
  height: 85vh;
  overflow: hidden;
  padding: 34px 16px 22px;
`;

export const SendMessageBox = styled(Box)`
  box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.1);
`;
