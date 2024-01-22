import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import { account } from 'src/_mock/account';
// ----------------------------------------------------------------------

export default function ProfileView() {
  const theme = useTheme();

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
          <Typography variant="h4">User Profile</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
            {account.displayName}
          </Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
            {account.email}
          </Typography>
        </Card>
      </Stack>
    </Box>
  );
}
