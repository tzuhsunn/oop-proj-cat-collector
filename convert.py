import os
import cv2
import numpy as np
from natsort import natsorted
from tqdm import tqdm
# set the file path
file_path = './annotations/annotations/trimaps/'
target_path = './masks/'
if not os.path.exists(target_path):
    os.makedirs(target_path)
images = (os.listdir(file_path))
# remove the file with prefix '._' if it exists
images = [images for images in images if not images.startswith('._')]
images = natsorted(images)

for image in tqdm(images):
    # check if the file exists
    if os.path.isfile(os.path.join(file_path, image)):
        # load the trimap and print its numpy array
        trimap = cv2.imread(os.path.join(file_path, image), cv2.IMREAD_GRAYSCALE)
        mask = np.zeros(trimap.shape)
        mask[np.logical_or(trimap == 1, trimap == 3)] = 255
        cv2.imwrite(os.path.join(target_path,image.replace('.png','_mask.jpg')), mask)
    else:
        print(f"File {file_path} does not exist.")