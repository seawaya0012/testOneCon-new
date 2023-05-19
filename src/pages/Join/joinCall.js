import React, { useRef, useEffect, useState } from 'react';
import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

//CSS
import './joinCall.scss';

//Component
import ToolFunction from '../Call/Tool/toolFunction';
import ToolSettings from '../Call/Tool/toolSettings';
import ToolControl from '../Call/Tool/toolControl';
import CameraUser from '../Call/Component/cameraUser';
import ToolOpenCamera from '../Call/Tool/toolOpenCamera';
import DraWer from '../Call/Component/draWer';
import LoadingView from '../Call/Loading/loadingView';
import ImagesPresentation from '../Call/Component/imagesPresentation';
import VideoPresentation from '../Call/Component/videoPresentation';
import RunCanvasBG from '../Call/Component/runCanvasBG';
import ConferenceWhenShareScreen from '../Call/Component/conferenceWhenShareScreen';
import ToolOpenConference from '../Call/Tool/toolOpenConference';

//Library
import { styled, useTheme } from '@mui/material/styles';
import {
  Box
} from '@mui/material';


const drawerWidth = 330;

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

function JoinCall(props) {
  const {
    pexRTC,
    dialURI,
    participantName,
    pinGuest,
    setCheckRole,
    authen_token,
    fileImages,
    statePresentationFile,
    openMessages,
    selectAudio,
    selectVideo,
    micMute,
    vidMute,
    bandwidth,
    typePexRTC,
    setUuid,
    setStatePresentationFile,
    indexOfPage,
    setIndexOfPage,
    authen_tokenGuest,
    room_id,
    setAuthen_token,
    setRefresh_token,
    stateCloseCamera,
    setStateCloseCamera,
    statePresentation,
    setStatePresentation,
    quality,
    listParticipants,
    stateSwitchCam,
    setStateSwitchCam,
    setPresenter,
    loading,
    setLoading,
    meetID,
    one_id,
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

    // Presentation
    pexRTC.onPresentationConnected = callPresentationConnected;
    pexRTC.onPresentationDisconnected = callPresentationDisconnected;
    pexRTC.onPresentation = callSharedScreen;
    // pexRTC.onPresentationReload = callPresentationReload;

    // Make the actual call with the PexRTC Library
    pexRTC.makeCall(
      process.env.REACT_APP_NODE_PEX_RTC,
      dialURI,
      participantName,
      bandwidth,
    );

    return () => {
      pexRTC.disconnect();
    };
  }, []);

  useEffect(() => {
    if (pexRTC.current_service_type === 'conference') {
      joinOneChat()
      let status = 'On'
      if (micMute) {
        status = "Off"
      } else {
        status = "On"
      }
      addmemMicHost(status)
    }

    //Join
    if (pexRTC.uuid !== null) {
      whenGuestJoinRoom()
    }

    // when user reload do this
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      callDisconnected()
    }

  }, [pexRTC.current_service_type, pexRTC.uuid]);

  useEffect(() => {
    //When handdle change output
    if (selectOutput) {
      setOutput()
    }

  }, [selectOutput]);

  //Create Join room on DB 
  async function whenGuestJoinRoom() {
    let oneID = "No"
    if (one_id !== "") {
      oneID = one_id
    }
    try {
      const response = await axios({
        method: 'POST',
        url: process.env.REACT_APP_API + '/api/vi/activity/join',
        data: {
          meeting_id: meetID,
          callid: pexRTC.uuid,
          oneid: oneID,
          name: participantName,
          vote: false
        }
      })
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  //Join OneChat
  async function joinOneChat() {
    try {
      const response = await axios({
        method: "post",
        url: process.env.REACT_APP_HOST_ONECHAT + '/backend/api/v1/member/join',
        data: {
          room_id: room_id,
          user_id: Math.random().toString().slice(2),
          user_name: participantName,
          user_profile: 'https://www.shareicon.net/data/512x512/2016/05/24/770117_people_512x512.png',
          user_role: "member"
        },
        headers: { Authorization: `Bearer ${authen_tokenGuest}` },
      });
      if (response.data.message === "success") {
        setAuthen_token(response.data.data.access_token)
        setRefresh_token(response.data.data.refresh_token)
      }
    } catch (error) {
      console.log(error);
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
    axios.delete(process.env.REACT_APP_HOST_ONECHAT + '/backend/api/v1/member/leave', { headers: { Authorization: `Bearer ${authen_token}` } })
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
    pexRTC.connect(pinGuest);
    setStreamCamera(stream)
  }

  // When the call is connected
  function callConnected(stream) {
    setUuid(pexRTC.uuid)
    setCheckRole('GUEST')
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
        callDisconnected()
      }
    });
  }

  // When the call is disconnected
  function callDisconnected(reason = '') {
    // leaveMemMic()
    axios.delete(process.env.REACT_APP_HOST_ONECHAT + '/backend/api/v1/member/leave',
      { headers: { Authorization: `Bearer ${authen_token}` } }
    )
      .then((result) => {
        // console.log('res', result)
        if (typePexRTC === '' && window.localStream !== undefined) {
          window.localStream.getVideoTracks()[0].stop();
        }
        window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
      })
      .catch((err) => {
        // console.log('error', err)
        if (typePexRTC === '' && window.localStream !== undefined) {
          window.localStream.getVideoTracks()[0].stop();
        }
        window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
      })
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

  //When handdle change output
  async function setOutput() {
    try {
      const audio = document.getElementById("audioOutPut");
      await audio.setSinkId(selectOutput);
      console.log(`Audio is being played on ${audio.sinkId}`);
    } catch (err) {
      console.log(err);
      setStateOutput(true)
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
            statePresentationFile={statePresentationFile} indexOfPage={indexOfPage} fileImages={fileImages} setIndexOfPage={setIndexOfPage}
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

export default JoinCall;