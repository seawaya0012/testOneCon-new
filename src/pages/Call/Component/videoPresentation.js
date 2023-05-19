import React, { useState, useRef, useEffect } from 'react';

//CSS
import '../CSS/ImagesPresentation.scss';
import '../Loading/loadingView.scss';

//Library
import {
  Box,
} from '@mui/material';

export default function VideoPresentation({ streamPresentation, statePresentation, quality, urlPresentation }) {
  const pexipPresentRef = useRef(null);
  const [presenLoading, setPresenLoading] = useState(false);

  useEffect(() => {
    if (statePresentation) {
      setPresenLoading(true)
      setInterval(function () { setPresenLoading(false) }, 2000);
    }
  }, [statePresentation])

  useEffect(() => {
    if (quality === 'SD') {
      if (pexipPresentRef.current) {
        if (typeof MediaStream !== 'undefined' && streamPresentation instanceof MediaStream) {
          pexipPresentRef.current.srcObject = streamPresentation;
        } else {
          pexipPresentRef.current.src = streamPresentation;
        }
      }
    } else if (pexipPresentRef.current) {
      if (typeof MediaStream !== 'undefined' && streamPresentation instanceof MediaStream) {
        pexipPresentRef.current.srcObject = null;
      } else {
        pexipPresentRef.current.src = null;
      }
    }

  }, [streamPresentation, quality]);

  return (
    <div className='imgaeContainer'>
      {quality === 'HD' ? (
        <Box sx={{ display: 'flex', height: '100vh', width: '100%', alignSelf: 'center', justifyContent: 'center' }}>
          {presenLoading &&
            <Box sx={{ display: 'flex', position: 'absolute', height: '100%', width: '100%', bgcolor: 'black' }}>
              <div className='centerTest'>
                <div className="wrapper">
                  <div className="circle"></div>
                  <div className="circle"></div>
                  <div className="circle"></div>
                  <div className="shadow"></div>
                  <div className="shadow"></div>
                  <div className="shadow"></div>
                </div>
              </div>
            </Box>
          }
          <img style={{ alignSelf: 'top', height: '100%', width: '100%', objectFit: 'contain' }} src={urlPresentation} alt="jpeg" id="conference" />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', height: '100vh', width: '100%', alignSelf: 'center', justifyContent: 'center' }}>
          {presenLoading &&
            <Box sx={{ display: 'flex', position: 'absolute', height: '100%', width: '100%', bgcolor: 'black' }}>
              <div className='centerTest'>
                <div className="wrapper">
                  <div className="circle"></div>
                  <div className="circle"></div>
                  <div className="circle"></div>
                  <div className="shadow"></div>
                  <div className="shadow"></div>
                  <div className="shadow"></div>
                </div>
              </div>
            </Box>
          }
          <video style={{ alignSelf: 'center', height: '100%', width: '100%', objectFit: 'contain' }} ref={pexipPresentRef} muted autoPlay='autoplay' playsInline id="conference"></video>
        </Box>
      )}
    </div>
  );
}