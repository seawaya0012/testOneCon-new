import React, { ChangeEvent, useState, useEffect } from "react";
import axios from "axios";

//Component
import DialogLayout from "../Dialog/dialogLayout";
import DialogRecord from "../Dialog/dialogRecord";
import DialogStream from "../Dialog/dialogStream";
import DialogAnnouce from "../Dialog/dialogAnnounce";
import DialogVote from "../Dialog/dialogVote";
import DialogUnlockParticipants from "../Dialog/dialogUnlockParticipants";
import DialogUploadPresentation from "../Dialog/dialogUploadPresentation";

//CSS
import ZoomCss from "../CSS/zoom.module.scss"

//Library
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  useMediaQuery,
  Badge
} from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from "sweetalert2/dist/sweetalert2.js";

//Icon
import {
  faHand,
} from '@fortawesome/free-solid-svg-icons';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LinkIcon from '@mui/icons-material/Link';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import GridViewIcon from '@mui/icons-material/GridView';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import CastIcon from '@mui/icons-material/Cast';
import PollIcon from '@mui/icons-material/Poll';
import CampaignIcon from '@mui/icons-material/Campaign';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

const theme = createTheme({
  palette: {
    white: {
      main: '#FFFFFF',
    },
    secondary: {
      main: '#88888887',
    },
  },
});

const ButtonIcon = styled(IconButton)({
  boxShadow: "none",
  textTransform: "none",
  border: '1px solid',
  fontSize: 16,
  lineHeight: 1.5,
  backgroundColor: "#484848",
});

function ToolSettings(props) {
  const { pexRTC, dialURI, setOpenDialog, setOpenDialogLayout, openDialogAnnouce, setOpenDialogAnnouce, checkRole, uuidRoom, meetID, vote, setStatePresentationFile,
    guestLink, uuid, listParticipants, statePresentationFile, stateVote, setStateVote, conferenceUpdate, accessToken, fileImages, setFileImages, setIndexOfPage } = props
  const [stateFullScreen, setStateFullScreen] = useState(null)
  const [uuidRecord, setUuidRecord] = useState(null);
  const [uuidStream, setUuidStream] = useState(null);
  const [stateRecord, setStateRecord] = useState(false);
  const [stateStream, setStateStream] = useState(false);
  const [stateAnnouce, setStateAnnouce] = useState(false);

  const matches = useMediaQuery(theme.breakpoints.down('md'));

  // amount of participants service type wati for the host accept
  let data = listParticipants?.filter(user => user?.service_type === 'waiting_room')

  //Open dialog Vote
  const [openDialogVote, setOpenDialogVote] = useState(false);

  //Open dialog RecordStream
  const [open, setOpen] = useState(false);

  //Open dialog Stream
  const [openStream, setOpenStream] = useState(false);

  //open Dialog Lock
  const [openLockParticipants, setOpenLockParticipants] = useState(false);

  //open Dialog FilePre
  const [openDialogFilePre, setOpenDialogFilePre] = useState(false);

  // stateFullScreen
  useEffect(() => {
    if (stateFullScreen !== null) {
      openFullscreen()
      setStateFullScreen(null)
    }
  }, [stateFullScreen]);

  //voteSystem ###### ปัญหาตอนนี้คือ คนมาใหม่เป็นคนยิง แต่ Host กลับไม่ยิง แก้โดยการย้ายไปยิงใน ไฟล์ draWer
  // useEffect(() => {
  //   if (pexRTC.role === 'HOST' && countParticipants > countVoteSystem) {
  //     setCountVoteSystem(countParticipants)
  //     if (stateVote === false) {
  //       pexRTC.sendChatMessage('1|&topic-id=' + vote)
  //     } else { pexRTC.sendChatMessage('2') }
  //   } else {
  //     setCountVoteSystem(countParticipants)
  //   }
  // }, [countParticipants]);

  var elem = document.getElementById("conference");
  function openFullscreen() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  }

  function openDialogSetting() {
    setOpenDialog(true);
  }

  //Change layout
  function openDialogLayout() {
    setOpenDialogLayout(true);
  }

  //Full Screen
  function setFullScreen() {
    setStateFullScreen(true)
  }

  //share screen
  function shareMyScreen() {
    if (statePresentationFile) {
      Swal.fire({
        title: "กรุณาปิดการพรีเซนต์ไฟล์ก่อน",
        text: "",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    } else {
      pexRTC.present("screen")
    }
  }
  function endShareMyScreen() {
    pexRTC.present(null)
  }

  //record
  async function recordStream() {
    if (uuidRecord === null) {
      await axios.get(process.env.REACT_APP_API + '/api/v1/rtmp/getlinks/' + meetID)
        .then((result) => {
          // console.log('recordStream', result.data.data)
          const data = result.data.data
          pexRTC.dialOut(data + "/" + meetID, "auto", "HOST", function (rs) {
            if (rs.result.length === 0) {
              setStateRecord(false)
              Swal.fire({
                title: "Record ใช้งานไม่ได้กรุณากดอีกครั้ง!",
                text: "",
                icon: "error",
                showCancelButton: false,
                confirmButtonText: "OK",
                allowOutsideClick: false,
              });
              setOpen(false);
            } else {
              setUuidRecord(rs)
              setStateRecord(true)
              setOpen(false);
            }
          }, { streaming: "yes" })

        })
        .catch((err) => {
          console.log('error', err)
          Swal.fire({
            title: "ไม่สามารถ Record ได้",
            text: "",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
            allowOutsideClick: false,
          });
        })
    }
    else {
      pexRTC.disconnectParticipant(uuidRecord.result[0])
      setStateRecord(false)
      setUuidRecord(null)
    }
    // -----------------------
    // if (uuidRecord === null) {
    // pexRTC.dialOut("rtmp://203.150.189.33:1935/Meeting10/sample-test", "auto", "GUEST", function (rs) { setUuidRecord(rs) }, { streaming: "yes" })
    //   pexRTC.dialOut("rtmp://503734.entrypoint.cloud.wowza.com/app-xtWz5B3J/sample-test", "auto", "GUEST", function (rs) { setUuidRecord(rs) }, { streaming: "yes" })
    //   setStateRecord(true)
    // }
    // else if (uuidRecord !== null) {
    //   pexRTC.disconnectParticipant(uuidRecord.result[0])
    //   setStateRecord(false)
    //   setUuidRecord(null)
    // }
  }

  //stream
  function stream() {
    if (uuidStream === null) {
      setOpenStream(true);
    }
    else {
      pexRTC.disconnectParticipant(uuidStream.result[0])
      setStateStream(false)
      setUuidStream(null)
    }
  }

  //vote system
  function voteSystem() {
    if (stateVote === false) {
      setStateVote(true)
      pexRTC.sendChatMessage('1|&topic-id=' + vote)
      Swal.fire({
        title: "เปิดระบบโหวตสำเร็จ",
        text: "",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    } else {
      setStateVote(false)
      pexRTC.sendChatMessage('2')
      Swal.fire({
        title: "ปิดระบบโหวตสำเร็จ",
        text: "",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    }
    // window.open(process.env.REACT_APP_HOST_VOTE_SYSTEM + '/?shared-token=' + data + '&topic-id=' + vote, '_blank')
    // setOpenDialogVote(true)
    // window.open(process.env.REACT_APP_HOST_VOTE_SYSTEM, '_blank')
  }

  //  function announce() {
  function announce() {
    setOpenDialogAnnouce(true)
  }

  //set Buzz
  function handUp() {
    pexRTC.setBuzz()
  }
  function handDown() {
    pexRTC.clearBuzz(uuid)
  }

  //Lock conference
  function lockParticipants() {
    Swal.fire({
      title: "ล็อคห้องประชุมสำเร็จ",
      text: "",
      icon: "success",
      showCancelButton: false,
      confirmButtonText: "OK",
      allowOutsideClick: false,
    });
    pexRTC.setConferenceLock(true)
  }
  //dialog invite participants
  function unlockParticipants() {
    setOpenLockParticipants(true)
  }

  // upload Images
  function uploadFilePresent() {
    pexRTC.present(null)
    setOpenDialogFilePre(true)
  }
  async function stopFilePresent() {
    setStatePresentationFile(false)
    try {
      const response = await axios({
        method: "post",
        url: process.env.REACT_APP_WEB_PEX_RTC + '/api/client/v2/conferences/' + dialURI + '/participants/' + pexRTC.uuid + '/release_floor',
        data: { "jpegs": true },
        headers: { token: pexRTC.token },
      });
      if (response.data.status === "success") {
        setFileImages([])
        setIndexOfPage(0)
      }
      console.log('response', response)
    } catch (error) {
      console.log(error)
      Swal.fire({
        title: error,
        text: "",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    }
  }

  //CoppyLink Shared
  function coppyLink() {
    Swal.fire({
      title: "คัดลอกสำเร็จ",
      text: "",
      icon: "success",
      showCancelButton: false,
      confirmButtonText: "OK",
      allowOutsideClick: false,
    });
    navigator.clipboard.writeText(guestLink)
  }

  return (
    <div className={ZoomCss.toolsSettings}>
      {/* For desktop */}
      {!matches &&
        <div>
          {listParticipants?.find(user => user?.uuid === uuid)?.buzz_time === 0 ? (
            <ThemeProvider theme={theme}>
              <Tooltip title="ยกมือ">
                <ButtonIcon color="secondary" sx={{ mx: 1 }} aria-label="setBuzz" onClick={() => handUp()}>
                  <FontAwesomeIcon color="white" icon={faHand} size="xl" />
                </ButtonIcon>
              </Tooltip>
            </ThemeProvider>
          ) : (
            <ThemeProvider theme={theme}>
              <Tooltip title="เอามือลง">
                <ButtonIcon color="secondary" sx={{ mx: 1 }} aria-label="setBuzz" onClick={() => handDown()}>
                  <FontAwesomeIcon color="white" icon={faHand} size="xl" />
                </ButtonIcon>
              </Tooltip>
            </ThemeProvider>
          )}
        </div>
      }
      {!matches &&
        <div>
          {listParticipants?.find(user => user?.uuid === uuid)?.is_presenting === "YES" && !statePresentationFile ? (
            <ThemeProvider theme={theme}>
              <Tooltip title="หยุดการนำเสนอ">
                <ButtonIcon color="secondary" sx={{ mx: 1 }} aria-label="shareScreen" onClick={() => endShareMyScreen()}>
                  <ScreenShareIcon color="white" />
                </ButtonIcon>
              </Tooltip>
            </ThemeProvider>
          ) : (
            <ThemeProvider theme={theme}>
              <Tooltip title="นำเสนอทันที">
                <ButtonIcon color="secondary" sx={{ mx: 1 }} aria-label="shareScreen" onClick={() => shareMyScreen()}>
                  <ScreenShareIcon color="white" />
                </ButtonIcon>
              </Tooltip>
            </ThemeProvider>
          )}
        </div>
      }
      {!matches &&
        <div>
          {checkRole === "HOST" &&
            <div>
              {stateRecord ? (
                <ThemeProvider theme={theme}>
                  <Tooltip title="หยุดการบันทึกหน้าจอ">
                    <ButtonIcon color="error" sx={{ mx: 1 }} aria-label="stopRecord" onClick={() => recordStream()}>
                      <RadioButtonCheckedIcon color="error" />
                    </ButtonIcon>
                  </Tooltip>
                </ThemeProvider>
              ) : (
                <ThemeProvider theme={theme}>
                  <Tooltip title="บันทึกหน้าจอ">
                    <ButtonIcon color="secondary" sx={{ mx: 1 }} aria-label="record" onClick={() => recordStream()}>
                      <RadioButtonCheckedIcon color="white" />
                    </ButtonIcon>
                  </Tooltip>
                </ThemeProvider>
              )}
            </div>
          }
        </div>
      }
      {!matches &&
        <div>
          {pexRTC.role === "HOST" &&
            <div>
              {conferenceUpdate?.locked === false ? (
                <ThemeProvider theme={theme}>
                  <Tooltip title="เปิดใช้งานขออนุญาตการเข้าประชุม">
                    <ButtonIcon color="secondary" sx={{ mx: 1 }} aria-label="lockParticipants" onClick={() => lockParticipants()}>
                      <LockPersonIcon color="white" />
                    </ButtonIcon>
                  </Tooltip>
                </ThemeProvider>
              ) : (
                <ThemeProvider theme={theme}>
                  <Tooltip title="อนุญาตให้คนเข้าประชุม">
                    <ButtonIcon color="secondary" sx={{ mx: 1 }} aria-label="unlockParticipants" onClick={() => unlockParticipants()}>
                      <Badge badgeContent={data?.length} color="primary">
                        <CoPresentIcon color="white" />
                      </Badge>
                    </ButtonIcon>
                  </Tooltip>
                </ThemeProvider>
              )}
            </div>
          }
        </div>
      }
      <div>
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <React.Fragment>
              <ThemeProvider theme={theme}>
                <Tooltip title="ตัวเลือกเพิ่มเติม">
                  <ButtonIcon color="secondary" sx={{ mx: 1 }} aria-label="muteCamera" {...bindTrigger(popupState)}>
                    <MoreVertIcon color="white" />
                  </ButtonIcon>
                </Tooltip>
              </ThemeProvider>
              <Menu {...bindMenu(popupState)}>
                {matches &&
                  <div>
                    {listParticipants?.find(user => user?.uuid === uuid)?.buzz_time === 0 ? (
                      <MenuItem onClick={() => handUp()}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="setBuzz" >
                          <FontAwesomeIcon icon={faHand} size="xl" />
                        </ListItemIcon>
                        ยกมือ
                      </MenuItem>
                    ) : (
                      <MenuItem onClick={() => handDown()}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="setBuzz" >
                          <FontAwesomeIcon icon={faHand} size="xl" />
                        </ListItemIcon>
                        เอามือลง
                      </MenuItem>
                    )}
                  </div>
                }
                {matches &&
                  <div>
                    {listParticipants?.find(user => user?.uuid === uuid)?.is_presenting === "YES" && !statePresentationFile ? (
                      <MenuItem onClick={() => endShareMyScreen()}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="shareScreen" >
                          <ScreenShareIcon color="white" />
                        </ListItemIcon>
                        หยุดการนำเสนอ
                      </MenuItem>
                    ) : (
                      <MenuItem onClick={() => shareMyScreen()}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="shareScreen" >
                          <ScreenShareIcon color="white" />
                        </ListItemIcon>
                        นำเสนอทันที
                      </MenuItem>
                    )}
                  </div>
                }
                {matches &&
                  <div>
                    {checkRole === "HOST" &&
                      <div>
                        {stateRecord ? (
                          <MenuItem onClick={() => recordStream()}>
                            <ListItemIcon color="error" sx={{ mx: 1 }} aria-label="stopRecord" >
                              <RadioButtonCheckedIcon color="error" />
                            </ListItemIcon>
                            หยุดการบันทึกหน้าจอ
                          </MenuItem>
                        ) : (
                          <MenuItem onClick={() => recordStream()}>
                            <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="record" >
                              <RadioButtonCheckedIcon color="white" />
                            </ListItemIcon>
                            บันทึกหน้าจอ
                          </MenuItem>
                        )}
                      </div>
                    }
                  </div>
                }
                {matches &&
                  <div>
                    {checkRole === "HOST" &&
                      <div>
                        {conferenceUpdate?.locked === false ? (
                          <MenuItem onClick={() => lockParticipants()}>
                            <ListItemIcon color="error" sx={{ mx: 1 }} aria-label="lockParticipants" >
                              <LockPersonIcon color="white" />
                            </ListItemIcon>
                            ล็อคห้องประชุม
                          </MenuItem>
                        ) : (
                          <MenuItem onClick={() => unlockParticipants()}>
                            <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="unlockParticipants" >
                              <Badge badgeContent={data?.length} color="primary">
                                <CoPresentIcon color="white" />
                              </Badge>
                            </ListItemIcon>
                            อนุญาตให้คนเข้ามา
                          </MenuItem>
                        )}
                      </div>
                    }
                  </div>
                }
                {/* upload */}
                {statePresentationFile ? (
                  <MenuItem onClick={() => stopFilePresent()}>
                    <ListItemIcon color="error" sx={{ mx: 1 }} aria-label="uploadPresentation" >
                      <DriveFolderUploadIcon color="error" />
                    </ListItemIcon>
                    หยุดการนำเสนอ
                  </MenuItem>
                ) : (
                  <MenuItem onClick={() => uploadFilePresent()}>
                    <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="uploadPresentation" >
                      <DriveFolderUploadIcon color="white" />
                    </ListItemIcon>
                    อัพโหลดพรีเซนต์
                  </MenuItem>
                )}
                {checkRole === "HOST" && vote !== undefined && vote !== '' &&
                  <div>
                    {stateVote === true ? (
                      <MenuItem onClick={() => voteSystem()}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="changeLayout" >
                          <PollIcon color="error" />
                        </ListItemIcon>
                        ปิดระบบโหวต
                      </MenuItem>
                    ) : (
                      <MenuItem onClick={() => voteSystem()}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="changeLayout" >
                          <PollIcon color="white" />
                        </ListItemIcon>
                        เปิดระบบโหวต
                      </MenuItem>
                    )}
                  </div>
                }
                {/* {pexRTC.role === "HOST" &&
                  <div>
                    {stateAnnouce === true ? (
                      <MenuItem onClick={() => announce()}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="announce" >
                          <CampaignIcon color="error" />
                        </ListItemIcon>
                        ประกาศ
                      </MenuItem>
                    ) : (
                      <MenuItem onClick={() => announce()}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="announce" >
                          <CampaignIcon color="white" />
                        </ListItemIcon>
                        ประกาศ
                      </MenuItem>
                    )}
                  </div>
                } */}
                {pexRTC.role === "HOST" &&
                  <div>
                    <MenuItem onClick={() => openDialogLayout()}>
                      <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="changeLayout" >
                        <GridViewIcon color="white" />
                      </ListItemIcon>
                      เปลี่ยนเลย์เอาต์
                    </MenuItem>
                  </div>
                }
                <MenuItem onClick={() => setFullScreen()}>
                  <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="fullScreen">
                    <FullscreenIcon color="white" />
                  </ListItemIcon>
                  เต็มหน้าจอ
                </MenuItem>
                {checkRole === "HOST" &&
                  <div>
                    <MenuItem onClick={() => stream()}>
                      {stateStream ? (
                        <ListItemIcon color="error" sx={{ mx: 1 }} aria-label="stream">
                          <CastIcon color="error" />
                        </ListItemIcon>
                      ) : (
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="stream">
                          <CastIcon color="white" />
                        </ListItemIcon>
                      )}
                      สตรีม
                    </MenuItem>
                  </div>
                }
                <MenuItem onClick={() => coppyLink()}>
                  <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="linkShareMeet">
                    <LinkIcon color="white" />
                  </ListItemIcon>
                  ลิงค์แชร์
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => openDialogSetting()}>
                  <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="setting">
                    <SettingsIcon color="white" />
                  </ListItemIcon>
                  การตั้งค่า
                </MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
      </div>

      {/* DialogLayout */}
      <DialogLayout {...props} />

      {/* DialogFileUploadPresentation */}
      <DialogUploadPresentation pexRTC={pexRTC} dialURI={dialURI} openDialogFilePre={openDialogFilePre} setOpenDialogFilePre={setOpenDialogFilePre} fileImages={fileImages} setFileImages={setFileImages} setStatePresentationFile={setStatePresentationFile} />

      {/* DialogUnlockParticipants */}
      <DialogUnlockParticipants pexRTC={pexRTC} setOpenLockParticipants={setOpenLockParticipants} openLockParticipants={openLockParticipants} listParticipants={listParticipants} />

      {/* Dialog Vote */}
      <DialogVote setOpenDialogVote={setOpenDialogVote} openDialogVote={openDialogVote} vote={vote} accessToken={accessToken} />

      {/* Dialog RecordStream */}
      <DialogRecord pexRTC={pexRTC} open={open} setOpen={setOpen} setUuidRecord={setUuidRecord} setStateRecord={setStateRecord} />

      {/* Dialog Annouce */}
      <DialogAnnouce pexRTC={pexRTC} openDialogAnnouce={openDialogAnnouce} setOpenDialogAnnouce={setOpenDialogAnnouce} setStateAnnouce={setStateAnnouce} stateAnnouce={stateAnnouce} />

      {/* Dialog Stream */}
      <DialogStream pexRTC={pexRTC} openStream={openStream} setOpenStream={setOpenStream} setUuidStream={setUuidStream} setStateStream={setStateStream} />
    </div>
  );
}

export default ToolSettings