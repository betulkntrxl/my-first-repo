import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  Divider,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import AccordionMenu from './AccordionMenu';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    style={{ flexGrow: 0 }}
    expandIcon={<ExpandMoreIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(180deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const Menu = (props: {
  temperature: number;
  handleTemperatureChange: (event: Event, value: number | number[], activeThumb: number) => void;
  topP: number;
  handleTopPChange: (event: Event, value: number | number[], activeThumb: number) => void;
  maxTokens: number;
  handleMaxTokensChange: (event: Event, value: number | number[], activeThumb: number) => void;
  handleSystemMessageValueChange: (event: { target: { name: any; value: any } }) => void;
  systemMessageValue: string;
  handlePastMessagesChange: (event: Event, value: number | number[], activeThumb: number) => void;
  pastMessages: number;
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [version, setVersion] = React.useState('');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  async function getVersion() {
    try {
      // GET request using fetch with async/await
      await fetch('/api/version').then(async response2 => {
        if (typeof response2 !== 'undefined') {
          const dataver = await response2.json();
          setVersion(dataver.version);
        }
      });
    } catch {
      return '';
    }
    return null;
  }

  useEffect(() => {
    getVersion();
  }, []);

  const drawerWidth = 400;
  const {
    temperature,
    handleTemperatureChange,
    topP,
    handleTopPChange,
    maxTokens,
    handleMaxTokensChange,
    handleSystemMessageValueChange,
    systemMessageValue,
    handlePastMessagesChange,
    pastMessages,
  } = props;

  const [systemMessageTemplate, setsystemMessageTemplate] = React.useState('as an assistant');

  const handlesystemMessageTemplateChange = (event: SelectChangeEvent) => {
    setsystemMessageTemplate(event.target.value as string);
    handleSystemMessageValueChange(event);
  };
  const [tempValue, setTempValue] = React.useState<number | string | Array<number | string>>(0.7);
  const [topPValue, setTopPValue] = React.useState<number | string | Array<number | string>>(0.95);
  const [maxTokensValue, setMaxTokensValue] = React.useState<
    number | string | Array<number | string>
  >(800);
  const [pastMessagesValue, setPastMessagesValue] = React.useState<
    number | string | Array<number | string>
  >(10);

  const handleTemperatureSliderChange = (event: Event, newValue: number | number[]) => {
    setTempValue(newValue);
    handleTemperatureChange(event, newValue, 1);
  };
  const handleTopPSliderChange = (event: Event, newValue: number | number[]) => {
    setTopPValue(newValue);
    handleTopPChange(event, newValue, 1);
  };
  const handleMaxTokensSliderChange = (event: Event, newValue: number | number[]) => {
    setMaxTokensValue(newValue);
    handleMaxTokensChange(event, newValue, 1);
  };
  const handlePastMessagesSliderChange = (event: Event, newValue: number | number[]) => {
    setPastMessagesValue(newValue);
    handlePastMessagesChange(event, newValue, 1);
  };
  const handleTemperatureInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) < 0) {
      handleTemperatureChange(new Event('0'), 0, 1);
      setTempValue(0);
    } else if (Number(event.target.value) > 1) {
      handleTemperatureChange(new Event('1'), 1, 1);
      setTempValue(1);
    } else {
      handleTemperatureChange(new Event(event.target.value), Number(event.target.value), 1);
      setTempValue(Number(event.target.value));
    }
  };
  const handleTopPInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) < 0) {
      handleTopPChange(new Event('0'), 0, 1);
      setTopPValue(0);
    } else if (Number(event.target.value) > 1) {
      handleTopPChange(new Event('1'), 1, 1);
      setTopPValue(1);
    } else {
      handleTopPChange(new Event(event.target.value), Number(event.target.value), 1);
      setTopPValue(Number(event.target.value));
    }
  };

  const handleMaxTokensInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) <= 0) {
      handleMaxTokensChange(new Event('0'), 0, 1);
      setMaxTokensValue(0);
    } else if (Number(event.target.value) > 4096) {
      handleMaxTokensChange(new Event('4096'), 4096, 1);
      setMaxTokensValue(4096);
    } else {
      handleMaxTokensChange(new Event(event.target.value), Number(event.target.value), 1);
      setMaxTokensValue(Number(event.target.value).toFixed(0));
    }
  };
  const handlePastMessagesInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tmpval = Number(event.target.value);
    if (tmpval <= 0) {
      handlePastMessagesChange(new Event('0'), 0, 1);
      setPastMessagesValue(0);
    } else if (tmpval > 20) {
      handlePastMessagesChange(new Event('20'), 20, 1);
      setPastMessagesValue(20);
    } else {
      handlePastMessagesChange(new Event(tmpval.toString()), tmpval, 1);
      setPastMessagesValue(event.target.value === '' ? '' : Number(event.target.value).toFixed(0));
    }
  };

  const drawer = (
    <div>
      <Stack direction="column">
        <Stack direction="row">
          <div
            style={{
              width: '90%',
              textAlign: 'left',
              color: '#007BC7',
              fontSize: '18px',
              fontWeight: 'bolder',
              fontFamily: 'Arial',
              margin: 20,
              marginTop: 30,
              marginBottom: 10,
            }}
          >
            Menu
          </div>
          <IconButton
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleDrawerToggle}
            style={{ float: 'right' }}
          >
            <CloseIcon style={{ color: '#007BC7', fontWeight: 'bold' }} />
          </IconButton>
        </Stack>
        <HorizontalRuleIcon
          preserveAspectRatio="none"
          sx={{
            color: '#007BC7',
            marginLeft: '-70px',
            width: '530px',
            maxWidth: 600,
            fontWeight: 'bolder',
          }}
        />
      </Stack>

      <AccordionMenu
        temperature={temperature}
        handleTemperatureChange={handleTemperatureChange}
        topP={topP}
        handleTopPChange={handleTopPChange}
        maxTokens={maxTokens}
        handleMaxTokensChange={handleMaxTokensChange}
        handleSystemMessageValueChange={handleSystemMessageValueChange}
        systemMessageValue={systemMessageValue}
        handlePastMessagesChange={handlePastMessagesChange}
        pastMessages={pastMessages}
      />

      <Paper elevation={1} style={{ maxWidth: 500, padding: '10px', margin: 10, float: 'left' }}>
        <div style={{ color: '#007BC7', fontWeight: 'bold', fontFamily: 'Arial' }}>About</div>

        {/* <Button
          style={{ float: 'left' }}
          onClick={() => {
            getVersion();
          }}
        >
          show version
        </Button> */}

        <div style={{ float: 'left', margin: 10 }}>Version: {version}</div>
      </Paper>
    </div>
  );

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="regular" style={{ width: '95%' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              sx={{ flexGrow: 1 }}
              title="menutitle"
            >
              McKesson Chat App
            </Typography>
            <IconButton style={{ color: 'white', fontSize: '16' }} onClick={handleLogout}>
              <LogoutIcon style={{ color: 'white' }} />
              <Typography> Logout</Typography>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="Settings"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open={mobileOpen}
          onClose={handleDrawerToggle}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Menu;
