import React, { useRef, useEffect, useState } from 'react';
import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

//CSS
import './joinCall.scss';
import DialogCSS from '../Call/CSS/Dialog.module.scss';

//Component
import ToolFunction from '../Call/Tool/toolFunction';
import ToolSettings from '../Call/Tool/toolSettings';
import ToolControl from '../Call/Tool/toolControl';
import CameraUser from '../Call/Component/cameraUser';
import ToolOpenCamera from '../Call/Tool/toolOpenCamera';
import DraWer from '../Call/Component/draWer';
import LoadingView from '../Call/Loading/loadingView';
import ImagesPresentation from '../Call/Component/imagesPresentation';

//Library
import { styled, useTheme } from '@mui/material/styles';
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  useMediaQuery
} from '@mui/material';

//Icon
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const drawerWidth = 330;

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    overflow: `hidde`,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      overflow: `hidde`,
    }),
  }),
);

function Call(props) {
  const { navigate, pexRTC, dialURI, participantName, pinGuest, pexipCamera, setCheckRole, openDialog, checkRole, authen_token, fileImages, statePresentationFile,
    setOpenDialog, openMessages, selectAudio, setSelectAudio, selectVideo, setSelectVideo, micMute, vidMute, bandwidth, typePexRTC, setUuid,
    indexOfPage, setIndexOfPage, room_idGuest, authen_tokenGuest, setRoom_id, setAuthen_token, setRefresh_token } = props
  const pexipVideoRef = useRef(null);
  const pexipSoundRef = useRef(null);
  const [streamSrc, setStreamSrc] = useState(null);
  const [streamCamera, setStreamCamera] = useState(null);
  const { id_dialURI } = useParams();
  const { id_guestPin } = useParams();
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  let i = 0

  // Presentation
  const [statePresentation, setStatePresentation] = useState(false);
  const [statePresentationOutputFIle, setStatePresentationOutputFIle] = useState(false);
  const [streamPresentation, setStreamPresentation] = useState(null);
  const [stateEndPresentation, setStateEndPresentation] = useState(null);
  const [urlPresentation, setUrlPresentation] = useState(null);

  // Setup Device
  const [selectTab, setSelectTab] = React.useState('AUDIO')
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const handleChangeVideo = (event) => {
    setSelectVideo(event.target.value);
  };
  const handleChangeAudio = (event) => {
    setSelectAudio(event.target.value);
  };
  // let constraints = {
  //   video: {
  //     width: { ideal: 1920, max: 1920 },
  //     height: { ideal: 1920, max: 1080 },
  //     deviceId: {
  //       exact: pexRTC.video_source = selectVideo
  //     }
  //   },
  //   audio: {
  //     deviceId: {
  //       exact: pexRTC.audio_source = selectAudio
  //     }
  //   }
  // }

  function setDeviceTest() {
    pexRTC.video_source = selectVideo
    pexRTC.audio_source = selectAudio
  }

  useEffect(() => {
    // Setup Devices
    setDeviceTest()

    // Setup Pexip
    pexRTC.onSetup = callSetup;
    pexRTC.onConnect = callConnected;
    pexRTC.onError = callError;
    pexRTC.onDisconnect = callDisconnected;

    // Presentation
    pexRTC.onPresentationConnected = callPresentationConnected;
    pexRTC.onPresentationDisconnected = callPresentationDisconnected;
    pexRTC.onPresentation = callSharedScreen;

    // Make the actual call with the PexRTC Library
    if (typePexRTC === '') {
      pexRTC.makeCall(
        process.env.REACT_APP_NODE_PEX_RTC,
        dialURI,
        participantName,
        bandwidth
      );
    }
    if (typePexRTC !== '') {
      pexRTC.makeCall(
        process.env.REACT_APP_NODE_PEX_RTC,
        dialURI,
        participantName,
        bandwidth,
        typePexRTC
      );
    }

    return () => {
      pexRTC.disconnect();
    };
  }, []);

  // Get the device
  useEffect(() => {
    getDevice();
  }, [navigator.mediaDevices.enumerateDevices()])

  // Get the device
  async function getDevice() {
    let devices = await navigator.mediaDevices.enumerateDevices();
    let video_devices = devices.filter((d) => d.kind === 'videoinput');
    let audio_devices = devices.filter((d) => d.kind === 'audioinput');
    setVideoDevices(video_devices);
    setAudioDevices(audio_devices);
  }

  // When User reload stream will end session
  // useEffect(() => {
  //   window.beforeunload = function (event) {
  //     return axios.delete(process.env.REACT_APP_HOST_ONECHAT + '/backend/api/v1/member/leave',
  //       { headers: { Authorization: `Bearer ${authen_token}` } }
  //     );
  //   };
  // }, [])

  // When User close stream will end session
  // useEffect(() => {
  //   const handleTabClose = (event) => {
  //     event.preventDefault();
  //     return axios.delete(process.env.REACT_APP_HOST_ONECHAT + '/backend/api/v1/member/leave',
  //       { headers: { Authorization: `Bearer ${authen_token}` } }
  //     );
  //   };
  //   window.addEventListener("beforeunload", handleTabClose);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleTabClose);
  //   };
  // }, []);

  // When User reload stream will end session
  useEffect(() => {
    window.beforeunload = function (event) {
      return pexRTC.disconnect();
    };
  }, [])

  // When User close stream will end session
  useEffect(() => {
    const handleTabClose = (event) => {
      event.preventDefault();
      return pexRTC.disconnect();
    };
    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  // When the stream source is updated
  useEffect(() => {
    if (statePresentation && pexipVideoRef.current) {
      pexipVideoRef.current.srcObject = streamPresentation;
      pexipSoundRef.current.srcObject = streamSrc;
    } else if (pexipVideoRef.current) {
      if (
        typeof MediaStream !== 'undefined' &&
        streamSrc instanceof MediaStream
      ) {
        pexipVideoRef.current.srcObject = streamSrc;
        // pexipSoundRef.current.srcObject = streamSrc;
        setInterval(function () { setLoading(false) }, 3000);
      } else {
        pexipVideoRef.current.src = streamSrc;
        // pexipSoundRef.current.src = streamSrc;
        setInterval(function () { setLoading(false) }, 3000);
      }
    }
  }, [statePresentation, streamSrc]);

  // CameraUser
  useEffect(() => {
    if (pexipCamera.current) {
      if (typeof MediaStream !== 'undefined' && streamCamera instanceof MediaStream) {
        pexipCamera.current.srcObject = streamCamera;
      } else {
        pexipCamera.current.src = streamCamera;
      }
    }
  }, [streamCamera]);


  // Setup Device
  // function callSetupDeive() {
  //   getMediaDevices(constraints)
  // }

  // This method is called when the call is setting up
  function callSetup(stream, pinStatus) {
    pexRTC.connect(pinGuest);
    setStreamCamera(stream)
    pexRTC.muteAudio(micMute)
    pexRTC.muteVideo(vidMute)
  }

  // Get mediaDevices
  // async function getMediaDevices(constraints) {
  //   await navigator.mediaDevices.getUserMedia(constraints);
  // }

  // When the call is connected
  function callConnected(stream) {
    setUuid(pexRTC.uuid)
    setCheckRole('GUEST')
    setStreamSrc(stream);
    if (pexRTC.role === "HOST") {
      pexRTC.transformLayout({
        layout: 'ac',
        enable_extended_ac: true,
        enable_active_speaker_indication: true,
        enable_overlay_text: true,
      })
    }
  }

  // When the call is presentation start 
  function callPresentationConnected(stream) {
    setStreamPresentation(stream)
  }

  // get Presentation
  function callSharedScreen(setting, presenter, uuid, presenter_source) {
    if (setting && presenter_source === "video") {
      pexRTC.getPresentation()
      setStatePresentation(setting)
    } else if (setting && presenter_source === "static") {
      setStatePresentationOutputFIle(setting)
      pexRTC.onPresentationReload = callPresentationReload;
    } else {
      setStatePresentationOutputFIle(setting)
      setStatePresentation(setting)
    }
  }

  // get Presentation images
  function callPresentationReload(url) {
    setUrlPresentation(url)
    console.log('url', url)
  }

  // check presentation has stop
  function callPresentationDisconnected(reason) {
    if (reason.status === 'stop') {
      setStatePresentation(false)
    }
    else setStateEndPresentation(reason)
  }

  // When the call is error
  function callError(reason) {
    Swal.fire({
      title: reason,
      text: "",
      icon: "error",
      showCancelButton: false,
      confirmButtonText: "OK",
      allowOutsideClick: false,
    }).then(() => {
      leaveOneChat()
    });
  }

  // When the call is disconnected
  function callDisconnected(reason) {
    leaveOneChat()
  }

  //joinOneChat
  // useEffect(() => {
  //   if (pexRTC.uuid !== null) {
  //     joinConChat()
  //   }
  // }, [pexRTC.uuid])

  // async function joinConChat() {
  //   await axios.post(process.env.REACT_APP_HOST_ONECHAT + '/backend/api/v1/member/join',
  //     {
  //       room_id: room_idGuest,
  //       user_id: pexRTC.uuid,
  //       user_name: participantName,
  //       user_profile: 'https://www.shareicon.net/data/512x512/2016/05/24/770117_people_512x512.png',
  //       user_role: "member"
  //     }, {
  //     headers: { Authorization: `Bearer ${authen_tokenGuest}` }
  //   })
  //     .then((result) => {
  //       const data = result.data.data
  //       console.log("data", data)
  //       setRoom_id(data.room_id)
  //       setAuthen_token(data.access_token)
  //       setRefresh_token(data.refresh_token)
  //     })
  //     .catch((err) => {
  //       console.log('error', err)
  //     })
  // }

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

  // Handle close dialogDevices
  function handleClose() {
    setOpenDialog(false);
  }

  // Select Tap Audio or Video on dialogDevices
  function toggleTab(value) {
    setSelectTab(value)
  }

  // Save Change Devices
  function saveChanges() {
    pexRTC.renegotiate(setDeviceTest())
    handleClose()
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* loading View */}
      {loading &&
        <LoadingView />
      }

      <DraWer {...props} />
      <Main open={openMessages}>

        {/* Presentation File */}
        {(statePresentationFile || statePresentationOutputFIle) &&
          <ImagesPresentation pexRTC={pexRTC} dialURI={dialURI} statePresentationOutputFIle={statePresentationOutputFIle} urlPresentation={urlPresentation}
            statePresentationFile={statePresentationFile} indexOfPage={indexOfPage} fileImages={fileImages} setIndexOfPage={setIndexOfPage} />
        }

        <div className='callContainer'>
          <video className='callVideoContainer' ref={pexipVideoRef} autoPlay='autoplay' playsInline id="conference"></video>
          {statePresentation &&
            <audio ref={pexipSoundRef} autoPlay='autoplay' id="soundConference"></audio>
          }

          {/* Tool Fucntion */}
          <ToolFunction {...props} />

          {/* Tool Settings */}
          <ToolSettings {...props} />

          {/* Tool Control */}
          <ToolControl {...props} />

          {/* Camera User */}
          <CameraUser {...props} />

          {/* Tool OpenCamera */}
          <ToolOpenCamera {...props} />

          {/* DialogSetting */}
          <div>
            <BootstrapDialog
              onClose={() => handleClose()}
              fullScreen={fullScreen}
              aria-labelledby="customized-dialog-title"
              open={openDialog}
            >
              <BootstrapDialogTitle id="customized-dialog-title" onClose={() => handleClose()}>
                การตั้งค่า
              </BootstrapDialogTitle>
              <DialogContent dividers>
                <Box sx={{ mt: 1, minWidth: 500, maxWidth: 500 }}>
                  {/* <Divider sx={{ position: 'absolute', justifySelf: 'center', height: '100%', m: 1 }} orientation="vertical" />
                asd */}
                  <div className={DialogCSS.content}>
                    <div className={DialogCSS.left}>
                      {selectTab === "AUDIO" ? (
                        <Box
                          sx={{ pr: 0, mr: 5, background: "#E6E6E6", borderRadius: 2 }}
                          className={`${DialogCSS.leftAudioTab} ${selectTab === "AUDIO" && DialogCSS.tabActive
                            }`}
                          onClick={() => {
                            toggleTab("AUDIO");
                          }}
                        >
                          Audio
                        </Box>
                      ) : (
                        <Box
                          sx={{ pr: 3 }}
                          className={`${DialogCSS.leftAudioTab} ${selectTab === "AUDIO" && DialogCSS.tabActive
                            }`}
                          onClick={() => {
                            toggleTab("AUDIO");
                          }}
                        >
                          Audio
                        </Box>
                      )}
                      {selectTab === "VIDEO" ? (
                        <Box
                          sx={{ pr: 0, mr: 5, background: "#E6E6E6", borderRadius: 2 }}
                          className={`${DialogCSS.leftVideoTab} ${selectTab === "VIDEO" && DialogCSS.tabActive
                            }`}
                          onClick={() => {
                            toggleTab("VIDEO");
                          }}
                        >
                          Video
                        </Box>
                      ) : (
                        <Box
                          sx={{ pr: 3 }}
                          className={`${DialogCSS.leftVideoTab} ${selectTab === "VIDEO" && DialogCSS.tabActive
                            }`}
                          onClick={() => {
                            toggleTab("VIDEO");
                          }}
                        >
                          Video
                        </Box>
                      )}
                    </div>
                    <Divider sx={{ height: 'auto', ml: '25px' }} orientation="vertical" />
                    <div className={`${DialogCSS.right} `}>
                      {selectTab === "AUDIO" && (
                        <div className={DialogCSS.rightAudio}>
                          <FormControl sx={{ mb: 2, minWidth: 120 }}>
                            <InputLabel id="demo-select-small">Audio</InputLabel>
                            <Select
                              labelId="demo-select-small"
                              id="demo-select-small"
                              value={selectAudio}
                              label="Audio"
                              onChange={handleChangeAudio}
                            >
                              {audioDevices.length === 0 ? (
                                <MenuItem value='loading'>Loading...</MenuItem>
                              ) : (
                                audioDevices.map((device, i) => {
                                  return <MenuItem key={i} value={device.deviceId}>{device.label}</MenuItem>;
                                })
                              )}
                            </Select>
                          </FormControl>
                        </div>
                      )}
                      {selectTab === "VIDEO" && (
                        <div className={DialogCSS.rightVideo}>
                          <FormControl sx={{ mb: 2, minWidth: 120 }}>
                            <InputLabel id="demo-select-small">Video</InputLabel>
                            <Select
                              labelId="demo-select-small"
                              id="demo-select-small"
                              value={selectVideo}
                              label="Video"
                              onChange={handleChangeVideo}
                            >
                              {videoDevices.length === 0 ? (
                                <MenuItem value='loading'>Loading...</MenuItem>
                              ) : (
                                videoDevices.map((device, i) => {
                                  return <MenuItem key={i} value={device.deviceId}>{device.label}</MenuItem>;
                                })
                              )}
                            </Select>
                          </FormControl>
                        </div>
                      )}
                    </div>
                  </div>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={() => saveChanges()}>
                  บันทึก
                </Button>
              </DialogActions>
            </BootstrapDialog>
          </div>

        </div>
      </Main>
    </Box>
  );
}

export default Call;