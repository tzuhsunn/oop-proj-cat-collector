import requests 
import json
# https://your-heroku-app-name.herokuapp.com/predict
# http://localhost:5000/predict
resp = requests.post("http://localhost:5000/predict",data=json.dumps({"past_breeds": [0,12,2,33,10]}), headers={'Content-Type': 'application/json'})

print(resp.json())