import React, { useEffect, useState } from 'react';
import {
  Box, Button, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Typography
} from '@mui/material';
import {
  DataGrid, GridColDef, GridActionsCellItem
} from '@mui/x-data-grid';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import api from '../../../contexts/AxiosContext';

export default function RoutineTestResultList() {
  const [data, setData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await api.get('/routine-test-results');
      setData(res.data);
    } catch {
      enqueueSnackbar('Failed to fetch data', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/routine-test-results/${deleteId}`);
      enqueueSnackbar('Deleted successfully', { variant: 'success' });
      fetchData();
    } catch {
      enqueueSnackbar('Delete failed', { variant: 'error' });
    }
    setOpenConfirm(false);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'serialNumber', headerName: 'Serial Number', width: 150 },
    { field: 'resistance1', headerName: 'Resistance 1', width: 130 },
    { field: 'resistance2', headerName: 'Resistance 2', width: 130 },
    { field: 'resistance3', headerName: 'Resistance 3', width: 130 },
    { field: 'rAvg', headerName: 'R Avg', width: 100 },
    { field: 'resistanceStatus', headerName: 'Pass/Fail', width: 120 },
    {
      field: 'actions', headerName: 'Actions', type: 'actions', width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />} label="Edit"
          onClick={() => navigate(`/routine-test-results/edit/${params.id}`)}
        />,
        <GridActionsCellItem
          icon={<Delete />} label="Delete" onClick={() => {
            setDeleteId(Number(params.id));
            setOpenConfirm(true);
          }}
        />
      ]
    }
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Routine Test Results</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/routine-testing/add')}>
          Add New
        </Button>
      </Box>

      <DataGrid
        rows={data}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
      />

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this entry?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
