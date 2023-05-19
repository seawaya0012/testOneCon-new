import React, { useRef, useEffect, useState } from 'react';

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

const NewButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  background: "#5353FF",
})

const NewButtonMobile = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px',
  height: '30px',
  background: "#5353FF",
})

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

const themeCustome = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 640,
      laptop: 1185,
      desktop: 1200,
    },
  },
});

function CameraUser(props) {

  const { pexRTC, pexipCamera, micMute, setMicMute, vidMute, stateCloseCamera, setStateCloseCamera } = props;
  const matches = useMediaQuery(theme.breakpoints.down('md'));


  // Toggle the microphone mute
  // function toggleMicMute() {
  //   setMicMute(!micMute);
  //   pexRTC.muteAudio(!micMute)
  // }

  function closeCamera() {
    setStateCloseCamera(true)
  }

  return (
    <div>
      {matches ? (
        <div className={ZoomCss.presentWrapperMobile}>

          {!vidMute && !stateCloseCamera ? (
            <video className={ZoomCss.camera} autoPlay='autoplay' muted playsInline ref={pexipCamera}></video>
          ) : (
            <video className={ZoomCss.noCamera} autoPlay='autoplay' muted playsInline ref={pexipCamera}></video>
          )}

          {/* {matches &&
            <div>
              {!stateCloseCamera && !vidMute &&
                <div className={ZoomCss.right}>
                  {micMute ? (
                    <NewButtonMobile>
                      <ThemeProvider theme={theme}>
                        <MicOffIcon color="white" sx={{ width: '35%' }} onClick={() => toggleMicMute()} />
                      </ThemeProvider>
                    </NewButtonMobile>
                  ) : (
                    <NewButtonMobile>
                      <ThemeProvider theme={theme}>
                        <MicIcon color="white" sx={{ width: '35%' }} onClick={() => toggleMicMute()} />
                      </ThemeProvider>
                    </NewButtonMobile>
                  )}
                </div>
              }
            </div>
          } */}
          {matches &&
            <div>
              {!stateCloseCamera && !vidMute &&
                <div className={ZoomCss.left}>
                  <Tooltip title="ซ่อนกล้อง">
                    <ExpandButtonMobile>
                      <ThemeProvider theme={theme}>
                        <ExpandMoreIcon color="white" sx={{ width: '35%' }} onClick={() => closeCamera()} />
                      </ThemeProvider>
                    </ExpandButtonMobile>
                  </Tooltip>
                </div>
              }
            </div>
          }
        </div>
      ) : (
        <div className={ZoomCss.presentWrapper}>

          {!vidMute && !stateCloseCamera ? (
            <video className={ZoomCss.camera} autoPlay='autoplay' muted playsInline ref={pexipCamera}></video>
          ) : (
            <video className={ZoomCss.noCamera} autoPlay='autoplay' muted playsInline ref={pexipCamera}></video>
          )}

          {!matches &&
            <div>
              {!stateCloseCamera && !vidMute &&
                <div className={ZoomCss.right}>
                  {micMute ? (
                    <NewButton>
                      <ThemeProvider theme={theme}>
                        <MicOffIcon color="white" sx={{ width: '50%' }} />
                        {/* <MicOffIcon color="white" sx={{ width: '50%' }} onClick={() => toggleMicMute()} /> */}
                      </ThemeProvider>
                    </NewButton>
                  ) : (
                    <NewButton>
                      <ThemeProvider theme={theme}>
                        <MicIcon color="white" sx={{ width: '50%' }} />
                        {/* <MicIcon color="white" sx={{ width: '50%' }} onClick={() => toggleMicMute()} /> */}
                      </ThemeProvider>
                    </NewButton>
                  )}
                </div>
              }
            </div>
          }

          {!matches &&
            <div>
              {!stateCloseCamera && !vidMute &&
                <div className={ZoomCss.left}>
                  <Tooltip title="ซ่อนกล้อง">
                    <ExpandButton>
                      <ThemeProvider theme={theme}>
                        <ExpandMoreIcon color="white" sx={{ width: '50%' }} onClick={() => closeCamera()} />
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

export default CameraUser