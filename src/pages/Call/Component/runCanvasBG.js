import React, { useRef, useEffect, useState } from 'react';
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";

// assets
import backImage1 from "./Background/bg1.jpg";
import backImage2 from "./Background/bg2.jpg";
import backImage3 from "./Background/bg3.jpg";
import backImage4 from "./Background/bg4.jpg";
import backImage5 from "./Background/bg5.jpg";
import backImage6 from "./Background/bg6.jpg";
import backImage7 from "./Background/bg7.jpg";
import backImage8 from "./Background/bg8.jpg";

//Library
import {
  Box,
  ImageList,
  ImageListItem
} from '@mui/material';

function RunCanvasBG(prop) {
  const {
    pexRTC,
    customVideo,
    setCustomVideo,
    backgroundSelect,
    setLoadingCamera,
    selectVideo,
    dataUpload,
    setStateUpload
  } = prop;
  const inputVideoRef = useRef();
  const canvasRef = useRef();
  const contextRef = useRef();

  const constraints = {
    video: {
      width: { min: 1024, ideal: 1280, max: 1920 },
      height: { min: 576, ideal: 720, max: 1080 },
      deviceId: {
        exact: selectVideo
      },
    },
  };
  const selfieSegmentation = new SelfieSegmentation({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
  });

  const sendToMediaPipe = async () => {
    if (!customVideo) return;
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(1);
    await selfieSegmentation.send({ image: inputVideoRef.current });
    let timeoutId = setTimeout(sendToMediaPipe);
    if (!inputVideoRef.current) {
      clearTimeout(timeoutId);
    }
  }

  // const sendToMediaPipe = async () => {
  //   if (!customVideo) return;
  //   await selfieSegmentation.send({ image: inputVideoRef.current });
  //   let animationFrame = requestAnimationFrame(sendToMediaPipe);
  //   if (!inputVideoRef.current) {
  //     cancelAnimationFrame(animationFrame);
  //   }
  // };

  useEffect(() => {
    if (!customVideo) return setLoadingCamera(false);
    setLoadingCamera(true)
    selfieSegmentation.reset();
    contextRef.current = canvasRef.current.getContext("2d");
    selfieSegmentation.setOptions({
      modelSelection: 1,
      selfieMode: false,
    });
    selfieSegmentation.onResults(onResults);
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      inputVideoRef.current.srcObject = stream;
      sendToMediaPipe();
    });

    return () => {
      selfieSegmentation.reset();
      selfieSegmentation.close();
    };

  }, [backgroundSelect, customVideo, selectVideo]);

  const onResults = (results) => {
    if (!customVideo) return;
    contextRef.current.save();
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    contextRef.current.drawImage(
      results.segmentationMask,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    // Only overwrite existing pixels.
    contextRef.current.globalCompositeOperation = "source-out";
    if (!customVideo) {
      // contextRef.current.fillStyle = "#00FF0001";
      contextRef.current.fillStyle = "#00FF00";
    } else {
      const img = document.getElementById(backgroundSelect);
      const pat = contextRef.current.createPattern(img, "no-repeat");
      contextRef.current.fillStyle = pat;
    }
    // contextRef.current.fillStyle = "#00FF00";

    contextRef.current.fillRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    // Only overwrite missing pixels.
    contextRef.current.globalCompositeOperation = "destination-atop";
    contextRef.current.drawImage(
      results.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    contextRef.current.restore();
    setLoadingCamera(false)
  };

  return (
    <Box sx={{ display: 'none' }}>
      <Box sx={{ display: 'none' }}>
        <video id="clearCanvas" autoPlay ref={inputVideoRef} />
      </Box>
      <Box sx={{ display: 'none' }}>
        <canvas id="playback" ref={canvasRef} width="1280" height="720" />
      </Box>
      <Box sx={{ display: 'none', width: '100%', justifyContent: 'space-between' }}>
        <ImageList sx={{ width: 390, height: 100 }} cols={4} rowHeight={70}>
          <ImageListItem>
            <img
              id="bg9"
              src={dataUpload}
              alt='jpeg'
              loading="lazy"
            />
          </ImageListItem>
        </ImageList>
        <ImageList sx={{ width: 390, height: 100 }} cols={4} rowHeight={70}>
          <ImageListItem>
            <img
              id="bg1"
              src={backImage1}
              alt='bg1'
              loading="lazy"
            />
          </ImageListItem>
          <ImageListItem>
            <img
              id="bg2"
              src={backImage2}
              alt='bg2'
              loading="lazy"
            />
          </ImageListItem>
          <ImageListItem>
            <img
              id="bg3"
              src={backImage3}
              alt='bg3'
              loading="lazy"
            />
          </ImageListItem>
          <ImageListItem>
            <img
              id="bg4"
              src={backImage4}
              alt='bg4'
              loading="lazy"
            />
          </ImageListItem>
        </ImageList>
        <ImageList sx={{ width: 390, height: 100 }} cols={4} rowHeight={70}>
          <ImageListItem>
            <img
              id="bg5"
              src={backImage5}
              alt='bg5'
              loading="lazy"
            />
          </ImageListItem>
          <ImageListItem>
            <img
              id="bg6"
              src={backImage6}
              alt='bg6'
              loading="lazy"
            />
          </ImageListItem>
          <ImageListItem>
            <img
              id="bg7"
              src={backImage7}
              alt='bg7'
              loading="lazy"
            />
          </ImageListItem>
          <ImageListItem>
            <img
              id="bg8"
              src={backImage8}
              alt='bg8'
              loading="lazy"
            />
          </ImageListItem>
        </ImageList>
      </Box>
    </Box>
  );
}

export default RunCanvasBG;