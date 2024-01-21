import React, { useState } from 'react';
import { Button, Typography, Input, Paper, Container } from '@mui/material';

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);

      // Display the selected image immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        console.error('No file selected for upload.');
        return;
      }

      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('http://nycu-llama.ddns.net/upload_d', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const newImageUrl = await response.text();
      setImageUrl(newImageUrl);

      // Assuming the response contains the prediction result
      setPredictionResult('prediction result');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleUploadArgriculture = async () => {
    try {
      if (!selectedFile) {
        console.error('No file selected for upload.');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('https://tzuhsun.online/cat/agriculture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const result = await data.prediction;
      console.log(data);

      // Assuming the response contains the prediction result
      setPredictionResult(result);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

//   return (
//     <div>
//       <h1>Coffee Image AI Detection</h1>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Ripe Coffee Detection</button>
//       <button onClick={handleUploadArgriculture}>Coffee Disease Detection</button>

//       {(imageUrl || predictionResult) && (
//         <div>
//           <h2>{predictionResult || 'Uploaded Image'}</h2>
//           <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '500px', maxHeight: '500px' }} />
//         </div>
//       )}
//     </div>
//   );
  
// };

return (
  <Container maxWidth="sm">
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
    <Typography variant="h4" gutterBottom>
      Coffee Detection
    </Typography>
    <Input type="file" onChange={handleFileChange} style={{ marginBottom: '20px' }} />
    <Button variant="contained" color="primary" onClick={handleUpload} style={{ width: '100px', marginRight: '10px' }}>
      Ripeness
    </Button>
    <Button variant="contained" color="primary" onClick={handleUploadArgriculture} style={{ width: '100px' }}>
      Disease
    </Button>
    {(imageUrl || predictionResult) && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h5">
            {predictionResult || 'Uploaded Image'}
          </Typography>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{ maxWidth: '300px', maxHeight: '500px', marginTop: '10px' }}
          />
        </div>
      )}
    </Paper>
  </Container>
);
};


export default ImageUploader;
