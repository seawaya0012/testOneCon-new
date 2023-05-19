import React, { useEffect, useState, useRef } from 'react';

import Logo from "../../assets/img/logo.png";

// Library functions
import {
  Box,
  Card,
  Button,
  Typography
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from "@mui/material/styles";

const THEME = createTheme({
  typography: {
    "fontFamily": `"Kanit", sans-serif`,
    "fontSize": 16,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
  }
});

const ImageWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItem: "center",
  justifyContent: "center",
}));

const TitleWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItem: "center",
  justifyContent: "center",
  flexDirection: "column",
  textAlign: "center",
}));

function EndMeeting(props) {
  const { navigate, guestLink } = props;

  useEffect(() => {
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self')
    }
  }, [])

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <Card sx={{ px: 4, py: 2 }} elevation={5}>
        <ImageWrapper sx={{ pt: 1 }}>
          <img
            src={Logo}
            alt="Logo"
            style={{
              display: "block",
              maxWidth: "145px",
              maxHeight: "60px",
              width: "auto",
              height: "auto",
            }}
          />
        </ImageWrapper>
        <ThemeProvider theme={THEME}>
          <Typography sx={{ color: "#3D4F58" }} variant="h4">One conference</Typography>
        </ThemeProvider>
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, pb: 1}}>
          <TitleWrapper>
            <ThemeProvider theme={THEME}>
              <Typography variant="h7" gutterBottom>คุณออกจากการประชุมแล้ว</Typography>
            </ThemeProvider>
          </TitleWrapper>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <Button variant="outlined" onClick={() => (window.open(guestLink, '_self'))}>
            เข้าร่วมใหม่
          </Button>
          <Box sx={{ px: 1 }} />
          <Button variant="contained" onClick={() => (window.open(process.env.REACT_APP_REDIRECT_LOBBY + '/redirectlobby', '_self'))}>
            กลับไปที่หน้าจอหลัก
          </Button>
        </Box>
      </Card>
    </Box>
  )
}

export default EndMeeting