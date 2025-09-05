// src/components/Sidebar.tsx
import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ExpandLess,
  ExpandMore,
  People as PeopleIcon,
  Store as StoreIcon,
  FlashOn as FlashOnIcon,
  Build as BuildIcon,
  Assessment as AssessmentIcon,
  Receipt as ReceiptIcon,
  NoteAdd as NoteAddIcon,
  Category as CategoryIcon,
  Engineering as EngineeringIcon,
  ElectricBolt as ElectricBoltIcon,
  DocumentScanner as DocumentScannerIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

const Sidebar = () => {
  const { user } = useAuth(); // 👈 Get current user

  const { open } = useSidebar();
  const location = useLocation();

  const [openMaster, setOpenMaster] = useState(true);
  const [openTesting, setOpenTesting] = useState(true);
  const [openReports, setOpenReports] = useState(true);

  const handleToggle = (section: string) => {
    if (section === 'master') setOpenMaster(!openMaster);
    if (section === 'testing') setOpenTesting(!openTesting);
    if (section === 'reports') setOpenReports(!openReports);
  };

  const getIconColor = (label: string) => {
    const map: { [key: string]: string } = {
      Dashboard: '#00796b',
      'Customer Master': '#0288d1',
      'Vendor Master': '#f57c00',
      'Electrical Design Master': '#c2185b',
      'Mechanical Data Master': '#7b1fa2',
      'Routine Test Data Master': '#388e3c',
      'Routine Testing': '#6a1b9a',
      'Type Testing': '#d32f2f',
      'Generate Invoice': '#1976d2',
      'Generate PO': '#0097a7',
      'Routine Test Certificate': '#5d4037',
      'Type Test Certificate': '#455a64',
    };
    return map[label] || '#9e9e9e';
  };

  const navItem = (label: string, path: string, icon: React.ReactNode) => (
    <Tooltip title={!open ? label : ''} placement="right" arrow key={label}>
      <ListItemButton
        component={Link}
        to={path}
        selected={location.pathname === path}
        sx={{
          pl: open ? 4 : 2,
          '&.Mui-selected': {
            backgroundColor: '#e3f2fd',
            fontWeight: 'bold',
          },
        }}
      >
        <ListItemIcon>
          {React.isValidElement(icon) &&
            React.cloneElement(icon as React.ReactElement<any, any>, {
              sx: {
                color: location.pathname === path ? '#1976d2' : getIconColor(label),
              },
            })}
        </ListItemIcon>
        {open && <ListItemText primary={label} />}
      </ListItemButton>
    </Tooltip>
  );

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 60,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 60,
          boxSizing: 'border-box',
          mt: 8,
          transition: 'width 0.3s',
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {navItem('Dashboard', '/dashboard', <DashboardIcon />)}

          {/* Master Data */}
          <ListItemButton onClick={() => handleToggle('master')}>
            <ListItemIcon>
              <CategoryIcon sx={{ color: '#5e35b1' }} />
            </ListItemIcon>
            {open && <ListItemText primary="Master Data" />}
            {open ? (openMaster ? <ExpandLess /> : <ExpandMore />) : null}
          </ListItemButton>
          <Collapse in={openMaster} timeout="auto" unmountOnExit>
            {[

              ['SKU Master', '/skumaster', <PeopleIcon />],
              ['Customer Master', '/customer', <PeopleIcon />],
              ['Vendor Master', '/vendor', <StoreIcon />],
              ['Electrical Design Master', '/electrical-design', <ElectricBoltIcon />],
              ['Mechanical Data Master', '/mechanical-data', <BuildIcon />],
              ['Routine Test Data Master', '/routine-test-data', <AssessmentIcon />],
            ].map(([label, path, icon]) => navItem(label as string, path as string, icon))}
          </Collapse>

          {/* Testing Module */}
          <ListItemButton onClick={() => handleToggle('testing')}>
            <ListItemIcon>
              <EngineeringIcon sx={{ color: '#c2185b' }} />
            </ListItemIcon>
            {open && <ListItemText primary="Testing Module" />}
            {open ? (openTesting ? <ExpandLess /> : <ExpandMore />) : null}
          </ListItemButton>
          <Collapse in={openTesting} timeout="auto" unmountOnExit>
            {[
              ['Routine Testing', '/routine-testing', <FlashOnIcon />],
              ['Type Testing', '/type-testing', <FlashOnIcon />],
            ].map(([label, path, icon]) => navItem(label as string, path as string, icon))}
          </Collapse>
          {user?.role === 'SuperAdmin' && navItem('User Management', '/users', <PersonIcon />)}

          {/* Reports */}
          <ListItemButton onClick={() => handleToggle('reports')}>
            <ListItemIcon>
              <ReceiptIcon sx={{ color: '#0288d1' }} />
            </ListItemIcon>
            {open && <ListItemText primary="Reports" />}
            {open ? (openReports ? <ExpandLess /> : <ExpandMore />) : null}
          </ListItemButton>
          <Collapse in={openReports} timeout="auto" unmountOnExit>
            {[
              ['Generate Invoice', '/generate-invoice', <NoteAddIcon />],
              ['Generate PO', '/generate-po', <NoteAddIcon />],
              ['Routine Test Certificate', '/routine-test-certificate', <DocumentScannerIcon />],
              ['Type Test Certificate', '/type-test-certificate', <DocumentScannerIcon />],
            ].map(([label, path, icon]) => navItem(label as string, path as string, icon))}
          </Collapse>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
