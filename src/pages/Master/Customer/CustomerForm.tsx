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

const defaultCustomer = {
  id: 0,
  customerCode: '',
  customerType: 'Domestic',
  customerCategory: '',
  customerName: '',
  addressField1: '',
  addressField2: '',
  nearbyLandmark: '',
  cityTaluka: '',
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
  creditLock: 'Open',
};

export default function CustomerForm() {
  const [form, setForm] = useState({ ...defaultCustomer });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      api.get(`/customers/${id}`)
        .then(res => setForm(res.data))
        .catch(() =>
          enqueueSnackbar('Failed to load customer', { variant: 'error' })
        );
    }
  }, [id]);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.customerName || !form.customerCode || !form.emailId || !form.contactNumber) {
      enqueueSnackbar('Please fill all required fields', { variant: 'warning' });
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/customers/${id}`, form);
        enqueueSnackbar('Customer updated successfully', { variant: 'success' });
      } else {
        await api.post('/customers', form);
        enqueueSnackbar('Customer added successfully', { variant: 'success' });
      }
      navigate('/customer');
    } catch {
      enqueueSnackbar('Operation failed', { variant: 'error' });
    }
  };

  const renderField = (
    label: string,
    field: keyof typeof form,
    options?: string[]
  ) => (
    <Grid size={{ xs: 12, sm: 6 }} key={field}>
      <TextField
        fullWidth
        required={['customerName', 'customerCode', 'emailId', 'contactNumber'].includes(field)}
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
      <Typography variant="h5" gutterBottom>
        {isEdit ? 'Edit Customer' : 'Add Customer'}
      </Typography>

      <Grid container spacing={3}>
        {/* Section 1: Basic Info */}
        <Grid size={{ xs: 12}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                {renderField('Customer Code', 'customerCode')}
                {renderField('Customer Type', 'customerType', ['Domestic', 'International'])}
                {renderField('Customer Category', 'customerCategory')}
                {renderField('Customer Name', 'customerName')}
                {renderField('GST No', 'gstNo')}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Section 2: Address Info */}
       <Grid size={{ xs: 12}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Address Information
              </Typography>
              <Grid container spacing={2}>
                {renderField('Address Line 1', 'addressField1')}
                {renderField('Address Line 2', 'addressField2')}
                {renderField('Nearby Landmark', 'nearbyLandmark')}
                {renderField('City/Taluka', 'cityTaluka')}
                {renderField('State', 'state')}
                {renderField('Country Code', 'countryCode')}
                {renderField('Country', 'country')}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Section 3: Contact Info */}
        <Grid size={{ xs: 12}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                {renderField('Contact Name', 'contactName')}
                {renderField('Alternate Contact Name', 'contactName_1')}
                {renderField('Contact Number', 'contactNumber')}
                {renderField('Alternate Contact Number', 'contactNumber_1')}
                {renderField('Email ID', 'emailId')}
                {renderField('Designation', 'designation')}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Section 4: Commercial Terms */}
       <Grid size={{ xs: 12}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Commercial Details
              </Typography>
              <Grid container spacing={2}>
                {renderField('Payment Terms', 'paymentTerms')}
                {renderField('Freight Terms', 'freightTerms')}
                {renderField('Billing Currency', 'billingCurrency')}
                {renderField('Credit Lock', 'creditLock', ['Open', 'Locked'])}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? 'Update' : 'Add'}
        </Button>
        <Button sx={{ ml: 2 }} onClick={() => navigate('/customer')}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
