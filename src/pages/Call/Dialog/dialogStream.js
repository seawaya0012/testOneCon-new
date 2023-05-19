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

export default function ResponsiveDialog({ pexRTC, openStream, setOpenStream, setUuidStream, setStateStream }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const rtmp = useRef('');
  const handleClose = () => {
    setOpenStream(false);
  };

  function recordStream() {
    pexRTC.dialOut(rtmp.current.value, "auto", "HOST", function (rs) {  
      if(rs.result.length === 0) {
        setStateStream(false)
        Swal.fire({
          title: "ลิงค์ RTMP ไม่ถูกต้อง",
          text: "",
          icon: "error",
          showCancelButton: false,
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
        setOpenStream(false);
      } else {
        setUuidStream(rs)
        setStateStream(true)
        setOpenStream(false);
      }
    }, { streaming: "yes" })
  };

  return (
    <div>
      <BackDrop
        fullScreen={fullScreen}
        open={openStream}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        สตรีม
        </BootstrapDialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, width: 500, maxWidth: '100%', }}>
            <TextField fullWidth sx={{ mx: 1, }} id="outlined-basic" label="RTMP URL :" variant="outlined" inputRef={rtmp} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => recordStream()} autoFocus>
            เริ่ม
          </Button>
        </DialogActions>
      </BackDrop>
    </div>
  );
}