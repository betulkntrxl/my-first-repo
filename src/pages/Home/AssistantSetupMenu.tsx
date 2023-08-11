import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React from 'react';
import axios from 'axios';
import { SelectChangeEvent } from '@mui/material/Select';

const AssistantSetupMenu = (props: {
  handleSystemMessageValueChange: (event: { target: { name: any; value: any } }) => void;
  systemMessageValue: string;
}) => {
  const { handleSystemMessageValueChange, systemMessageValue } = props;

  const handlesystemMessageTemplateChange = (event: SelectChangeEvent) => {
    // Tracking in app insights
    axios.post('/api/app-insights-event', {
      name: 'ChatApp System Message Template Changed',
    });
    handleSystemMessageValueChange(event);
  };

  return (
    <Typography>
      <Typography style={{ marginBottom: 10, marginTop: 10, color: 'dimgray' }}>
        Message Template
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="systemMessageTemplate-label">System Message Template</InputLabel>
        <Select
          fullWidth
          labelId="systemMessageTemplate-label"
          id="systemMessageTemplate"
          value={systemMessageValue}
          label="System Message Template"
          onChange={handlesystemMessageTemplateChange}
        >
          <MenuItem value="Assistant is a large language model trained by OpenAI.">
            Assistant is a large language model trained by OpenAI.
          </MenuItem>
          <MenuItem value="as an assistant">as an assistant</MenuItem>
          <MenuItem value="as a agent understanding the sentiment">
            as a agent understanding the sentiment
          </MenuItem>
          <MenuItem value="as a mentor using the Socratic method">
            as a mentor using the Socratic method
          </MenuItem>
        </Select>
      </FormControl>
      <br />
      <br />
      <div style={{ marginBottom: 10, color: 'dimgray' }}>
        System message:
        <Tooltip title="Give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the assistant’s personality, tell it what it should and shouldn’t answer, and tell it how to format responses. There’s no token limit for this section, but it will be included with every API call, so it counts against the overall token limit.">
          <InfoOutlinedIcon />
        </Tooltip>
      </div>
      <TextField
        id="outlined-multiline-static"
        label="System message"
        multiline
        fullWidth
        rows={4}
        //        defaultValue={systemMessageValue}
        value={systemMessageValue}
        onChange={handleSystemMessageValueChange}
        inputProps={{
          title: 'system-message-input',
        }}
      />
    </Typography>
  );
};

export default AssistantSetupMenu;
