import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';


import Iconify from 'src/components/iconify';

import PostCard from '../post-card';

// ----------------------------------------------------------------------

export default function BlogView() {
  const [catData, setCatData] = useState(
    {
      name_en: '選一隻卯貓狗勾！',
      name_zh: '',
      description: '點擊按鈕，隨機推薦一隻貓貓狗狗給你！',
      image_url: 'https://tzuhsun.online/static/cat/Abyssinian_1.jpg'
    },
  );

  const fetchCatData = async () => {
    try {
      const response = await fetch('https://tzuhsun.online/api/1.0/cat/recommendCats');
      if (!response.ok) {
        throw new Error('Failed to fetch cat data');
      }
      const data = await response.json();
      setCatData(data[0]);
      
    } catch (error) {
      console.error('Error fetching cat data:', error);
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">推薦一隻可愛貓貓狗狗！</Typography>
      </Stack>

      <Stack mb={2} direction="row" justifyContent="space-between">
        <Button 
          variant="contained" 
          color="inherit" 
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={fetchCatData}  
        >
            Click Me!
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <PostCard key={0} post={{
          title: catData.name_en+catData.name_zh,
          cover: catData.image_url,
          info: catData.description,
        }} index={1} />
      </Grid>
    </Container>
  );
}
