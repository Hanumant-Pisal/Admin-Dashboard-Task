import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaList, FaLayerGroup, FaBox } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="h-screen bg-gradient-to-b from-fuchsia-800 to-fuchsia-900 text-white p-6 shadow-lg w-20 md:w-64 transition-all duration-300">
      
     
      <h1 className="hidden md:block font-extrabold text-2xl mb-8">Admin Panel</h1>

      <ul className="space-y-3">
        <li>
          <Link
            to="/dashboard"
            className={`flex items-center p-3 rounded-lg transition duration-300 justify-center md:justify-start ${
              location.pathname === "/dashboard" ? "bg-fuchsia-700 shadow-md" : "hover:bg-fuchsia-700 hover:shadow-md"
            }`}
          >
            <FaTachometerAlt className="text-xl" />
            <span className="hidden md:inline ml-3">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            to="/categories"
            className={`flex items-center p-3 rounded-lg transition duration-300 justify-center md:justify-start ${
              location.pathname === "/categories" ? "bg-fuchsia-700 shadow-md" : "hover:bg-fuchsia-700 hover:shadow-md"
            }`}
          >
            <FaList className="text-xl" />
            <span className="hidden md:inline ml-3">Categories</span>
          </Link>
        </li>
        <li>
          <Link
            to="/subcategories"
            className={`flex items-center p-3 rounded-lg transition duration-300 justify-center md:justify-start ${
              location.pathname === "/subcategories" ? "bg-fuchsia-700 shadow-md" : "hover:bg-fuchsia-700 hover:shadow-md"
            }`}
          >
            <FaLayerGroup className="text-xl" />
            <span className="hidden md:inline ml-3">Sub-Categories</span>
          </Link>
        </li>
        <li>
          <Link
            to="/products"
            className={`flex items-center p-3 rounded-lg transition duration-300 justify-center md:justify-start ${
              location.pathname === "/products" ? "bg-fuchsia-700 shadow-md" : "hover:bg-fuchsia-700 hover:shadow-md"
            }`}
          >
            <FaBox className="text-xl" />
            <span className="hidden md:inline ml-3">Products</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
