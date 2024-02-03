import React from 'react';

import Stack from '@mui/material/Stack';

import AccordionMenu from '../AccordionMenu/AccordionMenu';

const MenuDrawer = () => (
  <div style={{ overflowX: 'hidden' }}>
    <Stack direction="column" />
    <AccordionMenu />
  </div>
);

export default MenuDrawer;
