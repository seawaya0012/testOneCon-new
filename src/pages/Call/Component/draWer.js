import React, { useEffect, useState } from 'react';
import axios from "axios";

//CSS
import '../Call.scss';
import ButtonCSS from '../CSS/zoom.module.scss';

//Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
  useMediaQuery
} from '@mui/material';

//Icon
import {
  faHand,
} from '@fortawesome/free-solid-svg-icons';
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
import PollIcon from '@mui/icons-material/Poll';
import KeyIcon from '@mui/icons-material/Key';
import KeyOffIcon from '@mui/icons-material/KeyOff';
import { FaCrown } from 'react-icons/fa';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { flexbox } from '@mui/system';

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

const InputChatBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  background: "#FFFFFF",
}))

function DraWer(props) {
  const { pexRTC, dialURI, openMessages, setOpenMessages, valueIndexOfDrawer, setValueIndexOfDrawer, countParticipants, setCountParticipants, listParticipants,
    setListParticipants, room_id, authen_token, refresh_token, checkRole, uuid, accessToken, stateVote, conferenceUpdate, setConferenceUpdate,
    openDialogPartiForMobile, setOpenDialogPartiForMobile } = props
  const [stateSpeakers, setStateSpeakers] = useState(null)
  const theme = useTheme();
  // const [conferenceUpdate, setConferenceUpdate] = useState(null) ย้ายไปประกาศบน app

  // ค้นหาผู้เข้าร่วมประชุม
  const [findParticipants, setFindParticipants] = useState('')

  //ประกาศ
  const [Messages, setMessages] = useState("")
  const [typeMessages, setTypeMessages] = useState("3")
  const [vote, setVote] = useState("")
  const [typeVote, setTypeVote] = useState("2")

  //state Active Speakers
  const [stateActiveSpeakers, setStateActiveSpeakers] = useState(null)
  const [checkParticipant, setCheckParticipant] = useState(null)

  // voteSystem
  const [countVoteSystem, setCountVoteSystem] = useState(0);

  const handleDrawerClose = () => {
    setOpenMessages(false);
  };

  const handleChangeIndex = (index) => {
    setValueIndexOfDrawer(index);
  };

  //Dialog
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const handleClose = () => {
    setOpenDialogPartiForMobile(false);
  };

  useEffect(() => {
    pexRTC.onStageUpdate = callActiveSpeakers;
    pexRTC.onRosterList = CallonRosterList;
    pexRTC.onConferenceUpdate = CallonConferenceUpdate;
    pexRTC.onChatMessage = ChatMessage;
    // pexRTC.onParticipantDelete = findMember;

    //set stateVote in useEffect for active stateVote in function CallonRosterList open Vote
  }, [stateVote]);

  //kick member in onechat by host
  // function findMember(participant) {
  //   console.log('findMember', authen_token)
  //   if (participant !== null) {
  //     axios.get(process.env.REACT_APP_HOST_ONECHAT + "/backend/api/v1/member/list",
  //       {
  //         headers: { Authorization: `Bearer ${authen_token}` }
  //       }).then((result) => {
  //         const data = result.data.data
  //         // console.log(data?.find(data => data?.member_id !== participant.uuid)?.id)
  //         deleteMember(data?.find(data => data?.member_id === participant.uuid)?.id)
  //       })
  //       .catch((err) => {
  //         console.log('result', err)
  //       })
  //   }
  // }

  // function deleteMember(id) {
  //   console.log(id)
  //   axios.delete(process.env.REACT_APP_HOST_ONECHAT + "/backend/api/v1/member/kick", {
  //     user_id: id
  //   },{
  //     headers: { Authorization: `Bearer ${authen_token}` }
  //   }).then((result) => {
  //     const data = result.data.data
  //     console.log('result', data)
  //   })
  //     .catch((err) => {
  //       console.log('result', err)
  //     })
  // }

  // List Participant
  function CallonRosterList(roster) {
    console.log(roster)
    setCountParticipants(roster.length)
    setListParticipants(roster)

    // update ให้คนที่เข้าที่หลัง สมารถเห็น Vote ได้่
    if (pexRTC.role === 'HOST' && roster.length > countVoteSystem) {
      if (stateVote === true) {
        pexRTC.sendChatMessage('1|&topic-id=' + vote)
      } else {
        pexRTC.sendChatMessage('2')
      }
      setCountVoteSystem(roster.length)
    } else {
      setCountVoteSystem(roster.length)
    }
  }

  // ConferenceUpdate
  function CallonConferenceUpdate(properties) {
    console.log(properties)
    setConferenceUpdate(properties)
  }

  //รับ Message จาก RTC มาแสดง
  function ChatMessage(message) {
    if (message.payload.charAt(0) === '1' || message.payload.charAt(0) === '2') {
      setTypeVote(message.payload.charAt(0))
      setVote(message.payload.substring(2))
    } else {
      setTypeMessages(message.payload.charAt(0))
      setMessages(message.payload.substring(2))
    }
  }

  // state Speaker Participant
  function callActiveSpeakers(stage) {
    setStateSpeakers(stage)
    setStateActiveSpeakers(stage[0]?.vad)
    setCheckParticipant(stage[0]?.participant_uuid)
  }

  //disconnectParticipant By Host
  function disconnectParticipant(uuid) {
    pexRTC.disconnectParticipant(uuid)
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

  function requestToken() {
    console.log('refresh token', pexRTC.token)
    console.log('uuid', pexRTC.uuid)
  }

  //open Vote System
  async function openVote() {
    await axios.get(process.env.REACT_APP_ONEID + '/api/v2/service/shared-token',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then((result) => {
        const data = result.data.data.shared_token
        const dataVote = vote
        console.log('data shared_token', data)
        window.open(process.env.REACT_APP_HOST_VOTE_SYSTEM + '/?shared-token=' + data + '' + dataVote, '_blank');
      })
      .catch((err) => {
        console.log('error', err)
        Swal.fire({
          title: "กรุณาล็อกอินและเปิดใช้งานระบบโหวตก่อนใช้งานระบบโหวต",
          text: "",
          icon: "error",
          showCancelButton: false,
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
      })
  }

  //ส่ง Message ไปยัง RTC
  const handleFindParti = (event) => {
    setFindParticipants(event.target.value)
  };

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
        <DrawerHeader>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={valueIndexOfDrawer}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={valueIndexOfDrawer} index={0} dir={theme.direction} sx={{ height: "100%", border: "1px solid blue" }}>
              Participants
            </TabPanel>
          </SwipeableViews>
          <IconButton sx={{ right: 0, position: 'absolute' }} onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <TabPanel value={valueIndexOfDrawer} index={0} style={{ overflow: "auto" }}>

          {/* find Participants */}
          <InputChatBox sx={{ boxShadow: 5, position: 'absolute', bottom: 0 }}>
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

          <Box sx={{ overflow: 'auto', pt: 8 }} >
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

            {/* โหวต */}
            {typeVote !== '2' &&
              <Box>
                {typeVote === '1' &&
                  <Box sx={{ mx: 2, my: 2, px: 1 }}>
                    <Button
                      sx={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', justifyItems: 'center' }}
                      fullWidth
                      onClick={() => openVote()}
                      color="primary"
                      endIcon={<PollIcon />
                      }>โหวต</Button>
                  </Box>
                }
                <Divider />
              </Box>
            }

            {/* ฟังก์ชั่น Buzz */}
            {listParticipants?.map((name, i) => (
              <Box key={i}>
                {name.buzz_time !== 0 &&
                  <MenuItem divider sx={{ justifyContent: 'space-between' }}>
                    <Typography>{name.display_name}</Typography>
                    <Tooltip title="เอามือลง">
                      <IconButton color="default" sx={{ mx: 3 }} aria-label="presentation" onClick={() => muteBuzzParticipant(name.uuid)}>
                        <PanToolIcon />
                      </IconButton>
                    </Tooltip>
                  </MenuItem>
                }
              </Box>
            ))}

            {/* ผู้เข้าร่วมประชุม */}
            {findParticipants !== '' ? (
              <Box>
                {listParticipants?.filter((paticipant) => paticipant.display_name.toLowerCase().includes(findParticipants.toLowerCase()))?.map((name, i) =>
                  <Box key={i}>
                    {name.buzz_time === 0 && name.protocol !== "rtmp" &&
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <React.Fragment>
                            <MenuItem {...bindTrigger(popupState)} divider sx={{ justifyContent: 'space-between' }}>
                              <Box>
                                <Typography>{name.display_name}</Typography>
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
                                {checkParticipant === name.uuid && stateActiveSpeakers === 0 && name.is_muted === "NO" &&
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                    <MicIcon />
                                  </IconButton>
                                }
                                {checkParticipant !== name.uuid && name?.is_muted === "NO" &&
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                    <MicIcon />
                                  </IconButton>
                                }
                                {name.is_muted === "YES" &&
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="MuteMucrophone">
                                    <MicOffIcon />
                                  </IconButton>
                                }

                                {/* ฟังก์ชั่นของ Video */}
                                {name.is_video_muted ? (
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera">
                                    {/* <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera" onClick={() => muteVideoParticipant(name.uuid, false)}> */}
                                    <VideocamOffIcon />
                                  </IconButton>
                                ) : (
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera">
                                    {/* <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera" onClick={() => muteVideoParticipant(name.uuid, true)}> */}
                                    <VideocamIcon />
                                  </IconButton>
                                )}
                              </Box>

                            </MenuItem>
                            {pexRTC.role === 'HOST' &&
                              <Menu {...bindMenu(popupState)}>
                                <MenuItem onClick={() => clearAllBuzzParticipant()}><PanToolIcon sx={{ mr: 1 }} />เอามือลงทั้งหมด</MenuItem>
                                {name.is_muted === "NO" &&
                                  <MenuItem onClick={() => muteAudioParticipant(name.uuid, true)}><MicIcon sx={{ mr: 1 }} /> ปิดไมค์</MenuItem>
                                }
                                {name.is_muted === "YES" &&
                                  <MenuItem onClick={() => muteAudioParticipant(name.uuid, false)}><MicOffIcon sx={{ mr: 1 }} /> เปิดไมค์</MenuItem>
                                }
                                {name.is_video_muted === false &&
                                  <MenuItem onClick={() => muteVideoParticipant(name.uuid, true)}><VideocamIcon sx={{ mr: 1 }} /> ปิดกล้อง</MenuItem>
                                }
                                {name.is_video_muted === true &&
                                  <MenuItem onClick={() => muteVideoParticipant(name.uuid, false)}><VideocamOffIcon sx={{ mr: 1 }} /> เปิดกล้อง</MenuItem>
                                }
                                {name.is_presenting === "YES" &&
                                  <MenuItem onClick={() => mutePresentationParticipant(name.uuid, false)}>ปิดแชร์หน้าจอ</MenuItem>
                                }
                                {conferenceUpdate?.guests_muted === false &&
                                  <MenuItem onClick={() => muteAudioAllParticipant(true)}><MicIcon color="error" sx={{ mr: 1 }} /> ปิดไมค์ทุกคน</MenuItem>
                                }
                                {conferenceUpdate?.guests_muted === true &&
                                  <MenuItem onClick={() => muteAudioAllParticipant(false)}><MicOffIcon color="error" sx={{ mr: 1 }} /> เปิดไมค์ทุกคน</MenuItem>
                                }
                                {/* <MenuItem onClick={() => setSpotlight(name?.uuid, true)}>Spotlight</MenuItem> */}
                                {name.role === "guest" &&
                                  <MenuItem onClick={() => setRole(name?.uuid, 'chair')}><KeyIcon sx={{ mr: 1 }} /> มอบสิทธิ์โฮสต์</MenuItem>
                                }
                                {name.role === "chair" && pexRTC.uuid !== name.uuid &&
                                  <MenuItem onClick={() => setRole(name?.uuid, 'guest')}><KeyOffIcon sx={{ mr: 1 }} /> ถอนสิทธิ์โฮสต์</MenuItem>
                                }
                                {/* <MenuItem onClick={() => requestToken()}><KeyIcon sx={{ mr: 1 }} /> ทดสอบการขอ token</MenuItem> */}
                                <MenuItem onClick={() => disconnectParticipant(name?.uuid)}><CallEndIcon sx={{ mr: 1 }} /> บังคับออกจากห้อง</MenuItem>
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
                    {name.buzz_time === 0 && name.protocol !== "rtmp" &&
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <React.Fragment>
                            <MenuItem {...bindTrigger(popupState)} divider sx={{ justifyContent: 'space-between' }}>
                              <Box>
                                <Typography>{name.display_name}</Typography>
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
                                {checkParticipant === name.uuid && stateActiveSpeakers === 0 && name.is_muted === "NO" &&
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                    <MicIcon />
                                  </IconButton>
                                }
                                {checkParticipant !== name.uuid && name?.is_muted === "NO" &&
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                    <MicIcon />
                                  </IconButton>
                                }
                                {name.is_muted === "YES" &&
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="MuteMucrophone">
                                    <MicOffIcon />
                                  </IconButton>
                                }
                                {/* {checkParticipant === name.uuid && stateActiveSpeakers === 100 ? (
                                  <IconButton color="error" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                    <MicIcon className={ButtonCSS.blob} />
                                  </IconButton>
                                ) : (
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                    <MicIcon />
                                  </IconButton>
                                )} */}

                                {/* ฟังก์ชั่นของ Video */}
                                {name.is_video_muted ? (
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera">
                                    {/* <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera" onClick={() => muteVideoParticipant(name.uuid, false)}> */}
                                    <VideocamOffIcon />
                                  </IconButton>
                                ) : (
                                  <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera">
                                    {/* <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera" onClick={() => muteVideoParticipant(name.uuid, true)}> */}
                                    <VideocamIcon />
                                  </IconButton>
                                )}
                              </Box>

                            </MenuItem>
                            {pexRTC.role === 'HOST' &&
                              <Menu {...bindMenu(popupState)}>
                                <MenuItem onClick={() => clearAllBuzzParticipant()}><PanToolIcon sx={{ mr: 1 }} />เอามือลงทั้งหมด</MenuItem>
                                {name.is_muted === "NO" &&
                                  <MenuItem onClick={() => muteAudioParticipant(name.uuid, true)}><MicIcon sx={{ mr: 1 }} /> ปิดไมค์</MenuItem>
                                }
                                {name.is_muted === "YES" &&
                                  <MenuItem onClick={() => muteAudioParticipant(name.uuid, false)}><MicOffIcon sx={{ mr: 1 }} /> เปิดไมค์</MenuItem>
                                }
                                {name.is_video_muted === false &&
                                  <MenuItem onClick={() => muteVideoParticipant(name.uuid, true)}><VideocamIcon sx={{ mr: 1 }} /> ปิดกล้อง</MenuItem>
                                }
                                {name.is_video_muted === true &&
                                  <MenuItem onClick={() => muteVideoParticipant(name.uuid, false)}><VideocamOffIcon sx={{ mr: 1 }} /> เปิดกล้อง</MenuItem>
                                }
                                {name.is_presenting === "YES" &&
                                  <MenuItem onClick={() => mutePresentationParticipant(name.uuid, false)}>ปิดแชร์หน้าจอ</MenuItem>
                                }
                                {conferenceUpdate?.guests_muted === false &&
                                  <MenuItem onClick={() => muteAudioAllParticipant(true)}><MicIcon color="error" sx={{ mr: 1 }} /> ปิดไมค์ทุกคน</MenuItem>
                                }
                                {conferenceUpdate?.guests_muted === true &&
                                  <MenuItem onClick={() => muteAudioAllParticipant(false)}><MicOffIcon color="error" sx={{ mr: 1 }} /> เปิดไมค์ทุกคน</MenuItem>
                                }
                                {/* <MenuItem onClick={() => setSpotlight(name?.uuid, true)}>Spotlight</MenuItem> */}
                                {name.role === "guest" &&
                                  <MenuItem onClick={() => setRole(name?.uuid, 'chair')}><KeyIcon sx={{ mr: 1 }} /> มอบสิทธิ์โฮสต์</MenuItem>
                                }
                                {name.role === "chair" && pexRTC.uuid !== name.uuid &&
                                  <MenuItem onClick={() => setRole(name?.uuid, 'guest')}><KeyOffIcon sx={{ mr: 1 }} /> ถอนสิทธิ์โฮสต์</MenuItem>
                                }
                                {/* <MenuItem onClick={() => requestToken()}><KeyIcon sx={{ mr: 1 }} /> ทดสอบการขอ token</MenuItem> */}
                                <MenuItem onClick={() => disconnectParticipant(name?.uuid)}><CallEndIcon sx={{ mr: 1 }} /> บังคับออกจากห้อง</MenuItem>
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
        </TabPanel>

        {/* ฟังก์ชั่น Chat */}
        <TabPanel value={valueIndexOfDrawer} index={1} style={{ overflow: "hidden" }}>
          <Box sx={{ width: "100%", height: "100vh" }}>
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

              {/* โหวต */}
              {typeVote !== '2' &&
                <Box>
                  {typeVote === '1' &&
                    <Box sx={{ mx: 2, my: 2, px: 1 }}>
                      <Button
                        sx={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', justifyItems: 'center' }}
                        fullWidth
                        onClick={() => openVote()}
                        color="primary"
                        endIcon={<PollIcon />
                        }>โหวต</Button>
                    </Box>
                  }
                  <Divider />
                </Box>
              }

              {/* ฟังก์ชั่น Buzz */}
              {listParticipants?.map((name, i) => (
                <Box key={i}>
                  {name.buzz_time !== 0 &&
                    <MenuItem divider sx={{ justifyContent: 'space-between' }}>
                      <Typography>{name.display_name}</Typography>
                      <Tooltip title="เอามือลง">
                        <IconButton color="default" sx={{ mx: 3 }} aria-label="presentation" onClick={() => muteBuzzParticipant(name.uuid)}>
                          <PanToolIcon />
                        </IconButton>
                      </Tooltip>
                    </MenuItem>
                  }
                </Box>
              ))}

              {/* ผู้เข้าร่วมประชุม */}
              {findParticipants !== '' ? (
                <Box>
                  {listParticipants?.filter((paticipant) => paticipant.display_name.toLowerCase().includes(findParticipants.toLowerCase()))?.map((name, i) =>
                    <Box key={i}>
                      {name.buzz_time === 0 && name.protocol !== "rtmp" &&
                        <PopupState variant="popover" popupId="demo-popup-menu">
                          {(popupState) => (
                            <React.Fragment>
                              <MenuItem {...bindTrigger(popupState)} divider sx={{ justifyContent: 'space-between' }}>
                                <Box>
                                  <Typography>{name.display_name}</Typography>
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
                                  {checkParticipant === name.uuid && stateActiveSpeakers === 0 && name.is_muted === "NO" &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                      <MicIcon />
                                    </IconButton>
                                  }
                                  {checkParticipant !== name.uuid && name?.is_muted === "NO" &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                      <MicIcon />
                                    </IconButton>
                                  }
                                  {name.is_muted === "YES" &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="MuteMucrophone">
                                      <MicOffIcon />
                                    </IconButton>
                                  }

                                  {/* ฟังก์ชั่นของ Video */}
                                  {name.is_video_muted ? (
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera">
                                      {/* <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera" onClick={() => muteVideoParticipant(name.uuid, false)}> */}
                                      <VideocamOffIcon />
                                    </IconButton>
                                  ) : (
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera">
                                      {/* <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera" onClick={() => muteVideoParticipant(name.uuid, true)}> */}
                                      <VideocamIcon />
                                    </IconButton>
                                  )}
                                </Box>

                              </MenuItem>
                              {pexRTC.role === 'HOST' &&
                                <Menu {...bindMenu(popupState)}>
                                  <MenuItem onClick={() => clearAllBuzzParticipant()}><PanToolIcon sx={{ mr: 1 }} />เอามือลงทั้งหมด</MenuItem>
                                  {name.is_muted === "NO" &&
                                    <MenuItem onClick={() => muteAudioParticipant(name.uuid, true)}><MicIcon sx={{ mr: 1 }} /> ปิดไมค์</MenuItem>
                                  }
                                  {name.is_muted === "YES" &&
                                    <MenuItem onClick={() => muteAudioParticipant(name.uuid, false)}><MicOffIcon sx={{ mr: 1 }} /> เปิดไมค์</MenuItem>
                                  }
                                  {name.is_video_muted === false &&
                                    <MenuItem onClick={() => muteVideoParticipant(name.uuid, true)}><VideocamIcon sx={{ mr: 1 }} /> ปิดกล้อง</MenuItem>
                                  }
                                  {name.is_video_muted === true &&
                                    <MenuItem onClick={() => muteVideoParticipant(name.uuid, false)}><VideocamOffIcon sx={{ mr: 1 }} /> เปิดกล้อง</MenuItem>
                                  }
                                  {name.is_presenting === "YES" &&
                                    <MenuItem onClick={() => mutePresentationParticipant(name.uuid, false)}>ปิดแชร์หน้าจอ</MenuItem>
                                  }
                                  {conferenceUpdate?.guests_muted === false &&
                                    <MenuItem onClick={() => muteAudioAllParticipant(true)}><MicIcon color="error" sx={{ mr: 1 }} /> ปิดไมค์ทุกคน</MenuItem>
                                  }
                                  {conferenceUpdate?.guests_muted === true &&
                                    <MenuItem onClick={() => muteAudioAllParticipant(false)}><MicOffIcon color="error" sx={{ mr: 1 }} /> เปิดไมค์ทุกคน</MenuItem>
                                  }
                                  {name.role === "guest" &&
                                    <MenuItem onClick={() => setRole(name?.uuid, 'chair')}><KeyIcon sx={{ mr: 1 }} /> มอบสิทธิ์โฮสต์</MenuItem>
                                  }
                                  {name.role === "chair" && pexRTC.uuid !== name.uuid &&
                                    <MenuItem onClick={() => setRole(name?.uuid, 'guest')}><KeyOffIcon sx={{ mr: 1 }} /> ถอนสิทธิ์โฮสต์</MenuItem>
                                  }
                                  <MenuItem onClick={() => disconnectParticipant(name?.uuid)}><CallEndIcon sx={{ mr: 1 }} /> บังคับออกจากห้อง</MenuItem>
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
                      {name.buzz_time === 0 && name.protocol !== "rtmp" &&
                        <PopupState variant="popover" popupId="demo-popup-menu">
                          {(popupState) => (
                            <React.Fragment>
                              <MenuItem {...bindTrigger(popupState)} divider sx={{ justifyContent: 'space-between' }}>
                                <Box>
                                  <Typography>{name.display_name}</Typography>
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
                                  {checkParticipant === name.uuid && stateActiveSpeakers === 0 && name.is_muted === "NO" &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone">
                                      <MicIcon />
                                    </IconButton>
                                  }
                                  {checkParticipant !== name.uuid && name?.is_muted === "NO" &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteMucrophone">
                                      <MicIcon />
                                    </IconButton>
                                  }
                                  {name.is_muted === "YES" &&
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="MuteMucrophone">
                                      <MicOffIcon />
                                    </IconButton>
                                  }

                                  {/* ฟังก์ชั่นของ Video */}
                                  {name.is_video_muted ? (
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera">
                                      {/* <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera" onClick={() => muteVideoParticipant(name.uuid, false)}> */}
                                      <VideocamOffIcon />
                                    </IconButton>
                                  ) : (
                                    <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera">
                                      {/* <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera" onClick={() => muteVideoParticipant(name.uuid, true)}> */}
                                      <VideocamIcon />
                                    </IconButton>
                                  )}
                                </Box>

                              </MenuItem>
                              {pexRTC.role === 'HOST' &&
                                <Menu {...bindMenu(popupState)}>
                                  <MenuItem onClick={() => clearAllBuzzParticipant()}><PanToolIcon sx={{ mr: 1 }} />เอามือลงทั้งหมด</MenuItem>
                                  {name.is_muted === "NO" &&
                                    <MenuItem onClick={() => muteAudioParticipant(name.uuid, true)}><MicIcon sx={{ mr: 1 }} /> ปิดไมค์</MenuItem>
                                  }
                                  {name.is_muted === "YES" &&
                                    <MenuItem onClick={() => muteAudioParticipant(name.uuid, false)}><MicOffIcon sx={{ mr: 1 }} /> เปิดไมค์</MenuItem>
                                  }
                                  {name.is_video_muted === false &&
                                    <MenuItem onClick={() => muteVideoParticipant(name.uuid, true)}><VideocamIcon sx={{ mr: 1 }} /> ปิดกล้อง</MenuItem>
                                  }
                                  {name.is_video_muted === true &&
                                    <MenuItem onClick={() => muteVideoParticipant(name.uuid, false)}><VideocamOffIcon sx={{ mr: 1 }} /> เปิดกล้อง</MenuItem>
                                  }
                                  {name.is_presenting === "YES" &&
                                    <MenuItem onClick={() => mutePresentationParticipant(name.uuid, false)}>ปิดแชร์หน้าจอ</MenuItem>
                                  }
                                  {conferenceUpdate?.guests_muted === false &&
                                    <MenuItem onClick={() => muteAudioAllParticipant(true)}><MicIcon color="error" sx={{ mr: 1 }} /> ปิดไมค์ทุกคน</MenuItem>
                                  }
                                  {conferenceUpdate?.guests_muted === true &&
                                    <MenuItem onClick={() => muteAudioAllParticipant(false)}><MicOffIcon color="error" sx={{ mr: 1 }} /> เปิดไมค์ทุกคน</MenuItem>
                                  }
                                  {/* <MenuItem onClick={() => setSpotlight(name?.uuid, true)}>Spotlight</MenuItem> */}
                                  {name.role === "guest" &&
                                    <MenuItem onClick={() => setRole(name?.uuid, 'chair')}><KeyIcon sx={{ mr: 1 }} /> มอบสิทธิ์โฮสต์</MenuItem>
                                  }
                                  {name.role === "chair" && pexRTC.uuid !== name.uuid &&
                                    <MenuItem onClick={() => setRole(name?.uuid, 'guest')}><KeyOffIcon sx={{ mr: 1 }} /> ถอนสิทธิ์โฮสต์</MenuItem>
                                  }
                                  <MenuItem onClick={() => disconnectParticipant(name?.uuid)}><CallEndIcon sx={{ mr: 1 }} /> บังคับออกจากห้อง</MenuItem>
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

    </Box >
  );
}

export default DraWer;