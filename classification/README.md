# cat-collector
For 2023 aoop group project classification part
## Description
Classify cats and dogs by their breeds with total 37 catagories. Use efficientnet as backbone and train with pytorch.
![results.png](results.png)
Download datasets from : [kaggle](https://www.kaggle.com/datasets/zippyz/cats-and-dogs-breeds-classification-oxford-dataset/data?select=images)

```bash
kaggle datasets download -d zippyz/cats-and-dogs-breeds-classification-oxford-dataset
```
```bash
unzip cats-and-dogs-breeds-classification-oxford-dataset.zip
```
## move images to individual folders
```bash
bash ImageFolder.sh
```

## check if there is corrupted images
```bash
python check_file.py
```

## train
```bash
python train.py
```
if you want to resume training, you can specify .pth file path 
```bash
python train.py --resume [path to .pth file]
```
Alternately, run the train_wandb.py if you want the result in saved in wandb 
```bash
python train_wandb.py
```
if you want to resume training using wandb, you can specify id 
```bash
python train_wandb.py --id [runs-id]
```
## demo
Currently, only available if running train.py 
```bash
python demo.py
```

## api
To open server:
```bash
cd app
flask run
```
To do inference:
```bash
curl -X POST -F "file=@/path/to/image.jpg" http://localhost:5000/predict
```
or use request library:
```bash
python test.py
```