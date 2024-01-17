import React, { useState } from 'react';

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

  return (
    <div>
      <h1>Coffee Image AI Detection</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Ripe Coffee Detection</button>

      {(imageUrl || predictionResult) && (
        <div>
          <h2>{predictionResult || 'Uploaded Image'}:</h2>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '500px' }} />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
