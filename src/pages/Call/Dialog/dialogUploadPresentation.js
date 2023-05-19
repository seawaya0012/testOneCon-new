import React, { useState, useRef } from "react";
import axios from "axios";
import { Document, Page } from 'react-pdf';
import { useDropzone } from 'react-dropzone';

//CSS
import '../CSS/Upload.scss'

//Library
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  Typography
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import Swal from "sweetalert2/dist/sweetalert2.js";

//Icon
import CloseIcon from '@mui/icons-material/Close';
import { flexbox } from '@mui/system';
import SaveIcon from '@mui/icons-material/Save';

const BootstrapDialog = styled(Dialog)({
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

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

function DialogUploadPresentation(props) {
  const { pexRTC, dialURI, listParticipants, openDialogFilePre, setOpenDialogFilePre, presenter, setFileImages, setStatePresentationFile } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);

  // state check jpeg or pdf file 
  const sateFile = useRef(false)

  const handleClose = () => {
    setOpenDialogFilePre(false);
  };

  // Convert Base64 to blob
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

  function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  // ----------------------- //
  // const [pdfFile, setPdfFile] = useState(null);
  // const [numPages, setNumPages] = useState(null);
  // const [pageNumber, setPageNumber] = useState(1);
  // const [pdfData, setPdfData] = useState(null);
  // const [blob, setBlob] = useState(null);

  // const onDrop = (acceptedFiles) => {
  //   setPdfFile(acceptedFiles[0]);
  // };

  // const handleFileSelectPDF = (event) => {
  //   setPdfFile(event.target.files[0])
  // }

  // const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // const onDocumentLoadSuccess = ({ numPages }) => {
  //   setNumPages(numPages);
  // };

  // const handleRenderPage = (page) => {
  //   const canvas = document.createElement('canvas');
  //   const scale = 1;
  //   const viewport = page.getViewport({ scale });
  //   canvas.height = viewport.height;
  //   canvas.width = viewport.width;

  //   const renderContext = {
  //     canvasContext: canvas.getContext('2d'),
  //     viewport,
  //   };

  //   page.render(renderContext);
  //   console.log('renderContext', renderContext)
  //   const jpegData = canvas.toDataURL("image/jpeg");
  //   setPdfData(jpegData.data);
  // }
  // ---------------

  const PDFJS = require("pdfjs-dist/webpack");

  const readFileData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  };

  //param: file -> the input file (e.g. event.target.files[0])
  //return: images -> an array of images encoded in base64 
  const convertPdfToImages = async (file) => {
    setLoadingUpload(true)
    let images = []
    const data = await readFileData(file);
    const pdf = await PDFJS.getDocument(data).promise;
    const canvas = document.createElement("canvas");
    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const viewport = page.getViewport({ scale: 2 });
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      // images.append(canvas.toDataURL());
      images.push(canvas.toDataURL("image/jpeg"));
    }
    canvas.remove();
    const jpegFile64 = images[0].replace(/^data:image\/(png|jpeg);base64,/, "");
    setSelectedFile(await base64ToBlob(jpegFile64, 'image/jpeg'))
    console.log('successfully');
    setLoadingUpload(false)
    return images;
  }

  async function sendFileToPexitp() {
    // if (sateFile.current) {
    //   pexRTC.sendChatMessage('5|' + presenter)
    //   const delay = ms => new Promise(res => setTimeout(res, ms));
    //   await delay(1000);
    // }
    try {
      const response = await axios({
        method: "post",
        url: process.env.REACT_APP_WEB_PEX_RTC + '/api/client/v2/conferences/' + dialURI + '/participants/' + pexRTC.uuid + '/take_floor',
        data: { "jpegs": true },
        headers: { token: pexRTC.token },
      });
      if (response.data.status === "success") {
        // setStatePresentationFile(true)
        handleSubmit(selectedFile)
      }
    } catch (error) {
      setOpenDialogFilePre(false)
      Swal.fire({
        title: 'สกุลไฟล์ไม่รองรับ',
        text: "",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    }
  }

  //--------------------------------//

  const handleFileSelect = async (event) => {
    if (event.target.files[0].type === "application/pdf") {
      let data = await convertPdfToImages(event.target.files[0])
      setFileImages(data)
    } else {
      let data = await blobToBase64(event.target.files[0])
      setFileImages([data])
      setSelectedFile(event.target.files[0])
    }

    //Check user presenting?
    // if (event.target.files[0].type === "application/pdf" || event.target.files[0].type === "image/png") {
    //   if (presenter !== '') {
    //     sateFile.current = true
    //   } else {
    //     sateFile.current = false
    //   }
    // } else {
    //   sateFile.current = false
    // }
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
      if (response.data.status === "success") {
        setOpenDialogFilePre(false)
        setStatePresentationFile(true)
      }
    } catch (error) {
      setOpenDialogFilePre(false)
      Swal.fire({
        title: 'สกุลไฟล์ไม่รองรับ',
        text: "",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      try {
        const response = await axios({
          method: "post",
          url: process.env.REACT_APP_WEB_PEX_RTC + '/api/client/v2/conferences/' + dialURI + '/participants/' + pexRTC.uuid + '/release_floor',
          data: { "jpegs": true },
          headers: { token: pexRTC.token },
        });
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openDialogFilePre}
        fullScreen={fullScreen}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Presentation files
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {/* ---------------------- */}
          {/* <div>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag and drop a PDF file here, or click to select a file</p>
            </div>
            <div>
              <input type="file" accept="application/pdf" onChange={handleFileSelectPDF} />
            </div>
            {pdfFile && (
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page
                  pageNumber={pageNumber}
                  onRenderSuccess={handleRenderPage}
                />
              </Document>
            )}
            {pdfData && <img src={pdfData} alt="PDF as JPEG" />}
          </div> */}
          {/* ---------------------- */}
          {/* <form onSubmit={handleSubmit}> */}
          <label htmlFor="images" className="drop-container">
            <span className="drop-title">อัปโหลดรองรับแค่ JPEG และ PDF ไฟล์เท่านั้น</span>
            or
            <input type="file" id="images" name="file" accept="application/pdf, image/jpeg" onChange={handleFileSelect} required />
          </label>
          {/* <Typography gutterBottom>
            อัปโหลดรองรับแค่ JPEG และ PDF ไฟล์เท่านั้น
          </Typography>
          <input type="file" name="file" accept="application/pdf, image/jpeg" onChange={handleFileSelect} /> */}
          {/* <input type="submit" value="Upload File" /> */}
          {/* </form> */}

        </DialogContent>
        <DialogActions sx={{ display: flexbox, justifyContent: 'space-between' }}>
          <div>
          </div>
          <div>
            {loadingUpload ? (
              <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="outlined"
              >
                อัปโหลด
              </LoadingButton>
            ) : (
              <Button variant="contained" onClick={() => sendFileToPexitp()}>
                อัปโหลด
              </Button>
            )}
          </div>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default DialogUploadPresentation