import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const EmotionAnalysis = ({ predictionResult }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [processedData, setProcessedData] = useState(null);

  useEffect(() => {
    if (predictionResult) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setProcessedData(predictionResult);
        setIsLoading(false);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setIsLoading(true);
      setProcessedData(null);
    }
  }, [predictionResult]);

  const emotions = processedData && processedData.probabilities
    ? Object.entries(processedData.probabilities).map(([emotion, prob]) => {
        const normalized = emotion?.toLowerCase() || '';
        return {
          name: normalized.charAt(0).toUpperCase() + normalized.slice(1),
          value: Math.round(prob * 100),
          raw: prob
        };
      }).sort((a, b) => b.value - a.value)
    : [];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };
  const dominantEmotion = processedData ? processedData.prediction : 'Unknown'; 
  const dominantValue = processedData && processedData.probabilities 
    ? Math.round(processedData.probabilities[processedData.prediction] * 100) 
    : 0;

  // Loading state
  if (isLoading || !processedData) {
    return (
      <div className="min-h-screen backdrop-blur-md bg-black text-white p-6 lg:p-8 flex items-center justify-center">
        <div className="relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-1.5">
              <div className="w-1 bg-gradient-to-t from-cyan-400 to-purple-400 rounded-full animate-pulse" style={{height: '12px', animationDelay: '0ms'}}></div>
              <div className="w-1 bg-gradient-to-t from-purple-400 to-cyan-400 rounded-full animate-pulse" style={{height: '20px', animationDelay: '150ms'}}></div>
              <div className="w-1 bg-gradient-to-t from-cyan-400 to-purple-400 rounded-full animate-pulse" style={{height: '16px', animationDelay: '300ms'}}></div>
              <div className="w-1 bg-gradient-to-t from-purple-400 to-cyan-400 rounded-full animate-pulse" style={{height: '24px', animationDelay: '450ms'}}></div>
              <div className="w-1 bg-gradient-to-t from-cyan-400 to-purple-400 rounded-full animate-pulse" style={{height: '18px', animationDelay: '600ms'}}></div>
            </div>
            
            <div className="text-center space-y-3">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
                Analyzing Results
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Processing emotion patterns
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
  {/* Results Header */}
        <motion.div 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <h1 className="text-4xl font-light bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Emotion Analysis Results
          </h1>
          <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl">
            Neural network classification with confidence scoring across detected emotional states.
          </p>
        </motion.div>

  {/* Dominant Emotion Section */}
        <motion.section 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-2xl font-light text-white mb-8 border-b border-gray-800 pb-2"
            variants={fadeInUp}
          >
            Primary Classification
          </motion.h2>
          
          <motion.div 
            className="text-center"
            variants={fadeInUp}
          >
            <motion.div 
              className="text-6xl font-light text-cyan-400 mb-2"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {dominantValue}%
            </motion.div>
            <motion.div 
              className="text-gray-400 text-sm mb-4"
              variants={fadeInUp}
            >
              Confidence Level
            </motion.div>
            <motion.div 
              className="text-2xl font-light text-white"
              variants={fadeInUp}
            >
              {dominantEmotion && typeof dominantEmotion === 'string' 
                ? dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1) 
                : 'Unknown'}
            </motion.div>
          </motion.div>
        </motion.section>

  {/* Probability Distribution Section */}
        <motion.section 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-2xl font-light text-white mb-8 border-b border-gray-800 pb-2"
            variants={fadeInUp}
          >
            Probability Distribution
          </motion.h2>
          
          <div className="space-y-4">
            {emotions.map((emotion, index) => (
              <motion.div 
                key={emotion.name} 
                className="group"
                variants={fadeInUp}
                custom={index}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.8 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white text-sm font-light">
                    {emotion.name}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400 text-xs font-mono">
                      {emotion.raw.toFixed(4)}
                    </span>
                    <span className="text-white text-sm font-mono w-10 text-right">
                      {emotion.value}%
                    </span>
                  </div>
                </div>
                
                <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400/80 to-purple-400/80 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${emotion.value}%` }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ 
                      duration: 1.2, 
                      delay: index * 0.1 + 0.3,
                      ease: "easeOut" 
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

  {/* Model Performance Context Section */}
        <motion.section 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-2xl font-light text-white mb-8 border-b border-gray-800 pb-2"
            variants={fadeInUp}
          >
            Performance Context
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={slideInLeft}>
              <h3 className="text-cyan-400 text-sm font-medium mb-3 uppercase tracking-wide">
                Classification Reliability
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Confidence scores above 0.7 indicate high reliability. Lower scores suggest 
                mixed emotional states or ambiguous vocal patterns requiring human interpretation.
              </p>
            </motion.div>
            
            <motion.div variants={slideInRight}>
              <h3 className="text-purple-400 text-sm font-medium mb-3 uppercase tracking-wide">
                Model Limitations
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Performance may vary with background noise, non-native accents, or atypical 
                vocal expressions. Results should be interpreted as computational estimates.
              </p>
            </motion.div>
          </div>
        </motion.section>

      </div>
    </div>
  );
};


EmotionAnalysis.propTypes = {
  predictionResult: PropTypes.object,
};

export default EmotionAnalysis;