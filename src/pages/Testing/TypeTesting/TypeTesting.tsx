import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Button,
  Autocomplete,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../contexts/AxiosContext';

interface MeasurementFields {
  [key: string]: number[];
}

interface CalculatedResults {
  avgNoLoadCurrent: number;
  avgColdRes: number;
  avgHotRes: number;
  noLoadCuLoss: number;
  tempRise: number;
  correctedSpeed: number;
  flCuLoss: number;
  slip: number;
  slipPer: number;
  rotorOutput: number;
  motorOutput: number;
  motorEfficiency: number;
  powerFactor: number;
}

interface FormData {
  sku: string;
  model: string;
  noLoad: MeasurementFields;
  fullLoad: MeasurementFields;
  hotResistance: MeasurementFields;
  results?: CalculatedResults;
}

const average = (nums: number[]) =>
  nums.length ? parseFloat((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2)) : 0;

const skuOptions = ['SKU123', 'SKU456', 'SKU789'];

const TypeTesting: React.FC = () => {
  const [skuList, setSkuList] = useState<any[]>([]);
  const [modelList, setModelList] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormData>({
    sku: '0',
    model: '0',
    noLoad: {
      'No Load Current': [0, 0, 0, 0],
      'No Load Watts': [0],
      'No Load Volts': [0],
      'Resistance / ph': [0, 0, 0],
      'Ambient Temp': [0],
    },
    fullLoad: {
      'Full Load Current': [0, 0, 0],
      'Full Load Input': [0],
      'Speed': [0],
      'Voltage': [0],
      'Frequency': [0],
    },
    hotResistance: {
      'Hot Resistance / ph': [0, 0, 0],
    },
  });

  // Calculation values
  const skuFreq = 1;
  const avgNoLoadCurrent = average(formData.noLoad['No Load Current']);
  const avgColdRes = average(formData.noLoad['Resistance / ph']);
  const avgHotRes = average(formData.hotResistance['Hot Resistance / ph']);
  const avgFullLoadCurrent = average(formData.fullLoad['Full Load Current']);
  const fullLoadInput = average(formData.fullLoad['Full Load Input']);
  const freq = average(formData.fullLoad['Frequency']);
  const synchSpeed = average(formData.fullLoad['Speed']);
  const ambientTemp = formData.noLoad['Ambient Temp'][0];

  const noLoadCuLoss = parseFloat((avgNoLoadCurrent ** 2 * avgColdRes).toFixed(1));
  const correctedSpeed = Math.round((skuFreq / freq) * synchSpeed);
  const flCuLoss = parseFloat((avgFullLoadCurrent ** 2 * avgColdRes).toFixed(1));
  const statorOutput = fullLoadInput - flCuLoss;
  const slip = parseFloat(((synchSpeed - correctedSpeed) / 100).toFixed(3));
  const slipPer = slip * 100;
  const rotorOutput = parseFloat((statorOutput * slip).toFixed(1));
  const motorOutput = parseFloat((rotorOutput * 0.05).toFixed(1));
  const motorEfficiency = parseFloat(((motorOutput / 1000) * 100).toFixed(2));
  const powerFactor = parseFloat((1000 / (1.732 * 400 * avgFullLoadCurrent)).toFixed(2));
  const tempRise = parseFloat(
    ((avgHotRes / avgColdRes - 1) * (234.5 + ambientTemp)).toFixed(1)
  );

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const numericFields = ["id"];

  // Fetch existing record when editing
  useEffect(() => {
    api.get('/skumaster')
      .then((res) => setSkuList(res.data.filter((x: any) => x.isActive)))
      .catch(() => enqueueSnackbar('Failed to load SKUs', { variant: 'error' }));

    api.get('/skumodel')
      .then((res) => setModelList(res.data.filter((x: any) => x.isActive)))
      .catch(() => enqueueSnackbar('Failed to load Models', { variant: 'error' }));

    if (isEdit) {
      api.get(`/typetestingresults/${id}`)
        .then((res) => {
          const data = res.data;

          setFormData({
            sku: data.sku || '0',
            model: data.model || '0',
            noLoad: {
              'No Load Current': [
                parseFloat(data.noLoadCurrent_1) || 0,
                parseFloat(data.noLoadCurrent_2) || 0,
                parseFloat(data.noLoadCurrent_3) || 0,
              ],
              'No Load Watts': [parseFloat(data.noLoadWatts) || 0],
              'No Load Volts': [parseFloat(data.noLoadVolts) || 0],
              'Resistance / ph': [
                parseFloat(data.resistanceCold_1) || 0,
                parseFloat(data.resistanceCold_2) || 0,
                parseFloat(data.resistanceCold_3) || 0,
              ],
              'Ambient Temp': [parseFloat(data.ambientTemp) || 0],
            },
            fullLoad: {
              'Full Load Current': [
                parseFloat(data.fullLoadCurrent_1) || 0,
                parseFloat(data.fullLoadCurrent_2) || 0,
                parseFloat(data.fullLoadCurrent_3) || 0,
              ],
              'Full Load Input': [parseFloat(data.fullLoadInput) || 0],
              'Speed': [parseFloat(data.speed) || 0],
              'Voltage': [parseFloat(data.voltage) || 0],
              'Frequency': [parseFloat(data.frequency) || 0],
            },
            hotResistance: {
              'Hot Resistance / ph': [
                parseFloat(data.resistanceHot_1) || 0,
                parseFloat(data.resistanceHot_2) || 0,
                parseFloat(data.resistanceHot_3) || 0,
              ],
            },
          });
        })
        .catch(() => enqueueSnackbar("Failed to load record", { variant: "error" }));
    }
  }, [isEdit, id, enqueueSnackbar]);

  const handleSubmit = async () => {
    try {
      const calculatedResults: CalculatedResults = {
        avgNoLoadCurrent,
        avgColdRes,
        avgHotRes,
        noLoadCuLoss,
        tempRise,
        correctedSpeed,
        flCuLoss,
        slip,
        slipPer,
        rotorOutput,
        motorOutput,
        motorEfficiency,
        powerFactor,
      };

      const payload = {
        id: 0,
        sku: formData.sku,
        model: formData.model,
        noLoadCurrent_1: formData.noLoad["No Load Current"][0].toString(),
        noLoadCurrent_2: formData.noLoad["No Load Current"][1].toString(),
        noLoadCurrent_3: formData.noLoad["No Load Current"][2].toString(),
        noLoadCurrentAvg: calculatedResults.avgNoLoadCurrent.toString(),
        noLoadWatts: formData.noLoad["No Load Watts"][0].toString(),
        noLoadVolts: formData.noLoad["No Load Volts"][0].toString(),
        resistanceCold_1: formData.noLoad["Resistance / ph"][0].toString(),
        resistanceCold_2: formData.noLoad["Resistance / ph"][1].toString(),
        resistanceCold_3: formData.noLoad["Resistance / ph"][2].toString(),
        resistanceColdAvg: calculatedResults.avgColdRes.toString(),
        ambientTemp: formData.noLoad["Ambient Temp"][0].toString(),
        fullLoadCurrent_1: formData.fullLoad["Full Load Current"][0].toString(),
        fullLoadCurrent_2: formData.fullLoad["Full Load Current"][1].toString(),
        fullLoadCurrent_3: formData.fullLoad["Full Load Current"][2].toString(),
        fullLoadCurrentAvg: avgFullLoadCurrent.toString(),
        fullLoadInput: formData.fullLoad["Full Load Input"][0].toString(),
        speed: formData.fullLoad["Speed"][0].toString(),
        voltage: formData.fullLoad["Voltage"][0].toString(),
        frequency: formData.fullLoad["Frequency"][0].toString(),
        resistanceHot_1: formData.hotResistance["Hot Resistance / ph"][0].toString(),
        resistanceHot_2: formData.hotResistance["Hot Resistance / ph"][1].toString(),
        resistanceHot_3: formData.hotResistance["Hot Resistance / ph"][2].toString(),
        resistanceHotAvg: calculatedResults.avgHotRes.toString(),
        noLoadCuLoss: calculatedResults.noLoadCuLoss.toString(),
        tempRise: calculatedResults.tempRise.toString(),
        correctedSpeed: calculatedResults.correctedSpeed.toString(),
        fullLoadCuLoss: calculatedResults.flCuLoss.toString(),
        statorOutput: (fullLoadInput - calculatedResults.flCuLoss).toString(),
        slip: calculatedResults.slip.toString(),
        slipPercent: calculatedResults.slipPer.toString(),
        rotorOutput: calculatedResults.rotorOutput.toString(),
        motorOutput: calculatedResults.motorOutput.toString(),
        motorEfficiency: calculatedResults.motorEfficiency.toString(),
        powerFactor: calculatedResults.powerFactor.toString(),
        createdBy: "test-user", // replace with real user
      };

      if (isEdit) {
        await api.put(`/typetestingresults/${id}`, payload);
        enqueueSnackbar("Updated successfully", { variant: "success" });
      } else {
        await api.post("/typetestingresults", payload);
        enqueueSnackbar("Created successfully", { variant: "success" });
      }

      navigate("/type-testing");
    } catch (error) {
      console.error("Error while saving:", error);
      enqueueSnackbar("Error while saving", { variant: "error" });
    }
  };


  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updatedForm = {
        ...prev,
        [field]: numericFields.includes(field) ? Number(value) : value,
      };
      return updatedForm;
    });
  };

  const handleInputChange = (
    section: keyof Omit<FormData, 'sku' | 'model' | 'results'>,
    field: string,
    index: number,
    value: string
  ) => {
    const num = parseFloat(value);
    const updated = { ...formData[section] };
    updated[field][index] = isNaN(num) ? 0 : num;
    setFormData({ ...formData, [section]: updated });
  };

  const renderInputFields = (
    section: keyof Omit<FormData, 'sku' | 'model' | 'results'>,
    sectionLabel: string,
    fields: MeasurementFields
  ) => (
    <Card sx={{ mb: 3 }} elevation={3}>
      <CardHeader title={sectionLabel} />
      <Divider />
      <CardContent>
        {Object.entries(fields).map(([label, values]) => {
          const avg = average(values);
          return (
            <Box key={label} mb={2}>
              <Typography variant="subtitle2" gutterBottom>{label}</Typography>
              <Grid container spacing={2}>
                {values.map((val, i) => (
                  <Grid sx={{ xs: 12, sm: 6, md: 2 }} key={i}>
                    <TextField
                      label={`${label.split(' ')[0].substring(0, 3).toUpperCase()}${i + 1}`}
                      value={val}
                      onChange={(e) =>
                        handleInputChange(section, label, i, e.target.value)
                      }
                      type="number"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                ))}
                {values.length > 1 && (
                  <Grid sx={{ xs: 12, sm: 6, md: 2 }}>
                    <TextField
                      label="AVG"
                      value={avg}
                      size="small"
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          );
        })}

        {section === 'noLoad' && (
          <Box mt={3}>
            <Typography variant="subtitle2">No Load Copper Loss</Typography>
            <TextField
              fullWidth
              size="small"
              value={noLoadCuLoss}
              InputProps={{ readOnly: true }}
              helperText="Avg Current × Avg Current × Avg Resistance"
            />
          </Box>
        )}

        {section === 'fullLoad' && (
          <Box mt={3}>
            <Card sx={{ mb: 5 }} elevation={3}>
              <CardHeader title="Calculated Results" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  {[['Corrected Speed', correctedSpeed],
                  ['Full Load Copper Loss', flCuLoss],
                  ['Slip', slip],
                  ['Slip %', slipPer],
                  ['Rotor Output', rotorOutput],
                  ['Motor Output', motorOutput],
                  ['Motor Efficiency (%)', motorEfficiency],
                  ['Motor Power Factor', powerFactor]
                  ].map(([label, value]) => (
                    <Grid sx={{ xs: 12, sm: 6, md: 4 }} key={label}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="body2"><strong>{label}:</strong> {value}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}

        {section === 'hotResistance' && (
          <Card elevation={3} sx={{ mt: 3 }}>
            <CardHeader title="Temp Rise by Resistance" />
            <Divider />
            <CardContent>
              <TextField
                fullWidth
                label="Temperature Rise (°C)"
                value={tempRise}
                InputProps={{ readOnly: true }}
                helperText="((Hot Avg / Cold Avg) - 1) × (234.5 + Ambient Temp)"
              />
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {isEdit ? "Edit Type Testing" : "New Type Testing"}
      </Typography>

      <Card sx={{ mb: 3 }} elevation={3}>
        <CardHeader title="Step 0: Select SKU" />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                options={skuList}
                getOptionLabel={(option: any) => option.sku || ""}
                value={skuList.find((s) => s.sku === formData.sku) || null}
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
                value={formData.model || 0}
                onChange={(e) => handleChange("model", e.target.value)}
                fullWidth
              >
                {modelList.filter((m) => m.sku.sku === formData.sku).map((m) => (
                  <MenuItem key={m.id} value={m.model}>{m.model}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {renderInputFields('noLoad', 'Step 1: No Load Inputs', formData.noLoad)}
      {renderInputFields('fullLoad', 'Step 2: Full Load Inputs', formData.fullLoad)}
      {renderInputFields('hotResistance', 'Step 3: Hot Resistance Inputs', formData.hotResistance)}

      <Box textAlign="right" mt={2}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {isEdit ? "Update Test Data" : "Save Test Data"}
        </Button>
      </Box>
    </Box>
  );
};

export default TypeTesting;
