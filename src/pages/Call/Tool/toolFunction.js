import React, { useState, useEffect } from "react";
import axios from "axios";

//Component
import DialogChatForMobile from "../Dialog/ForMobile/dialogChatForMobile";

//CSS
import ZoomCss from "../CSS/zoom.module.scss"

//Library
import {
  IconButton,
  Tooltip,
  Badge,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from "sweetalert2/dist/sweetalert2.js";

//Icon
import {
  faHand,
} from '@fortawesome/free-solid-svg-icons';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const theme = createTheme({
  palette: {
    white: {
      main: '#FFFFFF',
    },
    secondary: {
      main: '#88888887',
    },
    third: {
      main: '#2391FF87',
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

function ToolFunction(props) {

  const { pexRTC, dialURI, countParticipants, setOpenMessages, openMessages, setValueIndexOfDrawer, listParticipants, countMessages, setCountMessages,
    indexOfPage, fileImages, setIndexOfPage, statePresentationFile, room_id, authen_token, refresh_token, setOpenDialogPartiForMobile } = props;

  //open Dialog ChatForMobile
  const [openDialogChatForMobile, setOpenDialogChatForMobile] = useState(false);

  const onlyXS = useMediaQuery(theme.breakpoints.only('xs'));
  const matches = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerOpenChat = () => {
    setOpenMessages(true);
    setValueIndexOfDrawer(1);
    setCountMessages(0)
  };

  const handleDrawerOpenListParticipant = () => {
    setOpenMessages(true);
    setValueIndexOfDrawer(0);
  };

  //Function Presentation File
  function base64ToBlob(base64, mime) {
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
      var slice = byteChars.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
  }

  const handleSubmit = async (file) => {
    const formData = new FormData();
    formData.append("frame", file);
    try {
      const response = await axios({
        method: "post",
        url: process.env.REACT_APP_WEB_PEX_RTC + "/api/client/v2/conferences/" + dialURI + "/presentation",
        data: formData,
        headers: { "Content-Type": "multipart/form-data", token: pexRTC.token },
      });
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

  async function nextPagePresentationFile() {
    if (indexOfPage === fileImages?.length - 1) {
      await handleSubmit(await base64ToBlob(fileImages[0].replace(/^data:image\/(png|jpeg);base64,/, ""), 'image/jpeg'))
      setIndexOfPage(0)
    }
    else {
      await handleSubmit(await base64ToBlob(fileImages[indexOfPage + 1].replace(/^data:image\/(png|jpeg);base64,/, ""), 'image/jpeg'))
      setIndexOfPage(indexOfPage + 1)
    }
  }

  async function prevPagePresentationFile() {
    if (indexOfPage === 0) {
      await handleSubmit(await base64ToBlob(fileImages[fileImages?.length - 1].replace(/^data:image\/(png|jpeg);base64,/, ""), 'image/jpeg'))
      setIndexOfPage(fileImages?.length - 1)
    } else {
      await handleSubmit(await base64ToBlob(fileImages[indexOfPage - 1].replace(/^data:image\/(png|jpeg);base64,/, ""), 'image/jpeg'))
      setIndexOfPage(indexOfPage - 1)
    }
  }

  function openListParticipantMobile() {
    setOpenDialogPartiForMobile(true)
  }

  function openChatMobile() {
    setOpenDialogChatForMobile(true)
  }

  return (
    <div className={ZoomCss.toolsFuntion}>
      {/* For Desktop */}
      {!matches &&
        <div>
          <ThemeProvider theme={theme}>
            <ButtonIcon color="secondary" sx={{ mx: 1 }} aria-label="charMessage" onClick={handleDrawerOpenListParticipant}>
              {listParticipants?.find(buzz => buzz?.buzz_time !== 0) ? (
                <Tooltip title="แสดงทุกคน">
                  <FontAwesomeIcon color="red" icon={faHand} shake size="xl" />
                </Tooltip>
              ) : (
                <Tooltip title="แสดงทุกคน">
                  <Badge badgeContent={countParticipants} color="primary">
                    <PersonIcon color="white" />
                  </Badge>
                </Tooltip>
              )}
            </ButtonIcon>
          </ThemeProvider>
        </div>
      }
      {!matches &&
        <div>
          <ThemeProvider theme={theme}>
            <Tooltip title="แชทกับทุกคน">
              <ButtonIcon color="secondary" sx={{ mx: 1 }} aria-label="charMessage" onClick={handleDrawerOpenChat}>
                <Badge badgeContent={countMessages} color="primary">
                  <ChatIcon color="white" />
                </Badge>
              </ButtonIcon>
            </Tooltip>
          </ThemeProvider>
        </div>
      }

      {/* For Mobile */}
      {matches &&
        <div>
          <ThemeProvider theme={theme}>
            <ButtonIcon color="secondary" sx={{ mx: 1 }} aria-label="charMessage" onClick={() => openListParticipantMobile()}>
              {listParticipants?.find(buzz => buzz?.buzz_time !== 0) ? (
                <Tooltip title="แสดงทุกคน">
                  <FontAwesomeIcon color="red" icon={faHand} shake size="xl" />
                </Tooltip>
              ) : (
                <Tooltip title="แสดงทุกคน">
                  <Badge badgeContent={countParticipants} color="primary">
                    <PersonIcon color="white" />
                  </Badge>
                </Tooltip>
              )}
            </ButtonIcon>
          </ThemeProvider>
        </div>
      }
      {matches &&
        <div>
          <ThemeProvider theme={theme}>
            <Tooltip title="แชทกับทุกคน">
              <ButtonIcon color="secondary" sx={{ mx: 1 }} aria-label="charMessage" onClick={() => openChatMobile()}>
                <Badge badgeContent={countMessages} color="primary">
                  <ChatIcon color="white" />
                </Badge>
              </ButtonIcon>
            </Tooltip>
          </ThemeProvider>
        </div>
      }
      {onlyXS && statePresentationFile &&
        <div>
          <ThemeProvider theme={theme}>
            <Tooltip title="หน้าต่อไป">
              <ButtonIcon color="secondary" sx={{ mx: 1 }} aria-label="nextPage" onClick={() => nextPagePresentationFile()}>
                <Badge badgeContent={indexOfPage + 1} color="error">
                  <ArrowForwardIosIcon color="white" />
                </Badge>
              </ButtonIcon>
            </Tooltip>
          </ThemeProvider>
        </div>
      }
      {onlyXS && statePresentationFile &&
        <div>
          <ThemeProvider theme={theme}>
            <Tooltip title="ถอยหลัง">
              <ButtonIcon color="secondary" sx={{ mx: 1 }} aria-label="prevPage" onClick={() => prevPagePresentationFile()}>
                <Badge badgeContent={fileImages?.length} color="error">
                  <ArrowBackIosIcon color="white" />
                </Badge>
              </ButtonIcon>
            </Tooltip>
          </ThemeProvider>
        </div>
      }

      {/* DialogChatForMobile */}
      <DialogChatForMobile room_id={room_id} authen_token={authen_token} refresh_token={refresh_token} openDialogChatForMobile={openDialogChatForMobile}
        setOpenDialogChatForMobile={setOpenDialogChatForMobile} />

      {/* DialogParticipantsForMobile */}
      {/* <DialogPartiForMobile {...props} openDialogPartiForMobile={openDialogPartiForMobile} setOpenDialogPartiForMobile={setOpenDialogPartiForMobile} /> */}

    </div>
  );
}

export default ToolFunction