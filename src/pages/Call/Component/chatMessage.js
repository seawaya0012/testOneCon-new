import React, { useState, useEffect } from "react";

//CSS
import ZoomCss from "../zoom.module.scss";

//Library
import {
  IconButton,
  InputBase,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

//Icon
import SendIcon from '@mui/icons-material/Send';

const MessageWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end"
}))

const PaperofText = styled(Box)(({ theme }) => ({
  borderRadius: '12px',
  background: "#7A7AE8",
  maxWidth: "240px",
  alignSelf: "flex-end",
  display: "flex",
  flexWrap: "wrap",
}))

const PaperofText1 = styled(Box)(({ theme }) => ({
  borderRadius: '12px',
  background: "#8A8A8A",
  maxWidth: "max-content",
  alignSelf: "flex-start",
  flexWrap: "wrap"
}))

const TextWrapper = styled(Typography)(({ theme }) => ({
  wordBreak: "break-word",
}))

const ContentPaperofText1 = styled(Box)(({ theme }) => ({
  maxWidth: "240px",
  alignSelf: "flex-start",
  flexWrap: "wrap",
}))

const InputChatBox = styled(Box)(({ theme }) => ({
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: "50%",
  background: "#FFFFFF",
}))

function ChatMessage(props) {
  const { pexRTC, participantName, setCountMessages, countMessages } = props;
  const [valueofMessage, setValueofMessage] = useState('')
  const [Messages, setMessages] = useState(null)
  const [chatMessages, setChatMessages] = useState([])

  useEffect(() => {
    pexRTC.onChatMessage = ChatMessage;
  }, []);

  useEffect(() => {
    if (Messages != null) {
      setChatMessages((prev) => [...prev, Messages])
      setCountMessages(countMessages + 1)
    }
  }, [Messages]);

  //รับ Message จาก RTC มาแสดง
  function ChatMessage(message) {
    setMessages(message)
  }

  //ส่ง Message ไปยัง RTC
  const handleChangeMessage = (event) => {
    event.preventDefault()
    if (event.key === "Enter") {
      SendMessage(); return
    }
    setValueofMessage(event.target.value)
  };

  //ส่ง Message ไปยัง RTC
  function SendMessage() {
    setChatMessages((prev) => [...prev, { origin: participantName, payload: valueofMessage, type: "text/plain" }])
    pexRTC.sendChatMessage(valueofMessage);
    setValueofMessage('')
  }

  return (
    <Box sx={{ pb: 7 }}>
      {chatMessages.map((message, i) => (
        <Box sx={{ padding: '5px 12px 5px 12px' }} key={i}>
          {participantName === message.origin &&
            <MessageWrapper>
              <Typography sx={{ color: '#7A7AE8' }} align="right" variant="caption" >
                You
              </Typography>
              <PaperofText sx={{ mb: 2 }}>
                <TextWrapper align="left" sx={{ color: '#FFFFFF', px: 1, py: 1 }} variant="body2" gutterBottom>
                  {message.payload}
                </TextWrapper>
              </PaperofText>
            </MessageWrapper>
          }
          {participantName !== message.origin &&
            <div>
              <Typography variant="caption" >
                {message.origin}
              </Typography>
              <ContentPaperofText1>
                <PaperofText1 sx={{ mb: 2 }}>
                  <TextWrapper align="left" sx={{ color: '#FFFFFF', px: 1, py: 1 }} variant="body2" gutterBottom>
                    {message.payload}
                  </TextWrapper>
                </PaperofText1>
              </ContentPaperofText1>
            </div>
          }
        </Box>
      ))}
      <Box sx={{ position: 'absolute', bottom: '0', bgcolor: 'white' }} elevation={3}>
        <Divider />
        <div className={ZoomCss.toolWrapper}>
          <InputChatBox sx={{ boxShadow: 1 }}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Send a message"
              value={valueofMessage}
              onChange={handleChangeMessage}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  SendMessage()
                }
              }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton id="sendMessage" color="primary" sx={{ p: '10px' }} onClick={() => SendMessage()} aria-label="directions">
              <SendIcon />
            </IconButton>
          </InputChatBox>
        </div>
      </Box>
    </Box>
  );
}

export default ChatMessage;