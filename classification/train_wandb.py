'''
This is a experiment to use wandb to train the model
The file is modified from train.py, and the checkpoints are saved to wandb cloud
Note that the model can be loaded from the cloud by setting the id
'''


import argparse
import os

from model import cat_classifier
import math
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import transforms
from torchvision.datasets import ImageFolder
from tqdm import tqdm

from torch.utils.data import ConcatDataset
import matplotlib.pyplot as plt

import wandb

parser = argparse.ArgumentParser()
parser.add_argument('--display',default='experiment-2023-12-17', help='name of the run for wandb')
parser.add_argument('--pth_model',default='classifier.pth', help='path to save the.pth file and upload to wandb')
parser.add_argument('--onnx_model', default='classifier.onnx', help='path to save the onnx model and upload to wandb')
parser.add_argument('--id', default=None,type=str, help='the id of the run for wandb (used for rerun)')
parser.add_argument('--resume', default='', help='path to latest checkpoint')
parser.add_argument('--export', default='classifier.pth', help='path to save checkpoint')
parser.add_argument('--epoch', default=10, help='number of epochs to train')
parser.add_argument('--batch_size', default=64, help='batch size')
parser.add_argument('--lr', default=1e-5, help='learning rate')
args = parser.parse_args()


os.chdir(os.path.dirname(os.path.abspath(__file__)))


def adjust_learning_rate(epoch, T_max=1000, eta_min=2e-4, lr_init=args.lr):
    lr = eta_min + (lr_init - eta_min) * (1 + math.cos(math.pi * epoch / T_max)) / 2
    if epoch >= T_max:
        lr = eta_min
    for param_group in optimizer.param_groups:
        param_group['lr'] = lr

def train():
    train_loss = 0
    best_accuracy = 0
    start_epoch = 1
    #loading pretrained models

    if args.id is not None:
        run.restore(args.export)
        checkpoint = torch.load(args.export)

        model.load_state_dict(checkpoint['model'])
        start_epoch = checkpoint['epoch']
        best_accuracy = checkpoint['best_accuracy']
        print("checkpoint loaded: epoch = {}, accuracy = {}".format(start_epoch, best_accuracy))


    model.train()
    for epoch in range(start_epoch,args.epoch + 1):
        # adjust_learning_rate(epoch)
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

        wandb.log({"epoch": epoch, "Loss": {"Train": train_loss, "Valid": valid_loss}})
        wandb.log({"epoch": epoch, "accuracy": accuracy})

        if accuracy > best_accuracy:
            best_accuracy = accuracy
            state = {"epoch": epoch,
                    "model": model.state_dict(),
                    "best_accuracy": best_accuracy,
                    }

            # save the model to wandb cloud
            torch.save(state, args.export)
            wandb.save(args.export)
            print("===> model saved to {}".format(args.pth_model))


if __name__ == '__main__':
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    config = dict(
        epochs=args.epoch,
        batch_size=args.batch_size,
        learning_rate=args.lr,
    )

    run = wandb.init(project="cat-collector-classifier",config=config,name=args.display,resume='allow',id=args.id)
    trans1 = transforms.Compose([transforms.Resize(255),
                                    transforms.CenterCrop(224),
                                    transforms.ToTensor(),
                                ])
    
    # trans2 = transforms.Compose([transforms.Resize(255),
    #                                 transforms.CenterCrop(224),
    #                                 transforms.RandomHorizontalFlip(),
    #                                 transforms.RandomRotation(10),
    #                                 transforms.ToTensor(),
    #                                 ])
    full_ds1 = ImageFolder(root=os.path.join(os.getcwd(),'images'), transform=trans1) #train and valid
    # full_ds2 = ImageFolder(root=os.path.join(os.getcwd(),'images'), transform=trans2) #train and valid
    
    # full_ds = ConcatDataset([full_ds1,full_ds2])
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
    model = cat_classifier().to(device)
    # loss function
    criterion = nn.CrossEntropyLoss()
    # optimizer
    optimizer = torch.optim.Adam(model.parameters(), lr=args.lr,weight_decay=1e-5)
    train()

    # convert into onnx model
    torch_input = torch.randn(1, 3, 224, 224).to(device)
    torch.onnx.export(model, torch_input, args.onnx_model, verbose=True)
    wandb.save(args.onnx_model)
    run.finish()  