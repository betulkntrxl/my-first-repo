import { styled } from '@mui/system';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

export const AboutListItem = styled(ListItem)`
  position: absolute;
  bottom: 0;
`;

export const CustomIcon = styled('div')`
  margin-left: 0;
  margin-bottom: 3px;
  margin-top: 8px;
`;

export const ChatAppLogo = styled(Typography)`
  color: #005a8c;
  padding-top: 8px;
  font-weight: bold;
  font-size: 20px;
`;
export const MenuDivider = styled(Divider)`
  background: #007bc7;
  height: 1px;
`;
