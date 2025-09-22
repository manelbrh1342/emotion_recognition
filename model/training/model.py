"""
model.py — Model definitions for Speech Emotion Recognition
-----------------------------------------------------------
Contains all architectures used across milestones:
- FFNN (baseline)
- EmotionLSTM
- CRNN (CNN + BiLSTM)
- Wav2Vec2Classifier (Hugging Face)
"""

import torch
import torch.nn as nn
from transformers import Wav2Vec2ForSequenceClassification

# ---- FFNN baseline ----
class FFNN(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, output_dim)
        )

    def forward(self, x):
        return self.layers(x)


# ---- LSTM ----
class EmotionLSTM(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim, num_layers=2, dropout=0.0):
        super().__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers=num_layers,
                            dropout=dropout if num_layers > 1 else 0,
                            batch_first=True, bidirectional=False)
        self.fc = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        _, (hn, _) = self.lstm(x)
        return self.fc(hn[-1])


# ---- CRNN ----
class CRNN(nn.Module):
    def __init__(self, n_mels, cnn_channels, lstm_hidden, lstm_layers, dropout, num_classes):
        super().__init__()
        self.cnn = nn.Sequential(
            nn.Conv2d(1, cnn_channels, kernel_size=(3, 3), padding=1),
            nn.BatchNorm2d(cnn_channels),
            nn.ReLU(),
            nn.MaxPool2d((2, 2))
        )
        self.lstm = nn.LSTM(cnn_channels * (n_mels // 2), lstm_hidden,
                            num_layers=lstm_layers, dropout=dropout,
                            batch_first=True, bidirectional=True)
        self.fc = nn.Linear(lstm_hidden * 2, num_classes)

    def forward(self, x):
        x = x.unsqueeze(1)  # (batch, 1, time, n_mels)
        x = self.cnn(x)     # (batch, C, time/2, n_mels/2)
        b, c, t, f = x.size()
        x = x.permute(0, 2, 1, 3).contiguous().view(b, t, c * f)
        _, (hn, _) = self.lstm(x)
        return self.fc(torch.cat((hn[-2], hn[-1]), dim=1))


# ---- Wav2Vec2 ----
class Wav2Vec2Classifier(nn.Module):
    def __init__(self, pretrained="facebook/wav2vec2-base", num_labels=8):
        super().__init__()
        self.model = Wav2Vec2ForSequenceClassification.from_pretrained(
            pretrained,
            num_labels=num_labels,
            problem_type="single_label_classification"
        )

    def forward(self, x, attention_mask=None, labels=None):
        return self.model(x, attention_mask=attention_mask, labels=labels)
