import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Typography
} from '@mui/material';
import {
  DataGrid, GridColDef, GridActionsCellItem
} from '@mui/x-data-grid';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import api from '../../../contexts/AxiosContext';

export default function TypeTestResultList() {
  const [data, setData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await api.get('/typetestingresults');
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
      await api.delete(`/typetestingresults/${deleteId}`);
      enqueueSnackbar('Deleted successfully', { variant: 'success' });
      fetchData();
    } catch {
      enqueueSnackbar('Delete failed', { variant: 'error' });
    }
    setOpenConfirm(false);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'sku', headerName: 'SKU', width: 150 },
    { field: 'noLoadCurrentAvg', headerName: 'No Load Current Avg', width: 180 },
    { field: 'fullLoadCurrentAvg', headerName: 'Full Load Current Avg', width: 200 },
    { field: 'motorEfficiency', headerName: 'Efficiency', width: 150 },
    { field: 'powerFactor', headerName: 'Power Factor', width: 150 },
    { field: 'createdBy', headerName: 'Created By', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit sx={{ color: 'blue' }}/>}
          label="Edit"
          onClick={() => navigate(`/type-testing/${params.id}`)}
        />,
        <GridActionsCellItem
          icon={<Delete sx={{ color: 'red' }}/>}
          label="Delete"
          onClick={() => {
            setDeleteId(Number(params.id));
            setOpenConfirm(true);
          }}
        />,
      ],
    },
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Type Test Results</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/type-testing/add')}
        >
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
