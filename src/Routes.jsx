import { Routes, Route } from "react-router-dom";
import Contact from './Contact';
import StockDetails from './StockDetails';
import Home from './Home';
import Welcome from "./Welcome";
import AdminDashboard from "./AdminDashboard";

const AppRoutes = () => {
    return (
        <Routes>
            {/* 1. Home is the PARENT route. It stays on screen and provides the <Outlet /> */}
            <Route path="/" element={<Home />}>
                
                {/* 2. These are CHILD routes. They load inside Home's <Outlet /> */}                
                <Route index element={<Welcome />} /> 
                {/* Updated path to accept a dynamic product slug */}
                <Route path="stockDetails/:slug" element={<StockDetails />} />
                <Route path="contact" element={<Contact />} />
                <Route path="adminDashboard" element={<AdminDashboard />} />
                
            </Route>
        </Routes>
    );
};

export default AppRoutes;