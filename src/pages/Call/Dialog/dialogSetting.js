import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";

//Component
import TableVote from "../Component/tableVote"
import PrivateVote from "../Component/privateVote"
import MicVisualizer from "../Component/micVisualizer"
import VirsualBackground from '../Component/virsualBackground';
import YouTube from 'react-youtube';

//CSS
import DialogCSS from '../CSS/Dialog.module.scss';
import '../CSS/ButtonLoading.scss';
import '../CSS/Button.scss';
import ButtonCSS from '../CSS/zoom.module.scss';

//Library
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Box,
  useMediaQuery,
  FormControl,
  MenuItem,
  InputLabel,
  Tooltip,
  Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { pink } from '@mui/material/colors';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { createTheme, ThemeProvider } from '@mui/material/styles';

//Icon
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

const BOLD = createTheme({
  typography: {
    "fontFamily": `"Kanit", sans-serif`,
    "fontSize": 12,
    "fontWeightLight": 400,
    "fontWeightRegular": 600,
    "fontWeightMedium": 700
  }
});

const BootstrapDialog = styled(Dialog)({
},
  ({ theme }) => ({
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

export default function DialogSetting(prop) {
  const {
    pexRTC,
    checkRole,
    openDialog,
    setOpenDialog,
    selectVideo,
    setSelectVideo,
    selectAudio,
    setSelectAudio,
    accessToken,
    stateVote,
    setStateVote,
    indVote,
    setindVote,
    setVote,
    vote,
    typePexRTC,
    listParticipants,
    meetID,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    setVoteSecret,
    micMute,
    // audioRef,
    selectOutput,
    setSelectOutput,
    stateOutput,
    selectTab,
    setSelectTab,
    bandwidth,
    customVideo,
    setCustomVideo,
    backgroundSelect,
    setBackgroundSelect,
    detect
  } = prop
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Setup Device
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [outputDevice, setAutputDevice] = useState([]);
  const [stateTestMic, setStateTestMic] = useState(false);
  const [bandwidth_in, setBandwidth_in] = useState([512, 768, 1024, 1264, 1500, 2464, 6144]);
  const [bandwidth_incoming, setBandwidth_incoming] = useState(bandwidth);
  const [bandwidth_outcoming, setBandwidth_outcoming] = useState(bandwidth);

  const audioRef = useRef(null);

  //Output devices
  const handleChangeVideo = (event) => {
    setSelectVideo(event.target.value);
  };
  const handleChangeAudio = (event) => {
    setStateTestMic(false)
    setSelectAudio(event.target.value);
    getUserMedia(event.target.value)
  };
  const handleChangeOutput = (event) => {
    setSelectOutput(event.target.value);
    setOutput(event.target.value)
  };
  const handleChangeincoming = (event) => {
    setBandwidth_incoming(event.target.value);
    setBandwidth_outcoming(event.target.value);
    getUserMedia(selectAudio);
  };

  const handleClose = () => {
    setSelectVideo(pexRTC.video_source)
    setSelectAudio(pexRTC.audio_source)
    closeDialogSettings()
  };

  // Get the device
  useEffect(() => {
    getDevices();
    const onDeviceChange = () => getDevices();
    navigator.mediaDevices.ondevicechange = onDeviceChange;
    return () => {
      navigator.mediaDevices.ondevicechange = null;
    };
  }, []);

  // getUserMedia
  function getUserMedia(audio) {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          deviceId: {
            exact: audio
          }
        },
        video: false
      })
      .then(stream => {
        if (audioRef.current) {
          if (typeof MediaStream !== 'undefined' && stream instanceof MediaStream) {
            audioRef.current.srcObject = stream
          } else {
            audioRef.current.src = stream
          }
        }
        // audioRef.current.src = stream;
        setAudioStream(stream)
      })
  }

  // run useEffect when audio change form user
  // const isCalledRef = useRef(false);
  // useEffect(() => {
  //   if (!isCalledRef.current) {
  //     isCalledRef.current = true;
  //     audioHandleChange();
  //   } else {
  //     isCalledRef.current = false;
  //   }

  // }, [audioDevices, isCalledRef]);

  //call this function when audio change
  // function audioHandleChange() {
  //   pexRTC.renegotiate()
  // }

  // Get the device
  async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const video_devices = devices.filter(device => device.kind === 'videoinput');
    const audio_devices = devices.filter(device => device.kind === 'audioinput');
    const audioOutput = devices.filter(device => device.kind === "audiooutput");
    setVideoDevices(video_devices);
    setAudioDevices(audio_devices);
    setAutputDevice(audioOutput)
  }

  // Select Tap Audio or Video on dialogDevices
  function toggleTab(value) {
    setSelectTab(value)
  }

  //set Audio Output Devices
  async function setOutput(deviceID) {
    try {
      const audio = document.getElementById("output");
      await audio.setSinkId(deviceID);
      console.log(`Audio is being played on ${audio.sinkId}`);
    } catch (err) {
      console.log(err);
    }
  }

  async function startTest() {
    getUserMedia(selectAudio)
    setStateTestMic(true)
  }

  function stopTest() {
    setStateTestMic(false)
  }

  function saveChanges() {
    if (customVideo) {
      pexRTC.renegotiate(changeBakcground())
    } else {
      pexRTC.bandwidth_in = bandwidth_incoming
      pexRTC.bandwidth_out = bandwidth_outcoming
      pexRTC.video_source = selectVideo
      pexRTC.audio_source = selectAudio
      pexRTC.renegotiate()
    }
    closeDialogSettings()
  }

  function closeDialogSettings() {
    setOpenDialog(false);
    setSelectTab('AUDIO')
    stopTest()
  }

  // -----------------
  const [audioStream, setAudioStream] = useState(null);

  function changeBakcground() {
    const playbackElement = document.getElementById("playback");
    const processedStream = playbackElement.captureStream();
    processedStream.addTrack(audioStream.getAudioTracks()[0]);
    pexRTC.bandwidth_in = bandwidth_incoming
    pexRTC.bandwidth_out = bandwidth_outcoming
    pexRTC.user_media_stream = processedStream;
  }

  function sentObj() {

  }

  return (
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
          <Box sx={{ mt: 1, minWidth: 550, maxWidth: 700, maxHeight: 400 }}>
            <div className={DialogCSS.content}>
              <div className={DialogCSS.left}>
                {selectTab === "AUDIO" ? (
                  <Box
                    sx={{ pr: 2, mr: 5, background: "#E6E6E6", borderRadius: 2 }}
                    className={`${DialogCSS.leftAudioTab} ${selectTab === "AUDIO" && DialogCSS.tabActive
                      }`}
                    onClick={() => {
                      toggleTab("AUDIO");
                    }}
                  >
                    <div className={DialogCSS.cursor}>
                      Audio
                    </div>
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
                    <div className={DialogCSS.cursor}>
                      Audio
                    </div>
                  </Box>
                )}
                {selectTab === "VIDEO" ? (
                  <Box
                    sx={{ pr: 2, mr: 5, background: "#E6E6E6", borderRadius: 2 }}
                    className={`${DialogCSS.leftVideoTab} ${selectTab === "VIDEO" && DialogCSS.tabActive
                      }`}
                    onClick={() => {
                      toggleTab("VIDEO");
                    }}
                  >
                    <div className={DialogCSS.cursor}>
                      Video
                    </div>
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
                    <div className={DialogCSS.cursor}>
                      Video
                    </div>
                  </Box>
                )}
                {!detect && selectTab === "BACKBROUND" &&
                  <Box
                    sx={{ pr: 2, mr: 5, background: "#E6E6E6", borderRadius: 2 }}
                    className={`${DialogCSS.leftVideoTab} ${selectTab === "BACKBROUND" && DialogCSS.tabActive
                      }`}
                    onClick={() => {
                      toggleTab("BACKBROUND");
                      // backgroundEffect()
                      // setCustomVideo(false);
                    }}
                  >
                    <div className={DialogCSS.cursor}>
                      Background
                    </div>
                  </Box>
                }
                {!detect && selectTab !== "BACKBROUND" &&
                  <Box
                    sx={{ pr: 3 }}
                    className={`${DialogCSS.leftVideoTab} ${selectTab === "BACKBROUND" && DialogCSS.tabActive
                      }`}
                    onClick={() => {
                      toggleTab("BACKBROUND");
                      // backgroundEffect()
                      // setCustomVideo(true);
                    }}
                  >
                    <div className={DialogCSS.cursor}>
                      Background
                    </div>
                  </Box>
                }
                {selectTab === "VOTE" && checkRole === "HOST" &&
                  <Box
                    sx={{ pr: 2, mr: 5, background: "#E6E6E6", borderRadius: 2 }}
                    className={`${DialogCSS.leftVideoTab} ${selectTab === "VOTE" && DialogCSS.tabActive
                      }`}
                    onClick={() => {
                      toggleTab("VOTE");
                    }}
                  >
                    <div className={DialogCSS.cursor}>
                      Vote
                    </div>
                  </Box>
                }
                {selectTab !== "VOTE" && checkRole === "HOST" &&
                  <Box
                    sx={{ pr: 3 }}
                    className={`${DialogCSS.leftVideoTab} ${selectTab === "VOTE" && DialogCSS.tabActive
                      }`}
                    onClick={() => {
                      toggleTab("VOTE");
                    }}
                  >
                    <div className={DialogCSS.cursor}>
                      Vote
                    </div>
                  </Box>
                }
              </div>
              <Divider sx={{ height: 'auto', ml: '25px' }} orientation="vertical" />
              <div className={`${DialogCSS.right} `}>
                {selectTab === "AUDIO" && (
                  <div className={DialogCSS.rightAudio}>
                    <FormControl sx={{ mb: 2, minWidth: 120 }}>
                      <InputLabel id="Microphone">Microphone</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={selectAudio}
                        label="Microphone"
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
                    {stateOutput ? (
                      <div>
                        {/* เบราเซอร์หรืออุปกรณ์ที่คุณใช้ไม่รองรับตั้งค่า Output Device */}
                      </div>
                    ) : (
                      <FormControl sx={{ mb: 2, minWidth: 120 }}>
                        <InputLabel id="Speakers">Speakers</InputLabel>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={selectOutput}
                          label="Speakers"
                          onChange={handleChangeOutput}
                        >
                          {outputDevice.length === 0 ? (
                            <MenuItem value='loading'>Loading...</MenuItem>
                          ) : (
                            outputDevice.map((device, i) => {
                              return <MenuItem key={i} value={device.deviceId}>{device.label}</MenuItem>;
                            })
                          )}
                        </Select>
                      </FormControl>
                    )}
                    {!stateTestMic ? (
                      <Box>
                        <Button autoFocus variant="outlined" onClick={() => startTest()}>
                          ทดสอบไมค์
                        </Button>
                        <audio id="output" ref={audioRef} muted autoPlay='autoPlay' ></audio>
                      </Box>
                    ) : (
                      <Box>
                        <Button sx={{ mr: 1 }} autoFocus variant="outlined" color="error" onClick={() => stopTest()}>
                          หยุดทดสอบ
                        </Button>
                        <Tooltip title="Active">
                          <IconButton color="error" sx={{ mx: 0 }} aria-label="HOST">
                            <RadioButtonCheckedIcon size={20} className={ButtonCSS.blob} />
                          </IconButton>
                        </Tooltip>
                        <Box>
                          {selectOutput === 'default' ? (
                            <audio id="output" ref={audioRef} muted autoPlay='autoPlay' ></audio>
                          ) : (
                            <audio id="output" ref={audioRef} autoPlay='autoPlay' ></audio>
                          )}
                        </Box>
                        <Box>
                          <MicVisualizer audioStream={audioStream} />
                        </Box>
                      </Box>
                    )}
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
                    <FormControl sx={{ mb: 2, minWidth: 120 }}>
                      <InputLabel id="demo-select-small">Connection quality</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={bandwidth_incoming}
                        label="Connection quality"
                        onChange={handleChangeincoming}
                      >
                        {bandwidth_in.length === 0 ? (
                          <MenuItem value='loading'>Loading...</MenuItem>
                        ) : (
                          bandwidth_in.map((bandwidth, i) => {
                            return <MenuItem key={i} value={bandwidth}>{bandwidth}kbps</MenuItem>;
                          })
                        )}
                      </Select>
                    </FormControl>
                    {/* <YouTube
                      videoId={'bqigIHMComE'}                  // defaults -> ''
                      id={'bqigIHMComE'}                       // defaults -> ''
                      className={''}                // defaults -> ''
                      iframeClassName={''}          // defaults -> ''
                      style={{}}                    // defaults -> {}
                      title={''}                    // defaults -> ''
                      loading={undefined}                  // defaults -> undefined
                      opts={{}}                        // defaults -> {}
                      onReady={func}                    // defaults -> noop
                      onPlay={func}                     // defaults -> noop
                      onPause={func}                    // defaults -> noop
                      onEnd={func}                      // defaults -> noop
                      onError={func}                    // defaults -> noop
                      onStateChange={func}              // defaults -> noop
                      onPlaybackRateChange={func}       // defaults -> noop
                      onPlaybackQualityChange={func}    // defaults -> noop
                    /> */}
                    <ThemeProvider theme={BOLD} >
                      <Typography>หมายเหตุ : การตั้งค่านี้จะมีผลต่อปริมาณแบนด์วิดท์ที่คุณจะใช้สำหรับการประชุมนี้
                        โดยคุณสามารถปรับให้มีค่าต่ำลงได้หากการเชื่อมต่ออินเทอร์เน็ตของคุณช้าหรือถ้าคอมพิวเตอร์ของคุณมีปัญหาทำให้มีผลกระทบต่อประสิทธิภาพการใช้งาน</Typography>
                    </ThemeProvider>
                  </div>
                )}
                {selectTab === "BACKBROUND" && (
                  <div className={DialogCSS.rightVideo}>
                    <VirsualBackground {...prop} />
                  </div>
                )}
                {selectTab === "VOTE" && checkRole === "HOST" && (
                  <div className={DialogCSS.rightVideo}>
                    <TableVote
                      pexRTC={pexRTC}
                      indVote={indVote}
                      setVote={setVote}
                      setindVote={setindVote}
                      stateVote={stateVote}
                      setStateVote={setStateVote}
                      accessToken={accessToken}
                      setAccessToken={setAccessToken}
                      setOpenDialog={setOpenDialog}
                      setSelectTab={setSelectTab}
                      setVoteSecret={setVoteSecret}
                      meetID={meetID}
                      refreshToken={refreshToken}
                      setRefreshToken={setRefreshToken}
                    />
                  </div>
                )}
                {selectTab === "privateVote" && checkRole === "HOST" && (
                  <div className={DialogCSS.rightVideo}>
                    <PrivateVote
                      pexRTC={pexRTC}
                      vote={vote}
                      listParticipants={listParticipants}
                      selectTab={selectTab}
                      setSelectTab={setSelectTab}
                      meetID={meetID}
                    />
                    {/* </Box> */}
                  </div>
                )}
              </div>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          {selectTab !== "VOTE" && selectTab !== "loading" && selectTab !== "privateVote" && selectTab !== "BACKBROUND" &&
            <Button autoFocus variant="contained" color="info" onClick={() => sentObj()}>
              youtube
            </Button>
          }
          {selectTab !== "VOTE" && selectTab !== "loading" && selectTab !== "privateVote" && selectTab !== "BACKBROUND" &&
            <Button autoFocus variant="contained" color="info" onClick={() => saveChanges()}>
              บันทึก
            </Button>
          }
          {selectTab !== "AUDIO" && selectTab !== "VIDEO" &&
            <Button autoFocus variant="contained" color="error" onClick={() => handleClose()}>
              ปิด
            </Button>
          }
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}