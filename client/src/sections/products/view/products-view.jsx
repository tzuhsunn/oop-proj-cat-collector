import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import ProductCard from '../product-card';

// ----------------------------------------------------------------------

export default function ProductsView() {
  const [catData, setCatData] = useState([
    {
      name: 'cat',
      cover: 'https://tzuhsun.online/static/cat/Abyssinian_1.jpg'},
  ]);
  useEffect(() => {
    const fetchCatData = async () => {
      try {
        const response = await fetch('https://tzuhsun.online/api/1.0/cat/listAllCats');
        if (!response.ok) {
          throw new Error('Failed to fetch cat data');
        }
        const data = await response.json();
        console.log(data);
        const catArray = data.map((cat) => ({
          id: cat.id,
          cover: cat.image_url,
          name: cat.name_en,
          name_zh: cat.name_zh,
          description: cat.description,
        }));
        console.log(catArray);
        setCatData(catArray);
        
      } catch (error) {
        console.error('Error fetching cat data:', error);
      }
    };

    fetchCatData();
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        貓貓圖鑑
      </Typography>

      <Grid container spacing={3}>
        {catData.map((cat) => (
          <Grid key={cat.id} xs={12} sm={6} md={3}>
            <ProductCard product={cat} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
