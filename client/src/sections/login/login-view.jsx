import { useReducer, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { updateAccountFromLocalStorage } from 'src/_mock/account';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();
  
  const handleClick = () => {
    router.push('/');
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
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign in to Cat Collector</Typography>


          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              onClick={handleClick}
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />&nbsp;&nbsp;&nbsp;&nbsp;

              <GoogleOAuthProvider clientId="764610707185-r5k3j4q0hisq8iojk4l567a5i0scvqno.apps.googleusercontent.com">
              <GoogleLogin
                  onSuccess={async credentialResponse => {
                      console.log(credentialResponse);
                      const decoded = jwtDecode(credentialResponse.credential);
                      console.log(decoded);
                      try {
                          const userName = `${decoded.given_name} ${decoded.family_name}`;
                          const userEmail = decoded.email;
                          const userImage = decoded.picture;
                          // const response = await fetch('/api/auth/login', {
                          //     method: 'POST',
                          //     headers: {
                          //         'Content-Type': 'application/json',
                          //     },
                          //     body: JSON.stringify({
                          //         token: credentialResponse?.accessToken,
                          //     }),
                          // });
                          // if (!response.ok) {
                          //     throw new Error(response.statusText);
                          // }
                          // const { token } = await response.json();
                          localStorage.setItem('name', userName);
                          localStorage.setItem('email', userEmail);
                          localStorage.setItem('image', userImage);
                          updateAccountFromLocalStorage();
                          // reload for updating the account data
                          window.location.reload();
                          window.location.href = '/';
                      } catch (err) {
                          console.log(err);
                      }
                  }}
                  onError={() => {
                      console.log('Login Failed');
                  }}
                  />
              </GoogleOAuthProvider>
            </Button>
          </Stack>

        </Card>
      </Stack>
    </Box>
  );
}
