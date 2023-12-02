unzip cats-and-dogs-breeds-classification-oxford-dataset.zip 
mv ./images/images/* ./images/
mv ./annotations/annotations/* ./annotations/
rm -rf ./images/images
rm -rf ./annotations/annotations

python convert.py # convert the trimaps th readable format
python check_file.py
python png2npy.py --pathFrom ./images --pathTo ./images_npy
python trimap2npy.py --pathFrom ./annotations/trimaps --pathTo ./masks_npy

python verify.py
