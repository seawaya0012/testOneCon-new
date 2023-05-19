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

//library
import Skeleton from '@mui/material/Skeleton';
import Swal from "sweetalert2/dist/sweetalert2.js";

//CSS
import './loadingView.scss';

export default function LoadingView({ navigate, setDialURI, setParticipantName, setPin, setPinGuest, setGuestLink, setBandwidth, setMeetID, setAccessToken,
  setSelectAudio, setSelectVideo, setMicMute, setVidMute, setRoom_id, setAuthen_token, setRefresh_token, setTypePexRTC, setUuidRoom, setVote, setRoom_idGuest,
  setAuthen_tokenGuest }) {
  const { id_role } = useParams();
  const { id_params } = useParams();
  const secretKey = process.env.REACT_APP_SECRET_TOKEN
  const constraints = {
    video: {
      height: {
        min: 1080,
      },
      width: {
        min: 1920,
      },
    },
    audio: true
  };

  useEffect(() => {
    if (id_role === 'call') {
      getRoomCall()
    } else if (id_role === 'join') {
      getRoomJoin()
    }
  }, [])

  function getMediaDevices(constraints, audio, video) {
    navigator.mediaDevices.getUserMedia(constraints).then(setDevice).catch(setCatchDevice(audio, video))
  }

  async function setDevice() {
    let devices = await navigator.mediaDevices.enumerateDevices();
    let video_devices = devices.filter((d) => d.kind === 'videoinput');
    let audio_devices = devices.filter((d) => d.kind === 'audioinput');
    setSelectAudio(audio_devices[0].deviceId);
    setSelectVideo(video_devices[0].deviceId);
  }

  function setCatchDevice(audio, video) {
    if (audio === '' && video === '') {
      setSelectAudio('default');
      setSelectVideo(null);
    } else {
      setSelectAudio(audio);
      setSelectVideo(video);
    }
  }

  // For Host
  async function getRoomCall() {
    await axios.get(process.env.REACT_APP_API + '/api/v1/rtc/' + id_params,
      {
        headers: { Authorization: `Bearer ${secretKey}` }
      })
      .then((result) => {
        const data = result.data.data
        console.log("data", data)
        setDialURI(data.alias);
        setParticipantName(data.user_name);
        setPin(data.host_pin)
        setPinGuest(data.guest_pin)
        setBandwidth(data.video_bandwidth)
        setTypePexRTC(data.conference_type)
        setGuestLink(data.url_guest)
        // setSelectAudio(data.uid_audio);
        // setSelectVideo(data.uid_video);
        setMicMute(data.audio_mute)
        setVidMute(data.video_mute)
        // setDevice(data.uid_audio, data.uid_video)
        getMediaDevices(constraints, data.uid_audio, data.uid_video);
        setUuidRoom(data.uuid_room)
        setMeetID(data.meeting_id)
        setVote(data.vote_link)
        setAccessToken(data.access_token_oneid)
        setRoom_id(data.room_id)
        setAuthen_token(data.access_token)
        setRefresh_token(data.refresh_token)
        navigate('/webrtcapp/call');
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
  async function getRoomJoin() {
    await axios.get(process.env.REACT_APP_API + '/api/v1/rtc/anonymouse/' + id_params,
      {
        headers: { Authorization: `Bearer ${secretKey}` }
      })
      .then((result) => {
        const data = result.data.data
        console.log("data", data)
        setDialURI(data.alias);
        setParticipantName(data.user_name);
        setPinGuest(data.guest_pin)
        setBandwidth(data.video_bandwidth)
        setTypePexRTC(data.conference_type)
        setGuestLink(data.url_guest)
        // setSelectAudio(data.uid_audio);
        // setSelectVideo(data.uid_video);
        setMicMute(data.audio_mute)
        setVidMute(data.video_mute)
        // setDevice(data.uid_audio, data.uid_video)
        getMediaDevices(constraints, data.uid_audio, data.uid_video);
        setAccessToken(data.access_token_oneid)
        setRoom_id(data.room_id)
        setRoom_idGuest(data.room_id)
        setAuthen_token(data.access_token)
        setAuthen_tokenGuest(data.access_token)
        setRefresh_token(data.refresh_token)
        navigate('/webrtcapp/join');
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

  return (
    <div className='loaddingContainer'>
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
  );
}