from flask import Flask, request, jsonify
from utils import transform_image, get_prediction
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
        
        prediction = get_prediction(tensor)
        data = {'prediction': prediction}
        return jsonify(data)
        # except:
        #     return jsonify({'error': 'error during prediction'})


if __name__ == '__main__':
    app.run()