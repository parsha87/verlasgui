// src/routes/AppRouter.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../utils/PrivateRoute';
import MainLayout from '../layouts/MainLayout';

// Auth Pages
import Register from '../pages/auth/Register';
import Login from '../pages/auth/Login';

// Pages Inside Layout
import Dashboard from '../pages/Dashboard';
import CustomerMaster from '../pages/Master/Customer/CustomerList';
import VendorMaster from '../pages/Master/Vendor/VendorList';
import ElectricalDesignMaster from '../pages/Master/ElectricalDesign/ElectricalDesignList';
import MechanicalDataMaster from '../pages/Master/MechinicalData/MechanicalDataList';
import RoutineTestDataMaster from '../pages/Master/RoutineTestData/RoutineTestDataList';

import RoutineTesting from '../pages/Testing/RoutineTesting/RoutineTestResultList';
import TypeTesting from '../pages/Testing/TypeTesting';

import GenerateInvoice from '../pages/Reports/GenerateInvoice';
import GeneratePO from '../pages/Reports/GeneratePO';
import GenerateRoutineTestCertificate from '../pages/Reports/RoutineTestCertificate';
import GenerateTypeTestCertificate from '../pages/Reports/TypeTestCertificate';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes within MainLayout */}
                <Route element={<PrivateRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/customer" element={<CustomerMaster />} />
                        <Route path="/vendor" element={<VendorMaster />} />
                        <Route path="/electrical-design" element={<ElectricalDesignMaster />} />
                        <Route path="/mechanical-data" element={<MechanicalDataMaster />} />
                        <Route path="/routine-test-data" element={<RoutineTestDataMaster />} />
                        <Route path="/routine-testing" element={<RoutineTesting />} />
                        <Route path="/type-testing" element={<TypeTesting />} />
                        <Route path="/generate-invoice" element={<GenerateInvoice />} />
                        <Route path="/generate-po" element={<GeneratePO />} />
                        <Route path="/routine-test-certificate" element={<GenerateRoutineTestCertificate />} />
                        <Route path="/type-test-certificate" element={<GenerateTypeTestCertificate />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
