import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import { account } from 'src/_mock/account';
// ----------------------------------------------------------------------

export default function ProfileView() {
  const theme = useTheme();

  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard');
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="device" label="Device ID" />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Browse down Apple Watch to get device ID
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
      >
        SUBMIT
      </LoadingButton>
    </>
  );

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

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              device ID
            </Typography>
          </Divider>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
