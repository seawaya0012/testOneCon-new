import React, { useRef } from 'react';

//Library
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  useMediaQuery,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

//Icon
import CloseIcon from '@mui/icons-material/Close';

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

export default function ResponsiveDialog({ pexRTC, open, setOpen, setUuidRecord, setStateRecord }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const rtmp = useRef('');
  const nameRecord = useRef('');

  const handleClose = () => {
    setOpen(false);
  };

  function recordStream() {
    pexRTC.dialOut(rtmp.current.value + "/" + nameRecord.current.value, "auto", "GUEST", function (rs) {  
      if(rs.result.length === 0) {
        setStateRecord(false)
        Swal.fire({
          title: "ลิงค์ RTMP ไม่ถูกต้อง",
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
  };

  return (
    <div>
      <BackDrop
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Record
        </BootstrapDialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField sx={{ mx: 1 }} id="outlined-basic" label="RTMP" variant="outlined" inputRef={rtmp} />
            <TextField sx={{ mx: 1 }} id="outlined-basic" label="File name" variant="outlined" inputRef={nameRecord} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => recordStream()} autoFocus>
            บันทึกหน้าจอ
          </Button>
        </DialogActions>
      </BackDrop>
    </div>
  );
}