import React, { useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router';

import './App.scss';
import 'typeface-roboto';

import Call from '../Call/Call';
import JoinCall from '../Join/joinCall';
import EndMeeting from '../End/endMeeting';
import LoadingView from '../Call/Loading/loadingView';

// Test
import RoomTest from '../TestRoom/Login';
import Guest from '../TestRoom/LoginGuest';

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
  const [refreshToken, setRefreshToken] = useState("")
  const [stateLockRoom, setsStateLockRoom] = useState(false)

  //Dialog Setting
  const [selectTab, setSelectTab] = useState('AUDIO')

  // LoadingViewM
  const [loading, setLoading] = useState(true);

  //presentation file
  const [fileImages, setFileImages] = useState([]);
  const [statePresentationFile, setStatePresentationFile] = useState(false)
  const [indexOfPage, setIndexOfPage] = useState(0)

  // Presentation
  const [statePresentation, setStatePresentation] = useState(false);
  const [quality, setQuality] = useState('SD');
  const [presenter, setPresenter] = useState('')

  //Vote System
  const [vote, setVote] = useState('')
  const [voteSecret, setVoteSecret] = useState(false)
  const [one_id, setOne_id] = useState('')
  const [indVote, setindVote] = useState(null);
  //open Vote For Host 
  const [stateVote, setStateVote] = useState(false);
  const [openDialogVote, setOpenDialogVote] = useState(false);
  //open Vote For Guest 
  const [stateVoteGuest, setStateVoteGuest] = useState(false);
  const [stateCheckGuestLogin, setStateCheckGuestLogin] = useState(false);
  const [stateCheckAuthority, setStateCheckAuthority] = useState(false);

  //control Microphone and Video
  const [micMute, setMicMute] = useState(false);
  const [vidMute, setVidMute] = useState(false);
  const [stateMic, setStateMic] = useState(null)

  //cameraUser
  const [stateSwitchCam, setStateSwitchCam] = useState(false);
  const [streamCamera, setStreamCamera] = useState(null);

  //Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogLayout, setOpenDialogLayout] = useState(false);
  const [openDialogAnnouce, setOpenDialogAnnouce] = useState(false);
  //open Dialog ParticipantsForMobile
  const [openDialogPartiForMobile, setOpenDialogPartiForMobile] = useState(false);

  //Listparticipant
  const [countParticipants, setCountParticipants] = useState(0)
  const [countBuzz, setCountBuzz] = useState(0)

  //CheackRole
  const [checkRole, setCheckRole] = useState(null);

  //StateCloseCameraUser
  const [stateCloseCamera, setStateCloseCamera] = useState(false)

  //SetupDevices
  const [selectAudio, setSelectAudio] = useState('default');
  const [selectVideo, setSelectVideo] = useState(null)
  const [selectOutput, setSelectOutput] = useState('default');
  // Check setSink
  const [stateOutput, setStateOutput] = useState(false);
  const audioRef = useRef(null);

  //Ontest
  const [openMessages, setOpenMessages] = useState(false);
  const [valueIndexOfDrawer, setValueIndexOfDrawer] = useState(0);
  const [listParticipants, setListParticipants] = useState()
  const [countMessages, setCountMessages] = useState(0)
  const [conferenceUpdate, setConferenceUpdate] = useState()

  //OneChat
  const [authen_tokenGuest, setAuthen_tokenGuest] = useState('')
  const [room_id, setRoom_id] = useState('')
  const [status_room_id, setStatus_room_id] = useState('')
  const [member_id, setMember_id] = useState('')
  const [authen_token, setAuthen_token] = useState('')
  const [refresh_token, setRefresh_token] = useState('')

  //Change background
  const [detect, setDetect] = useState(false);
  const [customVideo, setCustomVideo] = useState()
  const [backgroundSelect, setBackgroundSelect] = useState(null)
  const [loadingCamera, setLoadingCamera] = useState(false);
  const [stateUpload, setStateUpload] = useState(false)
  const [dataUpload, setDataUpload] = useState('')

  //Block Devices
  const [blockDevice, setBlockDevice] = useState(false)

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
            setRefreshToken={setRefreshToken}
            setAuthen_tokenGuest={setAuthen_tokenGuest}
            setStatus_room_id={setStatus_room_id}
            setMember_id={setMember_id}
            setOne_id={setOne_id}
            setsStateLockRoom={setsStateLockRoom}
            setBlockDevice={setBlockDevice}
          />
        }
      />
      {/* for Host */}
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
            statePresentation={statePresentation}
            setStatePresentation={setStatePresentation}
            quality={quality}
            setQuality={setQuality}
            status_room_id={status_room_id}
            member_id={member_id}
            openDialogVote={openDialogVote}
            setOpenDialogVote={setOpenDialogVote}
            stateLockRoom={stateLockRoom}
            indVote={indVote}
            setindVote={setindVote}
            setVote={setVote}
            stateMic={stateMic}
            setStateMic={setStateMic}
            stateSwitchCam={stateSwitchCam}
            setStateSwitchCam={setStateSwitchCam}
            loading={loading}
            setLoading={setLoading}
            countBuzz={countBuzz}
            setCountBuzz={setCountBuzz}
            setPresenter={setPresenter}
            presenter={presenter}
            voteSecret={voteSecret}
            setVoteSecret={setVoteSecret}
            setAccessToken={setAccessToken}
            refreshToken={refreshToken}
            setRefreshToken={setRefreshToken}
            streamCamera={streamCamera}
            setStreamCamera={setStreamCamera}
            audioRef={audioRef}
            selectOutput={selectOutput}
            setSelectOutput={setSelectOutput}
            stateOutput={stateOutput}
            setStateOutput={setStateOutput}
            selectTab={selectTab}
            setSelectTab={setSelectTab}
            customVideo={customVideo}
            setCustomVideo={setCustomVideo}
            backgroundSelect={backgroundSelect}
            setBackgroundSelect={setBackgroundSelect}
            detect={detect}
            setDetect={setDetect}
            blockDevice={blockDevice}
            loadingCamera={loadingCamera}
            setLoadingCamera={setLoadingCamera}
            dataUpload={dataUpload}
            setDataUpload={setDataUpload}
            stateUpload={stateUpload}
            setStateUpload={setStateUpload}
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
            authen_tokenGuest={authen_tokenGuest}
            setRoom_id={setRoom_id}
            setAuthen_token={setAuthen_token}
            setRefresh_token={setRefresh_token}
            statePresentation={statePresentation}
            setStatePresentation={setStatePresentation}
            quality={quality}
            setQuality={setQuality}
            status_room_id={status_room_id}
            member_id={member_id}
            openDialogVote={openDialogVote}
            setOpenDialogVote={setOpenDialogVote}
            stateVoteGuest={stateVoteGuest}
            setStateVoteGuest={setStateVoteGuest}
            stateCheckGuestLogin={stateCheckGuestLogin}
            setStateCheckGuestLogin={setStateCheckGuestLogin}
            one_id={one_id}
            stateCheckAuthority={stateCheckAuthority}
            setStateCheckAuthority={setStateCheckAuthority}
            stateMic={stateMic}
            setStateMic={setStateMic}
            stateSwitchCam={stateSwitchCam}
            setStateSwitchCam={setStateSwitchCam}
            loading={loading}
            setLoading={setLoading}
            countBuzz={countBuzz}
            setCountBuzz={setCountBuzz}
            setPresenter={setPresenter}
            presenter={presenter}
            voteSecret={voteSecret}
            setVoteSecret={setVoteSecret}
            streamCamera={streamCamera}
            setStreamCamera={setStreamCamera}
            audioRef={audioRef}
            selectOutput={selectOutput}
            setSelectOutput={setSelectOutput}
            stateOutput={stateOutput}
            setStateOutput={setStateOutput}
            selectTab={selectTab}
            setSelectTab={setSelectTab}
            customVideo={customVideo}
            setCustomVideo={setCustomVideo}
            backgroundSelect={backgroundSelect}
            setBackgroundSelect={setBackgroundSelect}
            detect={detect}
            setDetect={setDetect}
            blockDevice={blockDevice}
            loadingCamera={loadingCamera}
            setLoadingCamera={setLoadingCamera}
            dataUpload={dataUpload}
            setDataUpload={setDataUpload}
            stateUpload={stateUpload}
            setStateUpload={setStateUpload}
          />
        }
      />

      <Route
        path='/webrtcapp/endmeet/'
        element={
          <EndMeeting
            navigate={navigate}
            pexRTC={pexRTC}
            guestLink={guestLink}
          />
        }
      />
    </Routes>
  );
}

export default App;