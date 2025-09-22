"""
Milestone v5 — Wav2Vec2-Base Fine-Tuned (~85% accuracy)
--------------------------------------------------------
- Architecture: Hugging Face `facebook/wav2vec2-base` pretrained on speech.
- Fine-tuned for 8-class emotion recognition.
- Class-weighted CrossEntropy to address imbalance.
- Dataset: RAVDESS
- Epochs: ~10-15, AdamW lr=1e-5
- Test Accuracy: ~85.07%

Improvements over v4:
- Switched from CRNN (CNN+BiLSTM) to transformer-based Wav2Vec2 pretrained on large speech corpora.
- Learns directly from raw waveform, removing the need for handcrafted features.
- Transfer learning provides a significant accuracy boost (~69% → ~85%).

Weaknesses:
- Requires much more compute (GPU, memory).
- Relies on Hugging Face ecosystem for pretrained models.
- Still only trained on a single dataset (RAVDESS), so generalization is limited.
"""

from training.datasets import RAVDESSDataset
from training.train import train_model
from training.model import Wav2Vec2Classifier
from training import config

if __name__ == "__main__":
    dataset = RAVDESSDataset(root_dir=config.DATASET_PATHS["ravdess"])
    model = Wav2Vec2Classifier(pretrained="facebook/wav2vec2-base", num_labels=len(config.EMOTIONS))
    train_model(model, dataset=dataset, epochs=15, lr=1e-5, optimizer="adamw", class_weighted=True)
