import React, { useRef, useEffect, useState } from 'react';
import backImage1 from "./Background/bg1.jpg";
import backImage2 from "./Background/bg2.jpg";
import backImage3 from "./Background/bg3.jpg";
import backImage4 from "./Background/bg4.jpg";
import backImage5 from "./Background/bg5.jpg";
import backImage6 from "./Background/bg6.jpg";
import backImage7 from "./Background/bg7.jpg";
import backImage8 from "./Background/bg8.jpg";

//CSS
import DialogCSS from '../CSS/Dialog.module.scss';
import '../CSS/Upload.scss'
import ZoomCss from "../CSS/zoom.module.scss"

//Library
import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  Typography,
  Tooltip
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

//icon
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';

const theme = createTheme({
  palette: {
    white: {
      main: 'red',
    },
    secondary: {
      main: '#88888887',
    },
  },
});

const BOLD = createTheme({
  typography: {
    "fontFamily": `"Kanit", sans-serif`,
    "fontSize": 12,
    "fontWeightLight": 400,
    "fontWeightRegular": 600,
    "fontWeightMedium": 700
  }
});

function VirsualBackground(prop) {
  const {
    pexRTC,
    customVideo,
    setCustomVideo,
    backgroundSelect,
    setBackgroundSelect,
    selectAudio,
    selectVideo,
    dataUpload,
    setDataUpload,
    stateUpload,
    setStateUpload
  } = prop;
  const [audio, setAudio] = useState(null)
  const inputVideoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.src = pexRTC.user_media_stream;
    }
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          deviceId: {
            exact: selectAudio
          }
        },
        video: {
          deviceId: {
            exact: selectVideo
          },
          width: { min: 1024, ideal: 1280, max: 1920 },
          height: { min: 576, ideal: 720, max: 1080 },
        }
      })
      .then(stream => {
        setAudio(stream)
        if (inputVideoRef.current) {
          inputVideoRef.current.srcObject = stream;
        }
      })
  }, []);

  function close() {
    setCustomVideo(false)
    pexRTC.user_media_stream = false
    pexRTC.video_source = selectVideo
    pexRTC.audio_source = selectAudio
    pexRTC.renegotiate()
    setBackgroundSelect(null)

    // clear data upload
    setDataUpload('')
    setStateUpload(false)
    document.getElementById('myTagInput').value = ''
  }

  useEffect(() => {
    if (!customVideo) return;
    
    const playbackElement = document.getElementById("playback");
    const processedStream = playbackElement.captureStream(25);

    if (canvasRef.current) {
      if (typeof MediaStream !== 'undefined' && processedStream instanceof MediaStream) {
        canvasRef.current.srcObject = processedStream;
      } else {
        canvasRef.current.src = processedStream;
      }
    }
  }, [customVideo])

  function changeBakcground() {
    const playbackElement = document.getElementById("playback");
    const processedStream = playbackElement.captureStream(25);
    processedStream.addTrack(audio.getAudioTracks()[0]);
    pexRTC.user_media_stream = processedStream;
    // const sUsrAg = navigator.userAgent;
    // if (sUsrAg.indexOf('Firefox') > -1) {
    // } else {
    // }
  }

  async function BackgroundSelect(val) {
    setCustomVideo(true)
    setBackgroundSelect(val)
    if (!customVideo) {
      const delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(1);
      pexRTC.renegotiate(changeBakcground())
    }

    // clear data upload
    setDataUpload('')
    setStateUpload(false)
  }

  const handleFileSelect = async (event) => {
    if (event.target.files[0].type === "image/jpeg" || event.target.files[0].type === "image/png") {
      let data = await blobToBase64(event.target.files[0])
      setDataUpload(data)
      setStateUpload(true)
      setCustomVideo(true)
      setBackgroundSelect('bg9')
      if (!customVideo) {
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(1);
        pexRTC.renegotiate(changeBakcground())
      }

    } else {
      console.log("Test");
    }
  }

  function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
        <Box>
          <ThemeProvider theme={BOLD} >
            <Typography sx={{ pb: 2 }} >ขนาดภาพที่แนะนำสำหรับการอัปโหลดภาพพื้นหลัง 1280 x 720</Typography>
          </ThemeProvider>
          <Box sx={customVideo ? { display: 'none' } : { display: 'flex', justifyContent: 'flex-end', height: '100px', width: '390px' }}>
            <Box sx={{ width: '100%', height: '100%', marginRight: '4px' }}>
              <label htmlFor="images" className="drop-containerBG">
                <Tooltip title="อัปโหลดภาพพื้นหลัง">
                  <AddPhotoAlternateIcon sx={{ fontSize: 60 }} />
                </Tooltip>
                <input style={{ display: 'none' }} type="file" id="myTagInput" name="file" accept="image/png, image/jpeg" onChange={handleFileSelect} required >
                </input>
              </label>
            </Box>
            <video className="cssVideo" autoPlay muted ref={inputVideoRef} />
          </Box>
          <Box sx={customVideo ? { display: 'flex', justifyContent: 'flex-end', height: '100px', width: '390px' } : { display: 'none' }}>
            <Box sx={{ width: '100%', height: '100%', marginRight: '4px' }}>
              {stateUpload ? (
                <Box sx={{ width: '100%', height: '100%' }}>
                  <img style={{ borderRadius: '10px', height: '100%', width: 'auto' }} src={dataUpload} id="bg9" alt="jpeg" loading="lazy" />
                  <Box
                    sx={{
                      opacity: '0%',
                      transition: 'opacity 0.8s',
                      '&:hover': {
                        opacity: '100%',
                        transition: 'opacity 0.8s',
                      },
                    }}
                  >
                    <div style={{ display: 'flex', position: 'absolute', top: '30%', left: '41%' }}>
                      <ThemeProvider theme={theme}>
                        <CloseIcon color="white" sx={{ fontSize: 60 }} onClick={() => close()} />
                      </ThemeProvider>
                    </div>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ width: '100%', height: '100%', marginRight: '4px' }}>
                  <label htmlFor="images" className="drop-containerBG">
                    <Tooltip title="อัปโหลดภาพพื้นหลัง">
                      <AddPhotoAlternateIcon sx={{ fontSize: 60 }} />
                    </Tooltip>
                    <input style={{ display: 'none' }} type="file" id="images" name="file" accept="image/jpeg" onChange={handleFileSelect} required >
                    </input>
                  </label>
                </Box>
              )
              }
            </Box>
            <video className="cssVideo" autoPlay muted ref={canvasRef} />
          </Box>
          <Box>
            <ImageList sx={{ width: 390, height: 70 }} cols={4} rowHeight={70}>
              <Box sx={backgroundSelect === 'bg1' ? { px: 1, background: "#00bcd4", borderRadius: 1 } : {}}>
                <ImageListItem>
                  <img
                    id="bg1"
                    src={backImage1}
                    alt='bg1'
                    loading="lazy"
                    onClick={() => BackgroundSelect('bg1')}
                  />
                </ImageListItem>
              </Box>
              <Box sx={backgroundSelect === 'bg2' ? { px: 1, background: "#00bcd4", borderRadius: 1 } : {}}>
                <ImageListItem>
                  <img
                    id="bg2"
                    src={backImage2}
                    alt='bg2'
                    loading="lazy"
                    onClick={() => BackgroundSelect('bg2')}
                  />
                </ImageListItem>
              </Box>
              <Box sx={backgroundSelect === 'bg3' ? { px: 1, background: "#00bcd4", borderRadius: 1 } : {}}>
                <ImageListItem>
                  <img
                    id="bg3"
                    src={backImage3}
                    alt='bg3'
                    loading="lazy"
                    onClick={() => BackgroundSelect('bg3')}
                  />
                </ImageListItem>
              </Box>
              <Box sx={backgroundSelect === 'bg4' ? { px: 1, background: "#00bcd4", borderRadius: 1 } : {}}>
                <ImageListItem>
                  <img
                    id="bg4"
                    src={backImage4}
                    alt='bg4'
                    loading="lazy"
                    onClick={() => BackgroundSelect('bg4')}
                  />
                </ImageListItem>
              </Box>
            </ImageList>
            <ImageList sx={{ width: 390, height: 70 }} cols={4} rowHeight={70}>
              <Box sx={backgroundSelect === 'bg5' ? { px: 1, background: "#00bcd4", borderRadius: 1 } : {}}>
                <ImageListItem>
                  <img
                    id="bg5"
                    src={backImage5}
                    alt='bg5'
                    loading="lazy"
                    onClick={() => BackgroundSelect('bg5')}
                  />
                </ImageListItem>
              </Box>
              <Box sx={backgroundSelect === 'bg6' ? { px: 1, background: "#00bcd4", borderRadius: 1 } : {}}>
                <ImageListItem>
                  <img
                    id="bg6"
                    src={backImage6}
                    alt='bg6'
                    loading="lazy"
                    onClick={() => BackgroundSelect('bg6')}
                  />
                </ImageListItem>
              </Box>
              <Box sx={backgroundSelect === 'bg7' ? { px: 1, background: "#00bcd4", borderRadius: 1 } : {}}>
                <ImageListItem>
                  <img
                    id="bg7"
                    src={backImage7}
                    alt='bg7'
                    loading="lazy"
                    onClick={() => BackgroundSelect('bg7')}
                  />
                </ImageListItem>
              </Box>
              <Box sx={backgroundSelect === 'bg8' ? { px: 1, background: "#00bcd4", borderRadius: 1 } : {}}>
                <ImageListItem>
                  <img
                    id="bg8"
                    src={backImage8}
                    alt='bg8'
                    loading="lazy"
                    onClick={() => BackgroundSelect('bg8')}
                  />
                </ImageListItem>
              </Box>
            </ImageList>
          </Box>
          <Box>
            <Button autoFocus variant="contained" color="info" onClick={() => close()}>
              remove background
            </Button>
          </Box>
        </Box>
      </Box>
    </Box >
  );
}

export default VirsualBackground;