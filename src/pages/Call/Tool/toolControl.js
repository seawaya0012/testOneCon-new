import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";

//CSS
import ZoomCss from "../CSS/zoom.module.scss"

//Library
import {
  IconButton,
  Tooltip,
  Box,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';

//Icon
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff'
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';

const theme = createTheme({
  palette: {
    white: {
      // Purple and green play nicely together.
      main: '#FFFFFF',
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#88888887',
    },
  },
});

const CameraButton = styled(IconButton)({
  boxShadow: "none",
  textTransform: "none",
  border: '1px solid',
  fontSize: 16,
  lineHeight: 1.5,
  backgroundColor: "#484848",
});

const BootstrapButton = styled(IconButton)({
  boxShadow: "none",
  textTransform: "none",
  border: '1px solid',
  fontSize: 16,
  lineHeight: 1.5,
  backgroundColor: "#5353FFD6",
});

const DisconnectButton = styled(IconButton)({
  boxShadow: "none",
  textTransform: "none",
  border: '1px solid',
  fontSize: 16,
  lineHeight: 1.5,
  backgroundColor: "#FF5370D6",
});

function ToolControl(props) {

  const { pexRTC, micMute, setMicMute, vidMute, setVidMute, setStateCloseCamera, authen_token, typePexRTC, checkRole, uuidRoom } = props;
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const [muteByHost, setMuteByHost] = useState(false)

  useEffect(() => {
    if (typePexRTC === 'recvonly') {
      setVidMute(true);
      pexRTC.muteVideo(true)
      setStateCloseCamera(true)
    }
    pexRTC.onParticipantUpdate = participantUpdate
  }, [])

  function participantUpdate(participant) {
    console.log(participant)
    if(pexRTC.uuid === participant.uuid) {
      setVidMute(pexRTC.muteVideo(participant.is_video_muted));
      if(participant.is_muted === 'YES'){
        setMicMute(pexRTC.muteAudio(true));
        setMuteByHost(true)
      } else { 
        setMuteByHost(false)
      }
    }
  }

  // Toggle the microphone mute
  function toggleMicMute() {
    if(muteByHost === true) {
      Swal.fire({
        title: 'คุณถูกบังคับปิดไมค์โดย HOST',
        text: "",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    } else {
      setMicMute(!micMute);
      pexRTC.muteAudio(!micMute)
    }
  }

  // Open the video mute
  function openleVidMute() {
    setVidMute(!vidMute);
    pexRTC.muteVideo(!vidMute)
    setStateCloseCamera(false)
  }

  // Close the video mute
  function closeleVidMute() {
    setVidMute(!vidMute);
    pexRTC.muteVideo(!vidMute)
    setStateCloseCamera(true)
  }

  // When the call is disconnected
  function callDisconnected() {
    pexRTC.disconnect();
    if (checkRole === 'HOST') {
      window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
    } else {
      leaveOneChat()
    }
  }

  function leaveOneChat() {
    axios.delete(process.env.REACT_APP_HOST_ONECHAT + '/backend/api/v1/member/leave',
      { headers: { Authorization: `Bearer ${authen_token}` } }
    )
      .then((result) => {
        console.log('res', result)
        window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
      })
      .catch((err) => {
        console.log('error', err)
        window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
      })
  }

  return (
    <div>
      {matches ? (
        // For Mobile
        <Box sx={{ display: 'flex', height: '100%', width: '100%', alignSelf: 'center', justifyContent: 'center' }}>
          <Box sx={{ position: 'absolute', bottom: 10 }}>
            <div className={ZoomCss.toolsNewsWrapper}>
              {micMute ? (
                <div>
                  <Tooltip title="เปิดไมโครโฟน">
                    <BootstrapButton color="default" sx={{ mx: 1 }} aria-label="muteMucrophone" onClick={() => toggleMicMute()}>
                      <ThemeProvider theme={theme}>
                        <MicOffIcon color="white" />
                      </ThemeProvider>
                    </BootstrapButton>
                  </Tooltip>
                </div>
              ) : (
                <div>
                  <Tooltip title="ปิดไมโครโฟน">
                    <BootstrapButton color="default" sx={{ mx: 1 }} aria-label="unMuteMucrophone" onClick={() => toggleMicMute()}>
                      <ThemeProvider theme={theme}>
                        <MicIcon color="white" />
                      </ThemeProvider>
                    </BootstrapButton>
                  </Tooltip>
                </div>
              )}
              <div>
                <ThemeProvider theme={theme}>
                  <Tooltip title="ออกจากการโทร">
                    <DisconnectButton color="error" sx={{ mx: 1 }} aria-label="muteCamera" onClick={() => callDisconnected()}>
                      <CallEndIcon color="white" />
                    </DisconnectButton>
                  </Tooltip>
                </ThemeProvider>
              </div>
              {typePexRTC !== 'recvonly' &&
                <div>
                  {vidMute ? (
                    <div>
                      <ThemeProvider theme={theme}>
                        <Tooltip title="เปิดกล้อง">
                          <CameraButton color="secondary" sx={{ mx: 1 }} aria-label="muteCamera" onClick={() => openleVidMute()}>
                            <VideocamOffIcon color="white" />
                          </CameraButton>
                        </Tooltip>
                      </ThemeProvider>
                    </div>
                  ) : (
                    <div>
                      <ThemeProvider theme={theme}>
                        <Tooltip title="ปิดกล้อง">
                          <CameraButton color="secondary" sx={{ mx: 1 }} aria-label="muteCamera" onClick={() => closeleVidMute()}>
                            <VideocamIcon color="white" />
                          </CameraButton>
                        </Tooltip>
                      </ThemeProvider>
                    </div>
                  )}
                </div>}
            </div>
          </Box>
        </Box>
      ) : (
        // For Desktop
        <Box sx={{ display: 'flex', height: '100%', width: '100%', alignSelf: 'center', justifyContent: 'center' }}>
          <Box sx={{ position: 'absolute', bottom: 45 }}>
            <div className={ZoomCss.toolsNewsWrapper}>
              {micMute ? (
                <div>
                  <Tooltip title="เปิดไมโครโฟน">
                    <BootstrapButton color="default" sx={{ mx: 1 }} aria-label="muteMucrophone" onClick={() => toggleMicMute()}>
                      <ThemeProvider theme={theme}>
                        <MicOffIcon color="white" />
                      </ThemeProvider>
                    </BootstrapButton>
                  </Tooltip>
                </div>
              ) : (
                <div>
                  <Tooltip title="ปิดไมโครโฟน">
                    <BootstrapButton color="default" sx={{ mx: 1 }} aria-label="unMuteMucrophone" onClick={() => toggleMicMute()}>
                      <ThemeProvider theme={theme}>
                        <MicIcon color="white" />
                      </ThemeProvider>
                    </BootstrapButton>
                  </Tooltip>
                </div>
              )}
              <div>
                <ThemeProvider theme={theme}>
                  <Tooltip title="ออกจากการโทร">
                    <DisconnectButton color="error" sx={{ mx: 1 }} aria-label="muteCamera" onClick={() => callDisconnected()}>
                      <CallEndIcon color="white" />
                    </DisconnectButton>
                  </Tooltip>
                </ThemeProvider>
              </div>
              {typePexRTC !== 'recvonly' &&
                <div>
                  {vidMute ? (
                    <div>
                      <ThemeProvider theme={theme}>
                        <Tooltip title="เปิดกล้อง">
                          <CameraButton color="secondary" sx={{ mx: 1 }} aria-label="muteCamera" onClick={() => openleVidMute()}>
                            <VideocamOffIcon color="white" />
                          </CameraButton>
                        </Tooltip>
                      </ThemeProvider>
                    </div>
                  ) : (
                    <div>
                      <ThemeProvider theme={theme}>
                        <Tooltip title="ปิดกล้อง">
                          <CameraButton color="secondary" sx={{ mx: 1 }} aria-label="muteCamera" onClick={() => closeleVidMute()}>
                            <VideocamIcon color="white" />
                          </CameraButton>
                        </Tooltip>
                      </ThemeProvider>
                    </div>
                  )}
                </div>}
            </div>
          </Box>
        </Box>
      )}
    </div>
  );
}

export default ToolControl