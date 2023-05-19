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
  TextField,
  Box,
  useMediaQuery,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
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

export default function DialogVote({ openDialogVote, setOpenDialogVote, dataVote, jwtOneChat, uuidVote }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [value, setValue] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [valueComnent, setValueComnent] = React.useState('');
  const [loadingVote, setLoadingVote] = useState(false);
  const handleRadioChange = (event) => {
    setValue(event.target.value);
  };
  const handlevalueComnent = (event) => {
    setValueComnent(event.target.value);
  };

  const handleClose = () => {
    setOpenDialogVote(false);
  };

  async function sentVote() {
    setLoadingVote(true)
    if (name === null) {
      Swal.fire({
        title: "กรุณาเลือกโพลก่อนกดส่ง !",
        text: "",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      setLoadingVote(false)
      setOpenDialogVote(false);
    } else {
      try {
        const response = await axios({
          method: "post",
          url: process.env.REACT_APP_HOST_VOTE_SYSTEM + '/api/v1/voting-transaction/create-update',
          data: {
            topic_id: uuidVote,
            timestamp: new Date().getTime(),
            choice_selected: [{
              description: "",
              key: value,
              name: name,
              value: 1
            }],
            comment: valueComnent
          },
          headers: { Authorization: `Bearer ${jwtOneChat}` }
        });
        if (response.data.message === "CREATED") {
          setOpenDialogVote(false);
          setLoadingVote(false)
          setName(null)
          setValueComnent('')
          Swal.fire({
            title: "ส่งโพลสำเร็จ",
            text: "",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: 'ตกลง',
            reverseButtons: true
          })
        }
      } catch (error) {
        if (error.response.data.message === "Duplicate Voting") {
          setOpenDialogVote(false);
          setLoadingVote(false)
          setName(null)
          Swal.fire({
            title: "คุณได้ทำการส่งโพลเรียบร้อยแล้ว",
            text: "",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: 'ตกลง',
            reverseButtons: true
          })
        } else if(error.response.data.message === "NO Permission") {
          setOpenDialogVote(false);
          setLoadingVote(false)
          setName(null)
          Swal.fire({
            title: "คุณไม่มีสิทธิ์โหวต",
            text: "",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: 'ตกลง',
            reverseButtons: true
          })
        } else {
          setOpenDialogVote(false)
          setLoadingVote(false)
          setName(null)
          Swal.fire({
            title: "กรุณาล็อกอินและเปิดใช้งานระบบโหวตก่อนใช้งาน",
            text: "",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: 'ตกลง',
            reverseButtons: true
          })
        }
      }
    }
  }

  function sentName(data) {
    setName(data)
  }

  return (
    <div>
      <BackDrop
        fullScreen={fullScreen}
        open={openDialogVote}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <ThemeProvider theme={BOLD}>
            <Typography>ระบบโหวต</Typography>
          </ThemeProvider>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 1, minWidth: 300, maxWidth: 650 }}>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">{dataVote?.topic_name}</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={0}
                name="radio-buttons-group"
                onChange={handleRadioChange}
              >
                {dataVote?.voting_choice?.choice_items?.map((choice, i) => (
                  <div key={i}>
                    <FormControlLabel value={i + 1} onClick={() => sentName(choice?.name)} control={<Radio />} label={choice?.name} />
                  </div>
                ))}
              </RadioGroup>
              {dataVote?.topic_comment_status &&
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '30ch', pb: 1 },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="outlined-multiline-static"
                    label="แสดงความเห็น"
                    multiline
                    rows={4}
                    defaultValue={valueComnent}
                    onChange={handlevalueComnent}
                  />
                </Box>}
            </FormControl>
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
            <Button onClick={() => sentVote()} autoFocus>
              ส่งโพล
            </Button>
          )}
        </DialogActions>
      </BackDrop>
    </div>
  );
}