from flask import Flask, request, jsonify
from utils import transform_image, get_prediction, get_prediction_bi, transform_agriculture, get_prediction_leaf
from flask import Response
import json
import random
from property import properties
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)
app.config['JSON_AS_ASCII'] = False

classes = ['阿比西尼亞貓','孟加拉貓','伯曼貓','孟買貓','英國短毛貓','埃及貓','緬因貓','波斯貓','布偶貓','俄羅斯藍貓','暹羅貓',
           '斯芬克斯貓','美國鬥牛犬','美國比特鬥牛犬','巴吉度獵犬','小獵犬','拳師狗','吉娃娃','英國可卡犬','英國塞特犬','德國短毛指示犬',
           '庇里牛斯山犬','哈瓦那犬','狆','凱斯犬','蘭伯格犬','迷你杜賓犬','紐芬蘭犬','博美犬','巴哥犬','聖伯納犬',
           '薩摩耶犬','蘇格蘭梗犬','柴犬','斯塔福郡鬥牛㹴','軟毛小麥梗','約克夏㹴']


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
            data = {'number': prediction,'breed': classes[prediction]}
            return jsonify(data)
        else:
            return jsonify({'number': -1,'breed':"not a cat or dog"}) # -1 means not a cat and not a dog
        
    
@app.route('/recommend', methods=['POST'])
def recommend():
    if request.method == 'POST':
        data = request.get_json()
        if data is None:
            return jsonify({'error': 'no data'})
        # get the past breeds
        test = data.get('past_breeds')
        # check if the past breeds is empty
        if len(test) == 0:
            number = random.randint(0, 36)
            return jsonify({'number': number},{'breed': classes[number]})
        # check if the elements of the past breeds are in the range of 0-36
        for i in test:
            if i < 0 or i > 36:
                return jsonify({'error': 'invalid input out of index'})
            
        #initialize a list of 0
        sum_list = [0] * len(properties[0])
        
        # gether the properties of the past breeds, store in sum_list
        for i in test:
            sum_list = [a + b for a, b in zip(sum_list, properties[i])]

        # calculate the similarity between the past breeds and all breeds, store in temp
        temp = []
        for i in range(len(properties)):
            temp.append(sum([a * b for a, b in zip(sum_list, properties[i])]))

        # set the past breeds to 0 to avoid recommending the same breeds
        for i in test:
            temp[i] = 0

        # Find the maximum value
        max_value = max(temp)

        # Find all indices of the maximum value
        max_indices = [i for i, x in enumerate(temp) if x == max_value]
        random_number = random.choice(max_indices)

        return jsonify({'number': random_number, 'breed': classes[random_number]})
        
@app.route('/agriculture', methods=['POST'])
def agriculture():
    if request.method == 'POST':
        file = request.files.get(key='file')
        if file is None or file.filename == "":
            return jsonify({'error': 'no file'})
        if not allowed_file(file.filename):
            return jsonify({'error': 'format not supported'})
        
        
        img_bytes = file.read() #read the image file
        tensor = transform_agriculture(img_bytes) # image -> tensor
        prediction = get_prediction_leaf(tensor)
        class_names = ['healthy', 'rust1', 'rust2', 'rust3']
        data = {'prediction': class_names[prediction]}
        response = Response(response=json.dumps(data, ensure_ascii=False),
                        status=200,
                        mimetype="application/json; charset=utf-8")
        return response

@app.route('/query', methods=['POST'])
def test():
    if request.method == 'POST':
        data = request.get_json()
        if data is None:
            return jsonify({'error': 'no data'})
        input_data = data.get('input')
        print(input_data)
        api_url = "http://203.145.216.230:55452/cat-dog/invoke"
        api_payload = {
            "input": input_data,
            "config": {},
            "kwargs": {}
        }
        try:
            response = requests.post(api_url, json=api_payload)
            response_data = response.json()

            if 'output' in response_data:
                return jsonify({'output': response_data['output'], 'input': input_data})
            else:
                return jsonify({'error': 'unexpected response from the external API'})
        except requests.RequestException as e:
            return jsonify({'error': f'Error calling the external API: {str(e)}'})
        
@app.route('/', methods=['GET'])
def index():
    return "<h1>Flask Server is up and running</h1>"

if __name__ == '__main__':
    app.run()