// src/pages/Vendor/VendorForm.tsx

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
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../../contexts/AxiosContext';

const defaultVendor = {
  id: 0,
  vendorCode: '',
  vendorType: '',
  vendorCategory: '',
  vendorName: '',
  addressField1: '',
  addressField2: '',
  nearbyLandmark: '',
  city: '',
  state: '',
  countryCode: '',
  country: '',
  contactName: '',
  contactName_1: '',
  contactNumber: '',
  contactNumber_1: '',
  emailId: '',
  designation: '',
  gstNo: '',
  paymentTerms: '',
  freightTerms: '',
  billingCurrency: '',
  lockStatus: 'Open',
};

export default function VendorForm() {
  const [form, setForm] = useState({ ...defaultVendor });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      api.get(`/vendors/${id}`)
        .then(res => setForm(res.data))
        .catch(() => enqueueSnackbar('Failed to load vendor', { variant: 'error' }));
    }
  }, [id]);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.vendorName || !form.vendorCode || !form.emailId || !form.contactNumber) {
      enqueueSnackbar('Please fill all required fields', { variant: 'warning' });
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/vendors/${id}`, form);
        enqueueSnackbar('Vendor updated successfully', { variant: 'success' });
      } else {
        await api.post('/vendors', form);
        enqueueSnackbar('Vendor added successfully', { variant: 'success' });
      }
      navigate('/vendor');
    } catch {
      enqueueSnackbar('Operation failed', { variant: 'error' });
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        {isEdit ? 'Edit Vendor' : 'Add Vendor'}
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Basic Info</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Vendor Code" value={form.vendorCode} onChange={(e) => handleChange('vendorCode', e.target.value)} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Vendor Name" value={form.vendorName} onChange={(e) => handleChange('vendorName', e.target.value)} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Vendor Type" value={form.vendorType} onChange={(e) => handleChange('vendorType', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label="Vendor Category"
                value={form.vendorCategory}
                onChange={(e) => handleChange('vendorCategory', e.target.value)}
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="C">C</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Address</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Address Line 1" value={form.addressField1} onChange={(e) => handleChange('addressField1', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Address Line 2" value={form.addressField2} onChange={(e) => handleChange('addressField2', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Nearby Landmark" value={form.nearbyLandmark} onChange={(e) => handleChange('nearbyLandmark', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="City" value={form.city} onChange={(e) => handleChange('city', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="State" value={form.state} onChange={(e) => handleChange('state', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Country Code" value={form.countryCode} onChange={(e) => handleChange('countryCode', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Country" value={form.country} onChange={(e) => handleChange('country', e.target.value)} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Contact Info</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Contact Name" value={form.contactName} onChange={(e) => handleChange('contactName', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Alternate Contact Name" value={form.contactName_1} onChange={(e) => handleChange('contactName_1', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Contact Number" value={form.contactNumber} onChange={(e) => handleChange('contactNumber', e.target.value)} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Alternate Contact Number" value={form.contactNumber_1} onChange={(e) => handleChange('contactNumber_1', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Email ID" value={form.emailId} onChange={(e) => handleChange('emailId', e.target.value)} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Designation" value={form.designation} onChange={(e) => handleChange('designation', e.target.value)} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Other Details</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="GST No" value={form.gstNo} onChange={(e) => handleChange('gstNo', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Payment Terms" value={form.paymentTerms} onChange={(e) => handleChange('paymentTerms', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Freight Terms" value={form.freightTerms} onChange={(e) => handleChange('freightTerms', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label="Billing Currency"
                value={form.billingCurrency}
                onChange={(e) => handleChange('billingCurrency', e.target.value)}
              >
                <MenuItem value="INR">INR</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
              </TextField>            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth select label="Lock" value={form.lockStatus} onChange={(e) => handleChange('lockStatus', e.target.value)}>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Locked">Locked</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box mt={2}>
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? 'Update' : 'Add'}
        </Button>
        <Button sx={{ ml: 2 }} onClick={() => navigate('/vendor')}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
