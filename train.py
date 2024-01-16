import argparse
import os

from model import classifier
import math
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import transforms
from torchvision.datasets import ImageFolder
from tqdm import tqdm

from utils import plot_accuracy_curve, plot_loss_curve, plot_lr_curve
from torch.utils.data import ConcatDataset
import matplotlib.pyplot as plt

# command line arguments (can be passed in the command line)
parser = argparse.ArgumentParser()
parser.add_argument('--resume', default='', help='path to latest checkpoint')
parser.add_argument('--export', default='model.pth', help='path to save checkpoint')
parser.add_argument('--epoch', default=2, help='number of epochs to train')
parser.add_argument('--batch_size', default=16, help='batch size')
parser.add_argument('--lr', default=1e-4, help='learning rate')
args = parser.parse_args()

# change working directory to the folder of this file
os.chdir(os.path.dirname(os.path.abspath(__file__)))


def train():
    history = []
    train_loss = 0
    best_accuracy = 0
    start_epoch = 1
    #loading pretrained models


    if args.resume:
        if os.path.isfile(args.resume):
            print("===> loading models '{}'".format(args.resume))
            checkpoint = torch.load(args.resume)
            model.load_state_dict(checkpoint['model'])
            start_epoch = checkpoint['epoch']
            best_accuracy = checkpoint['best_accuracy']
            history = checkpoint['history']
            print("checkpoint loaded: epoch = {}, accuracy = {}".format(start_epoch, best_accuracy))
        else:
            print("===> no models found at '{}'".format(args.resume))

    model.train()
    for epoch in range(start_epoch,args.epoch + 1):
        result = {'train_loss': [], 'valid_loss': [], 'lrs': [], 'accuracy': []}
        print('Epoch: {}'.format(epoch))
        print('learning rate: {:.6f}'.format(optimizer.param_groups[0]['lr']))
        for (img,label) in tqdm(train_dl):
            img = img.to(device)
            label = label.to(device)
            optimizer.zero_grad()
            output = model(img)
            loss = criterion(output, label)
            loss.backward()
            optimizer.step()
            scheduler.step()
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
            # compute test accuracy and show the results
            correct = 0
            for (img,label) in tqdm(test_dl):
                img = img.to(device)
                label = label.to(device)
                output = model(img)
                pred = output.argmax(dim=1, keepdim=True) #returns the index of the maximum value
                correct += pred.eq(label.view_as(pred)).sum().item()
                

        accuracy = correct/len(test_ds)
        result['train_loss'].append(train_loss)
        result['valid_loss'].append(valid_loss)
        result['accuracy'].append(accuracy)
        result['lrs'].append(optimizer.param_groups[0]['lr'])
        print('Train Loss: {:.4f}'.format(train_loss))
        print('Val Loss: {:.4f}'.format(valid_loss))
        print('Test Accuracy: {:.4f}'.format(accuracy))
        history.append(result)

        if accuracy > best_accuracy:
            model_folder = "checkpoint"
            if not os.path.exists(model_folder):
                os.makedirs(model_folder)
            best_accuracy = accuracy
            model_out_path = os.path.join(model_folder, args.export)
            state = {"epoch": epoch,
                    "model": model.state_dict(),
                    "best_accuracy": best_accuracy,
                    "history": history}
            torch.save(state, model_out_path)
            print("===> Checkpoint saved to {}".format(model_out_path))

        plot_loss_curve(history)
        plot_accuracy_curve(history)
        plot_lr_curve(history)


if __name__ == '__main__':
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    trans1 = transforms.Compose([transforms.Resize([250, 250]),
                                transforms.RandomHorizontalFlip(0.5),
                                transforms.ToTensor(),
                                ])
    # trans2 = transforms.Compose([transforms.Resize([250, 250]),
    #                             transforms.ToTensor(),
    #                             ])
    
    full_ds1 = ImageFolder(root=os.path.join(os.getcwd(),'images'), transform=trans1) #train and valid
    # full_ds2 = ImageFolder(root=os.path.join(os.getcwd(),'images'), transform=trans2) #train and valid
    
    # full_ds = full_ds1
    #split train_ds into train and val
    train_size = int(len(full_ds1)*0.8)
    val_size = int(len(full_ds1)*0.1)
    test_size = len(full_ds1) - train_size - val_size
    train_ds, val_ds, test_ds = torch.utils.data.random_split(full_ds1, [train_size, val_size, test_size])
    
    print("train size: {}, val size: {}, test size: {}".format(len(train_ds), len(val_ds), len(test_ds)))
    # dataloader
    train_dl = DataLoader(train_ds, batch_size=args.batch_size,num_workers=6, shuffle=True,drop_last=True)
    valid_dl = DataLoader(val_ds, batch_size=32, shuffle=True,num_workers=6,drop_last=True)
    test_dl = DataLoader(test_ds, batch_size=16, shuffle=True,num_workers=6,drop_last=True)
    
    # model
    model = classifier().to(device)
    # loss function
    criterion = nn.CrossEntropyLoss()
    # optimizer
    optimizer = torch.optim.Adam(model.parameters(), lr = args.lr, weight_decay = 1e-5)
    # Scheduler
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max = len(train_dl) * args.epoch, eta_min = 2e-5)
    # start training
    train()