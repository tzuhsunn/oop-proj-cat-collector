# cat-collector
For 2023 aoop group project  
Image segementation using U net

## Unzip the dataset
``` bash
unzip cats-and-dogs-breeds-classification-oxford-dataset.zip
```
## convert the mask images
```bash
python convert.py
```
## remove corrupted files
```bash
python check_file.py
```