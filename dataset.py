import torch
from torch.utils.data import Dataset
import numpy as np
import os
import random
import cv2
from natsort import natsorted
import random



class catDataset(Dataset):
    def __init__(self, image_path, mask_path):
        self.image_path = image_path
        self.mask_path = mask_path
        self.images = natsorted(os.listdir(image_path))
        self.masks = natsorted(os.listdir(mask_path))
        self.images = [os.path.join(image_path,i) for i in self.images]
        self.masks = [os.path.join(mask_path,i) for i in self.masks]
        print("Number of images: ", len(self.images))

    def __getitem__(self, idx):
        img, mask = self.load_file(idx) # load the file from numpy array
        img, mask = self.toTensor(img, mask) # convert numpy array to tensor
        return img, mask
    
    def __len__(self):
        return len(self.images)
    
    def load_file(self, idx):
        '''
        load numpy array from file
        '''
        img = np.load(self.images[idx])
        mask = np.load(self.masks[idx])
        return img, mask
    
    def toTensor(self, img, mask):
        '''
        convert numpy array to tensor, HWC->CHW
        '''
        img = np.ascontiguousarray(np.transpose(img,(2,0,1))) # convert HWC to CHW
        img = torch.from_numpy(img).float() # convert numpy array to tensor
        img = img.div_(255)
        mask = np.ascontiguousarray(mask)
        mask = torch.from_numpy(mask).long()
        return img, mask

if __name__ == '__main__':

    image_path = './images_npy'
    mask_path = './masks_npy'
    dataset = catDataset(image_path, mask_path)
    image, mask = dataset[0]
    print(mask)
    