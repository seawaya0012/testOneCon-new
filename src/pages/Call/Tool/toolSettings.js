import React, { useEffect, useState } from "react";
import axios from "axios";

//Component
import DialogLayout from "../Dialog/dialogLayout";
import DialogRecord from "../Dialog/dialogRecord";
import DialogStream from "../Dialog/dialogStream";
import DialogAnnouce from "../Dialog/dialogAnnounce";
import DialogUnlockParticipants from "../Dialog/dialogUnlockParticipants";
import DialogUploadPresentation from "../Dialog/dialogUploadPresentation";
import DialogSetting from "../Dialog/dialogSetting";
import DialogCaptrue from "../Dialog/dialogCaptrue";
import DialogReport from "../Dialog/dialogReport";
import DialogEditorForMobile from "../Dialog/ForMobile/dialogEditorForMobile";

//CSS
import ZoomCss from "../CSS/zoom.module.scss"
import DialogCSS from '../CSS/Dialog.module.scss';

//Library
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  useMediaQuery,
  Badge,
  Typography
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
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import HdIcon from '@mui/icons-material/Hd';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import SdIcon from '@mui/icons-material/Sd';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import HowToVoteIcon from '@mui/icons-material/HowToVote';

const BOLD = createTheme({
  typography: {
    "fontFamily": `"Kanit", sans-serif`,
    "fontSize": 14,
    "fontWeightLight": 400,
    "fontWeightRegular": 600,
    "fontWeightMedium": 700
  }
});

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
  const {
    pexRTC,
    dialURI,
    setOpenDialog,
    setOpenDialogLayout,
    openDialogAnnouce,
    setOpenDialogAnnouce,
    checkRole,
    one_id,
    meetID,
    vote,
    setStatePresentationFile,
    guestLink,
    uuid,
    listParticipants,
    statePresentationFile,
    stateVote,
    setStateVote,
    conferenceUpdate,
    participantName,
    fileImages,
    setFileImages,
    setIndexOfPage,
    quality,
    setQuality,
    statePresentation,
    typePexRTC,
    loading,
    presenter,
    setSelectTab,
    detect,
    setDetect
  } = props
  const [uuidRecord, setUuidRecord] = useState(null);
  const [uuidStream, setUuidStream] = useState(null);
  const [stateRecord, setStateRecord] = useState(false);
  const [stateStream, setStateStream] = useState(false);
  const [stateAnnouce, setStateAnnouce] = useState(false);
  // const [quality, setQuality] = useState('HD');

  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const height1135 = useMediaQuery(theme.breakpoints.down(1135));
  const height1020 = useMediaQuery(theme.breakpoints.down(1020));
  const beforeIpadAir = useMediaQuery(theme.breakpoints.down(1185));
  const matchesFullScreen = useMediaQuery(theme.breakpoints.down(720));

  // amount of participants service type wati for the host accept
  let data = listParticipants?.filter(user => user?.service_type === 'waiting_room')

  //Open dialog RecordStream
  const [open, setOpen] = useState(false);

  //Open dialog Stream
  const [openStream, setOpenStream] = useState(false);

  //open Dialog Lock
  const [openLockParticipants, setOpenLockParticipants] = useState(false);

  //open Dialog FilePre
  const [openDialogFilePre, setOpenDialogFilePre] = useState(false);

  //open Dialog Capture
  const [openDialogCapture, setOpenDialogCapture] = useState(false);

  //open Dialog Reprot
  const [openDialogReprot, setOpenDialogReprot] = useState(false);

  //open Dialog Editor
  const [openDialogEditor, setOpenDialogEditor] = useState(false);

  //Full Screen
  var element = document.body;
  function openFullscreen() {
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (requestMethod) { // Native full screen.
      requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") {
      var wscript = new window.ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
  }

  // var elem = document.getElementById("conference");
  // function openFullscreen() {
  //   if (elem.requestFullscreen) {
  //     elem.requestFullscreen();
  //   } else if (elem.webkitRequestFullscreen) { /* Safari */
  //     elem.webkitRequestFullscreen();
  //   } else if (elem.msRequestFullscreen) { /* IE11 */
  //     elem.msRequestFullscreen();
  //   } else if (elem.mozRequestFullScreen) {
  //     elem.mozRequestFullScreen();
  //   }
  // }

  //Detect Mobile and Tablet Devices
  useEffect(() => {
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) setDetect(true); })(navigator.userAgent || navigator.vendor || window.opera, 'http://detectmobilebrowser.com/mobile');
  }, [])
  // window.mobileAndTabletCheck = function () {
  //   setDetect(false);
  //   (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) setDetect(true); })(navigator.userAgent || navigator.vendor || window.opera, 'http://detectmobilebrowser.com/mobile');
  //   return detect;
  // };

  function openDialogSetting() {
    setOpenDialog(true);
  }

  //Change layout
  function openDialogLayout() {
    setOpenDialogLayout(true);
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

  //announce
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
    whenLockroom()
  }
  //dialog invite participants
  function unlockParticipants() {
    setOpenLockParticipants(true)
  }
  //Handle when Lock room
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

  // capture Image
  function captureImage() {
    setOpenDialogReprot(true)
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

  // qualityChange of presentation
  function qualityChange(val) {
    setQuality(val)
  }

  // Open Editor
  function Editor() {
    if (beforeIpadAir) {
      setOpenDialogEditor(true)
    } else {
      setTimeout(() => {
        // window.open(process.env.REACT_APP_EDITOR + "/p/" + meetID + "?showControls=true&showChat=false&showLineNumbers=true&useMonospaceFont=false", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=150,left=2000,width=400,height=500");
        window.open(process.env.REACT_APP_EDITOR + "/p/" + meetID + "?showChat=false&userName=" + participantName, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=150,left=2000,width=400,height=500");
      })
    }
  }
  // Open Vote
  function openVote() {
    setSelectTab('VOTE')
    setOpenDialog(true);
  }

  return (
    <div className={ZoomCss.toolsSettings}>

      {/* For desktop */}
      {!matches && pexRTC.current_service_type === 'conference' && !loading &&
        <div>
          {listParticipants?.find(user => user?.uuid === uuid)?.buzz_time === 0 ? (
            <ThemeProvider theme={theme}>
              <Tooltip title="ยกมือ">
                <ButtonIcon className={DialogCSS.cursor} color="secondary" sx={{ mx: 1 }} aria-label="setBuzz" onClick={() => handUp()}>
                  <FontAwesomeIcon color="white" icon={faHand} size="xl" />
                </ButtonIcon>
              </Tooltip>
            </ThemeProvider>
          ) : (
            <ThemeProvider theme={theme}>
              <Tooltip title="เอามือลง">
                <ButtonIcon className={DialogCSS.cursor} color="secondary" sx={{ mx: 1 }} aria-label="setBuzz" onClick={() => handDown()}>
                  <FontAwesomeIcon color="red" icon={faHand} size="xl" />
                </ButtonIcon>
              </Tooltip>
            </ThemeProvider>
          )}
        </div>
      }
      {!matches && pexRTC.current_service_type !== 'waiting_room' && typePexRTC === '' &&
        <div>
          {listParticipants?.find(user => user?.uuid === uuid)?.is_presenting === "YES" && !statePresentationFile ? (
            <ThemeProvider theme={theme}>
              <Tooltip title="stop share screen">
                <ButtonIcon className={DialogCSS.cursor} color="secondary" sx={{ mx: 1 }} aria-label="shareScreen" onClick={() => endShareMyScreen()}>
                  <ScreenShareIcon color="white" />
                </ButtonIcon>
              </Tooltip>
            </ThemeProvider>
          ) : (
            <ThemeProvider theme={theme}>
              <Tooltip title="share screen">
                <ButtonIcon className={DialogCSS.cursor} color="secondary" sx={{ mx: 1 }} aria-label="shareScreen" onClick={() => shareMyScreen()}>
                  <ScreenShareIcon color="white" />
                </ButtonIcon>
              </Tooltip>
            </ThemeProvider>
          )}
        </div>
      }
      {!matches && pexRTC.current_service_type !== 'waiting_room' &&
        <div>
          {statePresentation &&
            <div>
              {quality === 'HD' ? (
                <ThemeProvider theme={theme}>
                  <Tooltip title="HD">
                    <ButtonIcon className={DialogCSS.cursor} color="secondary" sx={{ mx: 1 }} aria-label="shareScreen" onClick={() => qualityChange('SD')}>
                      <HdIcon color="white" />
                    </ButtonIcon>
                  </Tooltip>
                </ThemeProvider>

              ) : (
                <ThemeProvider theme={theme}>
                  <Tooltip title="SD">
                    <ButtonIcon className={DialogCSS.cursor} color="secondary" sx={{ mx: 1 }} aria-label="shareScreen" onClick={() => qualityChange('HD')}>
                      <SdIcon color="white" />
                    </ButtonIcon>
                  </Tooltip>
                </ThemeProvider>
              )}
            </div>
          }
        </div>
      }
      {!height1020 && pexRTC.current_service_type !== 'waiting_room' && checkRole === "HOST" &&
        <div>
          {stateRecord ? (
            <ThemeProvider theme={theme}>
              <Tooltip title="หยุดการบันทึกหน้าจอ">
                <ButtonIcon className={DialogCSS.cursor} color="error" sx={{ mx: 1 }} aria-label="stopRecord" onClick={() => recordStream()}>
                  <RadioButtonCheckedIcon color="error" />
                </ButtonIcon>
              </Tooltip>
            </ThemeProvider>
          ) : (
            <ThemeProvider theme={theme}>
              <Tooltip title="บันทึกหน้าจอ">
                <ButtonIcon className={DialogCSS.cursor} color="secondary" sx={{ mx: 1 }} aria-label="record" onClick={() => recordStream()}>
                  <RadioButtonCheckedIcon color="white" />
                </ButtonIcon>
              </Tooltip>
            </ThemeProvider>
          )}
        </div>
      }
      {!height1135 && pexRTC.current_service_type !== 'waiting_room' && pexRTC.role === "HOST" &&
        <div>
          {conferenceUpdate?.locked === false ? (
            <ThemeProvider theme={theme}>
              <Tooltip title="เปิดใช้งานขออนุญาตการเข้าประชุม">
                <ButtonIcon className={DialogCSS.cursor} color="secondary" sx={{ mx: 1 }} aria-label="lockParticipants" onClick={() => lockParticipants()}>
                  <LockPersonIcon color="white" />
                </ButtonIcon>
              </Tooltip>
            </ThemeProvider>
          ) : (
            <ThemeProvider theme={theme}>
              <Tooltip title="อนุญาตให้คนเข้าประชุม">
                <ButtonIcon className={DialogCSS.cursor} color="secondary" sx={{ mx: 1 }} aria-label="unlockParticipants" onClick={() => unlockParticipants()}>
                  <Badge badgeContent={data?.length} color="primary">
                    <CoPresentIcon color="white" />
                  </Badge>
                </ButtonIcon>
              </Tooltip>
            </ThemeProvider>
          )}
        </div>
      }
      <div>
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <React.Fragment>
              <ThemeProvider theme={theme}>
                <Tooltip title="ตัวเลือกเพิ่มเติม">
                  <ButtonIcon className={DialogCSS.cursor} color="secondary" sx={{ mx: 1 }} aria-label="muteCamera" {...bindTrigger(popupState)}>
                    <MoreVertIcon color="white" />
                  </ButtonIcon>
                </Tooltip>
              </ThemeProvider>
              <Menu {...bindMenu(popupState)}>
                {matches && pexRTC.current_service_type !== 'waiting_room' &&
                  <div>
                    {listParticipants?.find(user => user?.uuid === uuid)?.buzz_time === 0 ? (
                      <MenuItem className={DialogCSS.cursor} onClick={() => handUp()}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="setBuzz" >
                          <FontAwesomeIcon icon={faHand} size="xl" />
                        </ListItemIcon>
                        <ThemeProvider theme={BOLD}>
                          <Typography>ยกมือ</Typography>
                        </ThemeProvider>
                      </MenuItem>
                    ) : (
                      <MenuItem className={DialogCSS.cursor} onClick={() => handDown()}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="setBuzz" >
                          <FontAwesomeIcon color="red" icon={faHand} size="xl" />
                        </ListItemIcon>
                        <ThemeProvider theme={BOLD}>
                          <Typography>เอามือลง</Typography>
                        </ThemeProvider>
                      </MenuItem>
                    )}
                  </div>
                }
                {matches && pexRTC.current_service_type !== 'waiting_room' && typePexRTC === '' && !detect &&
                  <div>
                    {listParticipants?.find(user => user?.uuid === uuid)?.is_presenting === "YES" && !statePresentationFile ? (
                      <MenuItem className={DialogCSS.cursor} onClick={() => endShareMyScreen()}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="shareScreen" >
                          <ScreenShareIcon color="white" />
                        </ListItemIcon>
                        <ThemeProvider theme={BOLD}>
                          <Typography>หยุดแชร์หน้าจอ</Typography>
                        </ThemeProvider>
                      </MenuItem>
                    ) : (
                      <MenuItem className={DialogCSS.cursor} onClick={() => shareMyScreen()}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="stopShareScreen" >
                          <ScreenShareIcon color="white" />
                        </ListItemIcon>
                        <ThemeProvider theme={BOLD}>
                          <Typography>แชร์หน้าจอ</Typography>
                        </ThemeProvider>
                      </MenuItem>
                    )}
                  </div>
                }
                {matches && statePresentation && pexRTC.current_service_type !== 'waiting_room' &&
                  <div>
                    {quality === 'HD' ? (
                      <MenuItem className={DialogCSS.cursor} onClick={() => qualityChange('SD')}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="HD" >
                          <HdIcon color="white" />
                        </ListItemIcon>
                        <ThemeProvider theme={BOLD}>
                          <Typography>HD</Typography>
                        </ThemeProvider>
                      </MenuItem>
                    ) : (
                      <MenuItem className={DialogCSS.cursor} onClick={() => qualityChange('HD')}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="HD" >
                          <SdIcon color="white" />
                        </ListItemIcon>
                        <ThemeProvider theme={BOLD}>
                          <Typography>SD</Typography>
                        </ThemeProvider>
                      </MenuItem>
                    )}
                  </div>
                }
                {height1020 && pexRTC.current_service_type !== 'waiting_room' && checkRole === "HOST" &&
                  <div>
                    {stateRecord ? (
                      <MenuItem className={DialogCSS.cursor} onClick={() => recordStream()}>
                        <ListItemIcon color="error" sx={{ mx: 1 }} aria-label="stopRecord" >
                          <RadioButtonCheckedIcon color="error" />
                        </ListItemIcon>
                        <ThemeProvider theme={BOLD}>
                          <Typography>หยุดการบันทึกหน้าจอ</Typography>
                        </ThemeProvider>
                      </MenuItem>
                    ) : (
                      <MenuItem className={DialogCSS.cursor} onClick={() => recordStream()}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="record" >
                          <RadioButtonCheckedIcon color="white" />
                        </ListItemIcon>
                        <ThemeProvider theme={BOLD}>
                          <Typography>บันทึกหน้าจอ</Typography>
                        </ThemeProvider>
                      </MenuItem>
                    )}
                  </div>
                }
                {height1135 && pexRTC.current_service_type !== 'waiting_room' && pexRTC.role === "HOST" &&
                  <div>
                    {conferenceUpdate?.locked === false ? (
                      <MenuItem className={DialogCSS.cursor} onClick={() => lockParticipants()}>
                        <ListItemIcon color="error" sx={{ mx: 1 }} aria-label="lockParticipants" >
                          <LockPersonIcon color="white" />
                        </ListItemIcon>
                        <ThemeProvider theme={BOLD}>
                          <Typography>ล็อคห้องประชุม</Typography>
                        </ThemeProvider>
                      </MenuItem>
                    ) : (
                      <MenuItem className={DialogCSS.cursor} onClick={() => unlockParticipants()}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="unlockParticipants" >
                          <Badge badgeContent={data?.length} color="primary">
                            <CoPresentIcon color="white" />
                          </Badge>
                        </ListItemIcon>
                        <ThemeProvider theme={BOLD}>
                          <Typography>อนุญาตให้คนเข้ามา</Typography>
                        </ThemeProvider>
                      </MenuItem>
                    )}
                  </div>
                }
                {/* capture */}
                {/* {pexRTC.current_service_type !== 'waiting_room' && pexRTC.role === "HOST" &&
                  <MenuItem onClick={() => captureImage()}>
                    <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="capture" >
                      <CameraAltIcon color="white" />
                    </ListItemIcon>
                    <ThemeProvider theme={BOLD}>
                      <Typography>บันทึกภาพหน้าจอ</Typography>
                    </ThemeProvider>
                  </MenuItem>
                } */}
                {/* Vote system */}
                {pexRTC.current_service_type !== 'waiting_room' && checkRole === "HOST" &&
                  <div>
                    <MenuItem className={DialogCSS.cursor} onClick={() => openVote()}>
                      <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="voteSystem" >
                        <HowToVoteIcon color="white" />
                      </ListItemIcon>
                      <ThemeProvider theme={BOLD}>
                        <Typography>ระบบโหวต</Typography>
                      </ThemeProvider>
                    </MenuItem>
                  </div>
                }
                {/* upload */}
                {pexRTC.current_service_type !== 'waiting_room' &&
                  <div>
                    {listParticipants?.find(user => user?.uuid === uuid)?.is_presenting === "YES" && statePresentationFile ? (
                      <MenuItem className={DialogCSS.cursor} onClick={() => stopFilePresent()}>
                        <ListItemIcon color="error" sx={{ mx: 1 }} aria-label="uploadPresentation" >
                          <DriveFolderUploadIcon color="error" />
                        </ListItemIcon>
                        <ThemeProvider theme={BOLD}>
                          <Typography>หยุดการนำเสนอ</Typography>
                        </ThemeProvider>
                      </MenuItem>
                    ) : (
                      <MenuItem className={DialogCSS.cursor} onClick={() => uploadFilePresent()}>
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="uploadPresentation" >
                          <DriveFolderUploadIcon color="white" />
                        </ListItemIcon>
                        <ThemeProvider theme={BOLD}>
                          <Typography>อัปโหลดพรีเซนต์</Typography>
                        </ThemeProvider>
                      </MenuItem>
                    )}
                  </div>
                }
                {/* {checkRole === "HOST" && vote !== undefined && vote !== '' && pexRTC.current_service_type !== 'waiting_room' &&
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
                } */}
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
                {pexRTC.current_service_type !== 'waiting_room' &&
                  <div>
                    <MenuItem className={DialogCSS.cursor} onClick={() => Editor()}>
                      <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="changeLayout" >
                        <NoteAltIcon color="white" />
                      </ListItemIcon>
                      <ThemeProvider theme={BOLD}>
                        <Typography>โน้ต</Typography>
                      </ThemeProvider>
                    </MenuItem>
                  </div>
                }
                {checkRole === "HOST" && pexRTC.current_service_type !== 'waiting_room' &&
                  <div>
                    <MenuItem className={DialogCSS.cursor} onClick={() => stream()}>
                      {stateStream ? (
                        <ListItemIcon color="error" sx={{ mx: 1 }} aria-label="stream">
                          <CastIcon color="error" />
                        </ListItemIcon>
                      ) : (
                        <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="stream">
                          <CastIcon color="white" />
                        </ListItemIcon>
                      )}
                      <ThemeProvider theme={BOLD}>
                        <Typography>สตรีม</Typography>
                      </ThemeProvider>
                    </MenuItem>
                  </div>
                }
                {!matchesFullScreen && pexRTC.current_service_type !== 'waiting_room' && <div>
                  <MenuItem className={DialogCSS.cursor} onClick={() => openFullscreen()}>
                    <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="fullScreen">
                      <FullscreenIcon color="white" />
                    </ListItemIcon>
                    <ThemeProvider theme={BOLD}>
                      <Typography>เต็มหน้าจอ</Typography>
                    </ThemeProvider>
                  </MenuItem>
                </div>}
                {pexRTC.role === "HOST" && pexRTC.current_service_type !== 'waiting_room' &&
                  <div>
                    <MenuItem className={DialogCSS.cursor} onClick={() => openDialogLayout()}>
                      <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="changeLayout" >
                        <GridViewIcon color="white" />
                      </ListItemIcon>
                      <ThemeProvider theme={BOLD}>
                        <Typography>เปลี่ยนเลย์เอาต์</Typography>
                      </ThemeProvider>
                    </MenuItem>
                  </div>
                }
                {pexRTC.current_service_type !== 'waiting_room' &&
                  <MenuItem className={DialogCSS.cursor} onClick={() => coppyLink()}>
                    <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="linkShareMeet">
                      <LinkIcon color="white" />
                    </ListItemIcon>
                    <ThemeProvider theme={BOLD}>
                      <Typography>แชร์ลิงก์</Typography>
                    </ThemeProvider>
                  </MenuItem>
                }
                <Divider />
                <MenuItem className={DialogCSS.cursor} onClick={() => openDialogSetting()}>
                  <ListItemIcon color="secondary" sx={{ mx: 1 }} aria-label="setting">
                    <SettingsIcon color="white" />
                  </ListItemIcon>
                  <ThemeProvider theme={BOLD}>
                    <Typography>การตั้งค่า</Typography>
                  </ThemeProvider>
                </MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
      </div>

      {/* DialogLayout */}
      <DialogLayout {...props} />

      {/* DialogFileUploadPresentation */}
      <DialogUploadPresentation
        pexRTC={pexRTC}
        dialURI={dialURI}
        openDialogFilePre={openDialogFilePre}
        setOpenDialogFilePre={setOpenDialogFilePre}
        fileImages={fileImages}
        setFileImages={setFileImages}
        setStatePresentationFile={setStatePresentationFile}
        listParticipants={listParticipants}
        presenter={presenter}
      />

      {/* DialogUnlockParticipants */}
      <DialogUnlockParticipants pexRTC={pexRTC} meetID={meetID} one_id={one_id} participantName={participantName} setOpenLockParticipants={setOpenLockParticipants} openLockParticipants={openLockParticipants} listParticipants={listParticipants} />

      {/* Dialog RecordStream */}
      <DialogRecord pexRTC={pexRTC} open={open} setOpen={setOpen} setUuidRecord={setUuidRecord} setStateRecord={setStateRecord} />

      {/* Dialog Annouce */}
      <DialogAnnouce pexRTC={pexRTC} openDialogAnnouce={openDialogAnnouce} setOpenDialogAnnouce={setOpenDialogAnnouce} setStateAnnouce={setStateAnnouce} stateAnnouce={stateAnnouce} />

      {/* Dialog Stream */}
      <DialogStream pexRTC={pexRTC} openStream={openStream} setOpenStream={setOpenStream} setUuidStream={setUuidStream} setStateStream={setStateStream} />

      {/* DialogCaptrue */}
      <DialogCaptrue openDialogCapture={openDialogCapture} setOpenDialogCapture={setOpenDialogCapture} />

      {/* DialogReport */}
      <DialogReport openDialogReprot={openDialogReprot} setOpenDialogReprot={setOpenDialogReprot} />

      {/* DialogSetting */}
      <DialogSetting {...props} />

      {/* DialogChatForMobile */}
      <DialogEditorForMobile
        meetID={meetID}
        openDialogEditor={openDialogEditor}
        setOpenDialogEditor={setOpenDialogEditor}
        participantName={participantName}
      />

    </div>
  );
}

export default ToolSettings