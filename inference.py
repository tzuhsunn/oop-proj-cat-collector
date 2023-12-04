import torch
import torch.nn as nn
import os
from torchvision import transforms
import cv2
import numpy as np
import argparse
import segmentation_models_pytorch as smp

parser = argparse.ArgumentParser(description='inferencing .png images')
parser.add_argument('--image', default='./test_image.png',
                    help='path to the image')
parser.add_argument('--mask', default='./test_mask.png',
                    help='path of saving the mask')
parser.add_argument('--result', default='./inference.png',
                    help='path of saving the result')
parser.add_argument('--model', default='./checkpoint/model.pth',
                    help='path of the model')
parser.add_argument('--height', default=256)
parser.add_argument('--width', default=256)
args = parser.parse_args()


def convert_to_mask(output):
    '''
    input: (batch_size, 3, height, width)
    output: (batch_size, height, width)
    '''
    trimap = torch.argmax(output, dim=1)
    trimap = trimap.numpy()[0]
    mask = np.zeros(shape=trimap.shape)  # ensure mask has the same shape as t
    mask[np.logical_or(trimap == 0, trimap == 2)] = 255
    return mask


def toTensor(img):
        '''
        convert numpy array to tensor, HWC->CHW
        '''
        img = np.ascontiguousarray(np.transpose(img,(2,0,1))) # convert HWC to CHW
        img = torch.from_numpy(img).float() # convert numpy array to tensor
        img = img.div_(255)
        return img


transform = transforms.Compose([
                transforms.ToPILImage(),
                transforms.Resize((args.height,args.width)),  # replace with your desired size
    ])


# def apply_mask_to_image(resized_image, mask):
#     """
#     Apply the given mask to the resized image.

#     Parameters:
#     resized_image (np.array): The resized image (HWC format).
#     mask (np.array): The mask image, where 0 indicates background (HW format).

#     Returns:
#     np.array: The image with the background blocked out.
#     """
#     # Ensure the mask is a boolean mask
#     mask_bool = mask.astype(bool)

#     # If the mask is not 3-channel, replicate it across the color channels
#     if len(mask.shape) == 2:
#         mask_bool = np.stack([mask_bool] * 3, axis=-1)

#     # Apply the mask to the image
#     blocked_image = np.where(mask_bool, resized_image, 0)

#     return blocked_image

def apply_mask_to_image(resized_image, mask):
    """
    Apply the given mask to the resized image.

    Parameters:
    resized_image (np.array): The resized image (HWC format).
    mask (np.array): The mask image, where 0 indicates background (HW format).
    blur_sigma (float): The sigma value for the Gaussian blur.

    Returns:
    np.array: The image with the background blurred.
    """
    # Ensure the mask is a boolean mask
    mask_bool = mask.astype(bool)

    # If the mask is not 3-channel, replicate it across the color channels
    if len(mask.shape) == 2:
        mask_bool = np.stack([mask_bool] * 3, axis=-1)

    # Blur the entire image
    blurred_image = cv2.GaussianBlur(resized_image, (11,11), 0)
    cv2.imwrite('./blurred.png', blurred_image)
    # Combine the blurred image with the original image using the mask
    final_image = np.where(mask_bool, resized_image, blurred_image)
   
    return final_image


if __name__ == '__main__':
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    # get the image
    image = cv2.imread(args.image)
    image_resized = transform(image)
    image_tensor = toTensor(image_resized).to(device).unsqueeze_(dim = 0)
    # load the model
    model = smp.UnetPlusPlus('efficientnet-b0', in_channels=3, classes=3,encoder_weights='imagenet')
    model.load_state_dict(torch.load(args.model)['model'],strict=False)
    model.eval()
    model.to(device)

    output = model(image_tensor).detach().cpu()
    mask = convert_to_mask(output)
    cv2.imwrite(args.mask, mask)
    cv2.imwrite(args.result, apply_mask_to_image(np.array(image_resized),mask))
    
    