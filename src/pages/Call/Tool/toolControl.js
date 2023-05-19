import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";

//Component
import DialogEndMeeting from "../Dialog/dialogEndMeeting";

//CSS
import ZoomCss from "../CSS/zoom.module.scss";
import DialogCSS from '../CSS/Dialog.module.scss';

//Library
import { IconButton, Tooltip, Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

//Icon
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";

var CryptoJS = require("crypto-js");

const theme = createTheme({
  palette: {
    white: {
      // Purple and green play nicely together.
      main: "#FFFFFF",
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#88888887",
    },
  },
});

const CameraButton = styled(IconButton)({
  boxShadow: "none",
  textTransform: "none",
  border: "1px solid",
  fontSize: 16,
  lineHeight: 1.5,
  backgroundColor: "#484848",
});

const BootstrapButton = styled(IconButton)({
  boxShadow: "none",
  textTransform: "none",
  border: "1px solid",
  fontSize: 16,
  lineHeight: 1.5,
  backgroundColor: "#5353FFD6",
});

const DisconnectButton = styled(IconButton)({
  boxShadow: "none",
  textTransform: "none",
  border: "1px solid",
  fontSize: 16,
  lineHeight: 1.5,
  backgroundColor: "#FF5370D6",
});

// var windowReference = window.open();

function ToolControl(props) {
  const {
    pexRTC,
    dialURI,
    micMute,
    setMicMute,
    vidMute,
    setVidMute,
    setStateCloseCamera,
    authen_token,
    typePexRTC,
    checkRole,
    meetID,
    room_id,
    setStateMic,
    navigate,
    blockDevice
  } = props;
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const [muteByHost, setMuteByHost] = useState(false);
  const [openDialogEndMeeting, setOpenDialogEndMeeting] = useState(false);

  useEffect(() => {
    if (blockDevice) {
      setMicMute(true)
      setVidMute(true)
    }
  }, []);

  // Toggle the microphone mute
  function toggleMicMute() {
    if (muteByHost === true) {
      Swal.fire({
        title: "คุณถูกบังคับปิดไมค์โดย HOST",
        text: "",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    } else {
      setMicMute(!micMute);
      pexRTC.muteAudio(!micMute);
      let status = 'On'
      if (!micMute) {
        status = "Off"
      } else {
        status = "On"
      }
      updateMic(status)
    }
    console.log(pexRTC.uuid);
  }

  //get allmem status mic
  async function getAllMemMic() {
    try {
      const response = await axios({
        method: "post",
        url: process.env.REACT_APP_API + '/api/v1/miccheck/getalldata',
        data: {
          meeting_id: room_id,
        },
      });
      if (response.data.message === "Get data success.") {
        const data = JSON.parse(decodeJS(response.data.data))
        setStateMic(data.member)
      }
    } catch (error) {
      console.log(error)
    }
  }

  function decodeJS(data) {
    try {
      var bytes = CryptoJS.AES.decrypt(
        data,
        process.env.REACT_APP_SECRET_KEY
      )
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
      return decryptedData
    } catch (error) {
      console.log('>>>>>>>>', error)
      return error
    }
  }

  //update mic in DB
  async function updateMic(mic) {
    try {
      const response = await axios({
        method: "put",
        url: process.env.REACT_APP_API + '/api/v1/miccheck/updatemem',
        data: {
          meeting_id: room_id,
          uid: pexRTC.uuid,
          status: mic
        },
      });
      if (response.data.result === "Success") {
        getAllMemMic()
        pexRTC.sendChatMessage('4|getAllMemMic')
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Open the video mute
  function openleVidMute() {
    setVidMute(!vidMute);
    pexRTC.muteVideo(!vidMute);
    setStateCloseCamera(false);
  }

  // Close the video mute
  function closeleVidMute() {
    setVidMute(!vidMute);
    pexRTC.muteVideo(!vidMute);
    setStateCloseCamera(true);
  }

  // When the call is disconnected
  function callDisconnected() {
    if (checkRole === "HOST") {
      setOpenDialogEndMeeting(true);
    } else {
      Swal.fire({
        title: "ต้องการออกจากห้อง ?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          pexRTC.disconnect();
          // leaveMemMic()
          leaveOneChat();
        }
      });
    }
  }

  //leave mem status mic
  async function leaveMemMic() {
    try {
      const response = await axios({
        method: "delete",
        url: process.env.REACT_APP_API + '/api/v1/miccheck/deletemem',
        data: {
          meeting_id: room_id,
          uid: pexRTC.uuid,
        },
      });
      if (response.data.message === "Delete data success.") {
        console.log(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  function leaveOneChat() {
    axios
      .delete(
        process.env.REACT_APP_HOST_ONECHAT + "/backend/api/v1/member/leave",
        { headers: { Authorization: `Bearer ${authen_token}` } }
      )
      .then((result) => {
        // window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
        navigate('/webrtcapp/endmeet')
        if (typePexRTC === '' && window.localStream !== undefined) {
          window.localStream.getVideoTracks()[0].stop();
        }
      })
      .catch((err) => {
        // window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
        navigate('/webrtcapp/endmeet')
        if (typePexRTC === '' && window.localStream !== undefined) {
          window.localStream.getVideoTracks()[0].stop();
        }
      });
  }

  function deviceGotBlock() {
    Swal.fire({
      title: "คุณได้บล็อกการเข้าถึงกล้องและไมโครโฟน กรุณาตั้งค่ายอมรับการเข้าถึงกล้องและไมโครโฟนในส่วนของการตั้งค่าเบราเซอร์ของคุณก่อนเข้าประชุม",
      text: "",
      icon: "error",
      showCancelButton: false,
      confirmButtonText: "OK",
      allowOutsideClick: false,
    });
  }


  return (
    <div>
      {matches ? (
        // For Mobile
        <Box
          sx={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ position: "absolute", bottom: 10 }}>
            <div className={ZoomCss.toolsNewsWrapper}>
              {micMute &&
                <div>
                  {/* <BootstrapButton color="default" sx={{ mx: 1 }} aria-label="muteMucrophone" onClick={() => toggleMicMute()}> */}
                  <DisconnectButton
                    color="error"
                    sx={{ mx: 1 }}
                    aria-label="muteMucrophone"
                    onClick={() => toggleMicMute()}
                  >
                    <ThemeProvider theme={theme}>
                      <MicOffIcon color="white" />
                    </ThemeProvider>
                  </DisconnectButton>
                  {/* </BootstrapButton> */}
                </div>
              }
              {!micMute &&
                <BootstrapButton
                  color="default"
                  sx={{ mx: 1 }}
                  aria-label="unMuteMucrophone"
                  onClick={() => toggleMicMute()}
                >
                  <ThemeProvider theme={theme}>
                    <MicIcon color="white" />
                  </ThemeProvider>
                </BootstrapButton>
              }
              <ThemeProvider theme={theme}>
                <DisconnectButton
                  color="error"
                  sx={{ mx: 1 }}
                  aria-label="Disconnected"
                  onClick={() => callDisconnected()}
                >
                  <CallEndIcon color="white" />
                </DisconnectButton>
              </ThemeProvider>
              {typePexRTC !== "audioonly" && (
                <div>
                  {vidMute &&
                    <div>
                      <ThemeProvider theme={theme}>
                        {/* <CameraButton color="secondary" sx={{ mx: 1 }} aria-label="muteCamera" onClick={() => openleVidMute()}> */}
                        <DisconnectButton
                          color="error"
                          sx={{ mx: 1 }}
                          aria-label="muteCamera"
                          onClick={() => openleVidMute()}
                        >
                          <VideocamOffIcon color="white" />
                        </DisconnectButton>
                        {/* </CameraButton> */}
                      </ThemeProvider>
                    </div>
                  }
                  {!vidMute &&
                    <div>
                      <ThemeProvider theme={theme}>
                        {/* <CameraButton color="secondary" sx={{ mx: 1 }} aria-label="muteCamera" onClick={() => closeleVidMute()}> */}
                        <BootstrapButton
                          color="default"
                          sx={{ mx: 1 }}
                          aria-label="muteCamera"
                          onClick={() => closeleVidMute()}
                        >
                          <VideocamIcon color="white" />
                        </BootstrapButton>
                        {/* </CameraButton> */}
                      </ThemeProvider>
                    </div>
                  }
                </div>
              )}
            </div>
          </Box>
        </Box>
      ) : (
        // For Desktop
        <Box
          sx={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ position: "absolute", bottom: 45 }}>
            <div className={ZoomCss.toolsNewsWrapper}>
              {micMute && !blockDevice &&
                <div>
                  <Tooltip title="เปิดไมโครโฟน">
                    {/* <BootstrapButton color="default" sx={{ mx: 1 }} aria-label="muteMucrophone" onClick={() => toggleMicMute()}> */}
                    <DisconnectButton
                      className={DialogCSS.cursor}
                      color="error"
                      sx={{ mx: 1 }}
                      aria-label="muteMucrophone"
                      onClick={() => toggleMicMute()}
                    >
                      <ThemeProvider theme={theme}>
                        <MicOffIcon color="white" />
                      </ThemeProvider>
                    </DisconnectButton>
                    {/* </BootstrapButton> */}
                  </Tooltip>
                </div>
              }
              {!micMute && !blockDevice &&
                <div>
                  <Tooltip title="ปิดไมโครโฟน">
                    <BootstrapButton
                      className={DialogCSS.cursor}
                      color="default"
                      sx={{ mx: 1 }}
                      aria-label="unMuteMucrophone"
                      onClick={() => toggleMicMute()}
                    >
                      <ThemeProvider theme={theme}>
                        <MicIcon color="white" />
                      </ThemeProvider>
                    </BootstrapButton>
                  </Tooltip>
                </div>
              }
              {/* Device got block */}
              {blockDevice &&
                <div>
                  <Tooltip title="You blocked access to your camera To grant access please go to the privacy settings of your browser">
                    <DisconnectButton
                      className={DialogCSS.cursor}
                      color="error"
                      sx={{ mx: 1 }}
                      aria-label="muteMucrophone"
                      onClick={() => deviceGotBlock()}
                    >
                      <ThemeProvider theme={theme}>
                        <MicOffIcon color="white" />
                      </ThemeProvider>
                    </DisconnectButton>
                  </Tooltip>
                </div>
              }
              <div>
                <ThemeProvider theme={theme}>
                  <Tooltip title="ออกจากการโทร">
                    <DisconnectButton
                      className={DialogCSS.cursor}
                      color="error"
                      sx={{ mx: 1 }}
                      aria-label="muteCamera"
                      onClick={() => callDisconnected()}
                    >
                      <CallEndIcon color="white" />
                    </DisconnectButton>
                  </Tooltip>
                </ThemeProvider>
              </div>
              {typePexRTC !== "audioonly" && (
                <div>
                  {vidMute && !blockDevice &&
                    <div>
                      <ThemeProvider theme={theme}>
                        <Tooltip title="เปิดกล้อง">
                          {/* <CameraButton color="secondary" sx={{ mx: 1 }} aria-label="muteCamera" onClick={() => openleVidMute()}> */}
                          <DisconnectButton
                            className={DialogCSS.cursor}
                            color="error"
                            sx={{ mx: 1 }}
                            aria-label="muteCamera"
                            onClick={() => openleVidMute()}
                          >
                            <VideocamOffIcon color="white" />
                          </DisconnectButton>
                          {/* </CameraButton> */}
                        </Tooltip>
                      </ThemeProvider>
                    </div>
                  }
                  {!vidMute && !blockDevice &&
                    <div>
                      <ThemeProvider theme={theme}>
                        <Tooltip title="ปิดกล้อง">
                          {/* <CameraButton color="secondary" sx={{ mx: 1 }} aria-label="muteCamera" onClick={() => closeleVidMute()}> */}
                          <BootstrapButton
                            className={DialogCSS.cursor}
                            color="default"
                            sx={{ mx: 1 }}
                            aria-label="muteCamera"
                            onClick={() => closeleVidMute()}
                          >
                            <VideocamIcon color="white" />
                          </BootstrapButton>
                          {/* </CameraButton> */}
                        </Tooltip>
                      </ThemeProvider>
                    </div>
                  }
                  {blockDevice &&
                    <div>
                      <ThemeProvider theme={theme}>
                        <Tooltip title="You blocked access to your camera To grant access please go to the privacy settings of your browser">
                          <DisconnectButton
                            className={DialogCSS.cursor}
                            color="error"
                            sx={{ mx: 1 }}
                            aria-label="muteCamera"
                            onClick={() => deviceGotBlock()}
                          >
                            <VideocamOffIcon color="white" />
                          </DisconnectButton>
                        </Tooltip>
                      </ThemeProvider>
                    </div>
                  }
                </div>
              )}
            </div>
          </Box>
        </Box>
      )}

      <DialogEndMeeting
        pexRTC={pexRTC}
        room_id={room_id}
        dialURI={dialURI}
        meetID={meetID}
        openDialogEndMeeting={openDialogEndMeeting}
        setOpenDialogEndMeeting={setOpenDialogEndMeeting}
        typePexRTC={typePexRTC}
      />
    </div>
  );
}

export default ToolControl;
