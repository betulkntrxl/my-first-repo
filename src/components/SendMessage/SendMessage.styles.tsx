import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const blue = {
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

// export const CustomButton = styled(Button)`
//   font-family: Arial, sans-serif;
//   font-size: 0.875rem;
//   background-color: ${blue[500]};
//   border-radius: 8px;
//   color: white;
//   transition: all 150ms ease;
//   cursor: pointer;
//   border: none;
//   white-space: nowrap;
//   pointer-event: ${({ disabled }) => (disabled ? 'auto' : 'auto')};

//   &:hover {
//     background-color: ${blue[600]};
//   }
// `;
export const CustomButton = styled(Button)`
  font-family: Arial, sans-serif;
  font-size: 0.875rem;
  background-color: ${({ disabled }) => (disabled ? 'gray' : blue[500])};
  border-radius: 8px;
  color: ${({ disabled }) => (disabled ? 'rgba(255, 255, 255, 0.5)' : 'white')};
  transition: all 150ms ease;
  border: none;
  white-space: nowrap;
  pointer-events: auto;

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
  [theme.breakpoints.up('md')]: {
    display: 'block',
  },
}));
