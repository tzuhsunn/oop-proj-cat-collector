import torch
import torch.nn as nn
import torchvision.models as models
# from thop import profile
class classifier(nn.Module):
    def __init__(self,output_dim = 2):
        super(classifier, self).__init__()
        self.model = models.efficientnet.efficientnet_b0(weights='DEFAULT')
        self.output = nn.Sequential(
            nn.Linear(1000, 500),
            nn.ReLU(),
            nn.Linear(500, 250),
            nn.ReLU(),
            nn.Linear(250, output_dim),
        )
        
    def forward(self, x):
        x = self.model(x)
        x = self.output(x)
        return x