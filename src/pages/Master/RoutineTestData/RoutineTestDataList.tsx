import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../../contexts/AxiosContext';

interface RoutineTestData {
  id: number;
  sku: string;
  modelNumber: string;
  noLoadCurrentMin: string;
  noLoadCurrentMax: string;
  lockedRotorVoltageMin: string;
  lockedRotorVoltageMax: string;
  resistancePerPhase: string;
}

export default function RoutineTestDataList() {
  const [data, setData] = useState<RoutineTestData[]>([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      const res = await api.get('/routine-tests');
      setData(res.data);
    } catch {
      enqueueSnackbar('Failed to fetch data', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/routine-tests/${id}`);
      enqueueSnackbar('Deleted successfully', { variant: 'success' });
      fetchData();
    } catch {
      enqueueSnackbar('Delete failed', { variant: 'error' });
    }
  };

  const columns: GridColDef[] = [
    { field: 'sku', headerName: 'SKU', width: 150 },
    { field: 'modelNumber', headerName: 'Model Number', width: 150 },
    { field: 'noLoadCurrentMin', headerName: 'No Load Current Min', width: 180 },
    { field: 'noLoadCurrentMax', headerName: 'No Load Current Max', width: 180 },
    { field: 'resistanceMin', headerName: 'Resistance Min', width: 180 },
    { field: 'resistanceMax', headerName: 'Resistance Max', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem icon={<Edit />} label="Edit" onClick={() => navigate(`/routine-test-data/${params.id}`)} />,
        <GridActionsCellItem icon={<Delete />} label="Delete" onClick={() => handleDelete(Number(params.id))} showInMenu />
      ],
    },
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Routine Test Data</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/routine-test-data/new')}>
          Add
        </Button>
      </Box>

      <DataGrid
        rows={data}
        columns={columns}
        autoHeight
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10]}
        initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
      />
    </Box>
  );
}
