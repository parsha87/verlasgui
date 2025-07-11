// src/pages/Customer/CustomerList.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../../contexts/AxiosContext';

interface Customer {
  id: number;
  customerName: string;
  customerCode: string;
  emailId: string;
  contactNumber: string;
  customerType: string;
}

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch {
      enqueueSnackbar('Failed to fetch customers', { variant: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.delete(`/customers/${id}`);
        enqueueSnackbar('Customer deleted', { variant: 'success' });
        fetchCustomers();
      } catch {
        enqueueSnackbar('Failed to delete', { variant: 'error' });
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'customerName', headerName: 'Name', flex: 1 },
    { field: 'customerCode', headerName: 'Code', flex: 1 },
    { field: 'emailId', headerName: 'Email', flex: 1 },
    { field: 'contactNumber', headerName: 'Contact', flex: 1 },
    { field: 'customerType', headerName: 'Type', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => navigate(`/customer/edit/${params.row.id}`)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDelete(params.row.id)}
        />,
      ],
    },
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Customer Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/customer/add')}
        >
          Add Customer
        </Button>
      </Box>

      <DataGrid
        rows={customers}
        columns={columns}
        autoHeight
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
      />
    </Box>
  );
}
