import { styled } from '@mui/system';
import Button from '@mui/material/Button';

const blue = {
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const CustomButton = styled(Button)`
  font-family: Arial, sans-serif;
  font-size: 0.875rem;
  background-color: ${blue[500]};
  padding: 4px 10px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: none;
  margin-right: 10px;

  &:hover {
    background-color: ${blue[600]};
  }
`;

export default CustomButton;
