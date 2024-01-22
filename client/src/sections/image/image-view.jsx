/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import Input from '@mui/material/Input';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { saveAs } from 'file-saver';

import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

export default function ImageView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

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
      setPredictionResult('重新上傳中...');
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('https://tzuhsun.online/cat/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const breed = data.breed;
      // const breedID = data.number;

      setPredictionResult(breed);
      setOpenDialog(true);

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = () => {
    // save to phone & database
    if (imageUrl) {
      // 將 base64 轉換成 Blob
      const byteCharacters = atob(imageUrl.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i += 1) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      const currentDateTime = new Date();
      const formattedDateTime = currentDateTime.toISOString().replace(/[-:.TZ]/g, '');

      // 使用 FileSaver.js 下載圖片
      saveAs(blob, `cat_image_${formattedDateTime}.png`);
    }
    setOpenDialog(false);
  };

  const handleEdit = () => {
    navigate('/edit', { state: { imageUrl } });
    setOpenDialog(false);
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Cat Prediction</Typography>

          <Typography variant="body2">
            拍照/上傳貓貓，我們會告訴你貓貓的種類
          </Typography>

          <label
            htmlFor="fileInput"
            style={{
              display: 'block',
              backgroundColor: '#ccc',
              padding: '20px',
              marginTop: '20px',
              cursor: 'pointer',
            }}
            onClick={handleFileClick}
          >
            {(imageUrl || predictionResult) ? (
              <img
                src={imageUrl}
                alt="Uploaded"
                style={{ maxWidth: '250px', 
                        maxHeight: '500px', 
                        marginTop: '10px', 
                        justifyContent: 'center',
                        alignContent: 'center',
                        marginLeft: 'auto', }}
              />
            ) : (
              <span>點擊這裡上傳照片</span>
            )}
          </label>

          <Input
            type="file"
            id="fileInput"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <br />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              onClick={handleUpload}
            >
              SUBMIT
            </LoadingButton>
          </div>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              貓貓種類檢測結果
            </Typography>
            <Typography variant="h3">
              {predictionResult}
            </Typography>
          </Divider>
        </Card>
      </Stack>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>選擇操作</DialogTitle>
        <DialogActions>
          <Button onClick={handleSave}>儲存</Button>
          <Button onClick={handleEdit}>繼續編輯</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
