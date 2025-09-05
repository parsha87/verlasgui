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
  Autocomplete,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../../contexts/AxiosContext';

const defaultForm = {
  id: 0,
  sku: '0',
  modelNumber: '0',
  kw: '',
  kw2: '',
  hp: '',
  hp2: '',
  phase: 'Three',
  pole: '',
  frameSize: '',
  type: 'LT',
  voltage: '450',
  frequency: '50',
  statorOd: '',
  statorId: '',
  rotorId: '',
  coreLength: '',
  statorSlots: '',
  rotorSlots: '',
  turnsPerCoil: '',
  noOfCoils: '',
  lmt: '',
  wireSize1: '',
  wireSize2: '',
  strandsWireSize1: '1',
  strandsWireSize2: '1',
  connection: '',
  mainWindingTurnsPerCoil: '',
  mainWindingWireSize1: '',
  strandsMainWireSize1: '',
  strandsMainWireSize2: '',
  resistancePerPhaseMin: '',
  resistancePerPhaseMax: '',
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
  synchronousRpm: '',
  rpmNamePlate: '',
  fullLoadTorque: '',
  fullLoadTorque1: '',
  powerFactorMin: '',
  tempRiseBodyPrototype: '',
  tempRiseResistancePrototype: '',
  insulationClass: 'F',
  fullLoadCurrentNameplate: '',
};



export default function ElectricalDesignForm() {
  const [form, setForm] = useState({ ...defaultForm });
  const [skuList, setSkuList] = useState<any[]>([]);
  const [modelList, setModelList] = useState<any[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const numericFields = ["id"];

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const phaseOptions = ["Single", "Three"];
  const poleOptions = [
    "2",
    "4",
    "6",
    "8",
    "10",
    "12",
    "14",
    "16",
    "2/4",
    "4/8",
    "2/12",
    "4/12",
  ];
  const frameSizeOptions = [
    "56",
    "63",
    "71",
    "80",
    "90S",
    "90L",
    "100L",
    "112M",
    "132S",
    "132M",
    "160M",
    "160L",
    "180M",
    "180L",
    "200L",
    "225S",
    "225M",
    "250M",
    "280S",
    "280M",
    "315S",
    "315M",
    "315L",
    "400",
    "450",
    "500",
    "560",
    "630",
    "710",
  ];


  const typeOptions = ["LT", "HT", "DC"];

  const strandsWireSizeOptions = ["0", "1", "2", "3"];

  const connectionOptions = ["Star", "Delta"];

  const typeOfWindingOptions = ["Concentric", "Double Layer", "Single Layer", "Other"];

  const insulationClassOptions = ["F", "H"];
  useEffect(() => {
    api.get('/skumaster')
      .then((res) => setSkuList(res.data.filter((x: any) => x.isActive)))
      .catch(() => enqueueSnackbar('Failed to load SKUs', { variant: 'error' }));

    api
      .get('/skumodel')
      .then((res) => {
        console.log("📦 Full /skumodel response:", res);
        console.log("✅ Data:", res.data);

        setModelList(res.data.filter((x: any) => x.isActive));
      })
      .catch(() =>
        enqueueSnackbar('Failed to load Models', { variant: 'error' })
      );

    if (isEdit) {
      api.get(`/electricaldesignmaster/${id}`)
        .then((res) => setForm(res.data))
        .catch(() =>
          enqueueSnackbar('Failed to load electrical design', { variant: 'error' })
        );
    }
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: numericFields.includes(field) ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.modelNumber || !form.voltage || !form.kw) {
      enqueueSnackbar('Please fill all required fields', { variant: 'warning' });
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/electricaldesignmaster/${id}`, form);
        enqueueSnackbar('Design updated successfully', { variant: 'success' });
      } else {
        await api.post('/electricaldesignmaster', form);
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

  const renderField = (
    label: string,
    field: keyof typeof form,
    options?: string[]
  ) => (
    <Grid size={{ xs: 12, sm: 6 }} key={field}>
      <TextField
        fullWidth
        required={['pole', 'frameSize', 'sku', 'skuNumner'].includes(field)}
        label={label}
        value={form[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        select={!!options}
      >
        {options?.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </TextField>
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                options={skuList}
                getOptionLabel={(option: any) => option.sku || ""}
                value={skuList.find((s) => s.sku === form.sku) || null}
                onChange={(e, newValue) => {
                  handleChange("sku", newValue ? newValue.sku : '0');
                  handleChange("modelNumber", 0); // reset when SKU changes
                }}
                renderInput={(params) => <TextField {...params} label="SKU" fullWidth />}
              />

            </Grid>

            {/* Model Number Dropdown */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Model"
                name="modelNumber"
                value={form.modelNumber || 0}
                onChange={(e) => handleChange("modelNumber", e.target.value)}
                fullWidth
              >
                {modelList
                  .filter((m) => m.sku.sku === form.sku)
                  .map((m) => (
                    <MenuItem key={m.id} value={m.model}>
                      {m.model}
                    </MenuItem>
                  ))}
              </TextField>

            </Grid>
            {renderField('Pole', 'pole', poleOptions)}
            {renderField('KW', 'kw')}
            {renderField('HP', 'hp')}

            {/* Conditionally render KW2 + HP2 */}
            {form.pole?.includes("/") && (
              <>
                {renderField("KW2", "kw2")}
                {renderField("HP2", "hp2")}
              </>
            )}

            {renderField('Frame Size', 'frameSize', frameSizeOptions)}
            {renderField('Phase', 'phase', phaseOptions)}
            {renderField('Type', 'type', typeOptions)}
            {renderField('Voltage', 'voltage')}
            {renderField('Frequency', 'frequency')}
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
            {renderField('Stator OD', 'statorOd')}
            {renderField('Stator ID', 'statorId')}
            {renderField('Rotor ID', 'rotorId')}
            {renderField('Core Length', 'coreLength')}
            {renderField('Stator Slots', 'statorSlots')}
            {renderField('Rotor Slots', 'rotorSlots')}
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
            {renderField('Type Of Winding', 'typeOfWinding', typeOfWindingOptions)}
            {renderField('Number of Coils', 'noOfCoils')}
            {renderField('Turns per Coil', 'turnsPerCoil')}            
            {renderField('LMT', 'lmt')}
            {renderField('Wire Size 1', 'wireSize1')}
            {renderField('Wire Size 2', 'wireSize2')}
            {renderField('Strands Wire Size 1', 'strandsWireSize1', strandsWireSizeOptions)}
            {renderField('Strands Wire Size 2', 'strandsWireSize2', strandsWireSizeOptions)}
            {renderField('Connection', 'connection', connectionOptions)}
            {/* Show only if Phase is NOT Three */}
            {form.phase !== "Three" && (
              <>
                {renderField('Main Winding Turns per Coil', 'mainWindingTurnsPerCoil')}
                {renderField('Main Winding Wire Size 1', 'mainWindingWireSize1')}
                {renderField('Strands Main Wire Size 1', 'strandsMainWireSize1')}
                {renderField('Strands Main Wire Size 2', 'strandsMainWireSize2')}
              </>
            )}
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
            {renderField('Resistance Per Phase Min', 'resistancePerPhaseMin')}
            {renderField('Resistance Per Phase Max', 'resistancePerPhaseMax')}
            {renderField('Efficiency Std', 'efficiencyStd')}
            {renderField('Efficiency Name Plate', 'efficiencyNamePlate')}
            {renderField('Power Factor Name Plate', 'powerFactorNamePlate')}
            {renderField('No Load Current Min', 'noLoadCurrentMin')}
            {renderField('No Load Current Max', 'noLoadCurrentMax')}
            {renderField('Locked Rotor Voltage Min', 'lockedRotorVoltageMin')}
            {renderField('Locked Rotor Voltage Max', 'lockedRotorVoltageMax')}
            {renderField('Efficiency Min', 'efficiencyMin')}
            {renderField('Starting Torque', 'startingTorque')}
            {renderField('Synchronous RPM', 'synchronousRpm')}
            {renderField('RPM Name Plate', 'rpmNamePlate')}
            {renderField('Full Load Torque', 'fullLoadTorque')}
            {renderField('Full Load Torque 1', 'fullLoadTorque1')}
            {renderField('Power Factor Min', 'powerFactorMin')}
            {renderField('Full Load Current (Nameplate)', 'fullLoadCurrentNameplate')}
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
            {renderField('Temp Rise Body (Prototype)', 'tempRiseBodyPrototype')}
            {renderField('Temp Rise Resistance (Prototype)', 'tempRiseResistancePrototype')}
            {renderField('Insulation Class', 'insulationClass', insulationClassOptions)}
            
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
