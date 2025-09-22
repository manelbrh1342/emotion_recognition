"""
Milestone v1 — Feedforward Baseline (~12% accuracy)
---------------------------------------------------
- Architecture: Simple 3-layer feedforward NN on MFCCs (config.N_MFCC features).
- Dataset: RAVDESS
- Epochs: 30, Adam lr=0.001
- Test Accuracy: ~12.15%

Weaknesses:
- Ignores sequential nature of audio → emotions are temporal.
- Severe underfitting, fails to generalize.

Improvement over previous: Baseline, no previous version.
Next step → try sequence models (LSTM) that can “listen” over time.
"""

from training.datasets import RAVDESSDataset
from training.train import train_model
from training.model import FFNN
from training import config
from training.feature_extraction import get_transform

if __name__ == "__main__":
    transform = get_transform('mfcc')
    dataset = RAVDESSDataset(root_dir=config.DATASET_PATHS["ravdess"], transform=transform)
    model = FFNN(input_dim=config.N_MFCC, hidden_dim=64, output_dim=len(config.EMOTIONS))
    train_model(model, dataset=dataset, epochs=config.EPOCHS, lr=config.LEARNING_RATE)
