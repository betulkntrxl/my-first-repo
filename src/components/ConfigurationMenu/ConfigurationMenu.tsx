import React from 'react';
import { signal } from '@preact/signals-react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Slider,
  TextField,
  Tooltip,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ConfigurationConstants from './ConfigurationConstants';
import { GPT_MODELS } from '../../clients/models/PromptModel';
import { getTokenLimit, getMaxTokensDefault } from './ConfigurationHelper';

import { availableModels } from '../../pages/Home/Home';

export const model = signal<GPT_MODELS>(GPT_MODELS.NONE);
export const tokenLimit = signal<number>(0);
export const temperature = signal<number>(ConfigurationConstants.DEFAULT_TEMPERATURE);
export const topP = signal<number>(ConfigurationConstants.DEFAULT_TOP_P);
export const maxTokens = signal<number>(0);
export const pastMessages = signal<number>(ConfigurationConstants.DEFAULT_PAST_MESSAGES);
export const APITimeout = signal<number>(ConfigurationConstants.DEFAULT_API_TIMEOUT);

const ConfigurationMenu = () => {
  const { t } = useTranslation();

  const handleModelChange = (event: { target: { name: any; value: any } }) => {
    model.value = event.target.value;
    tokenLimit.value = getTokenLimit(model.value);
    maxTokens.value = getMaxTokensDefault(model.value);
  };

  /* eslint-disable */
  const handleTemperatureSliderChange = (event: Event, newValue: number | number[]) => {
    temperature.value = Number.isNaN(newValue) ? 0 : (newValue as number);
  };

  const handleTopPSliderChange = (event: Event, newValue: number | number[]) => {
    topP.value = Number.isNaN(newValue) ? 0 : (newValue as number);
  };
  const handleMaxTokensSliderChange = (event: Event, newValue: number | number[]) => {
    maxTokens.value = Number.isNaN(newValue) ? 0 : (newValue as number);
  };
  const handlePastMessagesSliderChange = (event: Event, newValue: number | number[]) => {
    pastMessages.value = Number.isNaN(newValue) ? 0 : (newValue as number);
  };
  const handleAPITimeoutSliderChange = (event: Event, newValue: number | number[]) => {
    APITimeout.value = Number.isNaN(newValue) ? 0 : (newValue as number);
  };
  /* eslint-enable */

  const handleTemperatureInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) > 1) {
      temperature.value = 1;
    } else if (Number(event.target.value) < 0) {
      temperature.value = 0;
    } else {
      temperature.value = Number(event.target.value);
    }
  };

  const handleTopPInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) > 1) {
      topP.value = 1;
    } else if (Number(event.target.value) < 0) {
      topP.value = 0;
    } else {
      topP.value = Number(event.target.value);
    }
  };

  const handleMaxTokensInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) < 1) {
      maxTokens.value = 1;
    } else if (Number(event.target.value) > tokenLimit.value) {
      maxTokens.value = tokenLimit.value;
    } else {
      maxTokens.value = Number(event.target.value);
    }
  };

  const handlePastMessagesInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tmpval = Number(event.target.value);
    if (tmpval > 20) {
      pastMessages.value = 20;
    } else if (tmpval < 0) {
      pastMessages.value = 0;
    } else {
      pastMessages.value = tmpval;
    }
  };
  const handleAPITimeoutInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tmpval = Number(event.target.value);
    if (tmpval <= 5) {
      APITimeout.value = 5;
    } else if (tmpval > 60) {
      APITimeout.value = 60;
    } else {
      APITimeout.value = tmpval;
    }
  };

  return (
    <>
      {
        // Only showing model dropdown if there's
        // more than 1 model available
        availableModels.value.length > 1 && (
          <Grid item xs>
            <Typography style={{ marginBottom: 10, marginTop: 10, color: 'dimgray' }}>
              {t('menu.configuration.model')}:{' '}
              <Tooltip title={t('menu.configuration.model-tooltip')}>
                <InfoOutlinedIcon />
              </Tooltip>
            </Typography>

            <FormControl fullWidth>
              <InputLabel id="model">{t('menu.configuration.model')}</InputLabel>
              <Select
                fullWidth
                labelId="model-label"
                id="model"
                value={model.value}
                onChange={handleModelChange}
                label={t('menu.configuration.model')}
                aria-label="model"
              >
                {availableModels.value.map(availableModel => (
                  <MenuItem aria-label="model" value={availableModel}>
                    {availableModel}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )
      }
      <Typography
        id="temperature-input-label"
        style={{ fontFamily: 'Roboto, Helvetica, Arial, sans-serif', color: 'dimgray' }}
      >
        {t('menu.configuration.temperature')}:{' '}
        <Tooltip title={t('menu.configuration.temperature-tooltip')}>
          <InfoOutlinedIcon />
        </Tooltip>
      </Typography>
      <Grid container spacing={2} alignItems="center" style={{ width: 370 }}>
        <Grid item xs>
          <div>
            <Slider
              style={{ width: 230 }}
              valueLabelDisplay="auto"
              min={0}
              max={1}
              step={0.1}
              value={temperature.value}
              onChange={handleTemperatureSliderChange}
              aria-labelledby="temperature-input-label"
              aria-label="Temperature"
            />
          </div>
        </Grid>
        <Grid item>
          <TextField
            style={{ width: 85 }}
            value={temperature}
            size="small"
            onChange={handleTemperatureInputChange}
            inputProps={{
              step: 0.1,
              min: 0,
              max: 1,
              type: 'number',
              'aria-labelledby': 'temperature-input-label',
              title: 'temperature-input',
              'aria-label': 'temperature-input',
            }}
          />
        </Grid>
      </Grid>
      <Typography id="topp-input-label" style={{ color: 'dimgray' }}>
        {t('menu.configuration.top_p')}:{' '}
        <Tooltip title={t('menu.configuration.top_p-tooltip')}>
          <InfoOutlinedIcon />
        </Tooltip>
      </Typography>
      <Grid container spacing={2} alignItems="center" style={{ width: 370 }}>
        <Grid item xs>
          <Slider
            style={{ width: 230 }}
            valueLabelDisplay="auto"
            min={0}
            max={1}
            step={0.05}
            value={topP.value}
            aria-label="Top P"
            onChange={handleTopPSliderChange}
            aria-labelledby="topp-input-label"
          />
        </Grid>
        <Grid item>
          <TextField
            style={{ width: 85 }}
            value={topP}
            size="small"
            onChange={handleTopPInputChange}
            inputProps={{
              step: 0.1,
              min: 0,
              max: 1,
              type: 'number',
              'aria-labelledby': 'topp-input-label',
              title: 'topP-input',
            }}
          />
        </Grid>
      </Grid>
      <Typography id="maxtokens-input-label" style={{ color: 'dimgray' }}>
        {t('menu.configuration.max-tokens')}:{' '}
        <Tooltip title={t('menu.configuration.max-tokens-tooltip')}>
          <InfoOutlinedIcon />
        </Tooltip>
      </Typography>
      <Grid container spacing={2} alignItems="center" style={{ width: 370 }}>
        <Grid item xs>
          <Slider
            style={{ width: 230 }}
            valueLabelDisplay="auto"
            min={1}
            max={tokenLimit.value}
            step={1}
            value={maxTokens.value}
            aria-label="Max Tokens"
            onChange={handleMaxTokensSliderChange}
            aria-labelledby="maxtokens-input-label"
          />
        </Grid>
        <Grid item>
          <TextField
            style={{ width: 85 }}
            value={maxTokens.value}
            size="small"
            onChange={handleMaxTokensInputChange}
            inputProps={{
              step: 1,
              min: 1,
              max: tokenLimit.value,
              type: 'number',
              'aria-labelledby': 'maxtokens-input-label',
              title: 'maxTokens-input',
            }}
          />
        </Grid>
      </Grid>
      <>
        <Typography id="pastmessages-input-label" style={{ color: 'dimgray' }}>
          {t('menu.configuration.past-messages-included')}:{' '}
          <Tooltip title={t('menu.configuration.past-messages-included-tooltip')}>
            <InfoOutlinedIcon />
          </Tooltip>
        </Typography>
        <Grid container spacing={2} alignItems="center" style={{ width: 370 }}>
          <Grid item xs>
            <Slider
              style={{ width: 230 }}
              valueLabelDisplay="auto"
              min={0}
              max={20}
              step={1}
              value={pastMessages.value}
              aria-label="Past messages included"
              onChange={handlePastMessagesSliderChange}
              aria-labelledby="pastmessages-input-label"
            />
          </Grid>
          <Grid item>
            <TextField
              style={{ width: 85 }}
              value={pastMessages.value}
              size="small"
              onChange={handlePastMessagesInputChange}
              inputProps={{
                step: 1,
                min: 0,
                max: 20,
                type: 'number',
                'aria-labelledby': 'pastmessages-input-label',
                title: 'pastMessages-input',
              }}
            />
          </Grid>
        </Grid>
      </>
      <>
        <Typography id="apitimeout-input-label" style={{ color: 'dimgray' }}>
          {t('menu.configuration.api-timeout')}:{' '}
          <Tooltip title={t('menu.configuration.api-timeout-tooltip')}>
            <InfoOutlinedIcon />
          </Tooltip>
        </Typography>
        <Grid container spacing={2} alignItems="center" style={{ width: 370 }}>
          <Grid item xs>
            <Slider
              style={{ width: 230 }}
              valueLabelDisplay="auto"
              min={5}
              max={60}
              step={1}
              value={APITimeout.value}
              aria-label="API Timeout"
              onChange={handleAPITimeoutSliderChange}
              aria-labelledby="apitimeout-input-label"
            />
          </Grid>
          <Grid item>
            <TextField
              style={{ width: 85 }}
              value={APITimeout.value}
              size="small"
              onChange={handleAPITimeoutInputChange}
              inputProps={{
                step: 1,
                min: 5,
                max: 60,
                type: 'number',
                'aria-labelledby': 'apitimeout-input-label',
                title: 'apitimeout-input',
              }}
            />
          </Grid>
        </Grid>
      </>
    </>
  );
};

export default ConfigurationMenu;
