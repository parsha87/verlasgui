// src/pages/RoutineTestResultForm.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../../contexts/AxiosContext';

const defaultForm = {
  sku: '',
  resistance1: '',
  resistance2: '',
  resistance3: '',
  resistanceAvg: '',
  resistancePassFail: '',
  voltage1: '',
  voltage2: '',
  voltage3: '',
  highVoltagePassFail: '',
  noLoadCurrent1: '',
  noLoadCurrent2: '',
  noLoadCurrent3: '',
  noLoadPower: '',
  lockedRotorVoltage1: '',
  lockedRotorVoltage2: '',
  lockedRotorVoltage3: '',
  lockedRotorVoltageAvg: '',
  lockedRotorPassFail: '',
  lockedRotorPower: '',
  lockedRotorCurrent: '',
  lockedRotorFinalPassFail: '',
  serialNumber: '',
  isApproved: false,
  approvedBy: '',
  approvedOn: '',
  rejectedReason: '',
};

export default function RoutineTestResultForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...defaultForm });

  useEffect(() => {
    if (isEdit) {
      api.get(`/routine-tests-results/${id}`).then((res) => setForm(res.data));
    }
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form, isApproved: form.isApproved ? 1 : 0 };
      if (isEdit) {
        await api.put(`/routine-tests-results/${id}`, payload);
        enqueueSnackbar('Updated successfully', { variant: 'success' });
      } else {
        await api.post('/routine-tests-results', payload);
        enqueueSnackbar('Created successfully', { variant: 'success' });
      }
      navigate('/routine-test-results');
    } catch {
      enqueueSnackbar('Error while saving', { variant: 'error' });
    }
  };

  const passFailOptions = ['Pass', 'Fail'];

  const renderTextField = (label: string, field: string, type = 'text') => (
    <Grid sx={{ xs: 12, sm:6 }}>
      <TextField
        fullWidth
        type={type}
        label={label}
        value={(form as any)[field]}
        onChange={(e) => handleChange(field, e.target.value)}
      />
    </Grid>
  );

  const renderSelectField = (label: string, field: string) => (
    <Grid sx={{ xs: 12, sm:6 }}>
      <TextField
        select
        fullWidth
        label={label}
        value={(form as any)[field]}
        onChange={(e) => handleChange(field, e.target.value)}
      >
        {passFailOptions.map((opt) => (
          <MenuItem value={opt} key={opt}>
            {opt}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  );

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        {isEdit ? 'Edit Test Result' : 'Add Test Result'}
      </Typography>

      {/* Resistance Section */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>Resistance Test</Typography>
          <Grid container spacing={2}>
            {renderTextField('SKU', 'sku')}
            {renderTextField('Resistance 1', 'resistance1')}
            {renderTextField('Resistance 2', 'resistance2')}
            {renderTextField('Resistance 3', 'resistance3')}
            {renderTextField('Avg Resistance', 'resistanceAvg')}
            {renderSelectField('Resistance Status', 'resistancePassFail')}
          </Grid>
        </CardContent>
      </Card>

      {/* High Voltage Section */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>High Voltage Test</Typography>
          <Grid container spacing={2}>
            {renderTextField('Voltage 1', 'voltage1')}
            {renderTextField('Voltage 2', 'voltage2')}
            {renderTextField('Voltage 3', 'voltage3')}
            {renderSelectField('High Voltage Status', 'highVoltagePassFail')}
          </Grid>
        </CardContent>
      </Card>

      {/* No Load Test */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>No Load Test</Typography>
          <Grid container spacing={2}>
            {renderTextField('No Load Current 1', 'noLoadCurrent1')}
            {renderTextField('No Load Current 2', 'noLoadCurrent2')}
            {renderTextField('No Load Current 3', 'noLoadCurrent3')}
            {renderTextField('No Load Power', 'noLoadPower')}
          </Grid>
        </CardContent>
      </Card>

      {/* Locked Rotor Test */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>Locked Rotor Test</Typography>
          <Grid container spacing={2}>
            {renderTextField('Locked Rotor Voltage 1', 'lockedRotorVoltage1')}
            {renderTextField('Locked Rotor Voltage 2', 'lockedRotorVoltage2')}
            {renderTextField('Locked Rotor Voltage 3', 'lockedRotorVoltage3')}
            {renderTextField('Voltage Avg', 'lockedRotorVoltageAvg')}
            {renderSelectField('Rotor Pass/Fail', 'lockedRotorPassFail')}
            {renderTextField('Rotor Power', 'lockedRotorPower')}
            {renderTextField('Rotor Current', 'lockedRotorCurrent')}
            {renderSelectField('Final Pass/Fail', 'lockedRotorFinalPassFail')}
          </Grid>
        </CardContent>
      </Card>

      {/* Final Section */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>Approval Info</Typography>
          <Grid container spacing={2}>
            {renderTextField('Serial Number', 'serialNumber')}
            <Grid sx={{ xs: 12, sm:6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isApproved}
                    onChange={(e) => handleChange('isApproved', e.target.checked)}
                  />
                }
                label="Is Approved"
              />
            </Grid>
            {renderTextField('Approved By', 'approvedBy')}
            {renderTextField('Approved On', 'approvedOn', 'datetime-local')}
            {renderTextField('Rejected Reason', 'rejectedReason')}
          </Grid>
        </CardContent>
      </Card>

      <Box mt={2}>
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? 'Update' : 'Add'}
        </Button>
        <Button sx={{ ml: 2 }} onClick={() => navigate('/routine-test-results')}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
