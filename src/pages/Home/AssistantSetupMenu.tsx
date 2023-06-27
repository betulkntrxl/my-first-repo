import { FormControl, InputLabel, MenuItem, Select, Tooltip, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React from 'react';
import { SelectChangeEvent } from '@mui/material/Select';

const AssistantSetupMenu = (propsAccordianMenu: {
  handleSystemMessageValueChange: (event: { target: { name: any; value: any } }) => void;
  systemMessageValue: string;
}) => {
  const { handleSystemMessageValueChange, systemMessageValue } = propsAccordianMenu;

  const [systemMessageTemplate, setsystemMessageTemplate] = React.useState('as an assistant');

  const handlesystemMessageTemplateChange = (event: SelectChangeEvent) => {
    setsystemMessageTemplate(event.target.value as string);
    handleSystemMessageValueChange(event);
  };

  return (
    <>
      <br />
      <Typography>
        <FormControl fullWidth>
          <InputLabel id="systemMessageTemplate-label" style={{ fontWeight: 'bold' }}>
            System Message Template
          </InputLabel>
          <Select
            fullWidth
            labelId="systemMessageTemplate-label"
            id="systemMessageTemplate"
            value={systemMessageTemplate}
            label="System Message Template"
            onChange={handlesystemMessageTemplateChange}
          >
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
        <div style={{ fontWeight: 'bold' }}>
          System message:
          <Tooltip title="Give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the assistant’s personality, tell it what it should and shouldn’t answer, and tell it how to format responses. There’s no token limit for this section, but it will be included with every API call, so it counts against the overall token limit.">
            <InfoOutlinedIcon />
          </Tooltip>
        </div>{' '}
        <textarea
          placeholder="Type the system message here."
          ref={input => input && input.focus()}
          name="systemMessage"
          onChange={handleSystemMessageValueChange}
          rows={5}
          cols={50}
          value={systemMessageValue}
          style={{
            width: '98%',
            fontFamily: 'sans-serif',
            padding: '5px 5px',
            boxSizing: 'border-box',
            border: '1',
            borderRadius: '4px',
            fontSize: '16px',
            resize: 'none',
          }}
        />
      </Typography>
    </>
  );
};

export default AssistantSetupMenu;
