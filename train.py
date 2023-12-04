import argparse
import os

from model import cat_segmentation
import math
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from tqdm import tqdm

from utils import plot_loss_curve, plot_lr_curve
from memory_profiler import profile
from dataset import catDataset
import numpy as np
from torch.cuda.amp import GradScaler, autocast


parser = argparse.ArgumentParser()
parser.add_argument('--resume', default='', help='path to latest checkpoint')
parser.add_argument('--export', default='model.pth', help='path to save checkpoint')
parser.add_argument('--epoch', default=10, help='number of epochs to train')
parser.add_argument('--batch_size', default=16, help='batch size')
parser.add_argument('--lr', default=1e-5, help='learning rate')
args = parser.parse_args()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

def adjust_learning_rate(epoch, T_max=1000, eta_min=2e-4, lr_init=args.lr):
    lr = eta_min + (lr_init - eta_min) * (1 + math.cos(math.pi * epoch / T_max)) / 2
    if epoch >= T_max:
        lr = eta_min
    for param_group in optimizer.param_groups:
        param_group['lr'] = lr

@profile
def train():
    scaler = GradScaler()
    history = []
    best_loss = np.inf
    start_epoch = 1
    #loading pretrained models
    if args.resume:
        if os.path.isfile(args.resume):
            print("===> loading models '{}'".format(args.resume))
            checkpoint = torch.load(args.resume)
            model.load_state_dict(checkpoint['model'])
            start_epoch = checkpoint['epoch']
            best_loss = checkpoint['best_loss']
            history = checkpoint['history']
            print("checkpoint loaded: epoch = {}, loss = {}".format(start_epoch, best_loss))
        else:
            print("===> no models found at '{}'".format(args.resume))

    model.train()
    for epoch in range(start_epoch,args.epoch + 1):
        # adjust_learning_rate(epoch)
        result = {'train_loss': [], 'valid_loss': [], 'lrs': []}
        print('Epoch: {}'.format(epoch))
        print('learning rate: {:.6f}'.format(optimizer.param_groups[0]['lr']))
        train_loss = 0
        for (img,label) in tqdm(train_dl):
            img = img.to(device)
            label = label.to(device)
            optimizer.zero_grad()
            # Run forward pass in autocast
            with autocast():
                outputs = model(img)
                loss = criterion(outputs, label)

            # Scale the loss and perform backward pass
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()
            train_loss += loss.item()
        train_loss = train_loss / len(train_dl) # average loss per batch
        
        model.eval()
        with torch.no_grad():
            # compute validation loss 
            valid_loss = 0
            for (img,label) in tqdm(valid_dl):
                img = img.to(device)
                label = label.to(device)
                output = model(img)
                loss = criterion(output, label)
                valid_loss += loss.item()
            valid_loss = valid_loss / len(valid_dl) # average loss per batch
            
        
        result['train_loss'].append(train_loss)
        result['valid_loss'].append(valid_loss)
        
        result['lrs'].append(optimizer.param_groups[0]['lr'])
        print('Train Loss: {:.4f}'.format(train_loss))
        print('Val Loss: {:.4f}'.format(valid_loss))
        history.append(result)

        if valid_loss < best_loss:
            best_loss = valid_loss
            model_folder = "checkpoint"
            if not os.path.exists(model_folder):
                os.makedirs(model_folder)
            
            model_out_path = os.path.join(model_folder, args.export)
            state = {"epoch": epoch,
                    "model": model.state_dict(),
                    "best_loss": best_loss,
                    "history": history}
            torch.save(state, model_out_path)
            print("===> Checkpoint saved to {}".format(model_out_path))

        plot_loss_curve(history)
        plot_lr_curve(history)


if __name__ == '__main__':
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    catdataset = catDataset(image_path='./images_npy', mask_path='./masks_npy')
    #split train_ds into train and val
    train_size = int(len(catdataset)*0.9)
    val_size =  len(catdataset) - train_size
    train_ds, val_ds = torch.utils.data.random_split(catdataset, [train_size, val_size])
    
    print("train size: {}, val size: {}".format(len(train_ds), len(val_ds)))
    # dataloader
    train_dl = DataLoader(train_ds, batch_size=args.batch_size,num_workers=6, shuffle=True,drop_last=True)
    valid_dl = DataLoader(val_ds, batch_size=args.batch_size, shuffle=True,num_workers=6,drop_last=True)

    
    # model
    model = cat_segmentation(n_channels = 3,n_classes = 3).to(device)
    # loss function
    criterion = nn.CrossEntropyLoss()
    # optimizer
    optimizer = torch.optim.Adam(model.parameters(), lr=args.lr,weight_decay=1e-5)
    train()