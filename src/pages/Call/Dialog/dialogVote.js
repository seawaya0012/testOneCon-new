import React, { useState, useRef } from 'react';
import axios from "axios";

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
  FormControl,
  MenuItem,
  InputLabel
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
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

export default function ResponsiveDialog({ openDialogVote, setOpenDialogVote, vote, accessToken }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const annouce = useRef('');
  const [type, setType] = useState('1');

  const handleChange = (event) => {
    setType(event.target.value);
  };

  const handleClose = () => {
    setOpenDialogVote(false);
  };

  async function setVote() {
    await axios.get(process.env.REACT_APP_ONEID + '/api/v2/service/shared-token',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then((result) => {
        window.open(process.env.REACT_APP_HOST_VOTE_SYSTEM + '/?shared-token=' + result.data.data.shared_token, '_blank')
      })
      .catch((err) => {
        console.log('error', err)
        Swal.fire({
          title: err,
          text: "",
          icon: "error",
          showCancelButton: false,
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
      })
  };

  // async function getSharedToken() {
  //   await axios.get(process.env.REACT_APP_ONEID + '/api/v2/service/shared-token',
  //     {
  //       headers: { Authorization: `Bearer ${accessToken}` }
  //     })
  //     .then((result) => {
  //       setSharedToken(result.data.data.shared_token)
  //     })
  //     .catch((err) => {
  //       console.log('error', err)
  //     })
  // }

  return (
    <div>
      <BackDrop
        fullScreen={fullScreen}
        open={openDialogVote}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          ระบบโหวต
        </BootstrapDialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, minWidth: 250, maxWidth: 250 }}>
            <Button sx={{ mx: 1, justifyContent: 'center' }} variant="outlined">
              เปิดโหวต
            </Button>
            <Button variant="outlined" disabled>
              เปิดโหวต
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVote()} autoFocus>
            สร้างโพล
          </Button>
        </DialogActions>
      </BackDrop>
    </div>
  );
}