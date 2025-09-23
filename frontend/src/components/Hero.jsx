import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, useInView } from 'framer-motion';
import Orb from './Orb';
import CardNav from './CardNav';
import HeroCard from './HeroCard';
import { predictEmotion } from '../api';
import AudioProcessingLoader from './AudioProcessingLoader';
import { useToast } from './Toast';
import './Hero.css';
import '../index.css';

const Hero = ({ isRecording, setIsRecording }) => {

  // Add missing audio state for recording
  const [audioContext, setAudioContext] = useState(null);
  const [source, setSource] = useState(null);
  const [processor, setProcessor] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  // Add any other missing state as needed

  // Add missing getAudioDuration and scrollToResults helpers
  const getAudioDuration = (file) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        URL.revokeObjectURL(url);
        resolve(duration);
      });
      audio.addEventListener('error', (e) => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load audio file'));
      });
      audio.src = url;
    });
  };

  const scrollToResults = () => {
    setTimeout(() => {
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Add missing audioBufferToWavBlob helper
  const audioBufferToWavBlob = (audioBuffer) => {
    const numOfChan = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    let pos = 0;
    function writeString(s) {
      for (let i = 0; i < s.length; i++) {
        view.setUint8(pos++, s.charCodeAt(i));
      }
    }
    function writeUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }
    function writeUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
    // WAV header
    writeString("RIFF");
    writeUint32(length - 8);
    writeString("WAVE");
    writeString("fmt ");
    writeUint32(16);
    writeUint16(1);
    writeUint16(numOfChan);
    writeUint32(audioBuffer.sampleRate);
    writeUint32(audioBuffer.sampleRate * numOfChan * 2);
    writeUint16(numOfChan * 2);
    writeUint16(16);
    writeString("data");
    writeUint32(length - 44);
    // Write PCM samples
    for (let channel = 0; channel < numOfChan; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      for (let i = 0; i < channelData.length; i++, pos += 2) {
        let sample = Math.max(-1, Math.min(1, channelData[i]));
        view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      }
    }
    return new Blob([buffer], { type: "audio/wav" });
  };

  // Add missing handleStartRecording and handleStopRecording
  const handleStartRecording = async () => {
    try {
      const ctx = new AudioContext();
      setAudioContext(ctx);
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(s);
      const src = ctx.createMediaStreamSource(s);
      setSource(src);
      // Use ScriptProcessorNode to collect PCM data
      const proc = ctx.createScriptProcessor(4096, 1, 1);
      setProcessor(proc);
      let chunks = [];
      proc.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        chunks.push(new Float32Array(input));
        setAudioChunks((prev) => [...prev, new Float32Array(input)]);
      };
      src.connect(proc);
      proc.connect(ctx.destination); // Required in some browsers
      setAudioChunks([]);
    } catch (err) {
      showToast('Unable to access microphone. Please check your permissions and try again.', 'error');
      console.error(err);
    }
  };

  const [stream, setStream] = useState(null);
  const handleStopRecording = async () => {
    if (source) source.disconnect();
    if (processor) processor.disconnect();
    if (stream) stream.getTracks().forEach(track => track.stop());
    setAudioContext(null);
    setSource(null);
    setProcessor(null);
    setAudioChunks([]);
    setStream(null);
  };

  // Toast
  const { showToast, ToastComponent } = useToast();
  const items = [
    {
      label: "Model Info",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "How It Works", href: "#processing-pipeline", ariaLabel: "Processing Pipeline" },
        { label: "Performance", href: "#performance-metrics", ariaLabel: "Performance Metrics" }
      ]
    },
    {
      label: "Technical",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Specifications", href: "#technical-specifications", ariaLabel: "Technical Specifications" },
        { label: "Training Data", href: "#training-datasets", ariaLabel: "Training Datasets" }
      ]
    },
    {
      label: "Contact",
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        { label: "Email", href: "mailto:manelbrh13@outlook.fr", ariaLabel: "Send Email" },
        { label: "GitHub", href: "https://github.com/manelbrh1342/emotion_recognition", ariaLabel: "View Source Code" }
      ]
    }
  ];

  // Card and recording state
  const [recordingTime, setRecordingTime] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showProcessingScreen, setShowProcessingScreen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingDone, setProcessingDone] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const MAX_RECORDING_TIME = 8;
  const MAX_AUDIO_DURATION = 10;
  const fileInputRef = useRef(null);



  // Handle file upload with duration validation
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await processFileWithValidation(file);
    }
  };

  // Process uploaded audio file
  const processUploadedAudio = async (fileParam) => {
    const fileToProcess = fileParam || uploadedFile;
    if (!fileToProcess) return;

    setIsProcessing(true);

    try {
      // Create audio context and decode the file
      const audioContext = new AudioContext();
      const arrayBuffer = await fileToProcess.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Convert to WAV format
      const wavBlob = audioBufferToWavBlob(audioBuffer);
      const audioFile = new File([wavBlob], fileToProcess.name.replace(/\.[^/.]+$/, "") + '.wav', { type: 'audio/wav' });

  //

      // Send to backend for emotion prediction
      const result = await predictEmotion(audioFile);
  //

      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('emotionResult', { detail: result }));
      }

      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Scroll to results after processing
      scrollToResults();
      showToast('Audio file processed successfully!', 'success', 3000);
    } catch (err) {
      showToast('Failed to process your audio file. Please try a different file.', 'error');
      console.error('Upload processing error:', err);
    } finally {
      setIsProcessing(false);
      setShowProcessingScreen(false);
      setProcessingDone(true);
    }
  };

  // Process file with validation
  const processFileWithValidation = async (file) => {
    // Validate file type
    if (!file.type.startsWith('audio/')) {
      showToast('Please select an audio file (MP3, WAV, M4A, etc.)', 'error');
      return false;
    }
    // Validate audio duration
    try {
      const duration = await getAudioDuration(file);
      if (duration > MAX_AUDIO_DURATION) {
        showToast(`Audio must be ${MAX_AUDIO_DURATION} seconds or shorter. Your file is ${duration.toFixed(1)} seconds long.`, 'error');
        return false;
      }
      // If duration is valid, proceed with processing
      setUploadedFile(file);
      setShowProcessingScreen(true);
      await processUploadedAudio(file);
      return true;
    } catch (err) {
      showToast('Unable to read audio file. Please try a different format.', 'error');
      console.error('Duration check error:', err);
      return false;
    }
  };


  const handleDragStateChange = (dragging) => {
    setIsDragging(dragging);
  };

  const handleHeroCardFileInput = async (file) => {
    const valid = await processFileWithValidation(file);
    if (!valid) setShowProcessingScreen(false);
  };

  const handleHeroCardFileDrop = async (file) => {
    const valid = await processFileWithValidation(file);
    if (!valid) setShowProcessingScreen(false);
  };

  // Timer logic with auto-stop at 8 seconds

  React.useEffect(() => {
    let timer;
    if (isRecording) {
      handleStartRecording();
      timer = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= MAX_RECORDING_TIME) {
            setIsRecording(false);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      // When recording stops, process the recorded audio and show processing screen
      handleStopRecording();
      setRecordingTime(0);
      setProcessingDone(false);
      // If there are audio chunks, process them
      if (audioChunks && audioChunks.length > 0 && audioContext) {
        // Merge Float32Array chunks into one
        const totalLength = audioChunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const merged = new Float32Array(totalLength);
        let offset = 0;
        for (let chunk of audioChunks) {
          merged.set(chunk, offset);
          offset += chunk.length;
        }
        // Create AudioBuffer
        const buffer = audioContext.createBuffer(1, merged.length, audioContext.sampleRate);
        buffer.copyToChannel(merged, 0, 0);
        // Convert to WAV
        const wavBlob = audioBufferToWavBlob(buffer);
        const audioFile = new File([wavBlob], 'recording.wav', { type: 'audio/wav' });
        // Validate and process just like an uploaded file
        processFileWithValidation(audioFile);
      }
    }
    return () => clearInterval(timer);
  }, [isRecording, setIsRecording]);



  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  return (
    <>
  {/* Toast */}
      <ToastComponent />
      
      <motion.section
        className="relative hero-section w-screen h-screen flex flex-col justify-end items-center overflow-x-hidden bg-black"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <CardNav
          logo={null}
          items={items}
          baseColor="rgba(20,20,30,0.6)"
          menuColor="#fff"
          buttonBgColor="rgba(40,40,60,0.7)"
          buttonTextColor="#fff"
          ease="power3.out"
        />
        
  {/* Title and subtitle */}
        <div className="absolute top-0 left-0 w-full min-h-[8rem] sm:min-h-[10rem] md:min-h-[12rem] lg:min-h-[13rem] flex flex-col items-center mt-22 sm:mt-16 md:mt-20 lg:mt-24 z-10 text-center px-4">
          <h1 className=" hero-title text-4xl lg:text-5xl xl:text-6xl font-light bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-1 sm:mb-2 md:mb-4">
            Voice Emotion Analysis
          </h1>
          <p className="hero subtitle text-white/70 text-sm sm:text-base md:text-lg lg:text-xl font-light max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-2">
            Neural network classification of emotional states from vocal patterns and acoustic features.
          </p>
        </div>
        
  {/* Neon orb background */}
        <div
          className="absolute"
          style={{
            width: '201vw',
            height: '100vw',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            transform: 'translateY(65%)',
          }}>
            <Orb hue={0} hoverIntensity={0.3} rotateOnHover={false} />
          </div>
        </div>

  {/* Processing Overlay */}
        {showProcessingScreen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center">
            <AudioProcessingLoader />
          </div>
        )}

        {/* HeroCard extracted card UI */}
        <HeroCard
          isRecording={isRecording}
          isClicked={isClicked}
          isDragging={isDragging}
          recordingTime={recordingTime}
          MAX_RECORDING_TIME={MAX_RECORDING_TIME}
          fileInputRef={fileInputRef}
          setIsClicked={setIsClicked}
          setIsRecording={setIsRecording}
          onFileDrop={handleHeroCardFileDrop}
          onFileInput={handleHeroCardFileInput}
          onDragStateChange={handleDragStateChange}
        />
      </motion.section>
    </>
  );
};

Hero.propTypes = {
  isRecording: PropTypes.bool.isRequired,
  setIsRecording: PropTypes.func.isRequired,
};

export default Hero;