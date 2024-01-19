# cat-collector
For 2023 NYCU aoop group project classification function
## Description
Classify cats and dogs by their breeds with total 37 catagories. Use efficientnet as backbone and train with pytorch.
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
It will produce a results.png file in the same directory
```bash
python demo.py
```
![results.png](results.png)

## api
Using Flask to build api:
```bash
cd app
flask run
```
use POST method:
```bash
curl -X POST -F "file=@/path/to/image.jpg" http://localhost:5000/predict
```
or use request library:
```bash
python test.py
```