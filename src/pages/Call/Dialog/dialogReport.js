import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from "axios";

//Css
import reportCSS from '../CSS/Dialog.module.scss';
import '../CSS/Upload.scss'

//Library
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  useMediaQuery,
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

//Test
const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 'auto',
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

export default function DialogReport({ openDialogReprot, setOpenDialogReprot }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.only('xs'));
  const [loadingVote, setLoadingVote] = useState(false);
  const handleClose = () => {
    setOpenDialogReprot(false);
    setFiles([])
  };

  // document.addEventListener('DOMContentLoaded', (event) => {

  //   var dragSrcEl = null;

  //   function handleDragStart(e) {
  //     this.style.opacity = '0.4';

  //     dragSrcEl = this;

  //     e.dataTransfer.effectAllowed = 'move';
  //     e.dataTransfer.setData('text/html', this.innerHTML);
  //   }

  //   function handleDragOver(e) {
  //     if (e.preventDefault) {
  //       e.preventDefault();
  //     }

  //     e.dataTransfer.dropEffect = 'move';

  //     return false;
  //   }

  //   function handleDragEnter(e) {
  //     this.classList.add('over');
  //   }

  //   function handleDragLeave(e) {
  //     this.classList.remove('over');
  //   }

  //   function handleDrop(e) {
  //     if (e.stopPropagation) {
  //       e.stopPropagation(); // stops the browser from redirecting.
  //     }

  //     if (dragSrcEl !== this) {
  //       dragSrcEl.innerHTML = this.innerHTML;
  //       this.innerHTML = e.dataTransfer.getData('text/html');
  //     }

  //     return false;
  //   }

  //   function handleDragEnd(e) {
  //     this.style.opacity = '1';

  //     items.forEach(function (item) {
  //       item.classList.remove('over');
  //     });
  //   }

  //   let items = document.querySelectorAll('.container .box');
  //   items.forEach(function (item) {
  //     item.addEventListener('dragstart', handleDragStart, false);
  //     item.addEventListener('dragenter', handleDragEnter, false);
  //     item.addEventListener('dragover', handleDragOver, false);
  //     item.addEventListener('dragleave', handleDragLeave, false);
  //     item.addEventListener('drop', handleDrop, false);
  //     item.addEventListener('dragend', handleDragEnd, false);
  //   });
  // });

  function capture() {

  }

  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        {/* Revoke data uri after image is loaded */}
        <img src={file.preview} style={{ img }} onLoad={() => { URL.revokeObjectURL(file.preview) }} />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <div>
      <BackDrop
        fullScreen={fullScreen}
        open={openDialogReprot}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <ThemeProvider theme={BOLD}>
            <Typography>บันทึกภาพหน้าจอ</Typography>
          </ThemeProvider>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {/* <div className={reportCSS.container} sx={{ mt: 1, minWidth: 600, maxWidth: 650 }}>
            <div draggable="true" className={reportCSS.box}>A</div>
            <div draggable="true" className={reportCSS.box}>B</div>
            <div draggable="true" className={reportCSS.box}>C</div>
          </div> */}
          <div sx={{ mt: 1, minWidth: 600, maxWidth: 650 }}>

            <section className="container">
              <label htmlFor="images" className="drop-container" >
                <div className="drop-container" style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}} {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </label>
              <aside style={thumbsContainer}>
                {thumbs}
              </aside>
            </section>
          </div>
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
            <Button onClick={() => capture()} autoFocus>
              บันทึก
            </Button>
          )}
        </DialogActions>
      </BackDrop>
    </div>
  );
}