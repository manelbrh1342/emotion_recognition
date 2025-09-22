"""
ravdess.py — RAVDESS dataset loader
-----------------------------------
Parses filenames to extract emotion labels and harmonizes with EMOTIONS list.
"""

import os
from datasets.base_dataset import BaseSERDataset
from datasets.emotions import LABEL_MAP

class RAVDESSDataset(BaseSERDataset):
    def __init__(self, root_dir, transform=None, emotions=None):
        super().__init__(root_dir, transform=transform, emotions=emotions or config.EMOTIONS)

    def _load_files(self):
        samples = []
        for root, _, files in os.walk(self.root_dir):
            for f in files:
                if f.endswith(".wav"):
                    parts = f.split("-")
                    emotion_id = int(parts[2])
                    label = {
                        1: "neutral", 2: "calm", 3: "happy", 4: "sad",
                        5: "angry", 6: "fearful", 7: "disgust", 8: "surprised"
                    }[emotion_id]
                    samples.append((os.path.join(root, f), label))
        return samples
