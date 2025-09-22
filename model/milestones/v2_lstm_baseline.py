"""
Milestone v2 — LSTM Baseline (~33% accuracy)
--------------------------------------------
- Architecture: 2-layer LSTM, hidden=128, no dropout.
- Input: MFCC sequences (config.N_MFCC-dim, padded).
- Dataset: RAVDESS
- Epochs: 30, Adam lr=0.001
- Test Accuracy: ~32.99%

Improvement over v1:
- LSTM captures temporal structure of speech, improving accuracy from ~12% to ~33%.

Weaknesses:
- Still overfits quickly (no dropout).
- Uses only MFCC (limited representation).
"""

from training.datasets import RAVDESSDataset
from training.train import train_model
from training.model import EmotionLSTM
from training import config
from training.feature_extraction import get_transform

if __name__ == "__main__":
    transform = get_transform('mfcc')
    dataset = RAVDESSDataset(root_dir=config.DATASET_PATHS["ravdess"], transform=transform)
    model = EmotionLSTM(input_dim=config.N_MFCC, hidden_dim=128, output_dim=len(config.EMOTIONS), num_layers=2)
    train_model(model, dataset=dataset, epochs=config.EPOCHS, lr=config.LEARNING_RATE)
