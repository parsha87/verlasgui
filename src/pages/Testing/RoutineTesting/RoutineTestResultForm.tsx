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
  CardHeader,
  MenuItem,
  Switch,
  FormControlLabel,
  Autocomplete,
  Divider,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../../contexts/AxiosContext';

const defaultForm = {
  id: 0,
  sku: '0',
  model: '0',
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
  noLoadCurrentAvg: '',
  noLoadCurrentPassFail: '',
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

export interface RoutineData {
  id: number;
  sku: string;
  modelNumber: string;
  noLoadCurrentMin: string;
  noLoadCurrentMax: string;
  lockedRotorVoltageMin: string;
  lockedRotorVoltageMax: string;
  resistanceMin: string;
  resistanceMax: string;
}

export default function RoutineTestResultForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...defaultForm });
  const [skuList, setSkuList] = useState<any[]>([]);
  const [modelList, setModelList] = useState<any[]>([]);
  const [routineTestMaster, setRoutineTestMaster] = useState<RoutineData>();

  const numericFields = ["id"];

  useEffect(() => {
    api.get('/skumaster')
      .then((res) => setSkuList(res.data.filter((x: any) => x.isActive)))
      .catch(() => enqueueSnackbar('Failed to load SKUs', { variant: 'error' }));

    api.get('/skumodel')
      .then((res) => setModelList(res.data.filter((x: any) => x.isActive)))
      .catch(() => enqueueSnackbar('Failed to load Models', { variant: 'error' }));

    if (isEdit) {
      api.get(`/routinetestresults/${id}`).then((res) => setForm(res.data));
    }
  }, [id]);

  useEffect(() => {
    if (form.sku && form.model && form.sku !== '0' && form.model !== '0') {
      api
        .post(`/routinetestmaster/by-sku-model`, { sku: form.sku, model: form.model })
        .then((res) => res.data && setRoutineTestMaster(res.data))
        .catch(() => enqueueSnackbar('Failed to load electrical data', { variant: 'error' }));
    }
  }, [form.sku, form.model]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => {
      const updatedForm = {
        ...prev,
        [field]: numericFields.includes(field) ? Number(value) : value,
      };

      // Resistance Avg
      if (["resistance1", "resistance2", "resistance3"].includes(field)) {
        const r1 = parseFloat(updatedForm.resistance1) || 0;
        const r2 = parseFloat(updatedForm.resistance2) || 0;
        const r3 = parseFloat(updatedForm.resistance3) || 0;
        const avg = (r1 + r2 + r3) / 3;
        updatedForm.resistanceAvg = avg ? avg.toFixed(2) : "";
        if (routineTestMaster?.resistanceMax) {
          const min = parseFloat(routineTestMaster.resistanceMin);
          const max = parseFloat(routineTestMaster.resistanceMax);
          updatedForm.resistancePassFail = avg >= min && avg <= max ? "Pass" : "Fail";
        }
      }

      // No Load Current Avg
      if (["noLoadCurrent1", "noLoadCurrent2", "noLoadCurrent3"].includes(field)) {
        const c1 = parseFloat(updatedForm.noLoadCurrent1) || 0;
        const c2 = parseFloat(updatedForm.noLoadCurrent2) || 0;
        const c3 = parseFloat(updatedForm.noLoadCurrent3) || 0;
        const avg = (c1 + c2 + c3) / 3;
        updatedForm.noLoadCurrentAvg = avg ? avg.toFixed(2) : "";
        if (routineTestMaster?.noLoadCurrentMin && routineTestMaster?.noLoadCurrentMax) {
          const min = parseFloat(routineTestMaster.noLoadCurrentMin);
          const max = parseFloat(routineTestMaster.noLoadCurrentMax);
          updatedForm.noLoadCurrentPassFail = avg >= min && avg <= max ? "Pass" : "Fail";
        }
      }

      // Locked Rotor Avg + Pass/Fail
      if (["lockedRotorVoltage1", "lockedRotorVoltage2", "lockedRotorVoltage3"].includes(field)) {
        const v1 = parseFloat(updatedForm.lockedRotorVoltage1) || 0;
        const v2 = parseFloat(updatedForm.lockedRotorVoltage2) || 0;
        const v3 = parseFloat(updatedForm.lockedRotorVoltage3) || 0;
        const avg = (v1 + v2 + v3) / 3;
        updatedForm.lockedRotorVoltageAvg = avg ? avg.toFixed(2) : "";

        if (routineTestMaster?.lockedRotorVoltageMin && routineTestMaster?.lockedRotorVoltageMax) {
          const min = parseFloat(routineTestMaster.lockedRotorVoltageMin);
          const max = parseFloat(routineTestMaster.lockedRotorVoltageMax);
          updatedForm.lockedRotorPassFail = avg >= min && avg <= max ? "Pass" : "Fail";
        }
      }

      // Auto-calculate Final Pass/Fail
      const tests = [
        updatedForm.resistancePassFail,
        updatedForm.highVoltagePassFail,
        updatedForm.noLoadCurrentPassFail,
        updatedForm.lockedRotorPassFail,
      ];

      if (tests.every((t) => t === "Pass")) {
        updatedForm.lockedRotorFinalPassFail = "Pass";
      } else if (tests.some((t) => t === "Fail")) {
        updatedForm.lockedRotorFinalPassFail = "Fail";
      } else {
        updatedForm.lockedRotorFinalPassFail = ""; // if not all tests are completed yet
      }

      return updatedForm;
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form, isApproved: form.isApproved ? 1 : 0 };
      if (isEdit) {
        await api.put(`/routinetestresults/${id}`, payload);
        enqueueSnackbar('Updated successfully', { variant: 'success' });
      } else {
        await api.post('/routinetestresults', payload);
        enqueueSnackbar('Created successfully', { variant: 'success' });
      }
      navigate('/routine-testing');
    } catch {
      enqueueSnackbar('Error while saving', { variant: 'error' });
    }
  };

  const renderTextField = (label: string, field: string, type = 'text', readOnly = false) => (
    <Grid size={{ xs: 12, sm: 2 }}>
      <TextField
        fullWidth
        type={type}
        label={label}
        value={(form as any)[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        InputProps={readOnly ? { readOnly: true, style: { backgroundColor: "#f5f5f5" } } : {}}
      />
    </Grid>
  );

  const renderSelectField = (label: string, field: string, readOnly = false) => (
    <Grid size={{ xs: 12, sm: 2 }}>
      <TextField
        select
        fullWidth
        label={label}
        value={(form as any)[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        InputProps={readOnly ? { readOnly: true, style: { backgroundColor: "#f5f5f5" } } : {}}
        sx={{
          "& .MuiSelect-select": {
            fontWeight: "bold",
            color: (form as any)[field] === "Pass" ? "green" : (form as any)[field] === "Fail" ? "red" : "inherit",
          },
        }}
      >
        {['Pass', 'Fail'].map((opt) => (
          <MenuItem
            value={opt}
            key={opt}
            sx={{
              fontWeight: "bold",
              color: opt === "Pass" ? "green" : "red",
            }}
          >
            {opt}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  );

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        {isEdit ? '✏️ Edit Test Result' : '➕ Add Test Result'}
      </Typography>

      {/* SKU + Model Selection */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardHeader title="Product Selection" sx={{ backgroundColor: "#f0f4ff" }} />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                options={skuList}
                getOptionLabel={(option: any) => option.sku || ""}
                value={skuList.find((s) => s.sku === form.sku) || null}
                onChange={(e, newValue) => {
                  handleChange("sku", newValue ? newValue.sku : '0');
                  handleChange("model", 0);
                }}
                renderInput={(params) => <TextField {...params} label="SKU" fullWidth />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Model"
                name="model"
                value={form.model || 0}
                onChange={(e) => handleChange("model", e.target.value)}
                fullWidth
              >
                {modelList.filter((m) => m.sku.sku === form.sku).map((m) => (
                  <MenuItem key={m.id} value={m.model}>{m.model}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Resistance Section */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardHeader title="Resistance Test" sx={{ backgroundColor: "#f9f9f9" }} />
        <CardContent>
          <Grid container spacing={2}>
            {renderTextField('Resistance 1', 'resistance1')}
            {renderTextField('Resistance 2', 'resistance2')}
            {renderTextField('Resistance 3', 'resistance3')}
            {renderTextField('Avg Resistance', 'resistanceAvg', 'text', true)}
            {renderSelectField('Resistance Status', 'resistancePassFail', true)}
          </Grid>
        </CardContent>
      </Card>

      {/* High Voltage Section */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardHeader title="High Voltage Test" sx={{ backgroundColor: "#f9f9f9" }} />
        <CardContent>
          <Grid container spacing={2}>
            {/* {renderTextField('Voltage 1', 'voltage1')}
            {renderTextField('Voltage 2', 'voltage2')}
            {renderTextField('Voltage 3', 'voltage3')} */}
            {renderSelectField('High Voltage Status', 'highVoltagePassFail')}
          </Grid>
        </CardContent>
      </Card>

      {/* No Load Test */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardHeader title="No Load Test" sx={{ backgroundColor: "#f9f9f9" }} />
        <CardContent>
          <Grid container spacing={2}>
            {renderTextField('No Load Current 1', 'noLoadCurrent1')}
            {renderTextField('No Load Current 2', 'noLoadCurrent2')}
            {renderTextField('No Load Current 3', 'noLoadCurrent3')}
            {renderTextField('No Load Current Avg', 'noLoadCurrentAvg', 'text', true)}
            {renderSelectField('No Load Current Status', 'noLoadCurrentPassFail', true)}
            {renderTextField('No Load Power', 'noLoadPower')}
          </Grid>
        </CardContent>
      </Card>

      {/* Locked Rotor Test */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardHeader title="Locked Rotor Test" sx={{ backgroundColor: "#f9f9f9" }} />
        <CardContent>
          <Grid container spacing={2}>
            {renderTextField('Locked Rotor Voltage 1', 'lockedRotorVoltage1')}
            {renderTextField('Locked Rotor Voltage 2', 'lockedRotorVoltage2')}
            {renderTextField('Locked Rotor Voltage 3', 'lockedRotorVoltage3')}
            {renderTextField('Locked Rotor Voltage Avg', 'lockedRotorVoltageAvg', 'text', true)}

            {renderSelectField('Rotor Pass/Fail', 'lockedRotorPassFail')}
          </Grid>
        </CardContent>
      </Card>
      {/* Locked Rotor Test */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            {renderTextField('Rotor Power', 'lockedRotorPower')}
            {renderTextField('Rotor Current', 'lockedRotorCurrent')}

          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardHeader title="Routine Test Final Result" sx={{ backgroundColor: "#f9f9f9" }} />
        <CardContent>
          <Grid container spacing={2}>
            {renderSelectField('Final Pass/Fail', 'lockedRotorFinalPassFail', true)}
          </Grid>
        </CardContent>
      </Card>

      {/* Approval Section */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardHeader title="Approval Info" sx={{ backgroundColor: "#f9f9f9" }} />
        <CardContent>
          <Grid container spacing={2}>
            {renderTextField('Serial Number', 'serialNumber')}
            <Grid size={{ xs: 12, sm: 6 }}>
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

      {/* Action Buttons */}
      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={() => navigate('/routine-testing')}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} color="primary">
          {isEdit ? 'Update' : 'Add'}
        </Button>
      </Box>
    </Box>
  );
}
