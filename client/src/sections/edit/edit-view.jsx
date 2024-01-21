/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import React, { useState, useRef } from 'react';

import { saveAs } from 'file-saver';
import { useLocation } from 'react-router-dom';
import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

export default function EditView() {
  const theme = useTheme();

  const { state } = useLocation();
  const imageUrl = state?.imageUrl;
  const [pocessedFile, setProcessedFile] = useState(null);
  const [newBackgroundUrl, setNewBackgroundUrl] = useState(''); // 新的背景圖片 URL
  const [showImageUrl, setShowImageUrl] = useState(imageUrl);

  const handleUpload = async () => {
    try {
      if (!imageUrl) {
        console.error('No file selected for upload.');
        return;
      }
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], 'uploaded_image.png');

      const formData = new FormData();
      formData.append('image_file', file);
  
      // 發送 POST 請求到 Remove.bg API
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': 'Jp6KtXXvojMqkj1d289jMN78',
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Background removal failed');
      }
  
      // 將處理後的圖片設定為 state 中的值
      const processedImageUrl = await response.blob();
      setProcessedFile(URL.createObjectURL(processedImageUrl));
      setShowImageUrl(URL.createObjectURL(processedImageUrl));
    } catch (error) {
      console.error('Error removing background:', error);
    }
  };
  const handleBackgroundChange = (event) => {
    const newBackground = event.target.files[0];
    if (newBackground) {
      setNewBackgroundUrl(URL.createObjectURL(newBackground));
    }
  };

  const handleMergeImages = () => {
    // 確保兩張圖片都已載入
    if (pocessedFile && newBackgroundUrl) {
      const catImage = new Image();
      catImage.src = pocessedFile;
      catImage.onload = () => {
        // 載入新的背景圖片
        const backgroundImage = new Image();
        backgroundImage.src = newBackgroundUrl;
        backgroundImage.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // 設定 canvas 尺寸
          canvas.width = backgroundImage.width;
          canvas.height = backgroundImage.height;

          // 繪製新的背景圖片
          ctx.globalAlpha = 1; // 設定透明度，可根據需要調整
          ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
          // 繪製貓咪圖片
          const scaleWidth = backgroundImage.width / catImage.width;
          const scaleHeight = backgroundImage.height / catImage.height;
          const minScale = Math.min(scaleWidth, scaleHeight);
          const x = (canvas.width - catImage.width * minScale) / 2;
          const y = (canvas.height - catImage.height * minScale) / 2;
          ctx.drawImage(catImage, x, y, catImage.width * minScale, catImage.height * minScale);

          // 生成合併後的圖片 URL
          const mergedUrl = canvas.toDataURL('image/png');
          setShowImageUrl(mergedUrl);
        };
      };
    }
  };

  const handleSave = () => {
    // save to phone & database
    if (showImageUrl) {
      // 將 base64 轉換成 Blob
      const byteCharacters = atob(showImageUrl.split(',')[1]);
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
          <Typography variant="h4">編輯貓貓圖片</Typography>

          {(showImageUrl) ? (
            <img
              src={showImageUrl}
              alt="Uploaded"
              style={{ maxWidth: '250px', 
                      maxHeight: '500px', 
                      marginTop: '10px', 
                      justifyContent: 'center',
                      alignContent: 'center',
                      marginLeft: 'auto', }}
            />
          ) : (
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
          )}
          <Divider sx={{ my: 3 }} />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              onClick={handleUpload}
            >
              移除背景
            </LoadingButton>&nbsp;&nbsp;
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              onClick={handleMergeImages}
            >
              合併
            </LoadingButton>&nbsp;&nbsp;
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              儲存
            </LoadingButton>
          </div><br />
          <Typography variant="h6">選擇新的背景圖片</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundChange}
          />

        </Card>
      </Stack>
    </Box>
  );
}
