import { useEffect } from 'react';

var Centrifuge = require("centrifuge");

function GetInfoOneChat(props) {
  const { status_room_id, pexRTC, setCountMessages, countMessages, participantName } = props
  const centrifuge = new Centrifuge(process.env.REACT_APP_CENTRIFUGE_SOCKET);
  centrifuge.setToken(process.env.REACT_APP_CENTRIFUGE_KEY)
  // let checkMessage = null

  useEffect(() => {
    // Set up event listeners
    centrifuge.subscribe(`message-room-${status_room_id}`, function (message) {
      if (message.data.sender_name !== participantName && message.data.receiver_id !== null) {
        setCountMessages(countMessages + 1)
      }
    })

    centrifuge.on('connect', () => {
      console.log('Connected to Centrifugo server');
    });

    centrifuge.on('disconnect', () => {
      console.log('Disconnected from Centrifugo server');
    });

    centrifuge.on('error', (err) => {
      console.error('Error connecting to Centrifugo server:', err);
    });

    centrifuge.connect();
    return () => {
      centrifuge.disconnect();
    };
  }, []);

}

export default GetInfoOneChat;