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

const NewButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
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

function CameraUser(props) {
  const {
    streamCamera,
    streamSrc,
    micMute,
    vidMute,
    stateCloseCamera,
    setStateCloseCamera,
    stateSwitchCam,
    setStateSwitchCam,
    loadingCamera
  } = props;
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const pexipCamera = useRef(null);

  // CameraUser
  useEffect(() => {
    if (!vidMute && !stateCloseCamera) {
      if (pexipCamera.current) {
        if (!stateSwitchCam) {
          if (typeof MediaStream !== 'undefined' && streamCamera instanceof MediaStream) {
            pexipCamera.current.srcObject = streamCamera;
          } else {
            pexipCamera.current.src = streamCamera;
          }
        } else {
          if (typeof MediaStream !== 'undefined' && streamSrc instanceof MediaStream) {
            pexipCamera.current.srcObject = streamSrc;
          } else {
            pexipCamera.current.src = streamSrc;
          }
        }
      }
    } else if (pexipCamera.current) {
      if (typeof MediaStream !== 'undefined' && streamCamera instanceof MediaStream) {
        pexipCamera.current.srcObject = null;
      } else {
        pexipCamera.current.src = null;
      }
    }
  }, [streamCamera, streamSrc, stateSwitchCam, stateCloseCamera, vidMute]);

  function closeCamera() {
    setStateCloseCamera(true)
  }

  function switchCamera() {
    setStateSwitchCam(!stateSwitchCam)
  }

  return (
    <div>
      {matches ? (
        <div className={ZoomCss.presentWrapperMobile}>
          {/* id="videoElement" style={{ transform: 'rotateY(180deg)'}} */}
          <video className={ZoomCss.camera} autoPlay='autoplay' muted playsInline ref={pexipCamera}></video>

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

          {/* id="videoElement" style={{ transform: 'rotateY(180deg)'}} */}
          <video className={loadingCamera && !stateCloseCamera && !vidMute ? ZoomCss.cameraBG : ZoomCss.camera} autoPlay='autoplay' muted playsInline ref={pexipCamera}></video>

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

          {!matches && loadingCamera &&
            <Box>
              {!stateCloseCamera && !vidMute &&
                <div className={ZoomCss.loadcenter}>
                  <LoadingCamera />
                </div>
              }
            </Box>
          }

          {!matches &&
            <Box
              sx={{
                opacity: '0%',
                transition: 'opacity 0.8s',
                '&:hover': {
                  opacity: '100%',
                  transition: 'opacity 0.8s',
                },
              }}
            >
              {!stateCloseCamera && !vidMute &&
                <div className={ZoomCss.center}>
                  <ThemeProvider theme={theme}>
                    <CameraswitchIcon color="white" sx={{ fontSize: 60 }} onClick={() => switchCamera()} />
                  </ThemeProvider>
                </div>
              }
            </Box>
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