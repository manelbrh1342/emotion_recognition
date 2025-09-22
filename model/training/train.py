"""
train.py — Training utilities
-----------------------------
Generic PyTorch training loop, evaluation, and logging.
"""


import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
import numpy as np
import os
from training import config


def train_model(model, dataset, epochs=config.EPOCHS, lr=config.LEARNING_RATE,
                optimizer="adam", weight_decay=config.WEIGHT_DECAY,
                class_weighted=False, scheduler=None, device=None):
    """
    Trains a model with the given dataset.
    - dataset: PyTorch Dataset object
    """
    # Set random seed for reproducibility
    config.set_seed(42)

    device = device or ("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)

    loader = DataLoader(dataset, batch_size=config.BATCH_SIZE, shuffle=True)
    criterion = nn.CrossEntropyLoss(
        weight=dataset.class_weights().to(device) if class_weighted else None
    )
    if optimizer == "adamw":
        opt = optim.AdamW(model.parameters(), lr=lr, weight_decay=weight_decay)
    else:
        opt = optim.Adam(model.parameters(), lr=lr, weight_decay=weight_decay)

    sched = None
    if scheduler == "plateau":
        sched = optim.lr_scheduler.ReduceLROnPlateau(opt, patience=3)
    elif scheduler == "linear":
        sched = optim.lr_scheduler.LinearLR(opt)

    best_f1 = 0
    best_model_path = "best_model.pt"

    for epoch in range(epochs):
        model.train()
        total_loss, preds, targets = 0, [], []
        for X, y in loader:
            X, y = X.to(device), y.to(device)
            opt.zero_grad()
            output = model(X) if not isinstance(output := model(X, labels=y), dict) else output["logits"]
            loss = criterion(output, y)
            loss.backward()
            opt.step()

            total_loss += loss.item()
            preds.extend(output.argmax(1).cpu().numpy())
            targets.extend(y.cpu().numpy())

        acc = accuracy_score(targets, preds)
        precision, recall, f1, _ = precision_recall_fscore_support(targets, preds, average="weighted", zero_division=0)
        cm = confusion_matrix(targets, preds)
        print(f"Epoch {epoch+1}/{epochs} - Loss: {total_loss/len(loader):.4f} - Acc: {acc*100:.2f}% - F1: {f1:.4f}")
        print(f"Precision: {precision:.4f}  Recall: {recall:.4f}")
        print(f"Confusion Matrix:\n{cm}")

        # Save best model by F1
        if f1 > best_f1:
            best_f1 = f1
            torch.save(model.state_dict(), best_model_path)

        if sched:
            if scheduler == "plateau":
                sched.step(total_loss)
            else:
                sched.step()
