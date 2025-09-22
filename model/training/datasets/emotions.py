"""
emotions.py — Custom Emotions dataset loader
--------------------------------------------
Handles the "audio-emotions/Emotions" dataset with folders named by emotion.
"""

import os
from datasets.base_dataset import BaseSERDataset
from training import config

class EmotionsDataset(BaseSERDataset):
    def __init__(self, root_dir, transform=None, emotions=None):
        super().__init__(root_dir, transform=transform, emotions=emotions or config.EMOTIONS)

    def _load_files(self):
        samples = []
        for folder in os.listdir(self.root_dir):
            folder_path = os.path.join(self.root_dir, folder)
            if not os.path.isdir(folder_path):
                continue
            label = folder.lower().strip()
            if label in config.EMOTIONS:
                for f in os.listdir(folder_path):
                    if f.endswith(".wav"):
                        samples.append((os.path.join(folder_path, f), label))
        return samples
