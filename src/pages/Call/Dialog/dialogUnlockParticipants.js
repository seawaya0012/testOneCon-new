import React, { useState } from 'react';
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
  MenuItem,
  useMediaQuery,
  Box
} from '@mui/material';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { createTheme, ThemeProvider } from '@mui/material/styles';

//Icon
import CloseIcon from '@mui/icons-material/Close';
import { flexbox } from '@mui/system';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const BootstrapDialog = styled(Dialog)({
  "& > .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop": {
    backgroundColor: 'rgba(0, 0, 0, 0)'
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

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

function UnLockParticipants(props) {
  const { pexRTC, meetID, one_id, participantName, openLockParticipants, setOpenLockParticipants, listParticipants } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const data = listParticipants?.filter(user => user?.service_type === 'waiting_room')

  const handleClose = () => {
    setOpenLockParticipants(false);
  };

  function acceptAllParticipant() {
    for (let i = 0; i < data.length; i++) {
      pexRTC.unlockParticipant(data[i].uuid)
      whenApprove(data[i].uuid)
    }
    setOpenLockParticipants(false);
    Swal.fire({
      title: "ยอมรับทั้งหมดสำเร็จ",
      text: "",
      icon: "success",
      showCancelButton: false,
      confirmButtonText: "OK",
      allowOutsideClick: false,
    });
  }

  function declideAllParticipant() {
    for (let i = 0; i < data.length; i++) {
      pexRTC.disconnectParticipant(data[i].uuid)
      whenReject(data[i].uuid)
    }
    setOpenLockParticipants(false);
    Swal.fire({
      title: "ปฏิเสธทั้งหมดสำเร็จ",
      text: "",
      icon: "success",
      showCancelButton: false,
      confirmButtonText: "OK",
      allowOutsideClick: false,
    });
  }

  function acceptParticipant(uuid) {
    pexRTC.unlockParticipant(uuid)
    whenApprove(uuid)
  }

  //Handle when Lock room
  async function whenApprove(uuid) {
    try {
      const response = await axios({
        method: 'POST',
        url: process.env.REACT_APP_API + '/api/vi/activity/approve',
        data: {
          meeting_id: meetID,
          callid: uuid
        }
      })
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  function declideParticipant(uuid) {
    pexRTC.disconnectParticipant(uuid)
    whenReject(uuid)
  }

  //Handle when Lock room
  async function whenReject(uuid) {
    try {
      const response = await axios({
        method: 'POST',
        url: process.env.REACT_APP_API + '/api/vi/activity/reject',
        data: {
          meeting_id: meetID,
          callid: uuid,
          oneid: "No",
          name: participantName
        }
      })
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  function unlockParticipants() {
    setOpenLockParticipants(false);
    Swal.fire({
      title: "ปลดล็อคห้องประชุมสำเร็จ",
      text: "",
      icon: "success",
      showCancelButton: false,
      confirmButtonText: "OK",
      allowOutsideClick: false,
    });
    whenUnLockroom()
  }

  //Handle when unLock room
  async function whenUnLockroom() {
    const value = await setObject()
    try {
      const response = await axios({
        method: 'POST',
        url: process.env.REACT_APP_API + '/api/vi/activity/unlock',
        data: {
          meeting_id: meetID,
          list_user: value
        }
      })
      if(response.data.message === 'Room is unlocked.') {
        pexRTC.setConferenceLock(false)
      }
    } catch (err) {
      console.log(err);
    }
  }

  const setObject = () => {
    const value = []
    for (let i = 0; i < data.length; i++) {
      value[i] = {
        callid: data[i].uuid,
        oneid: "No",
        name: data[i].display_name,
        vote: false
      }
    }
    return value;
  }

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openLockParticipants}
        fullScreen={fullScreen}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <ThemeProvider theme={BOLD}>
            <Typography>รายชื่อคนรอเข้าประชุม</Typography>
          </ThemeProvider>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ minWidth: 350, maxWidth: 450, minHeight: 250, maxHeight: 250 }}>
            {listParticipants?.map((name, i) => (
              <Box key={i}>
                {name.service_type === "waiting_room" &&
                  <MenuItem divider sx={{ justifyContent: 'space-between' }}>
                    <Box>
                      <Typography>{name.display_name}</Typography>
                    </Box>
                    <Box sx={{ pl: 1 }}>
                      <IconButton color="success" sx={{ mx: 1 }} aria-label="accept" onClick={() => acceptParticipant(name.uuid)}>
                        <CheckIcon />
                      </IconButton>
                      <IconButton color="error" sx={{ mx: 0 }} aria-label="declide" onClick={() => declideParticipant(name.uuid)}>
                        <ClearIcon />
                      </IconButton>
                    </Box>
                  </MenuItem>
                }
              </Box>
            ))}

            {/* ถ้าไม่มีคนรอเข้าประชุมจะแสดง หน้านี้ */}
            {listParticipants?.find(user => user?.service_type === 'waiting_room')?.service_type === undefined &&
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                ไม่มีคนรอเข้าประชุม
              </Box>
            }
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: flexbox, justifyContent: 'space-between' }}>
          <Button variant="outlined" color="error" onClick={() => declideAllParticipant()}>
            ปฏิเสธทั้งหมด
          </Button>
          <Button variant="outlined" onClick={() => acceptAllParticipant()}>
            ยอมรับทั้งหมด
          </Button>
          <Button variant="contained" onClick={() => unlockParticipants()}>
            ปลดล็อกห้องประชุม
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default UnLockParticipants