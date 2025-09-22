"""
cremad.py — CREMA-D dataset loader
----------------------------------
Uses filename convention: "ID_XXX_XXX_XXX.wav"
"""

import os
from datasets.base_dataset import BaseSERDataset
from datasets.emotions import LABEL_MAP

class CREMADDataset(BaseSERDataset):
    def __init__(self, root_dir, transform=None, emotions=None):
        super().__init__(root_dir, transform=transform, emotions=emotions or config.EMOTIONS)

    def _load_files(self):
        samples = []
        for f in os.listdir(self.root_dir):
            if f.endswith(".wav"):
                emo = f.split("_")[2]
                if emo in LABEL_MAP["cremad"]:
                    label = LABEL_MAP["cremad"][emo]
                    samples.append((os.path.join(self.root_dir, f), label))
        return samples
