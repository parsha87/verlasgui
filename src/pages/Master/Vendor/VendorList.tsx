// src/pages/Vendor/VendorList.tsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../../contexts/AxiosContext';

interface Vendor {
    id: number;
    vendorCode: string;
    vendorName: string;
    vendorType: string;
    vendorCategory: string;
    contactName: string;
    contactNumber: string;
    emailId: string;
    lock: string;
}

export default function VendorList() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const res = await api.get('/vendors');
            setVendors(res.data);
        } catch (err) {
            enqueueSnackbar('Failed to fetch vendors', { variant: 'error' });
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/vendors/${deleteId}`);
            enqueueSnackbar('Vendor deleted', { variant: 'success' });
            setDeleteId(null);
            fetchVendors();
        } catch {
            enqueueSnackbar('Failed to delete vendor', { variant: 'error' });
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'vendorCode', headerName: 'Vendor Code', width: 150 },
        { field: 'vendorName', headerName: 'Vendor Name', width: 180 },
        { field: 'vendorType', headerName: 'Type', width: 120 },
        { field: 'vendorCategory', headerName: 'Category', width: 130 },
        { field: 'contactName', headerName: 'Contact Name', width: 150 },
        { field: 'contactNumber', headerName: 'Contact Number', width: 140 },
        { field: 'emailId', headerName: 'Email', width: 200 },
        { field: 'lock', headerName: 'Lock', width: 100 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 120,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<Edit />}
                    label="Edit"
                    onClick={() => navigate(`/vendor-form/${params.id}`)}
                />,
                <GridActionsCellItem
                    icon={<Delete />}
                    label="Delete"
                    onClick={() => setDeleteId(Number(params.id))}
                    showInMenu
                />,
            ],
        },
    ];

    return (
        <Box p={3}>
            <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Vendor List</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/vendor-form')}
                >
                    Add Vendor
                </Button>
            </Box>

            <DataGrid
                rows={vendors}
                columns={columns}
                autoHeight
                disableRowSelectionOnClick
                sx={{
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: '#fff',
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#e3f2fd',
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: '#f1f8ff',
                    },
                    '& .MuiDataGrid-cell': {
                        fontSize: '0.9rem',
                    },
                }}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                            page: 0,
                        },
                    },
                }}
            />


            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogTitle>Are you sure you want to delete this vendor?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
