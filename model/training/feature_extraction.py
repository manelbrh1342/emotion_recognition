"""
feature_extraction.py — Audio feature extraction utilities
--------------------------------------------------------
Provides MFCC, log-mel, and SpecAugment transforms for SER datasets.
All parameters are sourced from config.py for consistency.
"""

import torch
import torchaudio
from training import config

class ToMono:
    def __call__(self, waveform):
        if waveform.shape[0] > 1:
            return waveform.mean(dim=0, keepdim=True)
        return waveform

class MFCC:
    def __init__(self):
        self.mfcc = torchaudio.transforms.MFCC(
            sample_rate=config.SAMPLE_RATE,
            n_mfcc=config.N_MFCC,
            melkwargs={
                'n_fft': config.N_FFT,
                'hop_length': config.HOP_LENGTH,
                'n_mels': config.N_MELS
            }
        )
    def __call__(self, waveform):
        return self.mfcc(waveform)

class LogMel:
    def __init__(self):
        self.melspec = torchaudio.transforms.MelSpectrogram(
            sample_rate=config.SAMPLE_RATE,
            n_fft=config.N_FFT,
            hop_length=config.HOP_LENGTH,
            n_mels=config.N_MELS
        )
        self.amplitude_to_db = torchaudio.transforms.AmplitudeToDB()
    def __call__(self, waveform):
        mel = self.melspec(waveform)
        return self.amplitude_to_db(mel)

class SpecAugment:
    def __init__(self, freq_mask_param=8, time_mask_param=8):
        self.freq_mask = torchaudio.transforms.FrequencyMasking(freq_mask_param)
        self.time_mask = torchaudio.transforms.TimeMasking(time_mask_param)
    def __call__(self, spec):
        return self.time_mask(self.freq_mask(spec))

# Utility to build transform pipeline
def get_transform(feature_type, augment=None):
    transforms = [ToMono()]
    if feature_type == 'mfcc':
        transforms.append(MFCC())
    elif feature_type == 'logmel':
        transforms.append(LogMel())
    if augment == 'specaugment':
        transforms.append(SpecAugment())
    return torch.nn.Sequential(*transforms)
