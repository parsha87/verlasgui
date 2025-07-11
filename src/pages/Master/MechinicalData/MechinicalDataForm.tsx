import React, { useEffect, useState } from 'react';
import {
  Box, Grid, TextField, Typography, Button, Card, CardContent
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../contexts/AxiosContext';
import { MechanicalData } from './MechanicalDataList';

const defaultData: MechanicalData = {
  id: 0,
  sku: '',
  modelNumber: '',
  typeOfDeBearing: '',
  typeOfNdeBearing: '',
  deBearingShield: '',
  ndeBearingShield: '',
  deBearingNumber: '',
  ndeBearingNumber: '',
  degreeOfProtection: '',
  cooling: '',
  coolingType: '',
  shaftDe: '',
  shaftNde: '',
  encoderMountingArrgt: '',
  brakeMountingArrgt: '',
  brakeType: '',
  brakeSize: '',
  fan: '',
  casting: '',
  deEndshield: '',
  ndeEndshield: ''
};

export default function MechanicalDataForm() {
  const [form, setForm] = useState<MechanicalData>(defaultData);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      api.get(`/mechanicaldesigns/${id}`).then((res) => {
        setForm(res.data);
      }).catch(() => enqueueSnackbar('Failed to load data', { variant: 'error' }));
    }
  }, [id]);

  const handleChange = (field: keyof MechanicalData, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.sku || !form.modelNumber || !form.coolingType) {
      enqueueSnackbar('Please fill required fields', { variant: 'warning' });
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/mechanicaldesigns/${id}`, form);
        enqueueSnackbar('Updated successfully', { variant: 'success' });
      } else {
        await api.post('/mechanicaldesigns', form);
        enqueueSnackbar('Created successfully', { variant: 'success' });
      }
      navigate('/mechanical-data');
    } catch {
      enqueueSnackbar('Operation failed', { variant: 'error' });
    }
  };

  const renderSection = (title: string, fields: { label: string, key: keyof MechanicalData }[]) => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Grid container spacing={2}>
          {fields.map(({ label, key }) => (
            <Grid size={{ xs: 12, sm: 6 }} key={key}>
              <TextField
                fullWidth
                label={label}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>{isEdit ? 'Edit' : 'Add'} Mechanical Data</Typography>

      {renderSection('Basic Info', [
        { label: 'SKU', key: 'sku' },
        { label: 'Model Number', key: 'modelNumber' }
      ])}

      {renderSection('Bearings', [
        { label: 'Type of DE Bearing', key: 'typeOfDeBearing' },
        { label: 'Type of NDE Bearing', key: 'typeOfNdeBearing' },
        { label: 'DE Bearing Shield', key: 'deBearingShield' },
        { label: 'NDE Bearing Shield', key: 'ndeBearingShield' },
        { label: 'DE Bearing Number', key: 'deBearingNumber' },
        { label: 'NDE Bearing Number', key: 'ndeBearingNumber' }
      ])}

      {renderSection('Protection & Cooling', [
        { label: 'Degree of Protection', key: 'degreeOfProtection' },
        { label: 'Cooling', key: 'cooling' },
        { label: 'Cooling Type', key: 'coolingType' }
      ])}

      {renderSection('Shaft & Mounting', [
        { label: 'Shaft DE', key: 'shaftDe' },
        { label: 'Shaft NDE', key: 'shaftNde' },
        { label: 'Encoder Mounting Arrangement', key: 'encoderMountingArrgt' },
        { label: 'Brake Mounting Arrangement', key: 'brakeMountingArrgt' },
        { label: 'Brake Type', key: 'brakeType' },
        { label: 'Brake Size', key: 'brakeSize' }
      ])}

      {renderSection('Components', [
        { label: 'Fan', key: 'fan' },
        { label: 'Casting', key: 'casting' },
        { label: 'DE Endshield', key: 'deEndshield' },
        { label: 'NDE Endshield', key: 'ndeEndshield' }
      ])}

      <Box mt={2}>
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? 'Update' : 'Add'}
        </Button>
        <Button sx={{ ml: 2 }} onClick={() => navigate('/mechanical-data')}>Cancel</Button>
      </Box>
    </Box>
  );
}
