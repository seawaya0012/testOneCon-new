import React, { useState } from "react";

//CSS
import ZoomCss from "../CSS/zoom.module.scss"

//Library
import {
  Box,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';

//Icon
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const ExpandButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  background: "#A5A5A584",
})

const theme = createTheme({
  palette: {
    white: {
      main: '#FFFFFF',
    },
    secondary: {
      main: '#88888887',
    },
  },
});

function ToolOpenConference(props) {
  const { stateCloseConference, setStateCloseConference } = props;

  function openConference() {
    setStateCloseConference(false)
  }

  return (
    <div className={ZoomCss.toolOpenConference}>
      {stateCloseConference &&
        <Tooltip title="ยกเลิกการซ่อน">
          <ExpandButton>
            <ThemeProvider theme={theme}>
              <ExpandLessIcon color="white" sx={{ fontSize: 20 }} onClick={() => openConference()} />
            </ThemeProvider>
          </ExpandButton>
        </Tooltip>
      }
    </div>
  );
}

export default ToolOpenConference;