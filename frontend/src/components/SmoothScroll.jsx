import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ReactLenis, useLenis } from 'lenis/react';
import Hero from './Hero';
import EmotionAnalysis from './results';
import AboutModel from './about';
import '../index.css';

const SmoothScroll = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [resultsReady, setResultsReady] = useState(false);
  const [showProcessingScreen, setShowProcessingScreen] = useState(false);
  const emotionRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
  if (!isRecording && hasRecorded && resultsReady && lenis && emotionRef.current) {
  
    const timeout = setTimeout(() => {
      lenis.scrollTo(emotionRef.current, { offset: 0 });
    }, 600);

    return () => clearTimeout(timeout);
  }
}, [isRecording, hasRecorded, resultsReady, lenis]);


  useEffect(() => {
    function handleEmotionResult(event) {
      setPredictionResult(event.detail);
  // Set results as ready after a brief delay
      setTimeout(() => {
        setResultsReady(true);
      }, 200);
    }
    window.addEventListener('emotionResult', handleEmotionResult);
    return () => {
      window.removeEventListener('emotionResult', handleEmotionResult);
    };
  }, []);

  useEffect(() => {
    // Scroll to results when they are ready
    if (resultsReady && lenis && emotionRef.current) {
  //
      const timeout = setTimeout(() => {
        lenis.scrollTo(emotionRef.current, { offset: 0 });
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [resultsReady, lenis]);

  const handleRecordingChange = (recording) => {
    setIsRecording(recording);
    if (!recording) {
      setHasRecorded(true);
      setResultsReady(false); // Reset results ready state
    }
  };

  return (
    <ReactLenis root>
  <main className={showProcessingScreen ? 'overflow-hidden h-screen' : ''}>
    <article>
      {/* HERO pinned */}
      <section className="h-screen w-full bg-slate-950 sticky top-0">
        <Hero isRecording={isRecording} setIsRecording={handleRecordingChange} />
      </section>

      <section
  ref={emotionRef}
  className={`relative w-full bg-gray-900 transition-opacity duration-500 ease-in-out ${
    resultsReady ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none h-0"
  }`}
>
  <EmotionAnalysis predictionResult={predictionResult} />
</section>





      {/* ABOUT pinned */}
      <section className="h-screen w-full bg-gray-900 sticky top-0">
        <AboutModel />
      </section>
    </article>
    

  </main>
</ReactLenis>


  );
};

SmoothScroll.propTypes = {};

export default SmoothScroll;
