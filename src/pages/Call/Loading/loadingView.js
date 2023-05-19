import React, { useRef, useEffect, useState } from 'react';
import axios from "axios";
import {
  BrowserRouter as
    Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

import permission from "./permissionRequest.png";

//library
import Skeleton from '@mui/material/Skeleton';
import Swal from "sweetalert2/dist/sweetalert2.js";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from "@mui/material/styles";

//CSS
import './loadingView.scss';

const Container = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: '#607d8b'
}));

export default function LoadingView({
  navigate,
  setDialURI,
  setParticipantName,
  setPin,
  setPinGuest,
  setGuestLink,
  setBandwidth,
  setMeetID,
  setAccessToken,
  setSelectAudio,
  setSelectVideo,
  setMicMute,
  setVidMute,
  setRoom_id,
  setAuthen_token,
  setRefresh_token,
  setTypePexRTC,
  setUuidRoom,
  setVote,
  setRefreshToken,
  setAuthen_tokenGuest,
  setStatus_room_id,
  setMember_id,
  setOne_id,
  setsStateLockRoom,
  audioSound,
  setBlockDevice
}) {
  const { id_role } = useParams();
  const { id_params } = useParams();
  const secretKey = process.env.REACT_APP_SECRET_TOKEN

  const [requestPermissons, setRequestPermissons] = useState(false)

  useEffect(() => {
    navigator.permissions.query({ name: 'microphone' })
      .then((permissionObj) => {
        if (permissionObj.state === 'prompt') {
          setRequestPermissons(true)
          callRoom(true)
        } else {
          callRoom(false)
        }
      })
      .catch((error) => {
        callRoom(false)
      })
  }, [])

  function callRoom(val) {
    if (id_role === 'call') {
      getRoomCall(val)
    } else if (id_role === 'join') {
      getRoomJoin(val)
    }
  }

  function getAudioDevices() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false
      })
      .then(() => {
        setAudioDevice()
      })
      .catch(setCatchDevice)
  }

  function getMediaDevices() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          width: { min: 1024, ideal: 1280, max: 1920 },
          height: { min: 576, ideal: 720, max: 1080 },
        },
      })
      .then(stream => {
        window.localStream = stream;
        setDevice()
      })
      .catch(setCatchDevice)
  }

  async function setAudioDevice() {
    await navigator.mediaDevices.enumerateDevices().then((devices) => {
      const audioDevices = devices.filter(
        (device) => device.kind === 'audioinput'
      )
      setSelectAudio(audioDevices[0].deviceId);
      setSelectVideo(false);
      if (id_role === 'call') {
        navigate('/webrtcapp/call');
      } else if (id_role === 'join') {
        navigate('/webrtcapp/join');
      }
    })
  }

  async function setDevice() {
    await navigator.mediaDevices.enumerateDevices().then((devices) => {
      const audioDevices = devices.filter(
        (device) => device.kind === 'audioinput'
      )
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      )
      setSelectAudio(audioDevices[0].deviceId);
      setSelectVideo(videoDevices[0].deviceId);
      if (id_role === 'call') {
        navigate('/webrtcapp/call');
      } else if (id_role === 'join') {
        navigate('/webrtcapp/join');
      }
    })
  }

  function setCatchDevice() {
    setSelectAudio(false);
    setSelectVideo(false);
    setBlockDevice(true)
    if (id_role === 'call') {
      navigate('/webrtcapp/call');
    } else if (id_role === 'join') {
      navigate('/webrtcapp/join');
    }
  }

  //for CENTRIFUGE get Status Message form OneChat
  async function getRoomID(authen_token, uuidRoom, audio_mute) {
    try {
      const response = await axios({
        method: "get",
        url: process.env.REACT_APP_HOST_ONECHAT + '/backend/api/v1/member',
        headers: { Authorization: `Bearer ${authen_token}` },
      });
      if (response.data.message === "success") {
        setStatus_room_id(response.data.data.room_id)
        setMember_id(response.data.data.member_id)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // For Host
  async function getRoomCall(val) {
    await axios.get(process.env.REACT_APP_API + '/api/v1/rtc/' + id_params,
      {
        headers: { Authorization: `Bearer ${secretKey}` }
      })
      .then((result) => {
        const data = result.data.data
        setDialURI(data.alias);
        setParticipantName(data.user_name);
        setPin(data.host_pin)
        setPinGuest(data.guest_pin)
        setBandwidth(data.video_bandwidth)
        setTypePexRTC(data.conference_type)
        setGuestLink(data.url_guest)
        setMicMute(data.audio_mute)
        if (data.conference_type === "audioonly") {
          setVidMute(true)
        } else {
          setVidMute(data.video_mute)
        }
        setUuidRoom(data.uuid_room)
        setMeetID(data.meeting_id)
        setVote(data.vote_link)
        setAccessToken(data.access_token_oneid)
        setRefreshToken(data.refresh_accessToken)
        setRoom_id(data.room_id)
        setAuthen_token(data.access_token)
        setRefresh_token(data.refresh_token)
        setsStateLockRoom(data.stateLockRoom)

        // function
        getRoomID(data.access_token, data.room_id, data.audio_mute)
        console.log('1');
        console.log(data.conference_type);
        console.log(val);
        if (data.conference_type === '' && !val) {
          console.log('2');
          getMediaDevices();
        } else if (!val) {
          console.log('3');
          getAudioDevices();
        }
      })
      .catch((err) => {
        console.log('error', err)
        Swal.fire({
          title: err,
          text: "",
          icon: "error",
          showCancelButton: false,
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
      })
  }

  //For Guest No login
  async function getRoomJoin(val) {
    await axios.get(process.env.REACT_APP_API + '/api/v1/rtc/anonymouse/' + id_params,
      {
        headers: { Authorization: `Bearer ${secretKey}` }
      })
      .then((result) => {
        const data = result.data.data
        setDialURI(data.alias);
        setParticipantName(data.user_name);
        setPinGuest(data.guest_pin)
        setBandwidth(data.video_bandwidth)
        setTypePexRTC(data.conference_type)
        setGuestLink(data.url_guest)
        setMicMute(data.audio_mute)
        if (data.conference_type === "audioonly") {
          setVidMute(true)
        } else {
          setVidMute(data.video_mute)
        }
        setAccessToken(data.access_token_oneid)
        setRoom_id(data.room_id)
        setMeetID(data.meeting_id)
        // setAuthen_token(data.access_token)
        setAuthen_tokenGuest(data.access_token)
        // setRefresh_token(data.refresh_token)
        setOne_id(data.oneid)

        // function
        getRoomID(data.access_token, data.room_id, data.audio_mute)
        if (data.conference_type === '' && !val) {
          getMediaDevices();
        } else if (!val) {
          getAudioDevices();
        }
      })
      .catch((err) => {
        console.log('error', err)
        Swal.fire({
          title: err,
          text: "",
          icon: "error",
          showCancelButton: false,
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
      })
  }

  function startConference() {
    setRequestPermissons(false)
    getMediaDevices();
    navigator.permissions.query({ name: 'camera' })
      .then((permissionObj) => {
        if (permissionObj.state === 'denied') {
          setTypePexRTC('audioonly')
        } else {
          setTypePexRTC('')
        }
      })
      .catch((error) => {
        console.log('Got error :', error);
      })
  }

  return (
    <div>
      {requestPermissons ? (
        <Container>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              alt="green iguana"
              height="140"
              src={permission}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                We need your permission to use your camera and microphone
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please select Allow in the next step when prompted by your browser. We will only have access for the duration of the meeting.
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" onClick={() => startConference()}>Request permissons</Button>
            </CardActions>
          </Card>
        </Container>
      ) : (
        <div className='loaddingContainer'>
          <div className='centerTest'>
            <div className="wrapper">
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="shadow"></div>
              <div className="shadow"></div>
              <div className="shadow"></div>
            </div>
          </div>

          <div className='presentWrapper'>
            <Skeleton width={'100%'} height={'100%'} sx={{ bgcolor: 'grey.800' }} variant="rectangular" />
          </div>
          <div className='toolsFuntion'>
            <Skeleton width={42} height={42} sx={{ mx: 1, bgcolor: 'grey.800' }} variant="circular" />
            <Skeleton width={42} height={42} sx={{ mx: 1, bgcolor: 'grey.800' }} variant="circular" />
          </div>
          <div className='toolsSettings'>
            <Skeleton width={42} height={42} sx={{ mx: 1, bgcolor: 'grey.800' }} variant="circular" />
            <Skeleton width={42} height={42} sx={{ mx: 1, bgcolor: 'grey.800' }} variant="circular" />
            <Skeleton width={42} height={42} sx={{ mx: 1, bgcolor: 'grey.800' }} variant="circular" />
            <Skeleton width={42} height={42} sx={{ mx: 1, bgcolor: 'grey.800' }} variant="circular" />
          </div>
          <div className='toolsWrapper'>
            <Skeleton width={42} height={42} sx={{ mx: 1, bgcolor: 'grey.800' }} variant="circular" />
            <Skeleton width={42} height={42} sx={{ mx: 1, bgcolor: 'grey.800' }} variant="circular" />
            <Skeleton width={42} height={42} sx={{ mx: 1, bgcolor: 'grey.800' }} variant="circular" />
          </div>
        </div>
      )}
    </div>
  );
}