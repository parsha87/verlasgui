import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../../contexts/AxiosContext';

const defaultData = {
  id: 0,
  sku: '0',
  modelNumber: '0',
  noLoadCurrentMin: '',
  noLoadCurrentMax: '',
  lockedRotorVoltageMin: '',
  lockedRotorVoltageMax: '',
  resistanceMin: '',
  resistanceMax: '',
};

export default function RoutineTestDataForm() {
  const [form, setForm] = useState({ ...defaultData });
  const [skuList, setSkuList] = useState<any[]>([]);
  const [modelList, setModelList] = useState<any[]>([]);
  const numericFields = ["id"];

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    // Load SKU list from API
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
      api.get(`/routinetestmaster/${id}`)
        .then((res) => setForm(res.data))
        .catch(() => enqueueSnackbar('Failed to load data', { variant: 'error' }));
    }
  }, [id]);


  // 👇 Add this useEffect to trigger when SKU & Model change
  useEffect(() => {
    if (form.sku && form.modelNumber && form.sku !== '0' && form.modelNumber !== '0') {
      api
        .post(`/electricaldesignmaster/by-sku-model`, {
          sku: form.sku,
          model: form.modelNumber, // match DTO property "model"
        })
        .then((res) => {
          if (res.data) {
            console.log("⚡ Electrical data:", res.data);
            setForm((prev) => ({
              ...prev,
              noLoadCurrentMin: res.data.noLoadCurrentMin ?? prev.noLoadCurrentMin,
              noLoadCurrentMax: res.data.noLoadCurrentMax ?? prev.noLoadCurrentMax,
              lockedRotorVoltageMin: res.data.lockedRotorVoltageMin ?? prev.lockedRotorVoltageMin,
              lockedRotorVoltageMax: res.data.lockedRotorVoltageMax ?? prev.lockedRotorVoltageMax,
              resistanceMin: res.data.resistancePerPhaseMin ?? prev.resistanceMin,
              resistanceMax: res.data.resistancePerPhaseMax ?? prev.resistanceMax,
            }));
          }
        })
        .catch(() => {
          enqueueSnackbar('Failed to load electrical data', { variant: 'error' });
        });
    }
  }, [form.sku, form.modelNumber]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: numericFields.includes(field) ? Number(value) : value,
    }));
  };


  const handleSubmit = async () => {
    if (!form.sku || !form.modelNumber) {
      enqueueSnackbar('SKU and Model Number are required', { variant: 'warning' });
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/routinetestmaster/${id}`, form);
        enqueueSnackbar('Updated successfully', { variant: 'success' });
      } else {
        await api.post('/routinetestmaster', form);
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

            {/* SKU Autocomplete */}
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

            {/* Other numeric fields */}
            {[
              ['No Load Current Min', 'noLoadCurrentMin'],
              ['No Load Current Max', 'noLoadCurrentMax'],
              ['Locked Rotor Voltage Min', 'lockedRotorVoltageMin'],
              ['Locked Rotor Voltage Max', 'lockedRotorVoltageMax'],
              ['Resistance Min', 'resistanceMin'],
              ['Resistance Max', 'resistanceMax'],
            ].map(([label, key]) => (
              <Grid size={{ xs: 12, sm: 6 }} key={key}>
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
