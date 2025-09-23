import React from 'react';
import PropTypes from 'prop-types';

const AudioProcessingLoader = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden backdrop-blur-md bg-black/20">
      <div className="max-w-md mx-auto px-6">
        
  {/* Processing Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Processing Audio
          </h1>
          <p className="text-white/70 text-base font-light leading-relaxed">
            Neural network analysis in progress...
          </p>
        </div>

  {/* Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-1 h-3 bg-cyan-400/80 rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
            <div className="w-1 h-5 bg-purple-400/80 rounded-full animate-pulse" style={{animationDelay: '150ms'}}></div>
            <div className="w-1 h-4 bg-cyan-400/80 rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
            <div className="w-1 h-6 bg-purple-400/80 rounded-full animate-pulse" style={{animationDelay: '450ms'}}></div>
            <div className="w-1 h-4 bg-cyan-400/80 rounded-full animate-pulse" style={{animationDelay: '600ms'}}></div>
          </div>
        </div>

  {/* Info */}
        <div className="mt-10 text-center">
          <p className="text-white/40 text-xs font-light">
            if it takes too much time try again with a longer audio sample
          </p>
        </div>

      </div>
    </div>
  );
};


AudioProcessingLoader.propTypes = {};

export default AudioProcessingLoader;