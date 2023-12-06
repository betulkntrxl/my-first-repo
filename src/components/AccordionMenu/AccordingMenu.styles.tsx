import React from 'react';
import { createTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AccordionTheme = createTheme({
  components: {
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
        elevation: 0,
        square: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          border: `0px solid ${theme.palette.divider}`,
          '&:not(:last-child)': {
            borderBottom: '1px solid',
            marginLeft: 20,
            marginRight: 20,
            color: '#e6e6e6',
          },
          '&:before': {
            display: 'none',
          },
        }),
      },
    },
  },
});

const AccordionSummaryTheme = createTheme({
  components: {
    MuiAccordionSummary: {
      defaultProps: {
        expandIcon: <ExpandMoreIcon sx={{ fontSize: '0.9rem' }} />,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          style: 'flexGrow: 0',
          backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, 0)',
          flexDirection: 'row',
          '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(180deg)',
          },
          '& .MuiAccordionSummary-content': {
            marginLeft: -15,
          },
        }),
      },
    },
  },
});

const AccordionDetailsTheme = createTheme({
  components: {
    MuiAccordionDetails: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: 'black',
          padding: theme.spacing(0),
        }),
      },
    },
  },
});

export { AccordionTheme, AccordionSummaryTheme, AccordionDetailsTheme };
