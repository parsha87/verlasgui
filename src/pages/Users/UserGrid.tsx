// src/pages/UserManagement.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  DialogContentText,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import api from '../../contexts/AxiosContext';

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
}

const defaultForm: User = {
  id: 0,
  name: '',
  email: '',
  password: '',
  role: '',
};

export default function UserGrid() {
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<User>(defaultForm);
  const [isEdit, setIsEdit] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch {
      enqueueSnackbar('Failed to fetch users', { variant: 'error' });
    }
  };

  const handleAddClick = () => {
    setForm(defaultForm);
    setIsEdit(false);
    setOpenDialog(true);
  };

  const handleEditClick = (user: User) => {
    setForm({ ...user, password: '' });
    setIsEdit(true);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${selectedId}`);
      enqueueSnackbar('User deleted', { variant: 'success' });
      fetchUsers();
    } catch {
      enqueueSnackbar('Failed to delete user', { variant: 'error' });
    }
    setOpenConfirm(false);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || (!isEdit && !form.password) || !form.role) {
      enqueueSnackbar('Please fill all required fields', { variant: 'warning' });
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/users/${form.id}`, form);
        enqueueSnackbar('User updated successfully', { variant: 'success' });
      } else {
        await api.post('/users', form);
        enqueueSnackbar('User added successfully', { variant: 'success' });
      }
      setOpenDialog(false);
      fetchUsers();
    } catch {
      enqueueSnackbar('Operation failed', { variant: 'error' });
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 200 },
    { field: 'role', headerName: 'Role', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit sx={{ color: 'blue' }}/>}
          label="Edit"
          onClick={() => handleEditClick(params.row)}
        />,
        <GridActionsCellItem
          icon={<Delete sx={{ color: 'red' }}/>}
          label="Delete"
          onClick={() => {
            setSelectedId(Number(params.id));
            setOpenConfirm(true);
          }}
        />,
      ],
    },
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">User Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddClick}>
          Add User
        </Button>
      </Box>

      <Box sx={{ height: 480, backgroundColor: '#fff', borderRadius: 2 }}>
        <DataGrid
          rows={users}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10]}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#e3f2fd',
              fontWeight: 'bold',
            },
          }}
        />
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{isEdit ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {!isEdit && (
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              label="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <MenuItem value="SuperAdmin">SuperAdmin</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="User">User</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {isEdit ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
