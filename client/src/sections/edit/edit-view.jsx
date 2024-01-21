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
import Input from '@mui/material/Input';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import React, { useState, useRef } from 'react';

import { saveAs } from 'file-saver';
import { useRouter } from 'src/routes/hooks';
import { bgGradient } from 'src/theme/css';
import { useLocation } from 'react-router-dom';

import imglyRemoveBackground, { Config } from "@imgly/background-removal";
const config = {
  publicPath: "https://tzuhsun.online/static/removeBG/",
  fetchArgs: {
    mode: "no-cors",
  },
};

// ----------------------------------------------------------------------

export default function EditView() {
  const theme = useTheme();

  const { state } = useLocation();
  const imageUrl = state?.imageUrl;
  const [pocessedFile, setProcessedFile] = useState(null);

  const handleUpload = async () => {
    try {
      if (!imageUrl) {
        console.error('No file selected for upload.');
        return;
      }
      // removeBackground(imageUrl, {
      //   publicPath: MODEL_ASSETS_URL,
      //   debug: true,
      //   progress: (key, current, total) => {
      //     console.log(`Processing: ${key}: ${current}/${total}`);
      //   },
      // }).then((blob) => {
      //   const url = URL.createObjectURL(blob);
      //   setProcessedFile(url);
      // });
      const removeBackgorund = async (tmp) => {
        const blob = await imglyRemoveBackground(tmp, config);
        const url = URL.createObjectURL(blob);
        setProcessedFile(url);
      };
      removeBackgorund(imageUrl);

    } catch (error) {
      console.error('Error uploading image:', error);
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
          <Typography variant="h4">Cat Prediction</Typography>

          {(pocessedFile) ? (
            <img
              src={pocessedFile}
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
            </LoadingButton>
          </div>
        </Card>
      </Stack>
    </Box>
  );
}
