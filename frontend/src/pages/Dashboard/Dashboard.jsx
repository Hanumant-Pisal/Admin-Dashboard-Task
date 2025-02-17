import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaList, FaLayerGroup, FaBox } from "react-icons/fa";
import { getCategories } from "../../api/categoryApi";
import { getSubCategories } from "../../api/subCategoryApi";
import { getProducts } from "../../api/productApi";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ImSpinner } from "react-icons/im";

const Dashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    categories: 0,
    subcategories: 0,
    products: 0,
  });

  const [chartData, setChartData] = useState([]);

  
  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  const fetchStats = async () => {
    try {
      const [categoriesRes, subCategoriesRes, productsRes] = await Promise.all([
        getCategories(token),
        getSubCategories(token),
        getProducts(token),
      ]);

      setStats({
        categories: categoriesRes.data.length || 0,
        subcategories: subCategoriesRes.data.length || 0,
        products: productsRes.data.length || 0,
      });

    
      setChartData([
        { name: "Jan", categories: 4, subcategories: 10, products: 50 },
        { name: "Feb", categories: 6, subcategories: 15, products: 80 },
        { name: "Mar", categories: 8, subcategories: 20, products: 120 },
        { name: "Apr", categories: 10, subcategories: 25, products: 150 },
        { name: "May", categories: categoriesRes.data.length, subcategories: subCategoriesRes.data.length, products: productsRes.data.length },
      ]);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Welcome to Dashboard</h2>
        <p className="text-gray-600">Manage categories, subcategories, and products.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <ImSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
         
          <div className="p-6 rounded-lg shadow-md text-white flex items-center justify-between bg-blue-500">
            <div>
              <p className="text-2xl font-bold">{stats.categories}</p>
              <p className="text-sm">Total Categories</p>
            </div>
            <FaList className="text-3xl" />
          </div>

          <div className="p-6 rounded-lg shadow-md text-white flex items-center justify-between bg-green-500">
            <div>
              <p className="text-2xl font-bold">{stats.subcategories}</p>
              <p className="text-sm">Total Subcategories</p>
            </div>
            <FaLayerGroup className="text-3xl" />
          </div>

          <div className="p-6 rounded-lg shadow-md text-white flex items-center justify-between bg-purple-500">
            <div>
              <p className="text-2xl font-bold">{stats.products}</p>
              <p className="text-sm">Total Products</p>
            </div>
            <FaBox className="text-3xl" />
          </div>
        </div>
      )}

     
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Monthly Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="categories" fill="#3b82f6" />
            <Bar dataKey="subcategories" fill="#10b981" />
            <Bar dataKey="products" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
