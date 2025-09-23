import React, { useEffect, useRef } from "react";
import PropTypes from 'prop-types';

const AudioVisualizer = ({ isRecording }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = 250;

    const numLines = 6;
    const analyserConfig = [];
    let audioCtx, source, stream;

    const colors = [
  "rgba(127,90,240,0.85)",
  "rgba(59,130,246,0.85)",
  "rgba(255,255,255,0.7)",
  "rgba(0,255,255,0.6)",
  "rgba(30,80,200,0.7)",
  "rgba(128,0,255,0.6)",
    ];

    function drawStatic() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < numLines; i++) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = colors[i % colors.length];
        const midY = canvas.height / 2 + (i - numLines / 2) * 5;
        for (let x = 0; x < canvas.width; x += 10) {
          const y = midY;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      analyserConfig.forEach((conf, i) => {
        conf.analyser.getByteFrequencyData(conf.buffer);
        const avg = conf.buffer.reduce((a, b) => a + b, 0) / conf.buffer.length;
        const motion = (avg / 255) * 60;
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = colors[i % colors.length];
        const midY = canvas.height / 2 + conf.offset;
        for (let x = 0; x < canvas.width; x += 10) {
          const angle =
            (x / canvas.width) * Math.PI * 2 +
            Date.now() * 0.00005 * (i + 1);
          const y = midY + Math.sin(angle) * motion;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      animationRef.current = requestAnimationFrame(draw);
    }

    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((s) => {
        stream = s;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = audioCtx.createMediaStreamSource(stream);
        for (let i = 0; i < numLines; i++) {
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          analyserConfig.push({
            analyser,
            buffer: new Uint8Array(analyser.frequencyBinCount),
            offset: (i - numLines / 2) * 5,
          });
        }
        draw();
      });
    } else {
      drawStatic();
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioCtx) audioCtx.close();
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [isRecording]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "250px",
        background: "transparent",
        display: "block",
      }}
    />
  );
};


AudioVisualizer.propTypes = {
  isRecording: PropTypes.bool.isRequired,
};

export default AudioVisualizer;
