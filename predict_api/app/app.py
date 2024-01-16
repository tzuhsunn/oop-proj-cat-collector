from flask import Flask, request, jsonify
from utils import transform_image, get_prediction, get_prediction_bi
app = Flask(__name__)

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    '''
    check if the file extension is in ALLOWED_EXTENSIONS
    if in ALLOWED_EXTENSIONS, return True
    '''
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        file = request.files.get(key='file')
        if file is None or file.filename == "":
            return jsonify({'error': 'no file'})
        if not allowed_file(file.filename):
            return jsonify({'error': 'format not supported'})
        
        
        img_bytes = file.read() #read the image file
        tensor = transform_image(img_bytes) # image -> tensor
        if get_prediction_bi(tensor) == 1:
            prediction = get_prediction(tensor)
            data = {'prediction': prediction}
            return jsonify(data)
        else:
            return jsonify({'prediction': -1}) # -1 means not a cat and not a dog
        # except:
        #     return jsonify({'error': 'error during prediction'})

@app.route('/', methods=['GET'])
def index():
    return "<h1>Flask Server is up and running</h1>"

if __name__ == '__main__':
    app.run()