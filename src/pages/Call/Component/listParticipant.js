import React, { useState, useEffect } from "react";

//CSS
import ButtonCSS from '../zoom.module.scss';

//Library
import {
  IconButton,
  MenuItem,
  Menu,
  Box,
  Typography,
  Badge,
  SwipeableDrawer,
  Tooltip,
  Divider
} from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

//Icon
import {
  faHand,
} from '@fortawesome/free-solid-svg-icons';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff'
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MonitorIcon from '@mui/icons-material/Monitor';
import PanToolIcon from '@mui/icons-material/PanTool';

export default function LongMenu(props) {
  const { pexRTC, setCountParticipants, listParticipants, setListParticipants } = props;
  const [stateSpeakers, setStateSpeakers] = useState(null)

  useEffect(() => {
    pexRTC.onStageUpdate = callActiveSpeakers;
    pexRTC.onRosterList = CallonRosterList;
  }, []);

  // List Participant
  function CallonRosterList(roster) {
    console.log(roster)
    setCountParticipants(roster.length)
    setListParticipants(roster)
  }

  function callActiveSpeakers(stage) {
    setStateSpeakers(stage)
  }

  function disconnectParticipant(uuid) {
    pexRTC.disconnectParticipant(uuid)
  }

  function mutePresentationParticipant(uuid, setting) {
    pexRTC.setParticipantRxPresentation(uuid, setting)
  }

  //Mute audio participant by HOST
  function muteAudioParticipant(uuid, setting) {
    pexRTC.setParticipantMute(uuid, setting)
  }

  //Mute Video participant by HOST
  function muteVideoParticipant(uuid, state) {
    if (state) {
      pexRTC.videoMuted(uuid)
    } else {
      pexRTC.videoUnmuted(uuid)
    }
  }

  //Clear Buzz by HOST
  function muteBuzzParticipant(uuid) {
    pexRTC.clearBuzz(uuid)
  }

  //Clear All Buzz by HOST
  function clearAllBuzzParticipant() {
    pexRTC.clearAllBuzz()
  }

  function setSpotlight(uuid, setting) {
    pexRTC.setParticipantSpotlight(uuid, setting)
  }

  return (
    <Box sx={{ overflow: 'auto' }} >
      {listParticipants?.map((name, i) => (
        <MenuItem key={i}>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Typography {...bindTrigger(popupState)}>{name?.display_name}</Typography>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem onClick={() => clearAllBuzzParticipant()}>เอามือลงทั้งหมด</MenuItem>
                  <MenuItem onClick={() => setSpotlight(name?.uuid, true)}>Spotlight</MenuItem>
                  <MenuItem onClick={() => disconnectParticipant(name?.uuid)}>บังคับออกจากการโทร</MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
          <Box sx={{ pl: 1 }}>
            {/* ฟังก์ชั่นของ Buzz */}
            {name?.buzz_time !== 0 &&
              <Tooltip title="เอามือลง">
                <IconButton color="default" sx={{ mx: 0 }} aria-label="presentation" onClick={() => muteBuzzParticipant(name?.uuid)}>
                  <PanToolIcon sx={{ width: '75%' }} />
                </IconButton>
              </Tooltip>
            }
            {/* ฟังก์ชั่นของ Presentation */}
            {name?.is_presenting === "YES" &&
              <IconButton color="default" sx={{ mx: 0 }} aria-label="presentation" onClick={() => mutePresentationParticipant(name?.uuid, false)}>
                <MonitorIcon sx={{ width: '75%' }} />
              </IconButton>
            }
            {/* ฟังก์ชั่นของ Audio */}
            {stateSpeakers?.find(speaker => speaker?.participant_uuid === name?.uuid)?.vad === 0 && name?.is_muted === "NO" &&
              <IconButton color="default" sx={{ mx: 0 }} aria-label="muteMucrophone" onClick={() => muteAudioParticipant(name?.uuid, true)}>
                <MicOffIcon sx={{ width: '75%' }} />
              </IconButton>
            }
            {stateSpeakers?.find(speaker => speaker?.participant_uuid === name?.uuid)?.vad === 100 && name?.is_muted === "NO" &&
              <IconButton color="error" sx={{ mx: 0 }} aria-label="unMuteMucrophone" onClick={() => muteAudioParticipant(name?.uuid, true)}>
                <MicIcon sx={{ width: '75%' }} className={ButtonCSS.blob} />
              </IconButton>
            }
            {name?.is_muted === "YES" &&
              <IconButton color="error" sx={{ mx: 0 }} aria-label="unMuteMucrophone" onClick={() => muteAudioParticipant(name?.uuid, false)}>
                <MicOffIcon sx={{ width: '75%' }} />
              </IconButton>
            }
            {/* ฟังก์ชั่นของ Video */}
            {name?.is_video_muted ? (
              <IconButton color="default" sx={{ mx: 0 }} aria-label="muteCamera" onClick={() => muteVideoParticipant(name?.uuid, false)}>
                <VideocamOffIcon sx={{ width: '75%' }} />
              </IconButton>
            ) : (
              <IconButton color="default" sx={{ mx: 0 }} aria-label="unMuteCamera" onClick={() => muteVideoParticipant(name?.uuid, true)}>
                <VideocamIcon sx={{ width: '75%' }} />
              </IconButton>
            )}
          </Box>
        </MenuItem>
      ))}
    </Box>
  );

}