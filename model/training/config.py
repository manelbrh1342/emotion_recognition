"""
config.py — Global configuration for training
---------------------------------------------
Contains dataset paths, hyperparameters, and constants.
"""

# Dataset paths (adjust to your local setup)
DATASET_PATHS = {
    "ravdess": "datasets/ravdess",
    "cremad": "datasets/cremad",
    "tess": "datasets/tess",
    "savee": "datasets/savee"
}

# Training hyperparameters
BATCH_SIZE = 32
EPOCHS = 30
LEARNING_RATE = 1e-3
WEIGHT_DECAY = 1e-5

# Audio parameters

SAMPLE_RATE = 16000
N_MELS = 40
N_MFCC = 13
N_FFT = 512
HOP_LENGTH = 160
MAX_AUDIO_SECONDS = 4
MAX_AUDIO_SAMPLES = SAMPLE_RATE * MAX_AUDIO_SECONDS  # 64000


# Emotion classes (fixed across datasets)
EMOTIONS = [
    "angry", "calm", "disgust", "fearful",
    "happy", "neutral", "sad", "surprised"
]

# Reproducibility utility
def set_seed(seed=42):
    import random, torch, numpy as np
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)
