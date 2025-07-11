import React, { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, Grid, TextField, Typography
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../../contexts/AxiosContext';

const defaultData = {
  id: 0,
  sku: '',
  modelNumber: '',
  noLoadCurrentMin: '',
  noLoadCurrentMax: '',
  lockedRotorVoltageMin: '',
  lockedRotorVoltageMax: '',
  resistanceMin: '',
  resistanceMax: '',
};

export default function RoutineTestDataForm() {
  const [form, setForm] = useState({ ...defaultData });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      api.get(`/routine-tests/${id}`)
        .then((res) => setForm(res.data))
        .catch(() => enqueueSnackbar('Failed to load data', { variant: 'error' }));
    }
  }, [id]);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.sku || !form.modelNumber) {
      enqueueSnackbar('SKU and Model Number are required', { variant: 'warning' });
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/routine-tests/${id}`, form);
        enqueueSnackbar('Updated successfully', { variant: 'success' });
      } else {
        await api.post('/routine-tests', form);
        enqueueSnackbar('Added successfully', { variant: 'success' });
      }
      navigate('/routine-test-data');
    } catch {
      enqueueSnackbar('Operation failed', { variant: 'error' });
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        {isEdit ? 'Edit' : 'Add'} Routine Test Data
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Test Information</Typography>
          <Grid container spacing={2}>
            {[
              ['SKU', 'sku'],
              ['Model Number', 'modelNumber'],
              ['No Load Current Min', 'noLoadCurrentMin'],
              ['No Load Current Max', 'noLoadCurrentMax'],
              ['Locked Rotor Voltage Min', 'lockedRotorVoltageMin'],
              ['Locked Rotor Voltage Max', 'lockedRotorVoltageMax'],
              ['Resistance Min', 'resistanceMin'],
              ['Resistance Max', 'resistanceMax'],
            ].map(([label, key]) => (
              <Grid key={key} size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={label}
                  fullWidth
                  value={form[key as keyof typeof form]}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Box mt={2}>
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? 'Update' : 'Add'}
        </Button>
        <Button sx={{ ml: 2 }} onClick={() => navigate('/routine-test-data')}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
