import React, { useState } from 'react';
import img1 from './ImagesLayout/7+1.svg';

//Library
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  ImageList,
  ImageListItem,
  useMediaQuery,
  Box
} from '@mui/material';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';

//Icon
import CloseIcon from '@mui/icons-material/Close';
import { flexbox } from '@mui/system';

const BootstrapDialog = styled(Dialog)({
  "& > .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop": {
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }
});

const itemData1 = [
  {
    // img: 'https://pexip-edge1.one.th/webapp/custom_configuration/plugins/layout2/7+1.svg',
    img: 'https://i.imgur.com/3uLlgyA.png',
    title: '1:7',
  },
  {
    // img: 'https://pexip-edge1.one.th/webapp/custom_configuration/plugins/layout2/21+1.svg',
    img: 'https://i.imgur.com/e5ELovl.png',
    title: '1:21',
  },
  {
    // img: 'https://pexip-edge1.one.th/webapp/custom_configuration/plugins/layout2/21+2.svg',
    img: 'https://i.imgur.com/lgbyWKr.png',
    title: '2:21',
  },
  {
    img: 'https://i.imgur.com/rl1Smx8.png',
    // img: 'https://pexip-edge1.one.th/webapp/custom_configuration/plugins/layout2/33+1.svg',
    title: '1:33',
  },
  {
    // img: 'https://pexip-edge1.one.th/webapp/custom_configuration/plugins/layout2/5+7.svg',
    img: 'https://i.imgur.com/WqTWTvp.png',
    title: '5:7',
  }
];

const itemData2 = [
  {
    // img: 'https://pexip-edge1.one.th/webapp/custom_configuration/plugins/layout2/1+0.svg',
    img: 'https://i.imgur.com/eq2Wc2H.png',
    title: '1:0',
  },
  {
    img: 'https://i.imgur.com/NAkC1zP.png',
    // img: 'https://pexip-edge1.one.th/webapp/custom_configuration/plugins/layout2/4+0.svg',
    title: '4:0',
  },
  {
    img: 'https://i.imgur.com/fZIGQwO.png',
    // img: 'https://pexip-edge1.one.th/webapp/custom_configuration/plugins/layout2/9+0.svg',
    title: '9:0',
  },
  {
    img: 'https://i.imgur.com/Ff0l6Tl.png',
    // img: 'https://pexip-edge1.one.th/webapp/custom_configuration/plugins/layout2/16+0.svg',
    title: '16:0',
  },
  {
    // img: 'https://pexip-edge1.one.th/webapp/custom_configuration/plugins/layout2/25+0.svg',
    img: 'https://i.imgur.com/eYua5VP.png',
    title: '25:0',
  }
];

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

function DialogLayout(props) {
  const { pexRTC, openDialogLayout, setOpenDialogLayout } = props;
  const [select, setSelect] = useState('Default')
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setOpenDialogLayout(false);
  };

  function handleLayout(val) {
    pexRTC.transformLayout({
      layout: val
    })
    setSelect(val)
  }

  function stateName(val) {
    pexRTC.transformLayout({
      enable_overlay_text: val
    })
  }

  function defaultLayout() {
    pexRTC.transformLayout({
      layout: 'ac',
      enable_extended_ac: true,
      enable_active_speaker_indication: true,
      enable_overlay_text: true,
    })
    setSelect('Default')
  }

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openDialogLayout}
        fullScreen={fullScreen}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Layout control
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Speaker forcused layouts
          </Typography>
          <ImageList sx={{ width: 500, height: 100 }} cols={5} rowHeight={70}>
            {itemData1.map((item, i) => (
              <Box key={i}>
                {select === item.title ? (
                  <Box sx={{ py: 1, px: 1, background: "#6384B6", borderRadius: 1 }}>
                    <ImageListItem key={item.img}>
                      <img
                        src={`${item.img}`}
                        srcSet={`${item.img}`}
                        // src='7+1.svg'
                        alt={item.title}
                        loading="lazy"
                        onClick={() => handleLayout(item.title)}
                      />
                    </ImageListItem>
                  </Box>
                ) : (
                  <ImageListItem key={item.img}>
                    <img
                      src={`${item.img}`}
                      srcSet={`${item.img}`}
                      // src={img}
                      alt={item.title}
                      loading="lazy"
                      onClick={() => handleLayout(item.title)}
                    />
                  </ImageListItem>
                )
                }
              </Box>
            ))}
          </ImageList>
          <Typography gutterBottom>
            Equally focused layouts
          </Typography>
          <ImageList sx={{ width: 500, height: 100 }} cols={5} rowHeight={70}>
            {itemData2.map((item, i) => (
              <Box key={i}>
                {select === item.title ? (
                  <Box sx={{ py: 1, px: 1, background: "#6384B6", borderRadius: 1 }}>
                    <ImageListItem key={item.img}>
                      <img
                        src={`${item.img}`}
                        srcSet={`${item.img}`}
                        alt={item.title}
                        loading="lazy"
                        onClick={() => handleLayout(item.title)}
                      />
                    </ImageListItem>
                  </Box>
                ) : (
                  <ImageListItem key={item.img}>
                    <img
                      src={`${item.img}`}
                      srcSet={`${item.img}`}
                      alt={item.title}
                      loading="lazy"
                      onClick={() => handleLayout(item.title)}
                    />
                  </ImageListItem>
                )}
              </Box>
            ))}
          </ImageList>
        </DialogContent>
        <DialogActions sx={{ display: flexbox, justifyContent: 'space-between' }}>
          <div>
            {select === 'Default' ? (
              <Button autoFocus variant="contained" onClick={() => defaultLayout()}>
                Default
              </Button>
            ) : (
              <Button autoFocus onClick={() => defaultLayout()}>
                Default
              </Button>
            )}
          </div>
          <div>
            <Button autoFocus onClick={() => stateName(true)}>
              Show names
            </Button>
            <Button autoFocus onClick={() => stateName(false)}>
              Hide Names
            </Button>
          </div>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default DialogLayout
