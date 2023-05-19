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

function ToolOpenCamera(props) {
  const { stateCloseCamera, setStateCloseCamera, vidMute } = props;

  function openCamera() {
    setStateCloseCamera(false)
  }

  return (
    <div className={ZoomCss.toolOpenCamera}>
      {stateCloseCamera && !vidMute &&
        <Tooltip title="ยกเลิกการซ่อนกล้อง">
          <ExpandButton>
            <ThemeProvider theme={theme}>
              <ExpandLessIcon color="white" sx={{ fontSize: 20 }} onClick={() => openCamera()} />
            </ThemeProvider>
          </ExpandButton>
        </Tooltip>
      }
    </div>
  );
}

export default ToolOpenCamera;