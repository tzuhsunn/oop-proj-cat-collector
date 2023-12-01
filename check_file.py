import os
import cv2
import numpy as np
import torch
from natsort import natsorted
from torch.utils.data import Dataset
from torch.utils.data import DataLoader
from tqdm import tqdm
from PIL import Image
image_path = './images/images'
mask_path = './masks'
# remove extension .mat
for i in tqdm(os.listdir(image_path)):
    if i.endswith('.mat'):
        os.remove(os.path.join(image_path,i))

images = natsorted(os.listdir(image_path))
masks = natsorted(os.listdir(mask_path))       
images = [os.path.join(image_path,i) for i in images]
masks = [os.path.join(mask_path,i) for i in masks]

for (image_path,mask_path) in tqdm(zip(images,masks)):
   try:
       #check if the file exists
       if not os.path.isfile(image_path):
           raise ValueError(f"File {image_path} does not exist.")
       if not os.path.isfile(mask_path):
           raise ValueError(f"File {mask_path} does not exist.")
       img = cv2.imread(image_path)
       mask = cv2.imread(mask_path)
       # check loading image succesfully
       if img is None:
           raise ValueError(f"Loading {image_path} fails.")
       if mask is None:
           raise ValueError(f"Loading {mask_path} fails.")
       img = Image.open(image_path).convert('RGB')
       mask = Image.open(mask_path).convert('RGB')
       if img is None:
            raise ValueError(f"Loading {image_path} fails.")
       if mask is None:
            raise ValueError(f"Loading {mask_path} fails.")
       
   except:
       print(f"Error processing {image_path} and {mask_path},delete them......")
       # Delete the image and mask files
       os.remove(image_path)
       os.remove(mask_path)
       # Continue with the next iteration of the loop
       continue
   
os.remove('./images/images/chihuahua_121.jpg')
os.remove('./masks/chihuahua_121_mask.jpg')
os.remove('./images/images/beagle_116.jpg')
os.remove('./masks/beagle_116_mask.jpg')