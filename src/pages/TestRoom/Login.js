import React, { useRef, useEffect, useState } from "react";
import * as yup from "yup";
import Logo from "../../assets/img/logo.png";

import { Formik, Form } from "formik";
import Input from "./components/Field";

import { Box, Button, Typography, CircularProgress } from "@mui/material";

import { styled } from "@mui/material/styles";

import {
  TextField,
} from '@mui/material';

const Container = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItem: "center",
  justifyContent: "center",
}));

const TitleWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItem: "center",
  justifyContent: "center",
  flexDirection: "column",
  textAlign: "center",
  padding: "1em",
}));

const Title = styled(Typography)(({ theme }) => ({
  color: "#3D4F58",
  fontFamily: "Titillium Web",
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  color: "#5D6C74",
  fontFamily: "Titillium Web",
}));

const InputWrapper = styled(Box)(({ theme }) => ({
  paddingBottom: "0.25em",
}));

const Card = styled(Box)(({ theme }) => ({
  padding: "2.5em 2.5em",
  borderRadius: "10px",
  boxShadow:
    "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
}));

function Login( { navigate, pexRTC, setDialURI, setParticipantName, setPin, setPinGuest, setGuestLink } ) {
  const participantName = useRef('');
  const alias = useRef('');
  const hostpin = useRef('');
  const guestpin = useRef('');
  const validationSchema = yup.object({
    username: yup
      .string()
      .required()
      .max(30, "Maximum size of name is 30 characters")
      .min(5, "Minimum size of name is 5 characters"),
    password: yup.string().required(),
  });

  const initaileValues = {
    name: "",
    alias: "",
    hostpin: "",
    guestpin: ""
  };

  function connectCall() {
    setDialURI(alias.current.value);
    setParticipantName(participantName.current.value);
    setPin(hostpin.current.value)
    setPinGuest(guestpin.current.value)
    setGuestLink(process.env.REACT_APP_HOST + `/webrtcapp/guest/` + alias.current.value + `/` + guestpin.current.value)
    navigate('/webrtcapp/call');
  }

  return (
    <Container>
      <Card>
        <ImageWrapper>
          <img
            src={Logo}
            alt="Logo"
            style={{
              display: "block",
              maxWidth: "145px",
              maxHeight: "60px",
              width: "auto",
              height: "auto",
            }}
          />
        </ImageWrapper>
        <Box>
          <TitleWrapper>
            <Title variant="h4">One conference</Title>
            <SubTitle variant="overline">
              หมายเหตุ : ห้องชั่วคราวใช้สำหรับทดสอบเท่านั้น
            </SubTitle>
          </TitleWrapper>
          <Formik
            validateOnChange={true}
            initialValues={initaileValues}
            validationSchema={validationSchema}
            onSubmit={(data, { setSubmitting }) => {
              setSubmitting(true);
              // handleUpdateRequest(data);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, values }) => (
              <Form>
                <InputWrapper>
                  <Input
                    name="name"
                    label="Name"
                    variant="outlined"
                    size="small"
                    type="text"
                    inputRef={participantName}
                  />
                </InputWrapper>
                <InputWrapper>
                  <Input
                    name="alias"
                    label="Alias"
                    variant="outlined"
                    size="small"
                    type="text"
                    inputRef={alias}
                  />
                </InputWrapper>
                <InputWrapper>
                  <Input
                    name="hostpin"
                    label="Hostpin"
                    variant="outlined"
                    size="small"
                    type="password"
                    inputRef={hostpin}
                  />
                </InputWrapper>
                <InputWrapper>
                  <Input
                    name="guestpin"
                    label="Guestpin"
                    variant="outlined"
                    size="small"
                    type="password"
                    inputRef={guestpin}
                  />
                </InputWrapper>

                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  fullWidth
                  onClick={() => connectCall()}>Start room</Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Card>
    </Container>
  );
}

export default Login;
