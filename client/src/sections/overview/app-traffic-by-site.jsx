import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

// ----------------------------------------------------------------------

export default function AppTrafficBySite({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box
        sx={{
          p: 3,
          gap: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {list.map((site) => (
          <Paper
            key={site.name}
            variant="outlined"
            sx={{ py: 2.5, textAlign: 'center', borderStyle: 'dashed' }}
          >
            <a href={site.link} target="_blank" rel="noreferrer">
              <Box sx={{ mb: 0.5 }}>{site.icon}</Box>
            </a>
            <Typography variant="h6">{site.value}</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {site.name}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Card>
  );
}

AppTrafficBySite.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};
