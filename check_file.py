'''
check if the file is valid, if not valid, delete it
'''

import os
import cv2
from natsort import natsorted
from tqdm import tqdm
from PIL import Image

images_path = './images'
masks_path = './masks'
trimaps_path = './annotations/trimaps'

# remove extension .mat
for i in tqdm(os.listdir(images_path)):
    if i.endswith('.mat'):
        os.remove(os.path.join(images_path,i))

# deal with trimap here
# remove file started with ._
for i in tqdm(os.listdir(trimaps_path)):
    if i.startswith('._'):
        os.remove(os.path.join(trimaps_path,i))

images = natsorted(os.listdir(images_path))
masks = natsorted(os.listdir(masks_path))
trimaps = natsorted(os.listdir(trimaps_path))   

images = [os.path.join(images_path,i) for i in images]
masks = [os.path.join(masks_path,i) for i in masks]
trimaps = [os.path.join(trimaps_path,i) for i in trimaps]


for (image_path,mask_path,trimap_path) in tqdm(zip(images,masks,trimaps)):
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
       os.remove(trimap_path)
       # Continue with the next iteration of the loop
       continue
   

   
os.remove(os.path.join(images_path,'chihuahua_121.jpg'))
os.remove(os.path.join(trimaps_path,'chihuahua_121.png'))
os.remove(os.path.join(masks_path,'chihuahua_121_mask.jpg'))
os.remove(os.path.join(images_path,'beagle_116.jpg'))
os.remove(os.path.join(trimaps_path,'beagle_116.png'))
os.remove(os.path.join(masks_path,'beagle_116_mask.jpg'))


