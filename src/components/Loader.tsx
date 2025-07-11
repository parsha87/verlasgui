import { CircularProgress, Box } from '@mui/material';

export const Loader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
    <CircularProgress />
  </Box>
);
