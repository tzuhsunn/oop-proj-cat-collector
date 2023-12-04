import os
import argparse
import cv2
import torch
from torchvision import transforms
import numpy as np


parser = argparse.ArgumentParser(description='Pre-processing .png images')
parser.add_argument('--pathFrom', default='./images',
                    help='directory of images to convert')
parser.add_argument('--pathTo', default='./images_npy',
                    help='directory of images to save')
parser.add_argument('--split', default=True,
                    help='save individual images')
parser.add_argument('--select', default='',
                    help='select certain path')
parser.add_argument('--height',type=int,default=256,
                    help='height of converted images')
parser.add_argument('--width',type=int, default=256,
                    help='width of converted images')

args = parser.parse_args()

transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((args.height, args.width)),  # replace with your desired size
])



for (path, dirs, files) in os.walk(args.pathFrom):
    print(path)
    targetDir = os.path.join(args.pathTo, path[len(args.pathFrom) + 1:])
    if len(args.select) > 0 and path.find(args.select) == -1:
        continue

    if not os.path.exists(targetDir):
        os.mkdir(targetDir)

    if len(dirs) == 0:
        pack = {}
        n = 0
        for fileName in files:
            (idx, ext) = os.path.splitext(fileName)
            if ext == '.png' or ext == '.jpg':
                image = cv2.imread(os.path.join(path, fileName))
                # Resize the image
                image_resized = transform(image)
                if args.split:
                    np.save(os.path.join(targetDir, idx + '.npy'), image_resized)
                n += 1
                if n % 100 == 0:
                    print('Converted ' + str(n) + ' images.')