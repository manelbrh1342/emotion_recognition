from fastapi import FastAPI, File, UploadFile
import torch
import torch.nn.functional as F
import numpy as np
import librosa
import io
from transformers import Wav2Vec2ForSequenceClassification, Wav2Vec2FeatureExtractor
import soundfile as sf

# ===================================================== #
# Config
# ===================================================== #
MODEL_PATH = "manelbrh1342/emotion-recognition-model"  # Hugging Face model repo
TARGET_SR = 16000
DURATION = 4  # seconds
MAX_LENGTH = TARGET_SR * DURATION
TARGET_dB = -25  # target loudness for normalization

# ===================================================== #
# FastAPI initialization
# ===================================================== #
app = FastAPI()

# ===================================================== #
# Load model + processor
# ===================================================== #
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = Wav2Vec2ForSequenceClassification.from_pretrained(MODEL_PATH).to(device)
processor = Wav2Vec2FeatureExtractor.from_pretrained(MODEL_PATH)
model.eval()

# Correct label order (same as LabelEncoder in training)
emotion_labels = [
    "angry",
    "calm",
    "disgust",
    "fearful",
    "happy",
    "neutral",
    "sad",
    "surprised"
]

# ===================================================== #
# Helpers
# ===================================================== #
def normalize_volume(audio, target_dB=-25):
    """Normalize RMS loudness of the audio to target dB."""
    rms = np.sqrt(np.mean(audio**2))
    if rms < 1e-6:  # avoid division by zero
        return audio
    scalar = 10 ** (target_dB / 20) / rms
    audio = audio * scalar
    # Clip to valid range [-1, 1]
    return np.clip(audio, -1.0, 1.0)

TARGET_SR = 16000

def preprocess_audio(file_bytes):
    # Read directly from webm
    audio, sr = sf.read(io.BytesIO(file_bytes))
    # Resample
    if sr != TARGET_SR:
        audio = librosa.resample(audio.T, orig_sr=sr, target_sr=TARGET_SR)
    # If stereo → take mono
    if audio.ndim > 1:
        audio = librosa.to_mono(audio)
    return audio
# ===================================================== #
# Routes
# ===================================================== #
@app.get("/")
def root():
    return {"message": "Emotion recognition API is running 🚀"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Load + preprocess audio
    contents = await file.read()
    audio = preprocess_audio(contents)

    # Extract features
    inputs = processor(
        audio,
        sampling_rate=TARGET_SR,
        return_tensors="pt"
    ).to(device)

    # Run model
    with torch.no_grad():
        logits = model(**inputs).logits
        probs = F.softmax(logits, dim=-1).cpu().numpy()[0]
        pred_id = int(torch.argmax(logits, dim=-1).item())
        pred_label = emotion_labels[pred_id]

    return {
        "prediction": pred_label,
        "probabilities": {label: float(p) for label, p in zip(emotion_labels, probs)}
    }