import React, { useEffect, useState } from 'react';
import axios from "axios";

//CSS
import '../CSS/ImagesPresentation.scss';
import '../Loading/loadingView.scss';

//Coponent
// import LoadingView from '../Loading/loadingView';

//Library
// import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled, useTheme } from '@mui/material/styles';
import {
  Button,
  ButtonGroup,
  Box,
  useMediaQuery,
  // Card,
  // Typography,
  // CardContent,
  // Avatar
} from '@mui/material';
// import { withStyles } from "@material-ui/core/styles";
import Swal from "sweetalert2/dist/sweetalert2.js";
// import { purple, grey } from '@mui/material/colors';

//Icon
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// const Audioonly = styled(Card)(({ theme }) => ({
//   backgroundColor: "#454545B3",
//   elevation: 12
// }));

// const BOLD = createTheme({
//   typography: {
//     "fontFamily": `"Kanit", sans-serif`,
//     "fontSize": 16,
//     "fontWeightLight": 400,
//     "fontWeightRegular": 600,
//     "fontWeightMedium": 700
//   }
// });

export default function ImagesPresentation({ pexRTC, dialURI, statePresentationOutputFIle, urlPresentation, statePresentationFile, fileImages, indexOfPage,
  setIndexOfPage, listParticipants, typePexRTC, participantName, loading }) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.only('xs'));
  const [presenLoading, setPresenLoading] = useState(false);

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

  useEffect(() => {
    if (statePresentationOutputFIle) {
      setPresenLoading(true)
      setInterval(function () { setPresenLoading(false) }, 2000);
    }
  }, [statePresentationOutputFIle])

  return (
    <div className='imgaeContainer'>
      {/* Type Conference audio only waiting room*/}
      {/* {typePexRTC !== '' && !loading && pexRTC.current_service_type === "waiting_room" &&
        <Box sx={{ display: 'flex', height: '100vh', width: '100%', alignSelf: 'center', justifyContent: 'center' }}>
          <Audioonly sx={{ alignSelf: 'center', height: '70%', width: '95%', objectFit: 'contain' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', bgcolor: purple[500] }}>
              <ThemeProvider theme={BOLD}>
                <Typography variant="h4" color={grey[50]} gutterBottom> Waiting for the host... </Typography>
              </ThemeProvider>
            </Box>
          </Audioonly>
        </Box>
      } */}
      {/* Type Conference audio only waiting room*/}
      {/* {typePexRTC !== '' && !loading && !statePresentationOutputFIle && listParticipants?.find(user => user?.uuid === pexRTC.uuid)?.is_presenting === "NO" && !statePresentationFile &&
        <Box sx={{ display: 'flex', height: '100vh', width: '100%', alignSelf: 'center', justifyContent: 'center' }}>
          <Audioonly sx={{ alignSelf: 'center', height: '70%', width: '95%', objectFit: 'contain' }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', }}>
              <Avatar sx={{ width: 150, height: 150, fontSize: '4.25rem', bgcolor: purple[500] }} aria-label="recipe">
                {participantName[0].toUpperCase()}
              </Avatar>
            </CardContent>
          </Audioonly>
        </Box>
      } */}

      {/* presentation file */}
      {statePresentationOutputFIle &&
        <Box sx={{ display: 'flex', height: '100vh', width: '100%', alignSelf: 'center', justifyContent: 'center' }}>
          {presenLoading &&
            <Box sx={{ display: 'flex', position: 'absolute', height: '100%', width: '100%', bgcolor: 'black' }}>
              <div className='centerTest'>
                <div className="wrapper">
                  <div className="circle"></div>
                  <div className="circle"></div>
                  <div className="circle"></div>
                  <div className="shadow"></div>
                  <div className="shadow"></div>
                  <div className="shadow"></div>
                </div>
              </div>
            </Box>
          }
          <img style={{ alignSelf: 'center', height: '100%', width: '100%', objectFit: 'contain' }} src={urlPresentation} alt="jpeg" id="conference" />
        </Box>
      }

      {/* presenter file */}
      {listParticipants?.find(user => user?.uuid === pexRTC.uuid)?.is_presenting === "YES" && statePresentationFile &&
        <Box sx={{ display: 'flex', height: '100vh', width: '100%', alignSelf: 'center', justifyContent: 'center' }} id="conference">
          {/* <Box sx={{ position: 'absolute' }}>
            <Button endIcon={<ArrowDropDownIcon />} />
          </Box> */}
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