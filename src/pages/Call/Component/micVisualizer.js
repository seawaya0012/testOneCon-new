import React, { useEffect, useRef } from "react";

function MicVisualizer(props) {
  const { audioStream } = props;
  const canvasRef = useRef(null);

  useEffect(() => {
    if (audioStream === null) return;

    const audioContext = new AudioContext();
    const analyserNode = audioContext.createAnalyser();
    const sourceNode = audioContext.createMediaStreamSource(audioStream);

    sourceNode.connect(analyserNode);
    analyserNode.connect(audioContext.destination);

    const canvasCtx = canvasRef.current.getContext('2d');

    const draw = () => {
      requestAnimationFrame(draw);

      const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
      analyserNode.getByteFrequencyData(dataArray);

      if (!canvasRef.current) return;

      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      const barWidth = (canvasRef.current.width / dataArray.length) * 20.5;
      let barHeight;
      let x = 0;

      dataArray.forEach((value) => {
        barHeight = value * 0.7;

        canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
        canvasCtx.fillRect(x, canvasRef.current.height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      });
    };

    draw();

    return () => {
      sourceNode.disconnect();
      analyserNode.disconnect();
      audioContext.close();
    };
  }, [audioStream]);

  return (
    <canvas muted ref={canvasRef} width={380} height={100} />
  )
}

export default MicVisualizer