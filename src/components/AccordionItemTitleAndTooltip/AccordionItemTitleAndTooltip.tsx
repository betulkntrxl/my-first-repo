import React from 'react';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { CustomTitleAndTooltip } from './AccordionItemTitleAndTooltip.styles';

type AccordionItemTitleAndTooltipProps = {
  title: string;
  tooltipTitle: string;
  id?: string;
};

const AccordionItemTitleAndTooltip = ({
  title,
  tooltipTitle,
  id,
}: AccordionItemTitleAndTooltipProps) => (
  <CustomTitleAndTooltip direction="row" alignItems="center" spacing={1}>
    <Typography color="dimgray" id={id}>
      {title}:
    </Typography>
    <Tooltip title={tooltipTitle}>
      <InfoOutlinedIcon />
    </Tooltip>
  </CustomTitleAndTooltip>
);

export default AccordionItemTitleAndTooltip;
