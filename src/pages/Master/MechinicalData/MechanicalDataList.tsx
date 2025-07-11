import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../../contexts/AxiosContext';

export interface MechanicalData {
  id: number;
  sku: string;
  modelNumber: string;
  typeOfDeBearing: string;
  typeOfNdeBearing: string;
  deBearingShield: string;
  ndeBearingShield: string;
  deBearingNumber: string;
  ndeBearingNumber: string;
  degreeOfProtection: string;
  cooling: string;
  coolingType: string;
  shaftDe: string;
  shaftNde: string;
  encoderMountingArrgt: string;
  brakeMountingArrgt: string;
  brakeType: string;
  brakeSize: string;
  fan: string;
  casting: string;
  deEndshield: string;
  ndeEndshield: string;
}

export default function MechanicalDataList() {
  const [data, setData] = useState<MechanicalData[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await api.get('/mechanicaldesigns');
      setData(res.data);
    } catch {
      enqueueSnackbar('Failed to load data', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete(`/mechanicaldesigns/${id}`);
      enqueueSnackbar('Deleted successfully', { variant: 'success' });
      fetchData();
    } catch {
      enqueueSnackbar('Delete failed', { variant: 'error' });
    }
  };

  const columns: GridColDef[] = [
    { field: 'sku', headerName: 'SKU', width: 150 },
    { field: 'modelNumber', headerName: 'Model No', width: 150 },
    { field: 'coolingType', headerName: 'Cooling Type', width: 150 },
    { field: 'brakeType', headerName: 'Brake Type', width: 130 },
    { field: 'casting', headerName: 'Casting', width: 130 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem icon={<Edit />} label="Edit" onClick={() => navigate(`/mechanical-data/${params.id}`)} />,
        <GridActionsCellItem icon={<Delete />} label="Delete" onClick={() => handleDelete(Number(params.id))} showInMenu />
      ]
    }
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Mechanical Data</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/mechanical-data/new')}>
          Add Data
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
