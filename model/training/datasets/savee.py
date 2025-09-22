"""
savee.py — SAVEE dataset loader
-------------------------------
Files are named like DC_a01.wav where 'a' = angry.
"""

import os
from datasets.base_dataset import BaseSERDataset
from datasets.emotions import LABEL_MAP

class SAVEEDataset(BaseSERDataset):
    def __init__(self, root_dir, transform=None, emotions=None):
        super().__init__(root_dir, transform=transform, emotions=emotions or config.EMOTIONS)

    def _load_files(self):
        samples = []
        for f in os.listdir(self.root_dir):
            if f.endswith(".wav"):
                code = ''.join([c for c in f if c.isalpha()])
                for k, v in LABEL_MAP["savee"].items():
                    if code.startswith(k):
                        samples.append((os.path.join(self.root_dir, f), v))
                        break
        return samples
