import React, { useRef, useEffect, useState } from 'react';

//Component
import LoadingCamera from "../Loading/loadingCamera"

//CSS
import ZoomCss from "../CSS/zoom.module.scss"

//Library
import {
  Box,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';

//Icon
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';

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

const ExpandButtonMobile = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  background: "#A5A5A584",
})

const ExpandButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  background: "#A5A5A584",
})

function ConferenceWhenShareScreen(props) {
  const {
    streamSrc,
    stateCloseConference,
    setStateCloseConference
  } = props;
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const pexipConference = useRef(null);

  // CameraUser
  useEffect(() => {
    if (!stateCloseConference && pexipConference.current) {
      if (typeof MediaStream !== 'undefined' && streamSrc instanceof MediaStream) {
        pexipConference.current.srcObject = streamSrc;
      } else {
        pexipConference.current.src = streamSrc;
      }
    } else if (pexipConference.current) {
      if (typeof MediaStream !== 'undefined' && streamSrc instanceof MediaStream) {
        pexipConference.current.srcObject = null;
      } else {
        pexipConference.current.src = null;
      }
    }
  }, [streamSrc, stateCloseConference]);

  function closeConference() {
    setStateCloseConference(true)
  }

  return (
    <div>
      {matches ? (
        <div className={ZoomCss.presentWrapperMobileLeft}>

          {!stateCloseConference &&
            <video className={ZoomCss.camera} autoPlay='autoplay' muted playsInline ref={pexipConference}></video>
          }

          {matches &&
            <div>
              {!stateCloseConference &&
                <div className={ZoomCss.left}>
                  <Tooltip title="ซ่อน">
                    <ExpandButtonMobile>
                      <ThemeProvider theme={theme}>
                        <ExpandMoreIcon color="white" sx={{ width: '35%' }} onClick={() => closeConference()} />
                      </ThemeProvider>
                    </ExpandButtonMobile>
                  </Tooltip>
                </div>
              }
            </div>
          }

        </div>
      ) : (
        <div className={ZoomCss.presentWrapperleft}>

          {!stateCloseConference &&
            <video className={ZoomCss.camera} autoPlay='autoplay' muted playsInline ref={pexipConference}></video>
          }

          {!matches &&
            <div>
              {!stateCloseConference &&
                <div className={ZoomCss.left}>
                  <Tooltip title="ซ่อน">
                    <ExpandButton>
                      <ThemeProvider theme={theme}>
                        <ExpandMoreIcon color="white" sx={{ width: '50%' }} onClick={() => closeConference()} />
                      </ThemeProvider>
                    </ExpandButton>
                  </Tooltip>
                </div>
              }
            </div>
          }

        </div>
      )}
    </div>
  );
}

export default ConferenceWhenShareScreen