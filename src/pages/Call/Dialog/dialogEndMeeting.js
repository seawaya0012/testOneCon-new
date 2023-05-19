import React, { useState, useEffect } from 'react';
import axios from "axios";

//Library
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  useMediaQuery,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

//Icon
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

const BOLD = createTheme({
  typography: {
    "fontFamily": `"Kanit", sans-serif`,
    "fontSize": 16,
    "fontWeightLight": 400,
    "fontWeightRegular": 600,
    "fontWeightMedium": 700
  }
});

const BackDrop = styled(Dialog)({
  "& > .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop": {
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }
});

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

export default function DialogEndMeeting({ pexRTC, dialURI, room_id, meetID, openDialogEndMeeting, setOpenDialogEndMeeting, typePexRTC }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.only('xs'));
  const [loadingDisconnet, setLoadingDisconnet] = useState(false);

  const handleClose = () => {
    setOpenDialogEndMeeting(false);
  };

  async function disconnectAllParticipant() {
    setLoadingDisconnet(true)
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
      setLoadingDisconnet(false)
      // leaveMemMic()
      if (typePexRTC === '' && window.localStream !== undefined) {
        window.localStream.getVideoTracks()[0].stop();
      }
      window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
    }
  }

  async function genReport() {
    try {
      const response = await axios({
        method: "post",
        url: process.env.REACT_APP_API + '/api/v1/room/genreport',
        data: {
          meeting_id: meetID
        }
      })
      console.log(response);
    } catch (error) {
      console.log(error);
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
        genReport()
        setLoadingDisconnet(false)
        setOpenDialogEndMeeting(false);
        if (typePexRTC === '' && window.localStream !== undefined) {
          window.localStream.getVideoTracks()[0].stop();
        }
        window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
      }
    } catch (error) {
      setOpenDialogEndMeeting(false);
      setLoadingDisconnet(false)
      Swal.fire({
        title: "ปิดห้องไม่สำเร็จ",
        text: "",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: 'ตกลง',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // leaveMemMic()
          if (typePexRTC === '' && window.localStream !== undefined) {
            window.localStream.getVideoTracks()[0].stop();
          }
          window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
        }
      });
    }
  }

  function disconnect() {
    pexRTC.disconnect();
    // leaveMemMic()
    if (typePexRTC === '' && window.localStream !== undefined) {
      window.localStream.getVideoTracks()[0].stop();
    }
    window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
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

  return (
    <div>
      <BackDrop
        fullScreen={fullScreen}
        open={openDialogEndMeeting}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <ThemeProvider theme={BOLD}>
            <Typography>คุณต้องการปิดการประชุมนี้หรือไม่ ?</Typography>
          </ThemeProvider>
        </BootstrapDialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, minWidth: 400, maxWidth: 650 }}>
            <ThemeProvider theme={BOLD}>
              <Typography variant="body2" gutterBottom>เลือก "ปิดประชุม" เมื่อต้องการสิ้นสุดการประชุมครั้งนี้</Typography>
              <Typography variant="body2" gutterBottom>เลือก "พักการประชุม" เมื่อต้องการกลับเข้าห้องประชุมเดิมอีกครั้ง</Typography>
            </ThemeProvider>
            {/* เลือก "ปิดประชุม" เมื่อต้องการสิ้นสุดการประชุมครั้งนี้ <br/>
            เลือก "พักการประชุม" เมื่อต้องการกลับเข้าห้องประชุมเดิมอีกครั้ง */}
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: 'flexbox', justifyContent: 'space-between', mx: 6, mb: 1 }}>
          {loadingDisconnet ? (
            <LoadingButton
              loading
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="outlined"
            >
              กำลังปิดห้องประชุม
            </LoadingButton>
          ) : (
            <Button onClick={() => disconnectAllParticipant()} size="medium" variant="contained" color="info" >
              ปิดการประชุม
            </Button>
          )}
          <Button onClick={() => disconnect()} size="medium" variant="contained" color="inherit">
            พักการประชุม
          </Button>
          <Button onClick={handleClose} size="medium" variant="contained" color="inherit">
            ยกเลิก
          </Button>
        </DialogActions>
      </BackDrop>
    </div>
  );
}