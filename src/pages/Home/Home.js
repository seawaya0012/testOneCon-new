import React, { useRef, useEffect, useState } from 'react';
import {
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

import './Home.scss';

function Home({ navigate, pexRTC, setDialURI, setParticipantName, setPin }) {
  const participantName = useRef('');
  const pin = useRef('');
  const dialURI = useRef('');
  const videoDevice = useRef('');
  const audioDevice = useRef('');
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);

  const [audio, setAudio] = useState('')
  const [selectAudio, setSelectAudio] = useState('')
  const [selectVideo, setSelectVideo] = useState('')

  const handleChangeVideo = (event) => {
    setSelectVideo(event.target.value);
  };

  const handleChangeAudio = (event) => {
    setSelectAudio(event.target.value);
  };

  function connectCall() {
    // setDialURI(dialURI.current.value);
    setDialURI(process.env.REACT_APP_ALIAS);
    setParticipantName(participantName.current.value);
    // setPin(pin.current.value)
    setPin(process.env.REACT_APP_HOSTPIN)

    let constraints = {
      // video: {
      //   deviceId: {
      //     exact: "ac756d765f2cac116a2dcfda82fb9b31f5464c8028b60086227df2113952c1e2"
      //   },
      //   width: {
      //     ideal: 1920
      //   },
      //   height: {
      //     ideal: 1080
      //   },
      //   pan: true,
      //   tilt: true,
      //   zoom: true
      // },
      video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 }
      },
      audio: {
        deviceId: {
          exact: pexRTC.audio_source = selectAudio
        }
      }
    }
    // getMediaDevices(constraints)

    // navigate('/zoom');
    // navigate('/testtcall');
    navigate('/webrtcapp/call');
    
  }

  useEffect(() => {
    // getDevice();
  }, []);

  async function getDevice() {
    let devices = await navigator.mediaDevices.enumerateDevices();
    let video_devices = devices.filter((d) => d.kind === 'videoinput');
    let audio_devices = devices.filter((d) => d.kind === 'audioinput');
    setVideoDevices(video_devices);
    setAudioDevices(audio_devices);
    setAudio(audio_devices[3].deviceId)
  }

  async function getMediaDevices(constraints) {
    await navigator.mediaDevices.getUserMedia(constraints);
  }

  return (
    <div>
      <div className="pageContainer">
        <Card sx={{ height: '95%', width: '95%' }} elevation={5}>
          <Card sx={{ mx: 2, my: 2 }} elevation={2}>
            <CardContent>
              <Box sx={{ pt: 2, display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  ห้องสื่อสาร 1
                </Typography>
              </Box>
              <Box sx={{ pt: 2, display: 'flex', justifyContent: 'center' }} spacing={2}>
                <TextField sx={{px: 1}} id="outlined-basic" label="ชื่อ" variant="outlined" inputRef={participantName} />
                {/* <TextField id="outlined-basic" label="pin" variant="outlined" inputRef={pin} /> */}
                {/* <TextField id="outlined-basic" label="Alia" variant="outlined" inputRef={dialURI} /> */}
                {/* <div className='preflightContentBody'>
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
                <div className='preflightContentBody'>
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
                </div> */}
                <Button sx={{px: 1}} variant="contained" onClick={() => connectCall()}>Start room</Button>
              </Box>
            </CardContent>
          </Card>
        </Card>
      </div>
    </div>
  )
}

export default Home;