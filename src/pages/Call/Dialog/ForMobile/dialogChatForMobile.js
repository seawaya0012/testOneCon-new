import React, { useState } from 'react';

//Library
import {
  IconButton,
  Dialog,
  DialogTitle,
  Box,
  useMediaQuery
} from '@mui/material';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';

//Icon
import CloseIcon from '@mui/icons-material/Close';

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

function DialogChatForMobile(props) {
  const { room_id, authen_token, refresh_token, openDialogChatForMobile, setOpenDialogChatForMobile } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setOpenDialogChatForMobile(false);
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openDialogChatForMobile}
        fullScreen={fullScreen}
      >
        <IconButton sx={{ top: 10, right: 25, position: 'absolute' }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <Box sx={{ width: "100%", height: "100vh", pt:6, overflow: "hidden" }}>
          <iframe width="100%" height="100%" src={`${process.env.REACT_APP_HOST_ONECHAT}/chat-plugin/authen?room_id=${room_id}&authen_token=${authen_token}&refresh_token=${refresh_token}`} frameBorder="0"></iframe>
        </Box>
      </BootstrapDialog>
    </div>
  );
}

export default DialogChatForMobile