
# Emotion Recognition Frontend

This is a modern, open source React web application for real-time speech emotion recognition. It provides a beautiful, interactive UI for analyzing vocal emotion using a neural network model, with seamless audio recording, file upload, and live results visualization.

## Features

- 🎤 Record your voice or upload audio files (WAV, MP3, etc...)
- ⚡ Real-time neural network emotion analysis (8 emotion classes)
- 📊 Animated, responsive results and probability breakdown
- 🟣 Neon-inspired UI with smooth transitions and accessibility
- 🔒 Privacy-first: audio is processed on-the-fly, never stored
- 🌐 Powered by a Hugging Face backend (wav2vec2-based model)

## Demo

Try the live demo: [https://manelbrh1342-emotion-recognition-app.hf.space/](https://manelbrh1342-emotion-recognition-app.hf.space/)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/manelbrh1342/emotion_recognition_frontend.git
cd emotion_recognition_frontend
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

- `src/components/` — All React components (UI, logic, loaders, etc.)
- `src/api.js` — API calls to the Hugging Face backend
- `src/index.css` — Tailwind CSS and global styles
- `public/` — Static assets (logo, icons, etc.)


