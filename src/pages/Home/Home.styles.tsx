import { styled } from '@mui/system';
import Box from '@mui/material/Box';

export const MainBox = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 68px)', // adjusted the height in case of mobile.
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    height: '100vh',
  },
}));

export const MessagesBox = styled(Box)`
  padding: 0 22px;
  flex: 1;
  overflow-y: scroll;
`;

export const SendMessageBox = styled(Box)`
  box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.1);
`;
