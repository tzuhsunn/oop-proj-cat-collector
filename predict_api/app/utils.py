import sys
import os
import torch
import torch.nn as nn 
import torchvision.transforms as transforms 
from PIL import Image
import io
from model import classifier, cat_classifier, leaf_classifier # import your model here



def transform_image(image_bytes):
    '''
    transform image to tensor [1,3,224,224]
    '''
    transform = transforms.Compose([transforms.Resize(255),
                                    transforms.CenterCrop(224),
                                    transforms.ToTensor(),
                                ])
    image = Image.open(io.BytesIO(image_bytes)) #opening an image from a byte stream
    
    return transform(image).unsqueeze(0)

def transform_agriculture(image_bytes):
    '''
    transform image to tensor [1,3,224,224]
    '''
    transform = transforms.Compose([transforms.Resize([125, 250]),
                                    transforms.ToTensor(),
                                ])
    image = Image.open(io.BytesIO(image_bytes)) #opening an image from a byte stream
    
    return transform(image).unsqueeze(0)

# predict cat or dog or neither
def get_prediction_bi(image_tensor):
    # load the model
    PATH = './checkpoint/model_bi.pth' # path to your model checkpoint\
    model = classifier(output_dim = 2)
    model.load_state_dict(torch.load(PATH, map_location=torch.device('cpu'))['model'],strict=False)
    model.eval()
    output = model(image_tensor)
    pred = output.argmax(dim=1, keepdim=True)
    print(pred)
    # get the value of pred
    predicted = pred.item()
    
    return predicted

# predict breeds
def get_prediction(image_tensor):
    # load the model
    path_1 = './checkpoint/model.pth' # path to your model checkpoint\
    model = cat_classifier(output_dim = 37)
    model.load_state_dict(torch.load(path_1, map_location=torch.device('cpu'))['model'])
    model.eval()
    output = model(image_tensor)
    pred = output.argmax(dim=1, keepdim=True)
    print(pred)
    # get the value of pred
    predicted = pred.item()
    
    return predicted

# predict leaf
def get_prediction_leaf(image_tensor):
    # load the model
    PATH = './checkpoint/model_leaf.pth' # path to your model checkpoint\
    model = leaf_classifier(output_dim = 4)
    model.load_state_dict(torch.load(PATH, map_location=torch.device('cpu'))['model'])
    model.eval()
    output = model(image_tensor)
    pred = output.argmax(dim=1, keepdim=True)
    print(pred)
    # get the value of pred
    predicted = pred.item()
    
    return predicted