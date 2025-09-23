import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FiMic, FiUpload } from 'react-icons/fi';
import { BsRecordCircle } from 'react-icons/bs';
import AudioVisualizer from './audio';

const HeroCard = ({
  isRecording,
  isClicked,
  isDragging,
  recordingTime,
  MAX_RECORDING_TIME,
  fileInputRef,
  setIsClicked,
  setIsRecording,
  onFileDrop,
  onFileInput,
  onDragStateChange,
}) => {
  // Progress bar calculations
  const progressPercentage = (recordingTime / MAX_RECORDING_TIME) * 100;
  const circumference = 2 * Math.PI * 32;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div
      className="hero-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-between mt-25"
      style={{
        width: '18rem',
        height: '18rem',
        background: isDragging ? 'rgba(30, 100, 200, 0.25)' : 'rgba(30, 80, 200, 0.18)',
        borderRadius: '1.5rem',
        boxShadow: isDragging
          ? '0 8px 32px 0 rgba(31, 100, 235, 0.5)'
          : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: isDragging ? '2px dashed rgba(100, 200, 255, 0.6)' : '1px dashed rgba(255,255,255,0.12)',
        zIndex: 10,
        transition: 'all 0.3s ease',
      }}
      onDragOver={e => {
        e.preventDefault();
        e.stopPropagation();
        onDragStateChange(true);
      }}
      onDragEnter={e => {
        e.preventDefault();
        e.stopPropagation();
        onDragStateChange(true);
      }}
      onDragLeave={e => {
        e.preventDefault();
        e.stopPropagation();
        onDragStateChange(false);
      }}
      onDrop={e => {
        e.preventDefault();
        e.stopPropagation();
        onDragStateChange(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          onFileDrop(e.dataTransfer.files[0]);
          e.dataTransfer.clearData();
        }
      }}
    >
      {/* Prompt */}
      <div className="hero-card-prompt w-full text-center pt-6 px-6">
        <span className="text-white text-lg font-thin">
          {isDragging ? 'Drop audio file here' : 'Record your voice or drag & drop an audio file'}
        </span>
      </div>

      {/* Audio visualizer */}
      <AudioVisualizer isRecording={isRecording} />

      {/* Drag & drop icon */}
      {isDragging && (
        <div className="flex items-center justify-center">
          <FiUpload size={32} color="rgba(100, 200, 255, 0.8)" className="mb-2" />
        </div>
      )}

      {/* Mic/Recording button */}
      <div className="hero-mic-button w-full flex justify-center pb-6">
        <button
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          onClick={() => {
            setIsClicked(true);
            setIsRecording(!isRecording);
            setTimeout(() => setIsClicked(false), 180);
          }}
          className="relative"
          style={{ outline: 'none', border: 'none', background: 'none' }}
        >
          {/* Progress Bar */}
          {isRecording && (
            <svg
              className="absolute inset-0 w-16 h-16 m-auto transform -rotate-90"
              viewBox="0 0 64 64"
              style={{ top: 0, bottom: 0, left: 0, right: 0 }}
            >
              <circle
                cx="32"
                cy="32"
                r="30"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="30"
                stroke="rgba(239, 68, 68, 0.8)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
          )}

          {/* Main mic button */}
          <div
            className={`flex items-center justify-center rounded-full transition-transform duration-150 ${isClicked ? 'scale-90' : 'scale-100'} ${
              isRecording ? 'animate-pulse' : ''
            }`}
            style={{
              width: 54,
              height: 54,
              background: '#fff',
              boxShadow: isRecording
                ? 'rgb(231 121 121) -1px 0px 20px 1px, rgb(231 121 121) 1px 0px 20px 1px, 0 0 30px rgb(231 121 121)'
                : 'rgb(121 164 231) -1px 0px 20px 1px, rgb(121 164 231) 1px 0px 20px 1px',
              transition: 'box-shadow 0.2s',
            }}
          >
            {isRecording ? (
              <BsRecordCircle
                size={22}
                color="#dc2626"
                className="animate-pulse"
              />
            ) : (
              <FiMic size={22} color="#222" />
            )}
          </div>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            onFileInput(e.target.files[0]);
          }
        }}
        accept="audio/*"
        style={{ display: 'none' }}
      />
    </div>
  );
};

HeroCard.propTypes = {
  isRecording: PropTypes.bool.isRequired,
  isClicked: PropTypes.bool.isRequired,
  isDragging: PropTypes.bool.isRequired,
  recordingTime: PropTypes.number.isRequired,
  MAX_RECORDING_TIME: PropTypes.number.isRequired,
  fileInputRef: PropTypes.object.isRequired,
  setIsClicked: PropTypes.func.isRequired,
  setIsRecording: PropTypes.func.isRequired,
  onFileDrop: PropTypes.func.isRequired,
  onFileInput: PropTypes.func.isRequired,
  onDragStateChange: PropTypes.func.isRequired,
};

export default HeroCard;
