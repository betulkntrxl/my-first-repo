import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';

const blue = {
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

export const CustomTextarea = styled('textarea')`
  width: 100%;
  font-family: inherit;
  padding: 10px;

  font-size: inherit;
  border-radius: 8px;

  max-height: 167px;

  display: inline-flex;

  overflow: hidden;
  color: inherit;
  resize: none;

  &:active {
    outline-color: black;
  }
  &.Mui-focused fieldset {
    border-color: black;
  }
`;

export const CustomButton = styled(Button)`
  font-family: Arial, sans-serif;
  font-size: 0.875rem;
  background-color: ${({ disabled }) => (disabled ? 'gray' : blue[500])};
  border-radius: 8px;
  color: ${({ disabled }) => (disabled ? 'rgba(255, 255, 255, 0.5)' : 'white')};
  transition: all 150ms ease;
  padding: 4px 16px;
  pointerEvents: auto,
  border: none;
  white-space: nowrap;
  

  &:hover {
    background-color: ${({ disabled }) => (disabled ? null : blue[600])};
  }
`;

export const CustomIcon = styled('div')`
  margin-left: 0;
  margin-bottom: 3px;
  margin-top: 8px;
`;

export const CustomButtonText = styled(Typography)(({ theme }) => ({
  display: 'none',
  paddingRight: '8px',
  pointerEvents: 'auto',
  [theme.breakpoints.up('md')]: {
    display: 'block',
  },
}));
