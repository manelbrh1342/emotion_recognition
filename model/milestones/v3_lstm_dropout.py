"""
Milestone v3 — LSTM with Dropout & Log-Mel (~50% accuracy)
----------------------------------------------------------
- Architecture: 2-layer LSTM, hidden=128, dropout=0.3.
- Input: Log-Mel spectrograms (config.N_MELS-dim, normalized & trimmed).
- Dataset: RAVDESS
- Epochs: 30, Adam lr=0.001
- Test Accuracy: ~50.35%

Improvement over v2:
- Switching to log-mel spectrograms provides richer features, and dropout prevents overfitting, boosting accuracy from ~33% to ~50%.

Weaknesses:
- Still limited by pure LSTM; struggles with local spectral patterns.
- Training unstable on small datasets.

Next step → combine CNN + LSTM (CRNN).
"""

from training.datasets import RAVDESSDataset
from training.train import train_model
from training.model import EmotionLSTM
from training import config
from training.feature_extraction import get_transform

if __name__ == "__main__":
    transform = get_transform('logmel')
    dataset = RAVDESSDataset(root_dir=config.DATASET_PATHS["ravdess"], transform=transform)
    model = EmotionLSTM(input_dim=config.N_MELS, hidden_dim=128, output_dim=len(config.EMOTIONS), num_layers=2, dropout=0.3)
    train_model(model, dataset=dataset, epochs=config.EPOCHS, lr=config.LEARNING_RATE)
