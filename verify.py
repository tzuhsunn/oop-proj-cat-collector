'''
verify the images and masks are matched
'''
import os
from natsort import natsorted


images_path = './images_npy'
masks_path = './masks_npy'

images = natsorted(os.listdir(images_path))
masks = natsorted(os.listdir(masks_path))
for i in range(len(images)):
    if images[i].split('.')[0] != masks[i].split('.')[0]:
        print('image: ',images[i])
        print('mask: ',masks[i])
        print('images and masks are not matched')
        break