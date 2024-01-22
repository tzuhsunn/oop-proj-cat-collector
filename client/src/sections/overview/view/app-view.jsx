import { faker } from '@faker-js/faker';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import AppNewsUpdate from '../app-news-update';
import AppCurrentVisits from '../app-current-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppTrafficBySite from '../app-traffic-by-site';

// ----------------------------------------------------------------------

export default function AppView() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Cat Collector  🐱 🐈 😺
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={8} sm={6} md={3}>
        <AppWidgetSummary
            title="Captured Cats"
            total={48}
            color="info"
            icon={<img alt="icon" src="/assets/icons/cats/cat1.png" />}
          />
        </Grid>

        <Grid xs={4} sm={6} md={3}>
          <Card
            component={Stack}
            spacing={3}
            direction="column"
            height={158}
            alignItems="center"
            justifyContent="center"
          >
            <Stack alignItems="center" justifyContent="center">
              {/* master level icon */}
              <img
                alt="icon"
                src="/assets/icons/cats/profile_cat.png"
                style={{ borderRadius: '50%', width: 60, height: 60 }}
              />
            </Stack>
            <Stack alignItems="center" justifyContent="center">
              <strong>CAT</strong>
              <strong>MASTER</strong>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="貓貓捕獲分佈"
            chart={{
              series: [
                { label: '巴哥犬', value: 3 },
                { label: '蘇格蘭㹴犬', value: 5 },
                { label: '布偶貓', value: 20 },
                { label: '美國鬥牛犬', value: 5 },
                { label: '斯塔福郡鬥牛㹴', value: 5 },
                { label: '孟加拉貓', value: 10 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="最近捕獲貓貓"
            list={[
              {
                id: faker.string.uuid(),
                title: '白貓貓',
                description: '就很可愛',
                image: '/assets/cats/real-cat1.jpeg',
                postedAt: '2023/12/12',
              },
              {
                id: faker.string.uuid(),
                title: '虎斑貓貓',
                description: '就很機車',
                image: '/assets/cats/real-cat3.jpeg',
                postedAt: faker.date.recent(),
              },
              {
                id: faker.string.uuid(),
                title: '虎斑貓貓',
                description: '有點機車',
                image: '/assets/cats/real-cat4.jpeg',
                postedAt: faker.date.recent(),
              },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTrafficBySite
            title="推薦的雲端貓貓"
            list={[
              {
                name: '七貓嚕不完',
                value: '好味小姐',
                icon: <img alt="icon" src="/assets/icons/cats/ref-cat-1.jpeg" width={50}/>,
                link: 'https://www.youtube.com/@LadyFlavor',
              },
              {
                name: '短腿貓貓是真愛',
                value: '花花與三貓',
                icon: <img alt="icon" src="/assets/icons/cats/ref-cat-2.jpeg" width={50}/>,
                link: 'https://www.youtube.com/@catlive7508',
              },
              {
                name: '貓貓狗狗一次滿足',
                value: '浪浪別哭',
                icon: <img alt="icon" src="/assets/icons/cats/ref-cat-3.jpeg" width={50}/>,
                link: 'https://www.youtube.com/@langlangdontcry',
              },
              {
                name: '老人與貓最對味',
                value: '傲嬌爸的養貓日常',
                icon: <img alt="icon" src="/assets/icons/cats/ref-cat-4.jpeg" width={50}/>,
                link: 'https://www.youtube.com/@unicatto',
              },
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
