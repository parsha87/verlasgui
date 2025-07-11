import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../../contexts/AxiosContext';

const defaultForm = {
  id: 0,
  sku: '',
  modelNumber: '',
  kw: '',
  hp: '',
  pole: '',
  phase: '',
  type: '',
  voltage: '',
  frequency: '',
  statorOD: '',
  statorID: '',
  rotorID: '',
  coreLength: '',
  statorSlots: '',
  rotorSlots: '',
  turnsPerCoil: '',
  noOfCoils: '',
  lmt: '',
  wireSize1: '',
  wireSize2: '',
  strandsWireSize1: '',
  strandsWireSize2: '',
  connection: '',
  mainWindingTurnsPerCoil: '',
  mainWindingWireSize1: '',
  strandsMainWireSize1: '',
  strandsMainWireSize2: '',
  resistancePerPhase: '',
  typeOfWinding: '',
  efficiencyStd: '',
  efficiencyNamePlate: '',
  powerFactorNamePlate: '',
  noLoadCurrentMin: '',
  noLoadCurrentMax: '',
  lockedRotorVoltageMin: '',
  lockedRotorVoltageMax: '',
  efficiencyMin: '',
  startingTorque: '',
  synchronousRPM: '',
  rpmNamePlate: '',
  fullLoadTorque: '',
  fullLoadTorque1: '',
  powerFactorMin: '',
  tempRiseBodyPrototype: '',
  tempRiseResistancePrototype: '',
  insulationClass: '',
  fullLoadCurrentNameplate: '',
};

export default function ElectricalDesignForm() {
  const [form, setForm] = useState({ ...defaultForm });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      api.get(`/electricaldesigns/${id}`)
        .then((res) => setForm(res.data))
        .catch(() =>
          enqueueSnackbar('Failed to load electrical design', { variant: 'error' })
        );
    }
  }, [id]);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.modelNumber || !form.voltage || !form.kw) {
      enqueueSnackbar('Please fill all required fields', { variant: 'warning' });
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/electricaldesigns/${id}`, form);
        enqueueSnackbar('Design updated successfully', { variant: 'success' });
      } else {
        await api.post('/electricaldesigns', form);
        enqueueSnackbar('Design created successfully', { variant: 'success' });
      }
      navigate('/electrical-design');
    } catch {
      enqueueSnackbar('Operation failed', { variant: 'error' });
    }
  };

  const renderTextField = (label: string, field: keyof typeof form) => (
    <Grid size={{ xs: 12, sm: 6 }}>
      <TextField
        fullWidth
        label={label}
        value={form[field]}
        onChange={(e) => handleChange(field, e.target.value)}
      />
    </Grid>
  );

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        {isEdit ? 'Edit Electrical Design' : 'Add Electrical Design'}
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {renderTextField('SKU', 'sku')}
            {renderTextField('Model Number', 'modelNumber')}
            {renderTextField('KW', 'kw')}
            {renderTextField('HP', 'hp')}
            {renderTextField('Pole', 'pole')}
            {renderTextField('Phase', 'phase')}
            {renderTextField('Type', 'type')}
            {renderTextField('Voltage', 'voltage')}
            {renderTextField('Frequency', 'frequency')}
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Core Dimensions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {renderTextField('Stator OD', 'statorOD')}
            {renderTextField('Stator ID', 'statorID')}
            {renderTextField('Rotor ID', 'rotorID')}
            {renderTextField('Core Length', 'coreLength')}
            {renderTextField('Stator Slots', 'statorSlots')}
            {renderTextField('Rotor Slots', 'rotorSlots')}
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Coil & Winding
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {renderTextField('Turns per Coil', 'turnsPerCoil')}
            {renderTextField('Number of Coils', 'noOfCoils')}
            {renderTextField('LMT', 'lmt')}
            {renderTextField('Wire Size 1', 'wireSize1')}
            {renderTextField('Wire Size 2', 'wireSize2')}
            {renderTextField('Strands Wire Size 1', 'strandsWireSize1')}
            {renderTextField('Strands Wire Size 2', 'strandsWireSize2')}
            {renderTextField('Connection', 'connection')}
            {renderTextField('Main Winding Turns per Coil', 'mainWindingTurnsPerCoil')}
            {renderTextField('Main Winding Wire Size 1', 'mainWindingWireSize1')}
            {renderTextField('Strands Main Wire Size 1', 'strandsMainWireSize1')}
            {renderTextField('Strands Main Wire Size 2', 'strandsMainWireSize2')}
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Performance Characteristics
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {renderTextField('Resistance Per Phase', 'resistancePerPhase')}
            {renderTextField('Type Of Winding', 'typeOfWinding')}
            {renderTextField('Efficiency Std', 'efficiencyStd')}
            {renderTextField('Efficiency Name Plate', 'efficiencyNamePlate')}
            {renderTextField('Power Factor Name Plate', 'powerFactorNamePlate')}
            {renderTextField('No Load Current Min', 'noLoadCurrentMin')}
            {renderTextField('No Load Current Max', 'noLoadCurrentMax')}
            {renderTextField('Locked Rotor Voltage Min', 'lockedRotorVoltageMin')}
            {renderTextField('Locked Rotor Voltage Max', 'lockedRotorVoltageMax')}
            {renderTextField('Efficiency Min', 'efficiencyMin')}
            {renderTextField('Starting Torque', 'startingTorque')}
            {renderTextField('Synchronous RPM', 'synchronousRPM')}
            {renderTextField('RPM Name Plate', 'rpmNamePlate')}
            {renderTextField('Full Load Torque', 'fullLoadTorque')}
            {renderTextField('Full Load Torque 1', 'fullLoadTorque1')}
            {renderTextField('Power Factor Min', 'powerFactorMin')}
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Thermal & Miscellaneous
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {renderTextField('Temp Rise Body (Prototype)', 'tempRiseBodyPrototype')}
            {renderTextField('Temp Rise Resistance (Prototype)', 'tempRiseResistancePrototype')}
            {renderTextField('Insulation Class', 'insulationClass')}
            {renderTextField('Full Load Current (Nameplate)', 'fullLoadCurrentNameplate')}
          </Grid>
        </CardContent>
      </Card>

      <Box mt={3}>
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? 'Update Design' : 'Add Design'}
        </Button>
        <Button sx={{ ml: 2 }} onClick={() => navigate('/electrical-design')}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
