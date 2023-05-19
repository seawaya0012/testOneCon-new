import React, { useRef, useEffect, useState } from 'react';
import axios from "axios";

//CSS
import '../CSS/ImagesPresentation.scss';

//Library
import { styled, useTheme } from '@mui/material/styles';
import {
  Button,
  ButtonGroup,
  Box,
  useMediaQuery
} from '@mui/material';
import Swal from "sweetalert2/dist/sweetalert2.js";

//Icon
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function ImagesPresentation({ pexRTC, dialURI, statePresentationOutputFIle, urlPresentation, statePresentationFile, fileImages, indexOfPage,
  setIndexOfPage, openMessages }) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.only('xs'));

  //Function Presentation File
  function base64ToBlob(base64, mime) {
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
      var slice = byteChars.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
  }

  const handleSubmit = async (file) => {
    const formData = new FormData();
    formData.append("frame", file);
    try {
      const response = await axios({
        method: "post",
        url: process.env.REACT_APP_WEB_PEX_RTC + "/api/client/v2/conferences/" + dialURI + "/presentation",
        data: formData,
        headers: { "Content-Type": "multipart/form-data", token: pexRTC.token },
      });
      console.log('response', response)
    } catch (error) {
      console.log(error)
      Swal.fire({
        title: error,
        text: "",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    }
  }

  async function nextPagePresentationFile() {
    if (indexOfPage === fileImages?.length - 1) {
      await handleSubmit(await base64ToBlob(fileImages[0].replace(/^data:image\/(png|jpeg);base64,/, ""), 'image/jpeg'))
      setIndexOfPage(0)
    }
    else {
      await handleSubmit(await base64ToBlob(fileImages[indexOfPage + 1].replace(/^data:image\/(png|jpeg);base64,/, ""), 'image/jpeg'))
      setIndexOfPage(indexOfPage + 1)
    }
  }

  async function prevPagePresentationFile() {
    if (indexOfPage === 0) {
      await handleSubmit(await base64ToBlob(fileImages[fileImages?.length - 1].replace(/^data:image\/(png|jpeg);base64,/, ""), 'image/jpeg'))
      setIndexOfPage(fileImages?.length - 1)
    } else {
      await handleSubmit(await base64ToBlob(fileImages[indexOfPage - 1].replace(/^data:image\/(png|jpeg);base64,/, ""), 'image/jpeg'))
      setIndexOfPage(indexOfPage - 1)
    }
  }

  return (
    <div className='imgaeContainer'>
      {statePresentationOutputFIle &&
        <Box sx={{ display: 'flex', height: '100vh', width: '100%', alignSelf: 'center', justifyContent: 'center' }}>
          <img style={{ alignSelf: 'center', height: '100%', width: '100%', objectFit: 'contain' }} src={urlPresentation} alt="jpeg" />
        </Box>
      }
      {statePresentationFile &&
        <Box sx={{ display: 'flex', height: '100vh', width: '100%', alignSelf: 'center', justifyContent: 'center' }}>
          <Box sx={{ position: 'absolute', top: 20 }}>
            {!matches &&
              <ButtonGroup
                disableElevation
                variant="contained"
                aria-label="Disabled elevation buttons"
              >
                <Button variant="contained" endIcon={<ArrowBackIosIcon />} onClick={() => prevPagePresentationFile()} />
                <Button>{indexOfPage + 1}/{fileImages?.length}</Button>
                <Button variant="contained" endIcon={<ArrowForwardIosIcon />} onClick={() => nextPagePresentationFile()} />
              </ButtonGroup>
            }
          </Box>
          <img style={{ alignSelf: 'center', height: '100%', width: '100%', objectFit: 'contain' }} src={fileImages[indexOfPage]} alt="jpeg" />
        </Box>
      }
    </div>
  );
}