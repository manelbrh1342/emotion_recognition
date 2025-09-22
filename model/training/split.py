"""
split.py — Dataset splitting utilities
--------------------------------------
Provides stratified train/val/test split for SER datasets.
"""

import numpy as np
from sklearn.model_selection import train_test_split

def stratified_split(samples, labels, val_size=0.1, test_size=0.1, random_state=42):
    """
    Splits samples and labels into train/val/test sets with stratification.
    Returns: (train_idx, val_idx, test_idx)
    """
    idx = np.arange(len(samples))
    train_idx, test_idx = train_test_split(idx, test_size=test_size, stratify=labels, random_state=random_state)
    train_idx, val_idx = train_test_split(train_idx, test_size=val_size/(1-test_size), stratify=[labels[i] for i in train_idx], random_state=random_state)
    return train_idx, val_idx, test_idx
