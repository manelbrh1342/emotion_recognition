"""
Milestone v4 — CRNN + SpecAugment (~69% accuracy)
-------------------------------------------------
- Architecture: CNN frontend → BiLSTM → FC layers.
- Input: Log-Mel spectrograms (config.N_MELS-dim).
- Added SpecAugment for on-the-fly augmentation.
- Balanced classes with weighted CrossEntropy.
- Dataset: RAVDESS
- Epochs: 60, Adam (wd=1e-5), scheduler ReduceLROnPlateau
- Test Accuracy: ~69.44%

Improvement over v3:
- CNN extracts local spectral features for better representations, BiLSTM models temporal dependencies more robustly, and SpecAugment reduces overfitting. Accuracy improves from ~50% to ~69%.

Weaknesses:
- Heavy to train.
- Still dataset-limited (generalization may not scale).

Next step → try pretrained transformer (Wav2Vec2).
"""

from training.datasets import RAVDESSDataset
from training.train import train_model
from training.model import CRNN
from training import config
from training.feature_extraction import get_transform

if __name__ == "__main__":
    transform = get_transform('logmel', augment='specaugment')
    dataset = RAVDESSDataset(root_dir=config.DATASET_PATHS["ravdess"], transform=transform)
    model = CRNN(n_mels=config.N_MELS, cnn_channels=128, lstm_hidden=256, lstm_layers=2, dropout=0.3, num_classes=len(config.EMOTIONS))
    train_model(model, dataset=dataset, epochs=60, lr=1e-3, weight_decay=1e-5, scheduler="plateau")
