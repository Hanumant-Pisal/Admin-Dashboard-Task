import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";  
import Dashboard from "./pages/Dashboard/Dashboard";
import Categories from "./pages/Dashboard/Categories";
import SubCategories from "./pages/Dashboard/SubCategories";
import Products from "./pages/Dashboard/Products";
import Login from "./pages/Auth/Login";


function App() {
  return (
    <Routes>
     
      <Route exact path="/" element={<Login />} />
    

     
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout /> 
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/subcategories" element={<SubCategories />} />
        <Route path="/products" element={<Products />} />
      </Route>
    </Routes>
  );
}

export default App;
