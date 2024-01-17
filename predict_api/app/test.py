import requests 

# https://your-heroku-app-name.herokuapp.com/predict
# http://localhost:5000/predict
resp = requests.post("http://localhost:5000/agriculture", files={'file': open('./leaves/1.jpg', 'rb')})

print(resp.text)