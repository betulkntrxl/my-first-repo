import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import AccordionMenu from '../AccordionMenu/AccordionMenu';

const MenuDrawer = () => (
  <Box sx={{ overflowX: 'hidden' }} minWidth="100%">
    <Stack direction="column" />
    <AccordionMenu />
  </Box>
);

export default MenuDrawer;
