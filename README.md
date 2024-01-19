# cat-collector
For 2023 aoop group project

## Cat and Dog Collector App:
The aim of this app is to encourage people to spend more time outdoors, collecting pictures of cute cats and dogs they encounter in their daily lives.

### For the AI Model:
When users capture photos of cats or dogs with their phone's camera, they can upload these photos to the app. The app's backend incorporates an AI model for identifying cat and dog breeds and removing backgrounds. It can save the silhouettes of cats and dogs as PNG files, allowing users to keep them.

### For the App:
In addition to the features mentioned above, the app will randomly assign attributes and beautiful backgrounds to the collected images. This enables users to experience the joy of collecting digital cards and share them with friends. There may also be a possibility of adding a multiplayer battle feature in the future.

## Programming Framework:
- App Design: Flutter
- AI Model: PyTorch


![flutter](./imgs/flutter.png)

The app development will be done using Flutter, which is an open-source framework for building cross-platform applications for both iOS and Android.


![flutter](./imgs/pytorch.jpg)

The AI model development will be handled using PyTorch, a powerful deep learning framework, for tasks such as breed recognition and background removal.

This exciting app project combines mobile app development with AI capabilities to enhance the experience of collecting and sharing pictures of adorable cats and dogs.

## Keyword on the Working Items

### App
- UI Design
- Image Upload
- Card Generation
- Save Cards
- Randomly Assign Attributes and Beautiful Backgrounds

### AI Model
- Cat and Dog Breed Recognition
- Background Removal (Clipping)
- Model Deployment

## CICD flow
1. Complete certain feature in branches
2. Make PR to main branch and wait for review & merge
3. Trigger GitHub Action and deploy to GCP VM

## Deployment
1. Flask server, frontend, backend and sql are served by NGINX
2. Having DNS name and OpenSSL certificate
3. Flask server -> python engine run at port 5000 -> proxy pass to nginx /cat/
4. Nodejs server -> docker run forwarding to port 3000
5. Frontend -> build out and server by nginx (root location /)
