import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './utils/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import CustomerMaster from './pages/Master/Customer/CustomerList';
import VendorMaster from './pages/Master/Vendor/VendorList';
import ElectricalDesignMaster from './pages/Master/ElectricalDesign/ElectricalDesignList';
import MechanicalDataMaster from './pages/Master/MechinicalData/MechanicalDataList';
import RoutineTestDataMaster from './pages/Master/RoutineTestData/RoutineTestDataList';
import RoutineTesting from './pages/Testing/RoutineTesting/RoutineTestResultList';
import TypeTesting from './pages/Testing/TypeTesting';
import GenerateInvoice from './pages/Reports/GenerateInvoice';
import GeneratePO from './pages/Reports/GeneratePO';
import GenerateRoutineTestCertificate from './pages/Reports/RoutineTestCertificate';
import GenerateTypeTestCertificate from './pages/Reports/TypeTestCertificate';
import Users from './pages/Users/UserGrid';
import UserGrid from './pages/Users/UserGrid';
import CustomerList from './pages/Master/Customer/CustomerList';
import CustomerForm from './pages/Master/Customer/CustomerForm';
import VendorForm from './pages/Master/Vendor/VendorForm';
import VendorList from './pages/Master/Vendor/VendorList';
import ElectricalDesignList from './pages/Master/ElectricalDesign/ElectricalDesignList';
import ElectricalDesignForm from './pages/Master/ElectricalDesign/ElectricalDesignForm';
import MechanicalDataForm from './pages/Master/MechinicalData/MechinicalDataForm';
import MechanicalDataList from './pages/Master/MechinicalData/MechanicalDataList';
import RoutineTestDataList from './pages/Master/RoutineTestData/RoutineTestDataList';
import RoutineTestDataForm from './pages/Master/RoutineTestData/RoutineTestDataForm';
import RoutineTestResultList from './pages/Testing/RoutineTesting/RoutineTestResultList';
import RoutineTestResultForm from './pages/Testing/RoutineTesting/RoutineTestResultForm';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* CUSTOMER */}
            <Route path="/customer" element={<CustomerList />} />
            <Route path="/customer/add" element={<CustomerForm />} />
            <Route path="/customer/edit/:id" element={<CustomerForm />} />
            {/* VENDOR */}
            <Route path="/vendor" element={<VendorList />} />
            <Route path="/vendor-form" element={<VendorForm />} />
            <Route path="/vendor-form/:id" element={<VendorForm />} />
            {/* ELECTRICAL DESIGN */}
            <Route path="/electrical-design" element={<ElectricalDesignList />} />
            <Route path="/electrical-design/form" element={<ElectricalDesignForm />} />
            <Route path="/electrical-design/form/:id" element={<ElectricalDesignForm />} />
            {/* MECHNICAL DATA */}
            <Route path="/mechanical-data" element={<MechanicalDataList />} />
            <Route path="/mechanical-data/new" element={<MechanicalDataForm />} />
            <Route path="/mechanical-data/:id" element={<MechanicalDataForm />} />
            {/* ROUTINE TEST DATA */}
            <Route path="/routine-test-data" element={<RoutineTestDataList />} />
            <Route path="/routine-test-data/new" element={<RoutineTestDataForm />} />
            <Route path="/routine-test-data/:id" element={<RoutineTestDataForm />} />

            <Route path="/routine-testing" element={<RoutineTestResultList />} />
            <Route path="/routine-testing/add" element={<RoutineTestResultForm />} />
            <Route path="/routine-testing/edit/:id" element={<RoutineTestResultForm />} />

            <Route path="/type-testing" element={<TypeTesting />} />
            <Route path="/generate-invoice" element={<GenerateInvoice />} />
            <Route path="/generate-po" element={<GeneratePO />} />
            <Route path="/routine-test-certificate" element={<GenerateRoutineTestCertificate />} />
            <Route path="/type-test-certificate" element={<GenerateTypeTestCertificate />} />
            {/* USERS */}
            <Route path="/users" element={<UserGrid />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
