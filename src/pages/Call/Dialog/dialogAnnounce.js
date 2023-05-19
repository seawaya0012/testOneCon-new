import React, { useState, useRef } from 'react';

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

export default function ResponsiveDialog({ pexRTC, openDialogAnnouce, setOpenDialogAnnouce, setStateAnnouce, stateAnnouce }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const annouce = useRef('');
  const [type, setType] = useState('0');

  const handleChange = (event) => {
    setType(event.target.value);
  };

  const handleClose = () => {
    setOpenDialogAnnouce(false);
  };

  function announce() {
    pexRTC.sendChatMessage(type + '|' + annouce.current.value)
    setStateAnnouce(true)
    Swal.fire({
      title: "บันทึกสำเร็จ",
      text: "",
      icon: "success",
      showCancelButton: false,
      confirmButtonText: "OK",
      allowOutsideClick: false,
    });
    setOpenDialogAnnouce(false);
  };

  function closeAnnounce() {
    pexRTC.sendChatMessage('3')
    setStateAnnouce(false)
    Swal.fire({
      title: "ปิดการประกาศสำเร็จ",
      text: "",
      icon: "success",
      showCancelButton: false,
      confirmButtonText: "OK",
      allowOutsideClick: false,
    });
    setOpenDialogAnnouce(false);
  };

  return (
    <div>
      <BackDrop
        fullScreen={fullScreen}
        open={openDialogAnnouce}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          ประกาศ
        </BootstrapDialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, minWidth: 400, maxWidth: 400 }}>
            <FormControl sx={{ mx: 1 }}>
              <InputLabel id="demo-simple-select-label">รูปแบบ</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="type"
                onChange={handleChange}
              >
                <MenuItem value={'0'}>ข้อความ</MenuItem>
                {/* <MenuItem value={'1'}>โหวต</MenuItem> */}
              </Select>
            </FormControl>
            {type === '0' ? (
              <TextField sx={{ mx: 1, minWidth: 265, maxWidth: 265 }} id="outlined-basic" label="Text" variant="outlined" inputRef={annouce} />
            ) : (
              <TextField sx={{ mx: 1, minWidth: 265, maxWidth: 265 }} id="outlined-basic" label="URL: Vote" variant="outlined" inputRef={annouce} />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {stateAnnouce ? (
            <Button color="error" onClick={() => closeAnnounce()} autoFocus>
              ปิดการประกาศ
            </Button>
          ) : (
            <Button onClick={() => announce()} autoFocus>
              บันทึก
            </Button>
          )}
        </DialogActions>
      </BackDrop>
    </div>
  );
}