from torchvision.datasets import ImageFolder
from PIL import Image
from torchvision import transforms
from torch.utils.data import DataLoader
from tqdm import tqdm
trans = transforms.Compose([transforms.Resize(128),
                                    transforms.CenterCrop(64),
                                    transforms.ToTensor(),
                                ])
class CustomImageFolder(ImageFolder):
    def __getitem__(self, index):
        try:
            return super().__getitem__(index)
        except Exception as e:
            path, _ = self.samples[index]
            print('Corrupted file:', path)
            print('Error message:', e)
            return None, None
        
dataset = CustomImageFolder('./images', transform=trans)
dataloader = DataLoader(dataset, batch_size=32, shuffle=True)
for x, y in tqdm(dataloader):
    pass