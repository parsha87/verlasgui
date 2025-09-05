import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Tooltip,
  IconButton
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import api from '../../../contexts/AxiosContext';
import { Delete, Edit } from '@mui/icons-material';

interface SkuMaster {
  id: number;
  sku: string | null;
  isActive: number | null;
}

interface SkuModel {
  id: number;
  model: string;
  skuId: number;
  isActive: number | null;
  sku?: SkuMaster; // relation
}

const SkuMasterPage: React.FC = () => {
  const [tab, setTab] = useState(0);

  // ✅ SKU States
  const [skuRows, setSkuRows] = useState<SkuMaster[]>([]);
  const [skuForm, setSkuForm] = useState({ sku: '', isActive: true });
  const [skuEditing, setSkuEditing] = useState<SkuMaster | null>(null);
  const [skuDialog, setSkuDialog] = useState(false);

  // ✅ SKU Model States
  const [modelRows, setModelRows] = useState<SkuModel[]>([]);
  const [modelForm, setModelForm] = useState({ model: '', skuId: 0, isActive: true });
  const [modelEditing, setModelEditing] = useState<SkuModel | null>(null);
  const [modelDialog, setModelDialog] = useState(false);

  // ✅ Common
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const SKU_API = 'skumaster';
  const MODEL_API = 'skumodel';

  // Fetch SKU
  const fetchSkus = async () => {
    try {
      const { data } = await api.get<SkuMaster[]>(SKU_API);
      setSkuRows(data);
    } catch {
      showSnackbar('Failed to fetch SKUs', 'error');
    }
  };

  // Fetch Models
  const fetchModels = async () => {
    try {
      const { data } = await api.get<SkuModel[]>(MODEL_API);
      setModelRows(data);
    } catch {
      showSnackbar('Failed to fetch Models', 'error');
    }
  };

  useEffect(() => {
    fetchSkus();
    fetchModels();
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // ---------------- SKU CRUD ----------------
  const saveSku = async () => {
    try {
      const payload = { sku: skuForm.sku, isActive: skuForm.isActive ? 1 : 0 };
      if (skuEditing) {
        await api.put(`${SKU_API}/${skuEditing.id}`, payload);
        showSnackbar('SKU updated', 'success');
      } else {
        await api.post(SKU_API, payload);
        showSnackbar('SKU created', 'success');
      }
      setSkuDialog(false);
      setSkuForm({ sku: '', isActive: true });
      setSkuEditing(null);
      fetchSkus();
    } catch {
      showSnackbar('Failed to save SKU', 'error');
    }
  };

  const deleteSku = async (id: number) => {
    if (!window.confirm('Delete this SKU?')) return;
    try {
      await api.delete(`${SKU_API}/${id}`);
      showSnackbar('SKU deleted', 'success');
      fetchSkus();
    } catch {
      showSnackbar('Failed to delete SKU', 'error');
    }
  };

  // ---------------- MODEL CRUD ----------------
  const saveModel = async () => {
    try {
      const payload = {
        model: modelForm.model,
        skuId: modelForm.skuId,
        isActive: modelForm.isActive
      };
      console.log(payload)
      if (modelEditing) {
        await api.put(`${MODEL_API}/${modelEditing.id}`, payload);
        showSnackbar('Model updated', 'success');
      } else {
        await api.post(MODEL_API, payload);
        showSnackbar('Model created', 'success');
      }
      setModelDialog(false);
      setModelForm({ model: '', skuId: 0, isActive: true });
      setModelEditing(null);
      fetchModels();
    } catch {
      showSnackbar('Failed to save Model', 'error');
    }
  };

  const deleteModel = async (id: number) => {
    if (!window.confirm('Delete this Model?')) return;
    try {
      await api.delete(`${MODEL_API}/${id}`);
      showSnackbar('Model deleted', 'success');
      fetchModels();
    } catch {
      showSnackbar('Failed to delete Model', 'error');
    }
  };

  // ---------------- TABLES ----------------
  const skuColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'sku', headerName: 'SKU', flex: 1 },
    { field: 'isActive', headerName: 'Active', width: 120, valueFormatter: (p: any) => (p.value === 1 ? 'Yes' : 'No') },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => (
        <>
          <Button size="small" onClick={() => {
            setSkuEditing(params.row);
            setSkuForm({ sku: params.row.sku || '', isActive: params.row.isActive === 1 });
            setSkuDialog(true);
          }}>Edit</Button>
          <Button size="small" color="error" onClick={() => deleteSku(params.row.id)}>Delete</Button>
        </>
      )
    }
  ];

  const modelColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'model', headerName: 'Model', flex: 1 },
    {
      field: 'sku',
      headerName: 'SKU',
      flex: 1,
      valueGetter: (params: any) => params.sku || '-', // 👈 display related sku.sku
    },
    { field: 'isActive', headerName: 'Active', width: 120, valueFormatter: (p: any) => (p.value === 1 ? 'Yes' : 'No') },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => (
        <>

          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                setModelEditing(params.row);
                setModelForm({
                  model: params.row.model,
                  skuId: params.row.skuId,
                  isActive: params.row.isActive === 1
                });
                setModelDialog(true);
              }}
            >
              <Edit fontSize="small" sx={{ color: 'blue' }}/>
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => deleteModel(params.row.id)}
            >
              <Delete fontSize="small" sx={{ color: 'red' }} />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ];

  return (
    <Box p={2}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="SKU Master" />
        <Tab label="SKU Models" />
      </Tabs>

      {/* SKU Master Tab */}
      {tab === 0 && (
        <Box mt={2}>
          <Box mb={2} display="flex" justifyContent="space-between">
            <h2>SKU Master</h2>
            <Button variant="contained" onClick={() => setSkuDialog(true)}>Add SKU</Button>
          </Box>
          <DataGrid rows={skuRows} columns={skuColumns} autoHeight loading={loading} disableRowSelectionOnClick />
        </Box>
      )}

      {/* SKU Models Tab */}
      {tab === 1 && (
        <Box mt={2}>
          <Box mb={2} display="flex" justifyContent="space-between">
            <h2>SKU Models</h2>
            <Button variant="contained" onClick={() => setModelDialog(true)}>Add Model</Button>
          </Box>
          <DataGrid rows={modelRows} columns={modelColumns} autoHeight loading={loading} disableRowSelectionOnClick />
        </Box>
      )}

      {/* SKU Dialog */}
      <Dialog open={skuDialog} onClose={() => setSkuDialog(false)}>
        <DialogTitle>{skuEditing ? 'Edit SKU' : 'Add SKU'}</DialogTitle>
        <DialogContent>
          <TextField label="SKU" fullWidth margin="dense" value={skuForm.sku}
            onChange={(e) => setSkuForm({ ...skuForm, sku: e.target.value })} />
          <FormControlLabel control={<Checkbox checked={skuForm.isActive} onChange={(e) => setSkuForm({ ...skuForm, isActive: e.target.checked })} />} label="Active" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSkuDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveSku}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Model Dialog */}
      <Dialog open={modelDialog} onClose={() => setModelDialog(false)}>
        <DialogTitle>{modelEditing ? 'Edit Model' : 'Add Model'}</DialogTitle>
        <DialogContent>
          <TextField label="Model" fullWidth margin="dense" value={modelForm.model}
            onChange={(e) => setModelForm({ ...modelForm, model: e.target.value })} />
          <FormControl fullWidth margin="dense">
            <InputLabel>SKU</InputLabel>
            <Select value={modelForm.skuId} onChange={(e) => setModelForm({ ...modelForm, skuId: Number(e.target.value) })}>
              {skuRows.map((sku) => (
                <MenuItem key={sku.id} value={sku.id}>{sku.sku}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel control={<Checkbox checked={modelForm.isActive} onChange={(e) => setModelForm({ ...modelForm, isActive: e.target.checked })} />} label="Active" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModelDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveModel}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SkuMasterPage;
