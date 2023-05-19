import React, { useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router';

import './App.scss';
import 'typeface-roboto';

import Call from '../Call/Call';
import JoinCall from '../Join/joinCall';

// Test
import RoomTest from '../TestRoom/Login';
import Guest from '../TestRoom/LoginGuest';
import LoadingView from '../Call/Loading/loadingView';

function App() {
  const navigate = useNavigate();

  //Initialize WebRTC
  const [pexRTC] = useState(new window['PexRTC']());
  const [dialURI, setDialURI] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [typePexRTC, setTypePexRTC] = useState('');
  const [bandwidth, setBandwidth] = useState(5000);
  const [uuid, setUuid] = useState("")
  const [pin, setPin] = useState("")
  const [pinGuest, setPinGuest] = useState("")
  const [guestLink, setGuestLink] = useState("")
  const [uuidRoom, setUuidRoom] = useState("")
  const [meetID, setMeetID] = useState("") 
  const [accessToken, setAccessToken] = useState("") 

  //presentation file
  const [fileImages, setFileImages] = useState([]);
  const [statePresentationFile, setStatePresentationFile] = useState(false)
  const [indexOfPage, setIndexOfPage] = useState(0)

  //Vote System
  const [vote, setVote] = useState('')
  const [stateVote, setStateVote] = useState(false);

  //control Microphone and Video
  const [micMute, setMicMute] = useState(false);
  const [vidMute, setVidMute] = useState(false);

  //cameraUser
  const pexipCamera = useRef(null);

  //Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogLayout, setOpenDialogLayout] = useState(false);
  const [openDialogAnnouce, setOpenDialogAnnouce] = useState(false);
  //open Dialog ParticipantsForMobile
  const [openDialogPartiForMobile, setOpenDialogPartiForMobile] = useState(false);

  //Listparticipant
  const [countParticipants, setCountParticipants] = useState(0)

  //CheackRole
  const [checkRole, setCheckRole] = useState(null);

  //StateCloseCameraUser
  const [stateCloseCamera, setStateCloseCamera] = useState(false)

  //SetupDevices
  const [selectAudio, setSelectAudio] = useState('default');
  const [selectVideo, setSelectVideo] = useState(null)

  //Ontest
  const [openMessages, setOpenMessages] = useState(false);
  const [valueIndexOfDrawer, setValueIndexOfDrawer] = useState(0);
  const [listParticipants, setListParticipants] = useState()
  const [countMessages, setCountMessages] = useState(0)
  const [conferenceUpdate, setConferenceUpdate] = useState()

  //OneChat
  const [room_idGuest, setRoom_idGuest] = useState('')
  const [authen_tokenGuest, setAuthen_tokenGuest] = useState('')
  const [room_id, setRoom_id] = useState('')
  const [authen_token, setAuthen_token] = useState('')
  const [refresh_token, setRefresh_token] = useState('')

  return (
    <Routes>
      <Route
        path='/webrtcapp/'
        element={
          <RoomTest
            navigate={navigate}
            pexRTC={pexRTC}
            setDialURI={setDialURI}
            setParticipantName={setParticipantName}
            setPin={setPin}
            setPinGuest={setPinGuest}
            setGuestLink={setGuestLink}
          />
        }
      />
      <Route
        path='/webrtcapp/guest/:id_dialURI/:id_guestPin'
        element={
          <Guest
            navigate={navigate}
            pexRTC={pexRTC}
            setDialURI={setDialURI}
            setParticipantName={setParticipantName}
            setPin={setPin}
            setPinGuest={setPinGuest}
          />
        }
      />
      <Route
        path='/webrtcapp/room/:id_role/:id_params'
        element={
          <LoadingView
            navigate={navigate}
            setDialURI={setDialURI}
            setParticipantName={setParticipantName}
            setTypePexRTC={setTypePexRTC}
            setBandwidth={setBandwidth}
            setPin={setPin}
            setPinGuest={setPinGuest}
            setGuestLink={setGuestLink}
            setSelectAudio={setSelectAudio}
            setSelectVideo={setSelectVideo}
            setMicMute={setMicMute}
            setVidMute={setVidMute}
            setRoom_id={setRoom_id}
            setAuthen_token={setAuthen_token}
            setRefresh_token={setRefresh_token}
            setUuidRoom={setUuidRoom}
            setMeetID={setMeetID}
            setVote={setVote}
            setAccessToken={setAccessToken}
            setRoom_idGuest={setRoom_idGuest}
            setAuthen_tokenGuest={setAuthen_tokenGuest}
          />
        }
      />
      <Route
        path='/webrtcapp/call/'
        element={
          <Call
            navigate={navigate}
            pexRTC={pexRTC}
            dialURI={dialURI}
            participantName={participantName}
            typePexRTC={typePexRTC}
            bandwidth={bandwidth}
            pin={pin}
            micMute={micMute}
            setMicMute={setMicMute}
            vidMute={vidMute}
            setVidMute={setVidMute}
            pexipCamera={pexipCamera}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            countParticipants={countParticipants}
            setCountParticipants={setCountParticipants}
            checkRole={checkRole}
            setCheckRole={setCheckRole}
            stateCloseCamera={stateCloseCamera}
            setStateCloseCamera={setStateCloseCamera}
            openDialogLayout={openDialogLayout}
            setOpenDialogLayout={setOpenDialogLayout}
            openDialogAnnouce={openDialogAnnouce}
            setOpenDialogAnnouce={setOpenDialogAnnouce}
            openMessages={openMessages}
            setOpenMessages={setOpenMessages}
            valueIndexOfDrawer={valueIndexOfDrawer}
            setValueIndexOfDrawer={setValueIndexOfDrawer}
            listParticipants={listParticipants}
            setListParticipants={setListParticipants}
            countMessages={countMessages}
            setCountMessages={setCountMessages}
            pinGuest={pinGuest}
            guestLink={guestLink}
            selectAudio={selectAudio}
            setSelectAudio={setSelectAudio}
            selectVideo={selectVideo}
            setSelectVideo={setSelectVideo}
            room_id={room_id}
            authen_token={authen_token}
            refresh_token={refresh_token}
            uuidRoom={uuidRoom}
            setUuid={setUuid}
            uuid={uuid}
            meetID={meetID}
            vote={vote}
            accessToken={accessToken}
            conferenceUpdate={conferenceUpdate}
            setConferenceUpdate={setConferenceUpdate}
            stateVote={stateVote}
            setStateVote={setStateVote}
            fileImages={fileImages}
            setFileImages={setFileImages}
            statePresentationFile={statePresentationFile}
            setStatePresentationFile={setStatePresentationFile}
            indexOfPage={indexOfPage}
            setIndexOfPage={setIndexOfPage}
            openDialogPartiForMobile={openDialogPartiForMobile}
            setOpenDialogPartiForMobile={setOpenDialogPartiForMobile}
          />
        }
      />

      {/* for Guest */}
      <Route
        path='/webrtcapp/join/'
        element={
          <JoinCall
            navigate={navigate}
            pexRTC={pexRTC}
            dialURI={dialURI}
            participantName={participantName}
            typePexRTC={typePexRTC}
            bandwidth={bandwidth}
            pin={pin}
            micMute={micMute}
            setMicMute={setMicMute}
            vidMute={vidMute}
            setVidMute={setVidMute}
            pexipCamera={pexipCamera}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            countParticipants={countParticipants}
            setCountParticipants={setCountParticipants}
            checkRole={checkRole}
            setCheckRole={setCheckRole}
            stateCloseCamera={stateCloseCamera}
            setStateCloseCamera={setStateCloseCamera}
            openDialogLayout={openDialogLayout}
            setOpenDialogLayout={setOpenDialogLayout}
            openDialogAnnouce={openDialogAnnouce}
            setOpenDialogAnnouce={setOpenDialogAnnouce}
            openMessages={openMessages}
            setOpenMessages={setOpenMessages}
            valueIndexOfDrawer={valueIndexOfDrawer}
            setValueIndexOfDrawer={setValueIndexOfDrawer}
            listParticipants={listParticipants}
            setListParticipants={setListParticipants}
            countMessages={countMessages}
            setCountMessages={setCountMessages}
            pinGuest={pinGuest}
            guestLink={guestLink}
            selectAudio={selectAudio}
            setSelectAudio={setSelectAudio}
            selectVideo={selectVideo}
            setSelectVideo={setSelectVideo}
            room_id={room_id}
            authen_token={authen_token}
            refresh_token={refresh_token}
            setUuid={setUuid}
            uuid={uuid}
            meetID={meetID}
            vote={vote}
            accessToken={accessToken}
            conferenceUpdate={conferenceUpdate}
            setConferenceUpdate={setConferenceUpdate}
            fileImages={fileImages}
            setFileImages={setFileImages}
            statePresentationFile={statePresentationFile}
            setStatePresentationFile={setStatePresentationFile}
            indexOfPage={indexOfPage}
            setIndexOfPage={setIndexOfPage}
            openDialogPartiForMobile={openDialogPartiForMobile}
            setOpenDialogPartiForMobile={setOpenDialogPartiForMobile}
            room_idGuest={room_idGuest}
            authen_tokenGuest={authen_tokenGuest}
            setRoom_id={setRoom_id}
            setAuthen_token={setAuthen_token}
            setRefresh_token={setRefresh_token}
          />
        }
      />
    </Routes>
  );
}

export default App;