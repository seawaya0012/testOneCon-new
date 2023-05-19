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
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled, useTheme } from '@mui/material/styles';
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

//Icon
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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

export default function ResponsiveDialog({ pexRTC, openStream, setOpenStream, setUuidStream, setStateStream }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.only('xs'));
  const [showPassword, setShowPassword] = React.useState(false);
  const rtmp = useRef('');
  const key = useRef('');
  const handleClose = () => {
    setOpenStream(false);
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function recordStream() {
    pexRTC.dialOut(rtmp.current.value + '/' + key.current.value, "auto", "HOST", function (rs) {
      if (rs.result.length === 0) {
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
          <ThemeProvider theme={BOLD}>
            <Typography>สตรีม</Typography>
          </ThemeProvider>
        </BootstrapDialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, mr: 2, width: 400, maxWidth: '100%', }}>
            <Box sx={{ mb: 2 }}>
              <TextField placeholder="rtmp://a.rtmp.youtube.com/..." fullWidth sx={{ mx: 1, }} id="rtmp" label="URL Stream:" variant="outlined" inputRef={rtmp} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mx: 1, }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Stream Key:</InputLabel>
                <OutlinedInput
                  id="rtmp-Key"
                  type={showPassword ? 'text' : 'password'}
                  inputRef={key}
                  placeholder="********"
                  label="Stream Key"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle Key visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Box>
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