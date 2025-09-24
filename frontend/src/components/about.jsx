import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import SimpleFooter from './footer';

const AboutModel = (props) => {
  const howItWorksSteps = [
    {
      title: "Audio Preprocessing",
      description: "Raw audio resampled to 16kHz mono, standardized to 8-second clips"
    },
    {
      title: "Feature Extraction", 
      description: "Wav2Vec2 feature extraction with Hugging Face FeatureExtractor"
    },
    {
      title: "Transformer Processing",
      description: "Facebook's pretrained wav2vec2-base model processes audio features"
    },
    {
      title: "Emotion Classification",
      description: "Emotion recognition with class-weighted loss handling"
    }
  ];

  const modelStats = [
    { label: "Accuracy", value: "94.64%" },
    { label: "Base Model", value: "wav2vec2-base" },
    { label: "Emotion Classes", value: "8" },
    { label: "Training Datasets", value: "5" }
  ];

  const technicalSpecs = [
    { spec: "Architecture", value: "facebook/wav2vec2-base + classification head" },
    { spec: "Input", value: "Raw audio (16kHz, 8s max)" },
    { spec: "Training", value: "Mixed-precision (CUDA amp)" },
    { spec: "Optimizer", value: "AdamW (LR=2e-5)" },
    { spec: "Scheduler", value: "CosineAnnealingLR" },
    { spec: "Batch Size", value: "16" },
    { spec: "Epochs", value: "14" }
  ];

  const datasets = [
    { name: "RAVDESS", emoji: "🎭", description: "Actor vocal emotional expressions" },
    { name: "CREMA-D", emoji: "🎤", description: "Diverse multi-act emotional speech" },
    { name: "TESS", emoji: "🎧", description: "Toronto emotional speech stimuli" },
    { name: "SAVEE", emoji: "🗣️", description: "Surrey audio-visual expressed emotion" },
    { name: "Custom Emotions", emoji: "➕", description: "Additional proprietary dataset" }
  ];

  const emotionClasses = [
    "Neutral", "Calm", "Happy", "Sad", 
    "Angry", "Fearful", "Disgust", "Surprised"
  ];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const fadeInDown = {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
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

  const staggerFast = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className={`about-section min-h-screen bg-black text-white p-6 lg:p-8${!props.resultsReady ? ' pulled' : ''}`}> 
      <div className="max-w-4xl mx-auto">
        
  {/* About Header */}
        <motion.div 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInDown}
        >
          <h1 className="text-4xl font-light bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            About The Model
          </h1>
          <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl">
            A fine-tuned wav2vec2 transformer model trained on multiple speech emotion datasets, 
            achieving ≈95% accuracy in 8-class vocal emotion recognition with real-time capabilities.
          </p>
        </motion.div>

  {/* How It Works Section */}
        <motion.section
          id="processing-pipeline"
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-2xl font-light text-white mb-8 border-b border-gray-800 pb-2"
            variants={slideInLeft}
          >
            Processing Pipeline
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {howItWorksSteps.map((step, index) => (
              <motion.div 
                key={index} 
                className="flex space-x-4"
                variants={index % 2 === 0 ? slideInLeft : slideInRight}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
              >
                <div className="text-cyan-400 font-mono text-sm mt-1 w-6">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

  {/* Model Performance Section */}
        <motion.section
          id="performance-metrics"
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
            Performance Metrics
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={staggerFast}
          >
            {modelStats.map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="text-center"
                variants={scaleIn}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="text-2xl font-light text-cyan-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

  {/* Technical Architecture Section */}
        <motion.section
          id="technical-specifications"
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-2xl font-light text-white mb-8 border-b border-gray-800 pb-2"
            variants={slideInRight}
          >
            Technical Specifications
          </motion.h2>
          
          <div className="space-y-4">
            {technicalSpecs.map((item, index) => (
              <motion.div 
                key={index} 
                className="flex justify-between items-center py-2 border-b border-gray-900"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.8 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.08,
                  ease: "easeOut" 
                }}
                whileHover={{ 
                  x: 10,
                  transition: { duration: 0.2 }
                }}
              >
                <span className="text-gray-300 text-sm">
                  {item.spec}
                </span>
                <span className="text-white text-sm font-mono">
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

  {/* Training Datasets Section */}
        <motion.section
          id="training-datasets"
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-2xl font-light text-white mb-8 border-b border-gray-800 pb-2"
            variants={slideInLeft}
          >
            Training Datasets
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {datasets.map((dataset, index) => (
              <motion.div 
                key={index}
                className="bg-gray-900 p-4 rounded-lg"
                variants={fadeInUp}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2">{dataset.emoji}</span>
                  <h3 className="text-white font-medium">{dataset.name}</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  {dataset.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

  {/* Emotion Classes Section */}
        <motion.section 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-2xl font-light text-white mb-8 border-b border-gray-800 pb-2"
            variants={fadeInDown}
          >
            Emotion Classes
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emotionClasses.map((emotion, index) => (
              <motion.div 
                key={index}
                className="text-center py-3 bg-gray-900 rounded-lg"
                variants={scaleIn}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <span className="text-cyan-400 text-sm">
                  {emotion}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

  {/* Model Details Section */}
        <motion.section 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          
        </motion.section>

  {/* Privacy & Ethics Section */}
        <motion.section 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-2xl font-light text-white mb-8 border-b border-gray-800 pb-2"
            variants={fadeInDown}
          >
            Privacy & Ethics
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              variants={slideInLeft}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <h3 className="text-purple-400 text-sm font-medium mb-3 uppercase tracking-wide">
                On-the-fly Processing
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Audio is processed in real-time without storage, ensuring user privacy and data protection.
              </p>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <h3 className="text-cyan-400 text-sm font-medium mb-3 uppercase tracking-wide">
                Bias Reduction
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Multi-dataset training from diverse sources minimizes bias toward any single dataset or voice type.
              </p>
            </motion.div>
            
            <motion.div
              variants={slideInRight}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <h3 className="text-purple-400 text-sm font-medium mb-3 uppercase tracking-wide">
                Fairness Focus
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Training incorporates diverse demographic groups to support fairness across different voices.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.5 }}
          variants={scaleIn}
        >
          <SimpleFooter />
        </motion.div>
      </div>
    </div>
  );
};


AboutModel.propTypes = {};

export default AboutModel;