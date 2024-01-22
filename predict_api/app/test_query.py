import requests 
import json
# https://your-heroku-app-name.herokuapp.com/predict
# http://localhost:5000/predict
resp = requests.post("http://localhost:5000/query",data=json.dumps({"input": "hi"}), headers={'Content-Type': 'application/json'})

print(resp.json())