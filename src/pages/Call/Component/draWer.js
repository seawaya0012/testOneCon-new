import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";

//Component
import DialogVote from "../Dialog/dialogVote";

//CSS
import '../Call.scss';
import ButtonCSS from '../CSS/zoom.module.scss';

//Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { styled, useTheme } from '@mui/material/styles';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import {
  IconButton,
  InputBase,
  Box,
  Drawer,
  Divider,
  MenuItem,
  Typography,
  Menu,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  Badge,
  Paper
} from '@mui/material';

//Icon
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff'
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MonitorIcon from '@mui/icons-material/Monitor';
import PanToolIcon from '@mui/icons-material/PanTool';
import CampaignIcon from '@mui/icons-material/Campaign';
import CallEndIcon from '@mui/icons-material/CallEnd';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import KeyIcon from '@mui/icons-material/Key';
import KeyOffIcon from '@mui/icons-material/KeyOff';
import { FaCrown } from 'react-icons/fa';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { flexbox } from '@mui/system';

var CryptoJS = require("crypto-js");

const THEME = createTheme({
  typography: {
    "fontFamily": `"Kanit", sans-serif`,
    "fontSize": 14,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
  }
});

const BOLD = createTheme({
  typography: {
    "fontFamily": `"Kanit", sans-serif`,
    "fontSize": 14,
    "fontWeightLight": 400,
    "fontWeightRegular": 600,
    "fontWeightMedium": 700
  }
});

//Dialog
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
const BootstrapDialog = styled(Dialog)({
  "& > .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop": {
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }
});
BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
//-----------

const drawerWidth = 330;

const DrawerHeader = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  // position: 'absolute',
  // right: 25,
  // top: 0,
  width: '80%',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const DrawerHeader1 = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  position: 'absolute',
  right: 25,
  top: 0,
  width: '80%',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const ContentWrapper = styled(Box)(({ theme }) => ({
  borderRadius: '12px',
  background: "#FFFFFF",
  // maxWidth: "max-content",
  alignSelf: "flex-start",
  flexWrap: "wrap",
  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
}))

const TextWrapper = styled(Typography)(({ theme }) => ({
  wordBreak: "break-word",
}))

const InputChatBox = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  backgroundColor: "#FFFFFF",
  height: 'auto'
}))

const LongText = ({ content, limit }) => {
  if (content.length <= 16) {
    return <div>
      <ThemeProvider theme={THEME}>
        <Typography>{content}</Typography>
      </ThemeProvider>
    </div>
  }
  const toShow = content.substring(0, 16) + "...";
  return <div>
    <ThemeProvider theme={THEME}>
      <Typography>{toShow}</Typography>
    </ThemeProvider>
  </div>
}

function DraWer(props) {
  const {
    pexRTC,
    openMessages,
    setOpenMessages,
    valueIndexOfDrawer,
    setValueIndexOfDrawer,
    guestLink,
    countParticipants,
    setCountParticipants,
    listParticipants,
    setListParticipants,
    room_id,
    authen_token,
    refresh_token,
    stateMic,
    setStateMic,
    accessToken,
    stateVote,
    conferenceUpdate,
    setConferenceUpdate,
    openDialogPartiForMobile,
    setOpenDialogPartiForMobile,
    openDialogVote,
    setOpenDialogVote,
    meetID,
    setStateVoteGuest,
    vote,
    one_id,
    setStateCheckGuestLogin,
    setStateCheckAuthority,
    checkRole,
    participantName,
    setCountBuzz,
    voteSecret
  } = props
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // ค้นหาผู้เข้าร่วมประชุม
  const [findParticipants, setFindParticipants] = useState('')

  //Function buzz
  const [buzzState, setBuzzState] = useState([])

  //ประกาศ
  const [Messages, setMessages] = useState("")
  const [typeMessages, setTypeMessages] = useState("3")

  //state Active Speakers
  const [stateActiveSpeakers, setStateActiveSpeakers] = useState(null)
  const [checkParticipant, setCheckParticipant] = useState(null)

  // voteSystem
  const [jwtOneChat, setJwtOneChat] = useState('');
  const [countVoteSystem, setCountVoteSystem] = useState(0);
  const [uuidVote, setUuidVote] = useState(0);
  const [dataVote, setDataVote] = useState(null)
  const typeLoginVote = useRef('')

  const handleDrawerClose = () => {
    setOpenMessages(false);
  };

  const handleChangeIndex = (index) => {
    setValueIndexOfDrawer(index);
  };

  //Dialog
  const handleClose = () => {
    setOpenDialogPartiForMobile(false);
  };

  useEffect(() => {
    pexRTC.onStageUpdate = callActiveSpeakers;
    pexRTC.onRosterList = CallonRosterList;
    // pexRTC.onParticipantUpdate = CallonParticipantUpdate;
    pexRTC.onConferenceUpdate = CallonConferenceUpdate;
    pexRTC.onChatMessage = ChatMessage;
    getAllMemMic()

  }, [countVoteSystem, stateVote, voteSecret, vote]);

  // List Participant
  function CallonRosterList(roster) {
    // console.log(roster)
    const count = roster?.filter(user => user?.call_direction !== "out" && user?.service_type !== "waiting_room")
    setCountParticipants(count?.length)
    setListParticipants(roster)

    //Set and Sorted Buzz time
    const countBuzz = roster?.filter(user => user.buzz_time !== 0)
    setCountBuzz(countBuzz?.length)
    setBuzzState(countBuzz?.sort((a, b) => a.buzz_time - b.buzz_time))

    // update ให้คนที่เข้าที่หลัง สมารถเห็น Vote ได้่
    if (checkRole === 'HOST' && count?.length > countVoteSystem) {
      if (stateVote === true && !voteSecret) {
        pexRTC.sendChatMessage('1|&topic-id=' + vote)
      }
      setCountVoteSystem(count?.length)
    } else {
      setCountVoteSystem(count?.length)
    }
  }

  // participants update buzz
  // function CallonParticipantUpdate(participant) {
  //   if (participant.buzz_time !== 0 && buzzState?.find(user => user?.uuid === participant.uuid) === undefined) {
  //     setBuzzState(buzzState => [...buzzState, participant]);
  //   } else if (participant.buzz_time === 0) {
  //     setBuzzState(buzzState?.filter(user => user?.uuid !== participant.uuid))
  //   }
  // }

  // ConferenceUpdate
  function CallonConferenceUpdate(properties) {
    console.log(properties)
    setConferenceUpdate(properties)
  }

  //รับ Message จาก RTC มาแสดง
  function ChatMessage(message) {
    //Vote System
    if (message.payload.charAt(0) === '1' || message.payload.charAt(0) === '6' || message.payload.charAt(0) === '2' || message.payload.charAt(0) === '7') {
      //active เมื่อ host สั่งเปิดให้ทำ Vote ได้
      if (message.payload.charAt(0) === '1') {
        setStateVoteGuest(true)
        getSharedToken(message.payload.substring(12))
        //active เมื่อ host สั่งเปิดให้ทำ Vote ลับ type 6
      } else if (message.payload.charAt(0) === '6') {
        const substrings = message.payload.split('*');
        if (substrings[1] === pexRTC.uuid) {
          setStateVoteGuest(true)
          getSharedToken(message.payload.substring(12).split('*')[0])
        }
        // ปิดโหวตสำหรับ โหวตลับ type 7
      } else if (message.payload.charAt(0) === '7') {
        if (message.payload.substring(2) === pexRTC.uuid) {
          setStateVoteGuest(false)
        }
        // ปิดโหวต type 2
      } else if (message.payload.charAt(0) === '2') {
        setStateVoteGuest(false)
      }
      //Announce
    } else if (message.payload.charAt(0) === '0') {
      setTypeMessages(message.payload.charAt(0))
      setMessages(message.payload.substring(2))
      //Status Mic
    } else if (message.payload.charAt(0) === '4') {
      getAllMemMic()
    }
  }

  //Get Data Vote
  async function getData(uuidVote, jwt) {
    try {
      const response = await axios({
        method: "get",
        url: process.env.REACT_APP_HOST_VOTE_SYSTEM + '/api/v1/voting-topic/list/byid?id=' + uuidVote,
        headers: { Authorization: `Bearer ${jwt}` },
      });
      var checkSecret = false
      if (response.data.message === "OK") {
        if (response.data.result.topic_type === "Private") {
          for (let i = 0; i < response.data.result.voting_users_data.length; i++) {
            if (one_id === response.data.result.voting_users_data[i].user_id) {
              checkSecret = true
              break;
            }
          }
          if (checkSecret === true) {
            setDataVote(response.data.result)
            setUuidVote(uuidVote)
            setJwtOneChat(jwt)
            checkSecret = false
          } else {
            setStateCheckAuthority(true)
          }
        } else if (response.data.result.topic_type === "OneConference") {
          if (typeLoginVote.current === "Login") {
            getJWTOneChatGuest(uuidVote)
          } else {
            setStateCheckAuthority(false)
            setDataVote(response.data.result)
            setUuidVote(uuidVote)
            setJwtOneChat(jwt)
          }
        } else if (response.data.result.topic_type === "OneConference_Private") {
          if (typeLoginVote.current === "Login") {
            getJWTOneChatGuest(uuidVote)
          } else {
            setStateCheckAuthority(false)
            setDataVote(response.data.result)
            setUuidVote(uuidVote)
            setJwtOneChat(jwt)
          }
        } else {
          setStateCheckAuthority(false)
          setDataVote(response.data.result)
          setUuidVote(uuidVote)
          setJwtOneChat(jwt)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  async function getSharedToken(uuidVote) {
    await axios.get(process.env.REACT_APP_ONEID + '/api/v2/service/shared-token',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then((result) => {
        const data = result.data.data.shared_token
        getJWTOneChat(uuidVote, data)
      })
      .catch((err) => {
        getJWTOneChatGuest(uuidVote)
      })
  }
  async function getJWTOneChatGuest(uuidVote) {
    try {
      const response = await axios({
        method: "post",
        url: process.env.REACT_APP_HOST_VOTE_SYSTEM + '/api/v1/login/user/blockchain_scoring/guest',
        data: {
          name: participantName.substring(0, participantName.indexOf(" ")),
          surname: participantName.substring(participantName.indexOf(" ") + 1),
          topic_id: uuidVote,
          user_id: pexRTC.uuid
        }
      });
      if (response.data.message === "OK") {
        typeLoginVote.current = 'Guest'
        getData(uuidVote, response.data.result.jwt)
        setStateCheckGuestLogin(false)
      }
    } catch (error) {
      console.log(error)
      setStateCheckGuestLogin(true)
    }
  }
  async function getJWTOneChat(uuidVote, data) {
    try {
      const response = await axios({
        method: "get",
        url: process.env.REACT_APP_HOST_VOTE_SYSTEM + '/api/v1/login/user/blockchain_scoring/shared-token?shared_token=' + data
      });
      if (response.data.message === "OK") {
        // setJwtOneChat(response.data.result.jwt)
        typeLoginVote.current = 'Login'
        getData(uuidVote, response.data.result.jwt)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // state Speaker Participant
  function callActiveSpeakers(stage) {
    setStateActiveSpeakers(stage[0]?.vad)
    setCheckParticipant(stage[0]?.participant_uuid)
  }

  //disconnectParticipant By Host
  function disconnectParticipant(uuid) {
    pexRTC.disconnectParticipant(uuid)
  }

  function disconnectAllParticipant() {
    setOpenDialogPartiForMobile(false);
    Swal.fire({
      title: 'บังคับทุกคนให้ออกจากห้อง',
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        pexRTC.disconnectAll();
      }
    });
  }

  //MutePresentation Guest By Host
  function mutePresentationParticipant(uuid, setting) {
    pexRTC.setParticipantRxPresentation(uuid, setting)
  }

  //Mute audio participant by HOST
  function muteAudioParticipant(uuid, setting) {
    pexRTC.setParticipantMute(uuid, setting)
  }

  //Mute audio all participant by HOST
  function muteAudioAllParticipant(setting) {
    pexRTC.setMuteAllGuests(setting)
  }

  //Mute Video participant by HOST
  function muteVideoParticipant(uuid, state) {
    if (state) {
      pexRTC.videoMuted(uuid)
    } else {
      pexRTC.videoUnmuted(uuid)
    }
  }

  //Clear Buzz by HOST
  function muteBuzzParticipant(uuid) {
    pexRTC.clearBuzz(uuid)
  }

  //Clear All Buzz by HOST
  function clearAllBuzzParticipant() {
    pexRTC.clearAllBuzz()
  }

  //set role by Host
  function setRole(uuid, setting) {
    pexRTC.setRole(uuid, setting)
  }

  //setSpotlight
  function setSpotlight(uuid, setting) {
    pexRTC.setParticipantSpotlight(uuid, setting)
  }

  function requestToken(uuid) {
    // console.log('refresh token', pexRTC.token)
    console.log('uuid', pexRTC.uuid)
    // console.log('meetID', meetID)
    // console.log(guestLink);
    // console.log(participantName.substring(participantName.indexOf(" ") + 1));
    // console.log(participantName.split(" ")[1])
    // console.log('version', pexRTC.version)
    const text = '5|uuid|asdasd|asdasd|asdsada|3'
    console.log(text.substring(4));
  }

  //Find Participants
  const handleFindParti = (event) => {
    setFindParticipants(event.target.value)
  };

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

  return (
    <Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            overflow: 'hidden'
          },
        }}
        variant="persistent"
        anchor="left"
        open={openMessages}
      >
        {/* Headder */}
        {valueIndexOfDrawer === 0 &&
          <DrawerHeader>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={valueIndexOfDrawer}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={valueIndexOfDrawer} index={0} dir={theme.direction} sx={{ height: "100%", border: "1px solid blue" }}>
                Participants
              </TabPanel>
              <TabPanel value={valueIndexOfDrawer} index={1} dir={theme.direction} sx={{ height: "100%", border: "1px solid blue" }}>
                Chat
              </TabPanel>
            </SwipeableViews>
            <IconButton sx={{ right: 20, position: 'absolute' }} onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
        }
        {valueIndexOfDrawer === 1 &&
          <DrawerHeader1>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={valueIndexOfDrawer}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={valueIndexOfDrawer} index={0} dir={theme.direction} sx={{ height: "100%", border: "1px solid blue" }}>
                Participants
              </TabPanel>
              {/* <TabPanel value={valueIndexOfDrawer} index={1} dir={theme.direction} sx={{ height: "100%", border: "1px solid blue" }}>
                Chat
              </TabPanel> */}
            </SwipeableViews>
            <IconButton sx={{ right: 0, position: 'absolute' }} onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader1>
        }

        <TabPanel value={valueIndexOfDrawer} index={0} style={{ overflow: "auto" }}>
          <Box sx={{ overflow: 'auto' }} >
            <Divider />

            {/* ประกาศ */}
            {typeMessages !== '3' &&
              <Box>
                {typeMessages === '0' &&
                  <ContentWrapper sx={{ mx: 2, my: 2, px: 1 }}>
                    <Box>
                      <CampaignIcon sx={{ mx: 1, mt: 1 }} />
                      ประกาศ :
                    </Box>
                    <TextWrapper sx={{ mx: 1, pb: 1 }}>
                      {Messages}
                    </TextWrapper>
                  </ContentWrapper>
                }
                <Divider />
              </Box>
            }

            {/* ฟังก์ชั่น Buzz */}
            {buzzState?.map((name, i) => (
              <Box key={i}>
                <PopupState variant="popover" popupId="demo-popup-menu">
                  {(popupState) => (
                    <React.Fragment>
                      <MenuItem {...bindTrigger(popupState)} divider sx={{ justifyContent: 'space-between' }}>
                        <ThemeProvider theme={THEME}>
                          <LongText content={name.display_name} limit={18} />
                        </ThemeProvider>
                        <Box sx={{ pl: 1 }}>

                          <Tooltip title="เอามือลง">
                            <IconButton color="default" sx={{ mx: 0 }} aria-label="presentation">
                              <PanToolIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>

                          {/* ฟังก์ชั่นของ Presentation */}
                          {name.is_presenting === "YES" &&
                            <Tooltip title="presentation">
                              <IconButton color="default" sx={{ mx: 0 }} aria-label="presentation">
                                <MonitorIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Tooltip>
                          }

                          {/* ฟังก์ชั่นของ Audio */}
                          {checkParticipant === name.uuid && stateActiveSpeakers === 100 && name.is_muted === "NO" &&
                            <Tooltip title="Active Microphone">
                              <IconButton color="error" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                <MicIcon sx={{ fontSize: 20 }} className={ButtonCSS.blob} />
                              </IconButton>
                            </Tooltip>
                          }
                          {checkParticipant === name.uuid && stateActiveSpeakers === 0 && name.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'On' &&
                            <Tooltip title="Microphone">
                              <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                <MicIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Tooltip>
                          }
                          {checkParticipant === name.uuid && stateActiveSpeakers === 0 && name.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'Off' &&
                            <Tooltip title="Mute">
                              <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                <MicOffIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Tooltip>
                          }
                          {checkParticipant !== name.uuid && name?.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'On' &&
                            <Tooltip title="Microphone">
                              <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                <MicIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Tooltip>
                          }
                          {checkParticipant !== name.uuid && name?.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'Off' &&
                            <Tooltip title="Mute">
                              <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                <MicOffIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Tooltip>
                          }
                          {name.is_muted === "YES" &&
                            <Tooltip title="Mute by HOST">
                              <IconButton color="default" sx={{ mx: 0 }} aria-label="MuteMucrophone">
                                <Badge color="error" badgeContent={<CloseIcon sx={{ fontSize: 9 }} />}>
                                  <MicIcon sx={{ fontSize: 20 }} />
                                </Badge>
                              </IconButton>
                            </Tooltip>
                          }

                          {/* ฟังก์ชั่นของ Video */}
                          {name.is_video_call === 'YES' && name.is_video_muted &&
                            <Tooltip title="Close Camera">
                              <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera">
                                <VideocamOffIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Tooltip>
                          }
                          {name.is_video_call === 'YES' && !name.is_video_muted &&
                            <Tooltip title="Camera">
                              <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera">
                                <VideocamIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Tooltip>
                          }

                        </Box>
                      </MenuItem>
                      {pexRTC.role === 'HOST' &&
                        <Menu {...bindMenu(popupState)}>
                          <MenuItem onClick={() => muteBuzzParticipant(name.uuid)}><PanToolIcon sx={{ mr: 1 }} />
                            <ThemeProvider theme={BOLD}>
                              <Typography>เอามือลง</Typography>
                            </ThemeProvider>
                          </MenuItem>
                          <MenuItem onClick={() => clearAllBuzzParticipant()}><PanToolIcon color="error" sx={{ mr: 1 }} />
                            <ThemeProvider theme={BOLD}>
                              <Typography>เอามือลงทั้งหมด</Typography>
                            </ThemeProvider>
                          </MenuItem>
                          {name.is_muted === "NO" &&
                            <MenuItem onClick={() => muteAudioParticipant(name.uuid, true)}><MicIcon sx={{ mr: 1 }} />
                              <ThemeProvider theme={BOLD}>
                                <Typography>บังคับปิดไมค์</Typography>
                              </ThemeProvider>
                            </MenuItem>
                          }
                          {name.is_muted === "YES" &&
                            <MenuItem onClick={() => muteAudioParticipant(name.uuid, false)}><MicOffIcon sx={{ mr: 1 }} />
                              <ThemeProvider theme={BOLD}>
                                <Typography>ยกเลิกปิดไมค์</Typography>
                              </ThemeProvider>
                            </MenuItem>
                          }
                          {name.is_video_muted === false &&
                            <MenuItem onClick={() => muteVideoParticipant(name.uuid, true)}><VideocamIcon sx={{ mr: 1 }} />
                              <ThemeProvider theme={BOLD}>
                                <Typography>บังคับปิดกล้อง</Typography>
                              </ThemeProvider>
                            </MenuItem>
                          }
                          {conferenceUpdate?.guests_muted === false &&
                            <MenuItem onClick={() => muteAudioAllParticipant(true)}><MicIcon color="error" sx={{ mr: 1 }} />
                              <ThemeProvider theme={BOLD}>
                                <Typography>ปิดไมค์ทุกคน</Typography>
                              </ThemeProvider>
                            </MenuItem>
                          }
                          {conferenceUpdate?.guests_muted === true &&
                            <MenuItem onClick={() => muteAudioAllParticipant(false)}><MicOffIcon color="error" sx={{ mr: 1 }} />
                              <ThemeProvider theme={BOLD}>
                                <Typography>ยกเลิกปิดไมค์ทุกคน</Typography>
                              </ThemeProvider>
                            </MenuItem>
                          }
                          {name.spotlight === 0 ? (
                            <MenuItem onClick={() => setSpotlight(name?.uuid, true)}><RecordVoiceOverIcon sx={{ mr: 1 }} />
                              <ThemeProvider theme={BOLD}>
                                <Typography>สปอร์ตไลท์</Typography>
                              </ThemeProvider>
                            </MenuItem>
                          ) : (
                            <MenuItem onClick={() => setSpotlight(name?.uuid, false)}><RecordVoiceOverIcon color="error" sx={{ mr: 1 }} />
                              <ThemeProvider theme={BOLD}>
                                <Typography>ยกเลิกสปอร์ตไลท์</Typography>
                              </ThemeProvider>
                            </MenuItem>
                          )}
                          {name.role === "guest" &&
                            <MenuItem onClick={() => setRole(name?.uuid, 'chair')}><KeyIcon sx={{ mr: 1 }} />
                              <ThemeProvider theme={BOLD}>
                                <Typography>มอบสิทธิ์โฮสต์</Typography>
                              </ThemeProvider>
                            </MenuItem>
                          }
                          {name.role === "chair" && checkRole === "HOST" && pexRTC.uuid !== name.uuid &&
                            <MenuItem onClick={() => setRole(name?.uuid, 'guest')}><KeyOffIcon sx={{ mr: 1 }} />
                              <ThemeProvider theme={BOLD}>
                                <Typography>ถอนสิทธิ์โฮสต์</Typography>
                              </ThemeProvider>
                            </MenuItem>
                          }
                          {name?.uuid !== pexRTC.uuid &&
                            <MenuItem onClick={() => disconnectParticipant(name?.uuid)}><CallEndIcon sx={{ mr: 1 }} />
                              <ThemeProvider theme={BOLD}>
                                <Typography>บังคับออกจากห้อง</Typography>
                              </ThemeProvider>
                            </MenuItem>
                          }
                          {/* <MenuItem onClick={() => disconnectAllParticipant()}><PhoneDisabledIcon color="error" sx={{ mr: 1 }} />
                              <ThemeProvider theme={BOLD}>
                                <Typography>บังคับทุกคนออกจากห้อง</Typography>
                              </ThemeProvider>
                            </MenuItem> */}
                        </Menu>
                      }
                    </React.Fragment>
                  )}
                </PopupState>
              </Box>
            ))}

            {/* ผู้เข้าร่วมประชุม */}
            {findParticipants !== '' ? (
              <div>
                {listParticipants?.filter((paticipant) => paticipant.display_name.toLowerCase().includes(findParticipants.toLowerCase()))?.map((name, i) =>
                  <Box key={i}>
                    {name.buzz_time === 0 && name.call_direction !== "out" && name.service_type !== "waiting_room" &&
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <React.Fragment>
                            <MenuItem {...bindTrigger(popupState)} divider sx={{ justifyContent: 'space-between' }}>
                              <Box>
                                <ThemeProvider theme={THEME}>
                                  <LongText content={name.display_name} limit={18} />
                                </ThemeProvider>
                              </Box>

                              <Box sx={{ pl: 1 }}>

                                {/* สถานะ Host */}
                                {name.role === "chair" &&
                                  <Tooltip title="HOST">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="HOST">
                                      <FaCrown size={20} />
                                    </IconButton>
                                  </Tooltip>
                                }

                                {/* ฟังก์ชั่นของ Presentation */}
                                {name.is_presenting === "YES" &&
                                  <Tooltip title="presentation">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="presentation">
                                      <MonitorIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                  </Tooltip>
                                }

                                {/* ฟังก์ชั่นของ Audio */}
                                {checkParticipant === name.uuid && stateActiveSpeakers === 100 && name.is_muted === "NO" &&
                                  <Tooltip title="Active Microphone">
                                    <IconButton color="error" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                      <MicIcon sx={{ fontSize: 20 }} className={ButtonCSS.blob} />
                                    </IconButton>
                                  </Tooltip>
                                }
                                {checkParticipant === name.uuid && stateActiveSpeakers === 0 && name.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'On' &&
                                  <Tooltip title="Microphone">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                      <MicIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                  </Tooltip>
                                }
                                {checkParticipant === name.uuid && stateActiveSpeakers === 0 && name.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'Off' &&
                                  <Tooltip title="Mute">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                      <MicOffIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                  </Tooltip>
                                }
                                {checkParticipant !== name.uuid && name?.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'On' &&
                                  <Tooltip title="Microphone">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                      <MicIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                  </Tooltip>
                                }
                                {checkParticipant !== name.uuid && name?.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'Off' &&
                                  <Tooltip title="Mute">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                      <MicOffIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                  </Tooltip>
                                }
                                {name.is_muted === "YES" &&
                                  <Tooltip title="Mute by HOST">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="MuteMucrophone">
                                      <Badge color="error" badgeContent={<CloseIcon sx={{ fontSize: 9 }} />}>
                                        <MicIcon sx={{ fontSize: 20 }} />
                                      </Badge>
                                    </IconButton>
                                  </Tooltip>
                                }

                                {/* ฟังก์ชั่นของ Video */}
                                {name.is_video_call === 'YES' && name.is_video_muted &&
                                  <Tooltip title="Close Camera">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera">
                                      <VideocamOffIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                  </Tooltip>
                                }
                                {name.is_video_call === 'YES' && !name.is_video_muted &&
                                  <Tooltip title="Camera">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera">
                                      <VideocamIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                  </Tooltip>
                                }
                              </Box>

                            </MenuItem>
                            {pexRTC.role === 'HOST' &&
                              <Menu {...bindMenu(popupState)}>
                                {name.is_muted === "NO" &&
                                  <MenuItem onClick={() => muteAudioParticipant(name.uuid, true)}><MicIcon sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>บังคับปิดไมค์</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                }
                                {name.is_muted === "YES" &&
                                  <MenuItem onClick={() => muteAudioParticipant(name.uuid, false)}><MicOffIcon sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>ยกเลิกปิดไมค์</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                }
                                {name.is_video_muted === false &&
                                  <MenuItem onClick={() => muteVideoParticipant(name.uuid, true)}><VideocamIcon sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>บังคับปิดกล้อง</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                }
                                {/* {name.is_video_muted === true &&
                                <MenuItem onClick={() => muteVideoParticipant(name.uuid, false)}><VideocamOffIcon sx={{ mr: 1 }} /> เปิดกล้อง</MenuItem>
                              } */}
                                {/* {name.is_presenting === "YES" &&
                                <MenuItem onClick={() => mutePresentationParticipant(name.uuid, false)}>ปิดแชร์หน้าจอ</MenuItem>
                              } */}
                                {conferenceUpdate?.guests_muted === false &&
                                  <MenuItem onClick={() => muteAudioAllParticipant(true)}><MicIcon color="error" sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>ปิดไมค์ทุกคน</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                }
                                {conferenceUpdate?.guests_muted === true &&
                                  <MenuItem onClick={() => muteAudioAllParticipant(false)}><MicOffIcon color="error" sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>ยกเลิกปิดไมค์ทุกคน</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                }
                                {name.spotlight === 0 ? (
                                  <MenuItem onClick={() => setSpotlight(name?.uuid, true)}><RecordVoiceOverIcon sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>สปอร์ตไลท์</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                ) : (
                                  <MenuItem onClick={() => setSpotlight(name?.uuid, false)}><RecordVoiceOverIcon color="error" sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>ยกเลิกสปอร์ตไลท์</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                )}
                                {name.role === "guest" &&
                                  <MenuItem onClick={() => setRole(name?.uuid, 'chair')}><KeyIcon sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>มอบสิทธิ์โฮสต์</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                }
                                {name.role === "chair" && checkRole === "HOST" && pexRTC.uuid !== name.uuid &&
                                  <MenuItem onClick={() => setRole(name?.uuid, 'guest')}><KeyOffIcon sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>ถอนสิทธิ์โฮสต์</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                }
                                {/* <MenuItem onClick={() => requestToken()}><KeyIcon sx={{ mr: 1 }} /> ทดสอบการขอ token</MenuItem> */}
                                {name?.uuid !== pexRTC.uuid &&
                                  <MenuItem onClick={() => disconnectParticipant(name?.uuid)}><CallEndIcon sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>บังคับออกจากห้อง</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                }
                                {/* <MenuItem onClick={() => disconnectAllParticipant()}><PhoneDisabledIcon color="error" sx={{ mr: 1 }} />
                                  <ThemeProvider theme={BOLD}>
                                    <Typography>บังคับทุกคนออกจากห้อง</Typography>
                                  </ThemeProvider>
                                </MenuItem> */}
                              </Menu>
                            }
                          </React.Fragment>
                        )}
                      </PopupState>
                    }
                  </Box>
                )}
              </div>
            ) : (
              <div>
                {listParticipants?.map((name, i) => (
                  <Box key={i}>
                    {name.buzz_time === 0 && name.call_direction !== "out" && name.service_type !== "waiting_room" &&
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <React.Fragment>
                            <MenuItem {...bindTrigger(popupState)} divider sx={{ justifyContent: 'space-between' }}>
                              <Box>
                                <ThemeProvider theme={THEME}>
                                  <LongText content={name.display_name} limit={18} />
                                </ThemeProvider>
                              </Box>

                              <Box sx={{ pl: 1 }}>

                                {/* สถานะ Host */}
                                {name.role === "chair" &&
                                  <Tooltip title="HOST">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="HOST">
                                      <FaCrown size={20} />
                                    </IconButton>
                                  </Tooltip>
                                }

                                {/* ฟังก์ชั่นของ Presentation */}
                                {name.is_presenting === "YES" &&
                                  <Tooltip title="presentation">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="presentation">
                                      <MonitorIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                  </Tooltip>
                                }

                                {/* ฟังก์ชั่นของ Audio */}
                                {checkParticipant === name.uuid && stateActiveSpeakers === 100 && name.is_muted === "NO" &&
                                  <Tooltip title="Active Microphone">
                                    <IconButton color="error" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                      <MicIcon sx={{ fontSize: 20 }} className={ButtonCSS.blob} />
                                    </IconButton>
                                  </Tooltip>
                                }
                                {checkParticipant === name.uuid && stateActiveSpeakers === 0 && name.is_muted === "NO" && stateMic?.find(user => user?.uid === name?.uuid)?.status === 'On' &&
                                  <Tooltip title="Microphone">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                      <MicIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                  </Tooltip>
                                }
                                {checkParticipant === name.uuid && stateActiveSpeakers === 0 && name.is_muted === "NO" && stateMic?.find(user => user?.uid === name?.uuid)?.status === 'Off' &&
                                  <Tooltip title="Mute">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                      <MicOffIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                  </Tooltip>
                                }
                                {checkParticipant !== name.uuid && name?.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'On' &&
                                  <Tooltip title="Microphone">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                      <MicIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                  </Tooltip>
                                }
                                {checkParticipant !== name.uuid && name?.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'Off' &&
                                  <Tooltip title="Mute">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                      <MicOffIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                  </Tooltip>
                                }
                                {name.is_muted === "YES" &&
                                  <Tooltip title="Mute by HOST">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="MuteMucrophone">
                                      <Badge color="error" badgeContent={<CloseIcon sx={{ fontSize: 9 }} />}>
                                        <MicIcon sx={{ fontSize: 20 }} />
                                      </Badge>
                                    </IconButton>
                                  </Tooltip>
                                }

                                {/* ฟังก์ชั่นของ Video */}
                                {name.is_video_call === 'YES' && name.is_video_muted &&
                                  <Tooltip title="Close Camera">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera">
                                      <VideocamOffIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                  </Tooltip>
                                }
                                {name.is_video_call === 'YES' && !name.is_video_muted &&
                                  <Tooltip title="Camera">
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera">
                                      <VideocamIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                  </Tooltip>
                                }

                              </Box>

                            </MenuItem>
                            {pexRTC.role === 'HOST' &&
                              <Menu {...bindMenu(popupState)}>
                                {name.is_muted === "NO" &&
                                  <MenuItem onClick={() => muteAudioParticipant(name.uuid, true)}><MicIcon sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>บังคับปิดไมค์</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                }
                                {name.is_muted === "YES" &&
                                  <MenuItem onClick={() => muteAudioParticipant(name.uuid, false)}><MicOffIcon sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>ยกเลิกปิดไมค์</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                }
                                {name.is_video_muted === false &&
                                  <MenuItem onClick={() => muteVideoParticipant(name.uuid, true)}><VideocamIcon sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>บังคับปิดกล้อง</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                }
                                {/* {name.is_video_muted === true &&
                                  <MenuItem onClick={() => muteVideoParticipant(name.uuid, false)}><VideocamOffIcon sx={{ mr: 1 }} /> เปิดกล้อง</MenuItem>
                                } */}
                                {/* {name.is_presenting === "YES" &&
                                  <MenuItem onClick={() => mutePresentationParticipant(name.uuid, false)}>ปิดแชร์หน้าจอ</MenuItem>
                                } */}
                                {conferenceUpdate?.guests_muted === false &&
                                  <MenuItem onClick={() => muteAudioAllParticipant(true)}><MicIcon color="error" sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>ปิดไมค์ทุกคน</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                }
                                {conferenceUpdate?.guests_muted === true &&
                                  <MenuItem onClick={() => muteAudioAllParticipant(false)}><MicOffIcon color="error" sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>ยกเลิกปิดไมค์ทุกคน</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                }
                                {name.spotlight === 0 ? (
                                  <MenuItem onClick={() => setSpotlight(name?.uuid, true)}><RecordVoiceOverIcon sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>สปอร์ตไลท์</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                ) : (
                                  <MenuItem onClick={() => setSpotlight(name?.uuid, false)}><RecordVoiceOverIcon color="error" sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>ยกเลิกสปอร์ตไลท์</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                )}
                                {name.role === "guest" &&
                                  <MenuItem onClick={() => setRole(name?.uuid, 'chair')}><KeyIcon sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>มอบสิทธิ์โฮสต์</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                }
                                {name.role === "chair" && checkRole === "HOST" && pexRTC.uuid !== name.uuid &&
                                  <MenuItem onClick={() => setRole(name?.uuid, 'guest')}><KeyOffIcon sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>ถอนสิทธิ์โฮสต์</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                }
                                {/* <MenuItem onClick={() => requestToken(name.uuid)}><KeyIcon sx={{ mr: 1 }} /> ทดสอบการขอ token</MenuItem> */}
                                {name?.uuid !== pexRTC.uuid &&
                                  <MenuItem onClick={() => disconnectParticipant(name?.uuid)}><CallEndIcon sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>บังคับออกจากห้อง</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                }
                                {/* <MenuItem onClick={() => disconnectAllParticipant()}><PhoneDisabledIcon color="error" sx={{ mr: 1 }} />
                                  <ThemeProvider theme={BOLD}>
                                    <Typography>บังคับทุกคนออกจากห้อง</Typography>
                                  </ThemeProvider>
                                </MenuItem> */}
                              </Menu>
                            }
                          </React.Fragment>
                        )}
                      </PopupState>
                    }
                  </Box>
                ))}
              </div>
            )}

          </Box>
        </TabPanel>

        {valueIndexOfDrawer === 0 &&
          <Box sx={{ pb: '44px' }} />
        }

        <TabPanel value={valueIndexOfDrawer} index={0} style={{ position: 'absolute', bottom: 0, width: 'inherit' }} >
          {/* find Participants */}
          {valueIndexOfDrawer === 0 &&
            <InputChatBox sx={{ boxShadow: 5 }}>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Participants..."
                inputProps={{ 'aria-label': 'Search Participants...' }}
                value={findParticipants}
                onChange={handleFindParti}
              />
              <Divider sx={{ height: 30, m: 0.5 }} orientation="vertical" />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </InputChatBox>
          }
        </TabPanel>

        {/* ฟังก์ชั่น Chat */}
        <TabPanel value={valueIndexOfDrawer} index={1} style={{ overflow: "hidden" }}>
          <Box sx={{ pb: '57px' }} />
          <Box sx={{ width: "100%", height: "90vh", my: 1 }}>
            <iframe width="100%" height="100%" src={`${process.env.REACT_APP_HOST_ONECHAT}/chat-plugin/authen?room_id=${room_id}&authen_token=${authen_token}&refresh_token=${refresh_token}`} frameBorder="0"></iframe>
          </Box>
        </TabPanel>

      </Drawer>

      {/* DialogParticipantsForMobile */}
      <div>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openDialogPartiForMobile}
          fullScreen={fullScreen}
        >
          <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
            Participants
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Box sx={{ overflow: 'auto' }} >
              <Divider />

              {/* ประกาศ */}
              {typeMessages !== '3' &&
                <Box>
                  {typeMessages === '0' &&
                    <ContentWrapper sx={{ mx: 2, my: 2, px: 1 }}>
                      <Box>
                        <CampaignIcon sx={{ mx: 1, mt: 1 }} />
                        ประกาศ :
                      </Box>
                      <TextWrapper sx={{ mx: 1, pb: 1 }}>
                        {Messages}
                      </TextWrapper>
                    </ContentWrapper>
                  }
                  <Divider />
                </Box>
              }

              {/* ฟังก์ชั่น Buzz */}
              {listParticipants?.map((name, i) => (
                <Box key={i}>
                  {name.buzz_time !== 0 &&
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <React.Fragment>
                          <MenuItem {...bindTrigger(popupState)} divider sx={{ justifyContent: 'space-between' }}>
                            <ThemeProvider theme={THEME}>
                              <LongText content={name.display_name} limit={18} />
                            </ThemeProvider>
                            <Box sx={{ pl: 1 }}>
                              <Tooltip title="เอามือลง">
                                <IconButton color="default" sx={{ mx: 0 }} aria-label="presentation">
                                  <PanToolIcon />
                                </IconButton>
                              </Tooltip>

                              {/* ฟังก์ชั่นของ Presentation */}
                              {name.is_presenting === "YES" &&
                                <Tooltip title="presentation">
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="presentation">
                                    <MonitorIcon />
                                  </IconButton>
                                </Tooltip>
                              }

                              {/* ฟังก์ชั่นของ Audio */}
                              {checkParticipant === name.uuid && stateActiveSpeakers === 100 && name.is_muted === "NO" &&
                                <Tooltip title="Active Microphone">
                                  <IconButton color="error" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                    <MicIcon className={ButtonCSS.blob} />
                                  </IconButton>
                                </Tooltip>
                              }
                              {checkParticipant === name.uuid && stateActiveSpeakers === 0 && name.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'On' &&
                                <Tooltip title="Microphone">
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                    <MicIcon />
                                  </IconButton>
                                </Tooltip>
                              }
                              {checkParticipant === name.uuid && stateActiveSpeakers === 0 && name.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'Off' &&
                                <Tooltip title="Mute">
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                    <MicOffIcon />
                                  </IconButton>
                                </Tooltip>
                              }
                              {checkParticipant !== name.uuid && name?.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'On' &&
                                <Tooltip title="Microphone">
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                    <MicIcon />
                                  </IconButton>
                                </Tooltip>
                              }
                              {checkParticipant !== name.uuid && name?.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'Off' &&
                                <Tooltip title="Mute">
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                    <MicOffIcon />
                                  </IconButton>
                                </Tooltip>
                              }
                              {name.is_muted === "YES" &&
                                <Tooltip title="Mute by HOST">
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="MuteMucrophone">
                                    <Badge color="error" badgeContent={<CloseIcon sx={{ fontSize: 9 }} />}>
                                      <MicIcon />
                                    </Badge>
                                  </IconButton>
                                </Tooltip>
                              }

                              {/* ฟังก์ชั่นของ Video */}
                              {name.is_video_call === 'YES' && name.is_video_muted &&
                                <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera">
                                  {/* <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera" onClick={() => muteVideoParticipant(name.uuid, false)}> */}
                                  <VideocamOffIcon />
                                </IconButton>
                              }
                              {name.is_video_call === 'YES' && !name.is_video_muted &&
                                <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera">
                                  {/* <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera" onClick={() => muteVideoParticipant(name.uuid, true)}> */}
                                  <VideocamIcon />
                                </IconButton>
                              }
                            </Box>
                          </MenuItem>
                          {pexRTC.role === 'HOST' &&
                            <Menu {...bindMenu(popupState)}>
                              <MenuItem onClick={() => muteBuzzParticipant(name.uuid)}><PanToolIcon sx={{ mr: 1 }} />
                                <ThemeProvider theme={BOLD}>
                                  <Typography>เอามือลง</Typography>
                                </ThemeProvider>
                              </MenuItem>
                              <MenuItem onClick={() => clearAllBuzzParticipant()}><PanToolIcon color="error" sx={{ mr: 1 }} />
                                <ThemeProvider theme={BOLD}>
                                  <Typography>เอามือลงทั้งหมด</Typography>
                                </ThemeProvider>
                              </MenuItem>
                              {name.is_muted === "NO" &&
                                <MenuItem onClick={() => muteAudioParticipant(name.uuid, true)}><MicIcon sx={{ mr: 1 }} />
                                  <ThemeProvider theme={BOLD}>
                                    <Typography>บังคับปิดไมค์</Typography>
                                  </ThemeProvider>
                                </MenuItem>
                              }
                              {name.is_muted === "YES" &&
                                <MenuItem onClick={() => muteAudioParticipant(name.uuid, false)}><MicOffIcon sx={{ mr: 1 }} />
                                  <ThemeProvider theme={BOLD}>
                                    <Typography>ยกเลิกปิดไมค์</Typography>
                                  </ThemeProvider>
                                </MenuItem>
                              }
                              {name.is_video_muted === false &&
                                <MenuItem onClick={() => muteVideoParticipant(name.uuid, true)}><VideocamIcon sx={{ mr: 1 }} />
                                  <ThemeProvider theme={BOLD}>
                                    <Typography>บังคับปิดกล้อง</Typography>
                                  </ThemeProvider>
                                </MenuItem>
                              }
                              {conferenceUpdate?.guests_muted === false &&
                                <MenuItem onClick={() => muteAudioAllParticipant(true)}><MicIcon color="error" sx={{ mr: 1 }} />
                                  <ThemeProvider theme={BOLD}>
                                    <Typography>ปิดไมค์ทุกคน</Typography>
                                  </ThemeProvider>
                                </MenuItem>
                              }
                              {conferenceUpdate?.guests_muted === true &&
                                <MenuItem onClick={() => muteAudioAllParticipant(false)}><MicOffIcon color="error" sx={{ mr: 1 }} />
                                  <ThemeProvider theme={BOLD}>
                                    <Typography>ยกเลิกปิดไมค์ทุกคน</Typography>
                                  </ThemeProvider>
                                </MenuItem>
                              }
                              {name.spotlight === 0 ? (
                                <MenuItem onClick={() => setSpotlight(name?.uuid, true)}><RecordVoiceOverIcon sx={{ mr: 1 }} />
                                  <ThemeProvider theme={BOLD}>
                                    <Typography>สปอร์ตไลท์</Typography>
                                  </ThemeProvider>
                                </MenuItem>
                              ) : (
                                <MenuItem onClick={() => setSpotlight(name?.uuid, false)}><RecordVoiceOverIcon color="error" sx={{ mr: 1 }} />
                                  <ThemeProvider theme={BOLD}>
                                    <Typography>ยกเลิกสปอร์ตไลท์</Typography>
                                  </ThemeProvider>
                                </MenuItem>
                              )}
                              {name.role === "guest" &&
                                <MenuItem onClick={() => setRole(name?.uuid, 'chair')}><KeyIcon sx={{ mr: 1 }} />
                                  <ThemeProvider theme={BOLD}>
                                    <Typography>มอบสิทธิ์โฮสต์</Typography>
                                  </ThemeProvider>
                                </MenuItem>
                              }
                              {name.role === "chair" && checkRole === "HOST" && pexRTC.uuid !== name.uuid &&
                                <MenuItem onClick={() => setRole(name?.uuid, 'guest')}><KeyOffIcon sx={{ mr: 1 }} />
                                  <ThemeProvider theme={BOLD}>
                                    <Typography>ถอนสิทธิ์โฮสต์</Typography>
                                  </ThemeProvider>
                                </MenuItem>
                              }
                              {name?.uuid !== pexRTC.uuid &&
                                <MenuItem onClick={() => disconnectParticipant(name?.uuid)}><CallEndIcon sx={{ mr: 1 }} />
                                  <ThemeProvider theme={BOLD}>
                                    <Typography>บังคับออกจากห้อง</Typography>
                                  </ThemeProvider>
                                </MenuItem>
                              }
                              {/* <MenuItem onClick={() => disconnectAllParticipant()}><PhoneDisabledIcon color="error" sx={{ mr: 1 }} />
                                <ThemeProvider theme={BOLD}>
                                  <Typography>บังคับทุกคนออกจากห้อง</Typography>
                                </ThemeProvider>
                              </MenuItem> */}
                            </Menu>
                          }
                        </React.Fragment>
                      )}
                    </PopupState>
                  }
                </Box>
              ))}

              {/* ผู้เข้าร่วมประชุม */}
              {findParticipants !== '' ? (
                <Box>
                  {listParticipants?.filter((paticipant) => paticipant.display_name.toLowerCase().includes(findParticipants.toLowerCase()))?.map((name, i) =>
                    <Box key={i}>
                      {name.buzz_time === 0 && name.call_direction !== "out" && name.service_type !== "waiting_room" &&
                        <PopupState variant="popover" popupId="demo-popup-menu">
                          {(popupState) => (
                            <React.Fragment>
                              <MenuItem {...bindTrigger(popupState)} divider sx={{ justifyContent: 'space-between' }}>
                                <Box>
                                  <ThemeProvider theme={THEME}>
                                    <LongText content={name.display_name} limit={18} />
                                  </ThemeProvider>
                                </Box>

                                <Box sx={{ pl: 1 }}>

                                  {/* สถานะ Host */}
                                  {name.role === "chair" &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="HOST">
                                      <FaCrown />
                                    </IconButton>
                                  }

                                  {/* ฟังก์ชั่นของ Presentation */}
                                  {name.is_presenting === "YES" &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="presentation">
                                      {/* <IconButton color="default" sx={{ mx: 0 }} aria-label="presentation" onClick={() => mutePresentationParticipant(name.uuid, false)}> */}
                                      <MonitorIcon />
                                    </IconButton>
                                  }

                                  {/* ฟังก์ชั่นของ Audio */}
                                  {checkParticipant === name.uuid && stateActiveSpeakers === 100 && name.is_muted === "NO" &&
                                    <IconButton color="error" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                      <MicIcon className={ButtonCSS.blob} />
                                    </IconButton>
                                  }
                                  {checkParticipant === name.uuid && stateActiveSpeakers === 0 && name.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'On' &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                      <MicIcon />
                                    </IconButton>
                                  }
                                  {checkParticipant === name.uuid && stateActiveSpeakers === 0 && name.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'Off' &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                      <MicOffIcon />
                                    </IconButton>
                                  }
                                  {checkParticipant !== name.uuid && name?.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'On' &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                      <MicIcon />
                                    </IconButton>
                                  }
                                  {checkParticipant !== name.uuid && name?.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'Off' &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                      <MicOffIcon />
                                    </IconButton>
                                  }
                                  {name.is_muted === "YES" &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="MuteMucrophone">
                                      <Badge color="error" badgeContent={<CloseIcon sx={{ fontSize: 9 }} />}>
                                        <MicIcon />
                                      </Badge>
                                    </IconButton>
                                  }

                                  {/* ฟังก์ชั่นของ Video */}
                                  {name.is_video_call === 'YES' && name.is_video_muted &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera">
                                      {/* <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera" onClick={() => muteVideoParticipant(name.uuid, false)}> */}
                                      <VideocamOffIcon />
                                    </IconButton>
                                  }
                                  {name.is_video_call === 'YES' && !name.is_video_muted &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera">
                                      {/* <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera" onClick={() => muteVideoParticipant(name.uuid, true)}> */}
                                      <VideocamIcon />
                                    </IconButton>
                                  }
                                </Box>

                              </MenuItem>
                              {pexRTC.role === 'HOST' &&
                                <Menu {...bindMenu(popupState)}>
                                  {name.is_muted === "NO" &&
                                    <MenuItem onClick={() => muteAudioParticipant(name.uuid, true)}><MicIcon sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>บังคับปิดไมค์</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  }
                                  {name.is_muted === "YES" &&
                                    <MenuItem onClick={() => muteAudioParticipant(name.uuid, false)}><MicOffIcon sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>ยกเลิกปิดไมค์</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  }
                                  {name.is_video_muted === false &&
                                    <MenuItem onClick={() => muteVideoParticipant(name.uuid, true)}><VideocamIcon sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>บังคับปิดกล้อง</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  }
                                  {/* {name.is_video_muted === true &&
                                  <MenuItem onClick={() => muteVideoParticipant(name.uuid, false)}><VideocamOffIcon sx={{ mr: 1 }} /> เปิดกล้อง</MenuItem>
                                } */}
                                  {/* {name.is_presenting === "YES" &&
                                  <MenuItem onClick={() => mutePresentationParticipant(name.uuid, false)}>ปิดแชร์หน้าจอ</MenuItem>
                                } */}
                                  {conferenceUpdate?.guests_muted === false &&
                                    <MenuItem onClick={() => muteAudioAllParticipant(true)}><MicIcon color="error" sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>ปิดไมค์ทุกคน</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  }
                                  {conferenceUpdate?.guests_muted === true &&
                                    <MenuItem onClick={() => muteAudioAllParticipant(false)}><MicOffIcon color="error" sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>ยกเลิกปิดไมค์ทุกคน</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  }
                                  {name.spotlight === 0 ? (
                                    <MenuItem onClick={() => setSpotlight(name?.uuid, true)}><RecordVoiceOverIcon sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>สปอร์ตไลท์</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  ) : (
                                    <MenuItem onClick={() => setSpotlight(name?.uuid, false)}><RecordVoiceOverIcon color="error" sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>ยกเลิกสปอร์ตไลท์</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  )}
                                  {name.role === "guest" &&
                                    <MenuItem onClick={() => setRole(name?.uuid, 'chair')}><KeyIcon sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>มอบสิทธิ์โฮสต์</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  }
                                  {name.role === "chair" && checkRole === "HOST" && pexRTC.uuid !== name.uuid &&
                                    <MenuItem onClick={() => setRole(name?.uuid, 'guest')}><KeyOffIcon sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>ถอนสิทธิ์โฮสต์</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  }
                                  {/* <MenuItem onClick={() => requestToken()}><KeyIcon sx={{ mr: 1 }} /> ทดสอบการขอ token</MenuItem> */}
                                  <MenuItem onClick={() => disconnectParticipant(name?.uuid)}><CallEndIcon sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>บังคับออกจากห้อง</Typography>
                                    </ThemeProvider>
                                  </MenuItem>
                                  {/* <MenuItem onClick={() => disconnectAllParticipant()}><PhoneDisabledIcon color="error" sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>บังคับทุกคนออกจากห้อง</Typography>
                                    </ThemeProvider>
                                  </MenuItem> */}
                                </Menu>
                              }
                            </React.Fragment>
                          )}
                        </PopupState>
                      }
                    </Box>
                  )}
                </Box>
              ) : (
                <Box>
                  {listParticipants?.map((name, i) => (
                    <Box key={i}>
                      {name.buzz_time === 0 && name.call_direction !== "out" && name.service_type !== "waiting_room" &&
                        <PopupState variant="popover" popupId="demo-popup-menu">
                          {(popupState) => (
                            <React.Fragment>
                              <MenuItem {...bindTrigger(popupState)} divider sx={{ justifyContent: 'space-between' }}>
                                <Box>
                                  <ThemeProvider theme={THEME}>
                                    <LongText content={name.display_name} limit={18} />
                                  </ThemeProvider>
                                </Box>

                                <Box sx={{ pl: 1 }}>

                                  {/* สถานะ Host */}
                                  {name.role === "chair" &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="HOST">
                                      <FaCrown />
                                    </IconButton>
                                  }

                                  {/* ฟังก์ชั่นของ Presentation */}
                                  {name.is_presenting === "YES" &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="presentation">
                                      <MonitorIcon />
                                    </IconButton>
                                  }

                                  {/* ฟังก์ชั่นของ Audio */}
                                  {checkParticipant === name.uuid && stateActiveSpeakers === 100 && name.is_muted === "NO" &&
                                    <IconButton color="error" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                      <MicIcon className={ButtonCSS.blob} />
                                    </IconButton>
                                  }
                                  {checkParticipant === name.uuid && stateActiveSpeakers === 0 && name.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'On' &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                      <MicIcon />
                                    </IconButton>
                                  }
                                  {checkParticipant === name.uuid && stateActiveSpeakers === 0 && name.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'Off' &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                      <MicOffIcon />
                                    </IconButton>
                                  }
                                  {checkParticipant !== name.uuid && name?.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'On' &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                      <MicIcon />
                                    </IconButton>
                                  }
                                  {checkParticipant !== name.uuid && name?.is_muted === "NO" && stateMic?.find(user => user?.uid === name.uuid)?.status === 'Off' &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                      <MicOffIcon />
                                    </IconButton>
                                  }
                                  {name.is_muted === "YES" &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="MuteMucrophone">
                                      <Badge color="error" badgeContent={<CloseIcon sx={{ fontSize: 9 }} />}>
                                        <MicIcon />
                                      </Badge>
                                    </IconButton>
                                  }

                                  {/* ฟังก์ชั่นของ Video */}
                                  {name.is_video_call === 'YES' && name.is_video_muted &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera">
                                      {/* <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera" onClick={() => muteVideoParticipant(name.uuid, false)}> */}
                                      <VideocamOffIcon />
                                    </IconButton>
                                  }
                                  {name.is_video_call === 'YES' && !name.is_video_muted &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera">
                                      {/* <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera" onClick={() => muteVideoParticipant(name.uuid, true)}> */}
                                      <VideocamIcon />
                                    </IconButton>
                                  }

                                </Box>

                              </MenuItem>
                              {pexRTC.role === 'HOST' &&
                                <Menu {...bindMenu(popupState)}>
                                  {name.is_muted === "NO" &&
                                    <MenuItem onClick={() => muteAudioParticipant(name.uuid, true)}><MicIcon sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>บังคับปิดไมค์</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  }
                                  {name.is_muted === "YES" &&
                                    <MenuItem onClick={() => muteAudioParticipant(name.uuid, false)}><MicOffIcon sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>ยกเลิกปิดไมค์</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  }
                                  {name.is_video_muted === false &&
                                    <MenuItem onClick={() => muteVideoParticipant(name.uuid, true)}><VideocamIcon sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>บังคับปิดกล้อง</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  }
                                  {/* {name.is_video_muted === true &&
                                  <MenuItem onClick={() => muteVideoParticipant(name.uuid, false)}><VideocamOffIcon sx={{ mr: 1 }} /> เปิดกล้อง</MenuItem>
                                } */}
                                  {/* {name.is_presenting === "YES" &&
                                  <MenuItem onClick={() => mutePresentationParticipant(name.uuid, false)}>ปิดแชร์หน้าจอ</MenuItem>
                                } */}
                                  {conferenceUpdate?.guests_muted === false &&
                                    <MenuItem onClick={() => muteAudioAllParticipant(true)}><MicIcon color="error" sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>ปิดไมค์ทุกคน</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  }
                                  {conferenceUpdate?.guests_muted === true &&
                                    <MenuItem onClick={() => muteAudioAllParticipant(false)}><MicOffIcon color="error" sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>ยกเลิกปิดไมค์ทุกคน</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  }
                                  {name.spotlight === 0 ? (
                                    <MenuItem onClick={() => setSpotlight(name?.uuid, true)}><RecordVoiceOverIcon sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>สปอร์ตไลท์</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  ) : (
                                    <MenuItem onClick={() => setSpotlight(name?.uuid, false)}><RecordVoiceOverIcon color="error" sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>ยกเลิกสปอร์ตไลท์</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  )}
                                  {name.role === "guest" &&
                                    <MenuItem onClick={() => setRole(name?.uuid, 'chair')}><KeyIcon sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>มอบสิทธิ์โฮสต์</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  }
                                  {name.role === "chair" && checkRole === "HOST" && pexRTC.uuid !== name.uuid &&
                                    <MenuItem onClick={() => setRole(name?.uuid, 'guest')}><KeyOffIcon sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>ถอนสิทธิ์โฮสต์</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  }
                                  {/* <MenuItem onClick={() => requestToken()}><KeyIcon sx={{ mr: 1 }} /> ทดสอบการขอ token</MenuItem> */}
                                  {name?.uuid !== pexRTC.uuid &&
                                    <MenuItem onClick={() => disconnectParticipant(name?.uuid)}><CallEndIcon sx={{ mr: 1 }} />
                                      <ThemeProvider theme={BOLD}>
                                        <Typography>บังคับออกจากห้อง</Typography>
                                      </ThemeProvider>
                                    </MenuItem>
                                  }
                                  {/* <MenuItem onClick={() => disconnectAllParticipant()}><PhoneDisabledIcon color="error" sx={{ mr: 1 }} />
                                    <ThemeProvider theme={BOLD}>
                                      <Typography>บังคับทุกคนออกจากห้อง</Typography>
                                    </ThemeProvider>
                                  </MenuItem> */}
                                </Menu>
                              }
                            </React.Fragment>
                          )}
                        </PopupState>
                      }
                    </Box>
                  ))}
                </Box>
              )}

            </Box>

          </DialogContent>
          <DialogActions sx={{ display: flexbox, justifyContent: 'space-between' }}>
            <InputChatBox sx={{ boxShadow: 5 }}>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Participants..."
                inputProps={{ 'aria-label': 'Search Participants...' }}
                value={findParticipants}
                onChange={handleFindParti}
              />
              <Divider sx={{ height: 30, m: 0.5 }} orientation="vertical" />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </InputChatBox>
          </DialogActions>
        </BootstrapDialog>
      </div>

      {/* Dialog Vote */}
      <DialogVote
        setOpenDialogVote={setOpenDialogVote}
        openDialogVote={openDialogVote}
        dataVote={dataVote}
        jwtOneChat={jwtOneChat}
        uuidVote={uuidVote}
      />

    </Box >
  );
}

export default DraWer;