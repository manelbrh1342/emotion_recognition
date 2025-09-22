"""
base_dataset.py — Base dataset class
------------------------------------
Provides a unified interface for all SER datasets.
"""

import torch
from torch.utils.data import Dataset
import torchaudio
from training import config
import os

class BaseSERDataset(Dataset):
    def __init__(self, root_dir, transform=None, emotions=config.EMOTIONS):
        self.root_dir = root_dir
        self.transform = transform
        self.emotions = emotions
        self.samples = self._load_files()

    def _load_files(self):
        """Implemented by subclasses: return list of (filepath, label)."""
        raise NotImplementedError

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        filepath, label = self.samples[idx]
        waveform, sr = torchaudio.load(filepath)
        if sr != config.SAMPLE_RATE:
            waveform = torchaudio.functional.resample(waveform, sr, config.SAMPLE_RATE)

        # Ensure mono
        if waveform.shape[0] > 1:
            waveform = waveform.mean(dim=0, keepdim=True)

        # Trim or pad to MAX_AUDIO_SAMPLES
        max_len = config.MAX_AUDIO_SAMPLES
        if waveform.shape[1] > max_len:
            waveform = waveform[:, :max_len]
        elif waveform.shape[1] < max_len:
            pad = max_len - waveform.shape[1]
            waveform = torch.nn.functional.pad(waveform, (0, pad))

        if self.transform:
            features = self.transform(waveform)
        else:
            features = waveform

        label_idx = self.emotions.index(label)
        return features.squeeze(0), torch.tensor(label_idx)

    def class_weights(self):
        """Return tensor of class weights (for imbalance)."""
        counts = [0] * len(self.emotions)
        for _, label in self.samples:
            counts[self.emotions.index(label)] += 1
        weights = torch.tensor([1.0 / (c if c > 0 else 1) for c in counts])
        return weights
