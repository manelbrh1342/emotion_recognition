"""
Milestone v6 — Wav2Vec2-Base Fine-Tuned on Multiple Datasets (~94.96% accuracy)
-------------------------------------------------------------------------------
- Architecture: Hugging Face `facebook/wav2vec2-base` pretrained on speech.
- Fine-tuned for 8-class emotion recognition.
- Dataset: Combined RAVDESS + CREMA-D + TESS + SAVEE
- Loss: Class-weighted CrossEntropy (to handle imbalance across corpora)
- Optimizer: AdamW, lr=1e-5, scheduler linear decay
- Epochs: ~15
- Test Accuracy: ~94.96%

Improvements over v5:
- Fine-tuned on multiple datasets (RAVDESS, CREMA-D, TESS, SAVEE) for greater diversity and generalization.
- Larger training set reduces overfitting.
- Accuracy improves from ~85% to ~95%.

Weaknesses:
- Still limited to English corpora.
- Model is heavy for deployment; may require distillation or quantization.
"""

from training.datasets import MultiDataset
from training.train import train_model
from training.model import Wav2Vec2Classifier
from training import config

if __name__ == "__main__":
    dataset = MultiDataset(datasets=["ravdess", "cremad", "tess", "savee"])
    model = Wav2Vec2Classifier(pretrained="facebook/wav2vec2-base", num_labels=len(config.EMOTIONS))
    train_model(model, dataset=dataset, epochs=15, lr=1e-5, optimizer="adamw", class_weighted=True, scheduler="linear")
