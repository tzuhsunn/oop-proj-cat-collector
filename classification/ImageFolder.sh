#Move images to the parent folder
mv ./images/images/* ./images/
echo "Moving images to their respective directories..."
cd images
# Create an array of unique image types
types=($(ls | grep -oP '.*(?=_\d+\.jpg)' | sort -u))
# print types
echo "${types[@]}"
# Create directories for each image type
for type in "${types[@]}"
do
  mkdir -p "$type"
done

# Move images to their respective directories
for type in "${types[@]}"
do
  mv "$type"_*.jpg "$type"
done
# remove the .mat files
rm *.mat
rm -r images