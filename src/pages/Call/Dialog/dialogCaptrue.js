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
  Box,
  useMediaQuery,
  Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

//Icon
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

const BOLD = createTheme({
  typography: {
    "fontFamily": `"Kanit", sans-serif`,
    "fontSize": 14,
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

export default function DialogCaptrue({ openDialogCapture, setOpenDialogCapture }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.only('xs'));
  const [loadingVote, setLoadingVote] = useState(false);
  const handleClose = () => {
    setOpenDialogCapture(false);
  };

  useEffect(() => {
    if(openDialogCapture) {
      captureImage()
    }
  }, [openDialogCapture])

  async function captureImage() {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(1);
    capture()
  }

  function capture() {
    var canvas = document.getElementById('canvas');
    var video = document.getElementById('conference');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight); // for drawing the video element on the canvas
    // let images = []
    // images.push(canvas.toDataURL("image/jpeg"));
    console.log('Test', canvas.toDataURL("image/jpeg"))

    /** Code to merge image **/
    /** For instance, if I want to merge a play image on center of existing image **/
    const playImage = new Image();
    playImage.src = 'path to image asset';
    playImage.onload = () => {
      const startX = (video.videoWidth / 2) - (playImage.width / 2);
      const startY = (video.videoHeight / 2) - (playImage.height / 2);
      canvas.getContext('2d').drawImage(playImage, startX, startY, playImage.width, playImage.height);
      canvas.toBlob = (blob) => { // Canvas element gives a callback to listen to the event after blob is prepared from canvas
        const img = new Image();
        img.src = window.URL.createObjectUrl(blob); // window object with static function of URL class that can be used to get URL from blob
      };
    };
  }

  return (
    <div>
      <BackDrop
        fullScreen={fullScreen}
        open={openDialogCapture}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <ThemeProvider theme={BOLD}>
            <Typography>บันทึกภาพหน้าจอ</Typography>
          </ThemeProvider>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 1, minWidth: 300, maxWidth: 650 }}>
            <canvas style={{ height: '100%', width: '100%', objectFit: 'contain'}} id="canvas"></canvas>
          </Box>
        </DialogContent>
        <DialogActions>
          {loadingVote ? (
            <LoadingButton
              loading
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="outlined"
            >
              อัปโหลด
            </LoadingButton>
          ) : (
            <Button onClick={() => capture()} autoFocus>
              บันทึก
            </Button>
          )}
        </DialogActions>
      </BackDrop>
    </div>
  );
}