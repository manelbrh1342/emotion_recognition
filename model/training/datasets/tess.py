"""
tess.py — TESS dataset loader
------------------------------
Files are stored in subfolders by emotion (e.g., Angry/, Sad/, etc.)
"""

import os
from datasets.base_dataset import BaseSERDataset
from datasets.emotions import LABEL_MAP

class TESSDataset(BaseSERDataset):
    def __init__(self, root_dir, transform=None, emotions=None):
        super().__init__(root_dir, transform=transform, emotions=emotions or config.EMOTIONS)

    def _load_files(self):
        samples = []
        for emo_dir in os.listdir(self.root_dir):
            full_path = os.path.join(self.root_dir, emo_dir)
            if os.path.isdir(full_path):
                label = LABEL_MAP["tess"].get(emo_dir.lower())
                if label:
                    for f in os.listdir(full_path):
                        if f.endswith(".wav"):
                            samples.append((os.path.join(full_path, f), label))
        return samples
