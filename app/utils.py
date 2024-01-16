import sys
import os
import torch
import torch.nn as nn 
import torchvision.transforms as transforms 
from PIL import Image
import io
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from model import cat_classifier # import your model here



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


# predict
def get_prediction(image_tensor):
    # load the model
    PATH = './checkpoint/model.pth' # path to your model checkpoint\
    model = cat_classifier()
    model.load_state_dict(torch.load(PATH, map_location=torch.device('cpu'))['model'],strict=False)
    model.eval()
    output = model(image_tensor)
    pred = output.argmax(dim=1, keepdim=True)
    print(pred)
    # get the value of pred
    predicted = pred.item()
    
    return predicted