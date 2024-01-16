# cat-collector
For 2023 aoop group project classification part
## Description


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

first open the other terminal
```bash
python test.py
```