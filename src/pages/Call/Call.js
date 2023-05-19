import React, { useRef, useEffect, useState } from 'react';
import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

//CSS
import './Call.scss';

//Component
import ToolFunction from './Tool/toolFunction';
import ToolSettings from './Tool/toolSettings';
import ToolControl from './Tool/toolControl';
import CameraUser from './Component/cameraUser';
import ToolOpenCamera from './Tool/toolOpenCamera';
import DraWer from './Component/draWer';
import LoadingView from './Loading/loadingView';
import ImagesPresentation from './Component/imagesPresentation';
import VideoPresentation from './Component/videoPresentation';
import RunCanvasBG from './Component/runCanvasBG';
import ConferenceWhenShareScreen from './Component/conferenceWhenShareScreen';
import ToolOpenConference from './Tool/toolOpenConference';

//Library
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
} from '@mui/material';

const drawerWidth = 330;
// const xsWidth = 50;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    overflow: `hidde`,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // [theme.breakpoints.up('xs')]: {
    //   marginLeft: `-${drawerWidth}px`
    // },
    marginLeft: `-${drawerWidth}px`,
    // marginLeft: -'50%',
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
  const {
    navigate,
    pexRTC,
    dialURI,
    participantName,
    pin,
    pexipCamera,
    setCheckRole,
    checkRole,
    authen_token,
    fileImages,
    statePresentationFile,
    openMessages,
    selectAudio,
    selectVideo,
    micMute,
    vidMute,
    typePexRTC,
    bandwidth,
    room_id,
    stateLockRoom,
    setUuid,
    indexOfPage,
    setIndexOfPage,
    stateCloseCamera,
    setStateCloseCamera,
    statePresentation,
    setStatePresentation,
    quality,
    listParticipants,
    stateSwitchCam,
    setStateSwitchCam,
    meetID,
    setStatePresentationFile,
    loading,
    setLoading,
    setPresenter,
    streamCamera,
    setStreamCamera,
    audioRef,
    selectOutput,
    setStateOutput,
    customVideo,
    setCustomVideo,
    backgroundSelect,
    detect,
    loadingCamera,
    setLoadingCamera
  } = props
  const pexipVideoRef = useRef(null);
  const [streamSrc, setStreamSrc] = useState(null);
  // const [loading, setLoading] = useState(true); ย้ายไปประกาศใน app

  // Presentation
  // const [statePresentation, setStatePresentation] = useState(false);
  const [statePresentationOutputFIle, setStatePresentationOutputFIle] = useState(false);
  const [streamPresentation, setStreamPresentation] = useState(null);
  const [urlPresentation, setUrlPresentation] = useState(null);
  // const [quality, setQuality] = useState('HD');
  // when share call Conference
  const [stateCloseConference, setStateCloseConference] = useState(true)

  useEffect(() => {
    // Setup Pexip
    pexRTC.onSetup = callSetup;
    pexRTC.onConnect = callConnected;
    pexRTC.onError = callError;
    pexRTC.onDisconnect = callDisconnected;
    pexRTC.video_source = selectVideo
    pexRTC.audio_source = selectAudio
    pexRTC.muteAudio(micMute)
    pexRTC.muteVideo(vidMute)
    if (stateLockRoom) {
      pexRTC.setConferenceLock(stateLockRoom)
    }

    // pexRTC.transformLayout({
    // layout: 'ac',
    // enable_extended_ac: true,
    //   streaming_indicator: false,
    //   recording_indicator: false,
    //   transcribing_indicator: false,
    //   enable_active_speaker_indication: true,
    //   enable_overlay_text: true,
    //   plus_n_pip_enabled: false
    // })

    // Presentation
    pexRTC.onPresentation = callSharedScreen;
    pexRTC.onPresentationConnected = callPresentationConnected;
    pexRTC.onPresentationDisconnected = callPresentationDisconnected;

    // Make the actual call with the PexRTC Library
    pexRTC.makeCall(
      process.env.REACT_APP_NODE_PEX_RTC,
      dialURI,
      participantName,
      bandwidth,
    );

    //setTimeout
    // timeout(60000)
    // timeoutAnnounce(60000/1.2, 60000)

    //Create Data on DataBase
    createData()

    return () => {
      pexRTC.disconnect();
    };
  }, []);

  //Create Data putSession on DB
  async function createData() {
    try {
      const response = await axios({
        method: 'POST',
        url: process.env.REACT_APP_API + '/api/vi/activity/create',
        data: {
          meeting_id: meetID
        }
      })
      console.log(response);
      if (stateLockRoom) {
        whenLockroom()
      }
    } catch (err) {
      console.log(err);
    }
  }

  //Handle when Create room with Lock room
  async function whenLockroom() {
    try {
      const response = await axios({
        method: 'POST',
        url: process.env.REACT_APP_API + '/api/vi/activity/lock',
        data: {
          meeting_id: meetID
        }
      })
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  async function timeoutAnnounce(time, set) {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(time);
    pexRTC.sendChatMessage('0|เวลาการใช้งาน conference กำลังจะหมดในอีก ' + ((set / 1000) - (time / 1000)) + ' วินาที')
  }

  async function timeout(time) {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(time);
    disconnectAllParticipant()
  }

  async function disconnectAllParticipant() {
    try {
      const response = await axios({
        method: "post",
        url: process.env.REACT_APP_WEB_PEX_RTC + '/api/client/v2/conferences/' + dialURI + '/disconnect',
        headers: { token: pexRTC.token },
      });
      if (response.data.status === "success") {
        closeRoom()
      }
    } catch (error) {
      if (typePexRTC === '' && window.localStream !== undefined) {
        window.localStream.getVideoTracks()[0].stop();
      }
      window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
    }
  }

  async function closeRoom() {
    try {
      const response = await axios({
        method: "post",
        url: process.env.REACT_APP_API + '/api/v1/room/autocloseRTC',
        data: {
          meeting_id: meetID
        },
      });
      if (response.data.status === "success") {
        if (typePexRTC === '' && window.localStream !== undefined) {
          window.localStream.getVideoTracks()[0].stop();
        }
        window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
      }
    } catch (error) {
      Swal.fire({
        title: "ปิดห้องไม่สำเร็จ",
        text: "",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: 'ตกลง',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          if (typePexRTC === '' && window.localStream !== undefined) {
            window.localStream.getVideoTracks()[0].stop();
          }
          window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
        }
      });
    }
  }

  useEffect(() => {
    if (pexRTC.current_service_type === 'conference') {
      let status = 'On'
      if (micMute) {
        status = "Off"
      } else {
        status = "On"
      }
      createMicHost(status)
    }

    // when user reload do this
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
    }

  }, [pexRTC.current_service_type]);

  useEffect(() => {
    //When handdle change output
    if (selectOutput) {
      setOutput()
    }

  }, [selectOutput]);

  //Create mic for Host
  async function createMicHost(mic) {
    try {
      const response = await axios({
        method: "post",
        url: process.env.REACT_APP_API + '/api/v1/miccheck/create',
        data: {
          meeting_id: room_id,
          uid: pexRTC.uuid,
          status: mic
        },
      });
      if (response.data.result === "Create") {
        console.log(response.data.data)
      }
    } catch (error) {
      addmemMicHost(mic)
    }
  }

  //Add mem status mic for Host
  async function addmemMicHost(mic) {
    try {
      const response = await axios({
        method: "post",
        url: process.env.REACT_APP_API + '/api/v1/miccheck/addmem',
        data: {
          meeting_id: room_id,
          uid: pexRTC.uuid,
          status: mic
        },
      });
      if (response.data.result === "Create") {
        console.log(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // When User close stream will end session
  window.addEventListener("beforeunload", () => {
    // axios.delete(process.env.REACT_APP_API + '/api/v1/miccheck/deletemem', {
    //   meeting_id: room_id,
    //   uid: pexRTC.uuid,
    // })
    pexRTC.disconnect()
  });

  // When the stream source is updated
  useEffect(() => {
    if (pexipVideoRef.current) {
      if (!stateSwitchCam) {
        if (typeof MediaStream !== 'undefined' && streamSrc instanceof MediaStream) {
          pexipVideoRef.current.srcObject = streamSrc;
          if (loading) {
            setInterval(function () { setLoading(false) }, 3000);
          }
        } else {
          pexipVideoRef.current.src = streamSrc;
          if (loading) {
            setInterval(function () { setLoading(false) }, 3000);
          }
        }
      } else {
        if (typeof MediaStream !== 'undefined' && streamCamera instanceof MediaStream) {
          pexipVideoRef.current.srcObject = streamCamera;
          if (loading) {
            setInterval(function () { setLoading(false) }, 3000);
          }
        } else {
          pexipVideoRef.current.src = streamCamera;
          if (loading) {
            setInterval(function () { setLoading(false) }, 3000);
          }
        }
      }
    }
    if (audioRef.current) {
      if (typeof MediaStream !== 'undefined' && streamSrc instanceof MediaStream) {
        audioRef.current.srcObject = streamSrc
      } else {
        audioRef.current.src = streamSrc
      }
    }
  }, [streamSrc, streamCamera, stateSwitchCam]);

  // This method is called when the call is setting up
  function callSetup(stream, pinStatus) {
    pexRTC.connect(pin);
    setStreamCamera(stream)
  }

  // When the call is connected
  function callConnected(stream) {
    setUuid(pexRTC.uuid)
    setCheckRole('HOST')
    setStreamSrc(stream);
  }

  // When the call is presentation start 
  function callPresentationConnected(stream) {
    setStreamPresentation(stream)
  }

  // get Presentation
  function callSharedScreen(setting, presenter, uuid, presenter_source) {
    // if (setting && presenter_source === "video") {
    //   pexRTC.getPresentation()
    //   setStatePresentation(setting)
    //   setStatePresentationFile(false)
    //   pexRTC.onPresentationReload = callPresentationReload;
    //   setStateCloseConference(false)
    // } else if (setting && presenter_source === "static") {
    //   setStatePresentationOutputFIle(setting)
    //   setStatePresentationFile(false)
    //   pexRTC.onPresentationReload = callPresentationReload;
    //   setStateCloseConference(false)
    // } else {
    //   setStatePresentationOutputFIle(setting)
    //   setStatePresentation(setting)
    //   setStateCloseConference(true)
    // }
    // -------------------
    if (setting) {
      setStateCloseConference(false)
      setStatePresentationFile(false)
    } else {
      setStateCloseConference(true)
    }
    setStatePresentationOutputFIle(setting)
    setStatePresentation(setting)
    pexRTC.getPresentation()
    pexRTC.onPresentationReload = callPresentationReload;
  }

  // get Presentation images
  function callPresentationReload(url) {
    setUrlPresentation(url)
  }

  // check presentation has stop
  function callPresentationDisconnected(reason) {
    if (reason.status === 'stop') {
      setStatePresentation(false)
      setIndexOfPage(0)
    }
  }

  // When the call is error
  function callError(reason) {
    Swal.fire({
      title: reason,
      text: "",
      icon: "error",
      showCancelButton: false,
      confirmButtonText: 'ตกลง',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (typePexRTC === '' && window.localStream !== undefined) {
          window.localStream.getVideoTracks()[0].stop();
        }
        window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
      }
    });
  }

  // When the call is disconnected
  function callDisconnected(reason = '') {
    // window.localStream.getVideoTracks()[0].stop();
    // window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
  }

  //When handdle change output
  async function setOutput() {
    try {
      const audio = document.getElementById("audioOutPut");
      await audio.setSinkId(selectOutput);
      console.log(`Audio is being played on ${audio.sinkId}`);
    } catch (err) {
      setStateOutput(true)
      console.log(err);
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* loading View */}
      {loading &&
        <LoadingView />
      }

      {/* VirtualBackground */}
      {!detect &&
        <RunCanvasBG {...props} />
      }

      <DraWer {...props} />
      <Main open={openMessages}>

        {/* Presentation File */}
        {(statePresentationFile || statePresentationOutputFIle) &&
          <ImagesPresentation pexRTC={pexRTC} dialURI={dialURI} statePresentationOutputFIle={statePresentationOutputFIle} urlPresentation={urlPresentation}
            statePresentationFile={statePresentationFile} indexOfPage={indexOfPage} fileImages={fileImages} setIndexOfPage={setIndexOfPage} openMessages={openMessages}
            listParticipants={listParticipants} typePexRTC={typePexRTC} participantName={participantName} loading={loading} />
        }

        {/* Presentation*/}
        {statePresentation &&
          <VideoPresentation streamPresentation={streamPresentation} statePresentation={statePresentation} quality={quality} urlPresentation={urlPresentation} />
        }

        <div className='callContainer'>
          {(!statePresentationFile || !statePresentation) ? (
            <video className='callVideoContainer' ref={pexipVideoRef} muted autoPlay='autoplay' playsInline id="conference"></video>
          ) : (
            <video className='callVideoContainer' ref={pexipVideoRef} muted autoPlay='autoplay' playsInline></video>
          )}
          {/* Audio output */}
          <audio id="audioOutPut" ref={audioRef} autoPlay='autoPlay' ></audio>

          {/* Tool Fucntion */}
          <ToolFunction {...props} />

          {/* Tool Settings */}
          <ToolSettings {...props} />

          {/* Tool Control */}
          <ToolControl {...props} />

          {/* Camera User */}
          <CameraUser
            streamCamera={streamCamera}
            streamSrc={streamSrc}
            micMute={micMute}
            vidMute={vidMute}
            stateCloseCamera={stateCloseCamera}
            setStateCloseCamera={setStateCloseCamera}
            stateSwitchCam={stateSwitchCam}
            setStateSwitchCam={setStateSwitchCam}
            loadingCamera={loadingCamera}
          />

          {/* conferenceWhenShareScreen */}
          <ConferenceWhenShareScreen streamSrc={streamSrc} stateCloseConference={stateCloseConference} setStateCloseConference={setStateCloseConference} />

          {/* Tool OpenCamera */}
          <ToolOpenCamera {...props} />

          {/* ToolOpenConference */}
          {statePresentation &&
            <ToolOpenConference stateCloseConference={stateCloseConference} setStateCloseConference={setStateCloseConference} />
          }

        </div>
      </Main>

    </Box>
  );
}

export default Call;