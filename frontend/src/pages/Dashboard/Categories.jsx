import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCategories, addCategory, updateCategory, deleteCategory } from "../../api/categoryApi";
import DataTable from "../../components/DataTable";
import Sidebar from "../../components/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa"; // For loading spinner
import { MdClose } from "react-icons/md"; // For close icon in modal
import { ImSpinner } from "react-icons/im";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", image: "", status: true, sequence: 0 });

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      fetchCategories();
    } else {
      setError("Authentication failed. Please log in again.");
    }
  }, [token]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories(token);
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "status" ? value === "true" : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Authentication failed. Please log in again.");
      return;
    }

    try {
      if (editingCategory) {
        const updatedCategory = await updateCategory(editingCategory._id, formData, token);
        setCategories(categories.map(cat => cat._id === editingCategory._id ? updatedCategory : cat));
      } else {
        const newCategory = await addCategory(formData, token);
        setCategories([...categories, newCategory]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving category:", error);
      setError("Failed to save category. Please try again.");
    }
  };

  const openModal = (category = null) => {
    setEditingCategory(category);
    setFormData(category || { name: "", image: "", status: true, sequence: 0 });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", image: "", status: true, sequence: 0 });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id, token);
        setCategories(prevCategories => prevCategories.filter(cat => cat._id !== id));
      } catch (error) {
        console.error("Failed to delete category:", error);
        setError("Failed to delete category. Please try again.");
      }
    }
  };

  const columns = [
    { Header: "ID", accessor: "_id" },
    { Header: "Category Name", accessor: "name" },
    { Header: "Image", accessor: "image", Cell: ({ value }) => value ? <img src={value} alt="category" className="w-12 h-12 rounded-md object-cover" /> : "No Image" },
    { Header: "Status", accessor: "status", Cell: ({ value }) => (
        <span className={`px-3 py-1 rounded-full text-white text-sm ${value ? "bg-green-500" : "bg-red-500"}`}>
          {value ? "Active" : "Inactive"}
        </span>
      ) },
    { Header: "Sequence", accessor: "sequence" },
    { 
          Header: "Actions", 
          accessor: "actions", 
          Cell: ({ row }) => (
            <div className="flex gap-2">
              <button onClick={() => openModal(row.original)} className="text-blue-500  hover:text-blue-700">
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
      <h2 className="text-3xl font-bold mb-6">Categories</h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

      <button onClick={() => openModal()} className="bg-blue-500  hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md mb-4 transition duration-200">
        + Add Category
      </button>

     
{loading ? (
        <div className="flex justify-center items-center h-40">
          <ImSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : categories.length > 0 ? (
        <DataTable columns={columns} data={categories} />
      ) : (
        <p className="text-gray-500">No subcategories available.</p>
      )}


      
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <MdClose className="text-2xl" />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingCategory ? "Edit Category" : "Add Category"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-medium mb-1">Category Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300" required />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Image URL:</label>
                <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full p-2 border rounded-md" />
                {formData.image && (
                  <div className="mt-2">
                    <img src={formData.image} alt="Preview" className="w-20 h-20 rounded-md object-cover" onError={(e) => (e.target.src = "/default.jpg")} />
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Status:</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-md">
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Sequence:</label>
                <input type="number" name="sequence" value={formData.sequence} onChange={handleChange} className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300" required />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200">Cancel</button>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200">{editingCategory ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;