
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";
import { getSubCategories } from "../../api/subCategoryApi"; // Ensure this function works correctly
import DataTable from "../../components/DataTable";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ImSpinner } from "react-icons/im";

const Products = () => {
  const { token } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]); // State to store subcategories
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    subCategory: "",
    category: "",
    image: "",
    status: true,
  });

  // Fetch products
  useEffect(() => {
    if (token) {
      fetchProducts();
    } else {
      setError("Authentication failed. Please log in again.");
    }
  }, [token]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts(token);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories(token);
      setCategories(res.data); 
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories. Please try again.");
    }
  };

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) return; 
    try {
      const res = await getSubCategories(categoryId, token);
      if (Array.isArray(res.data)) {
        setSubCategories(res.data); 
      } else {
        setSubCategories([]); 
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setError("Failed to fetch subcategories. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      
      setFormData({ ...formData, category: value, subCategory: "" });
      fetchSubCategories(value); 
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Authentication failed. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      if (editingProduct) {
        const updatedProduct = await updateProduct(editingProduct._id, formData, token);
        setProducts(products.map(prod => prod._id === editingProduct._id ? updatedProduct : prod));
      } else {
        const newProduct = await addProduct(formData, token);
        setProducts([...products, newProduct]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    setEditingProduct(product);
    setFormData(product || { name: "", subCategory: "", category: "", image: "", status: true });
    if (product && product.category) {
      fetchSubCategories(product.category._id); 
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: "", subCategory: "", category: "", image: "", status: true });
    setSubCategories([]); 
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id, token);
        setProducts(prevProducts => prevProducts.filter(prod => prod._id !== id));
      } catch (error) {
        console.error("Failed to delete product:", error);
        setError("Failed to delete product. Please try again.");
      }
    }
  };

  const columns = [
    { Header: "ID", accessor: "_id" },
    { Header: "Product Name", accessor: "name" },
    { Header: "Sub Category", accessor: "subCategory.name" },
    { Header: "Category", accessor: "category.name" },
    {
      Header: "Image",
      accessor: "image",
      Cell: ({ value }) => (
        <img
          src={value}
          alt="product"
          className="w-20 h-20 object-cover rounded-md"
        />
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => (
        <span
          className={`px-3 py-1 rounded-full text-white text-sm ${value ? "bg-green-500" : "bg-red-500"}`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    { 
          Header: "Actions", 
          accessor: "actions", 
          Cell: ({ row }) => (
            <div className="flex gap-2">
              <button onClick={() => openModal(row.original)} className="text-blue-500 hover:text-blue-700">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(row.original._id)} className="text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
            </div>
          )
        },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Products</h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

      <button onClick={() => openModal()} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md mb-4">
        + Add Product
      </button>

     
{loading ? (
        <div className="flex justify-center items-center h-40">
          <ImSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : products.length > 0 ? (
        <DataTable columns={columns} data={products} />
      ) : (
        <p className="text-gray-500">No subcategories available.</p>
      )}


     
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{editingProduct ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block font-medium">Product Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block font-medium">Category:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block font-medium">Sub Category:</label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select SubCategory</option>
                  {subCategories.map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.name}
                    moong dal
                    </option>
                    
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Image URL:</label>
                <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full p-2 border rounded-md" />
                {formData.image && (
                  <div className="mt-2">
                    <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-md object-cover" onError={(e) => (e.target.src = "/default.jpg")} />
                  </div>
                )}
                </div>
              <div className="mb-3">
                <label className="block font-medium">Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  {editingProduct ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;