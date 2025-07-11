import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../../contexts/AxiosContext';

interface ElectricalDesign {
  id: number;
  sku: string;
  modelNumber: string;
  kw: string;
  hp: string;
  pole: string;
  phase: string;
  type: string;
  voltage: string;
  frequency: string;
  statorOD: string;
  statorID: string;
  rotorID: string;
  coreLength: string;
  statorSlots: string;
  rotorSlots: string;
  turnsPerCoil: string;
  noOfCoils: string;
  lmt: string;
  wireSize1: string;
  wireSize2: string;
  strandsWireSize1: string;
  strandsWireSize2: string;
  connection: string;
  mainWindingTurnsPerCoil: string;
  mainWindingWireSize1: string;
  strandsMainWireSize1: string;
  strandsMainWireSize2: string;
  resistancePerPhase: string;
  typeOfWinding: string;
  efficiencyStd: string;
  efficiencyNamePlate: string;
  powerFactorNamePlate: string;
  noLoadCurrentMin: string;
  noLoadCurrentMax: string;
  lockedRotorVoltageMin: string;
  lockedRotorVoltageMax: string;
  efficiencyMin: string;
  startingTorque: string;
  synchronousRPM: string;
  rpmNamePlate: string;
  fullLoadTorque: string;
  fullLoadTorque1: string;
  powerFactorMin: string;
  tempRiseBodyPrototype: string;
  tempRiseResistancePrototype: string;
  insulationClass: string;
  fullLoadCurrentNameplate: string;
}

export default function ElectricalDesignList() {
  const [rows, setRows] = useState<ElectricalDesign[]>([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      const res = await api.get('/electricaldesigns');
      setRows(res.data);
    } catch (error) {
      enqueueSnackbar('Failed to fetch data', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/electricaldesigns/${id}`);
      enqueueSnackbar('Deleted successfully', { variant: 'success' });
      fetchData();
    } catch (error) {
      enqueueSnackbar('Delete failed', { variant: 'error' });
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'sku', headerName: 'SKU', width: 150 },
    { field: 'modelNumber', headerName: 'Model No.', width: 150 },
    { field: 'kw', headerName: 'KW', width: 100 },
    { field: 'hp', headerName: 'HP', width: 100 },
    { field: 'voltage', headerName: 'Voltage', width: 100 },
    { field: 'frequency', headerName: 'Freq.', width: 100 },
    { field: 'rpmNamePlate', headerName: 'RPM', width: 100 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => navigate(`/electrical-design/form/${params.id}`)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDelete(Number(params.id))}
          showInMenu
        />,
      ],
    },
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Electrical Design List</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/electrical-design/form')}>
          Add Design
        </Button>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
      />
    </Box>
  );
}
