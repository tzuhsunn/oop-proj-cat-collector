import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { posts } from 'src/_mock/blog';

import Iconify from 'src/components/iconify';

import PostCard from '../post-card';

// ----------------------------------------------------------------------

export default function BlogView() {
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">推薦一隻可愛貓貓狗狗！</Typography>
      </Stack>

      <Stack mb={2} direction="row" justifyContent="space-between">
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
            Click Me!
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <PostCard key={0} post={{
          title: 'Abyssinian',
          cover: 'https://tzuhsun.online/static/cat/Abyssinian_1.jpg',
          info: "貓",
        }} index={1} />
      </Grid>
    </Container>
  );
}
