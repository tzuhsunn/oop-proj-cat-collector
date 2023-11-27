# convert pytorch model to onnx model
import torch
from model import cat_classifier

onnx_path = "classifier.onnx"
if __name__ == '__main__':
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = cat_classifier()
    model.load_state_dict(torch.load('checkpoint/model.pth')['model'],strict=False)
    torch_input = torch.randn(1, 3, 224, 224)

    torch.onnx.export(model, torch_input, onnx_path, verbose=True)
