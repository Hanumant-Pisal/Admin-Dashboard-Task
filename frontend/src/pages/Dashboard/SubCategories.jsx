import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSubCategories, addSubCategory, updateSubCategory, deleteSubCategory } from "../../api/subCategoryApi";
import { getCategories } from "../../api/categoryApi";
import DataTable from "../../components/DataTable";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ImSpinner } from "react-icons/im";

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", image: "", status: true, sequence: 0, category: "" });

  const { token } = useSelector((state) => state.auth);

  const fetchCategories = async () => {
    try {
      const res = await getCategories(token);
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories. Please try again.");
    }
  };

  const fetchSubCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getSubCategories(token);
      setSubCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setError("Failed to fetch subcategories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCategories();
      fetchSubCategories();
    } else {
      setError("Authentication failed. Please log in again.");
    }
  }, [token]);

  const validateImageUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("SubCategory name is required.");
      return false;
    }
    if (!formData.category) {
      setError("Please select a category.");
      return false;
    }
    if (formData.image && !validateImageUrl(formData.image)) {
      setError("Please enter a valid image URL.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "status" ? value === "true" : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editingSubCategory) {
        const updatedSubCategory = await updateSubCategory(editingSubCategory._id, formData, token);
        setSubCategories(prevState =>
          prevState.map(sub =>
            sub._id === editingSubCategory._id ? updatedSubCategory : sub
          )
        );
      } else {
        const newSubCategory = await addSubCategory(formData, token);
        setSubCategories(prevState =>
          prevState.some(sub => sub._id === newSubCategory._id)
            ? prevState
            : [...prevState, newSubCategory]
        );
      }
      closeModal();
    } catch (error) {
      console.error("Error saving subcategory:", error);
      setError("Failed to save subcategory. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = (subCategory = null) => {
    setEditingSubCategory(subCategory);
    setFormData(subCategory || { name: "", image: "", status: true, sequence: 0, category: "" });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSubCategory(null);
    setFormData({ name: "", image: "", status: true, sequence: 0, category: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        await deleteSubCategory(id, token);
        setSubCategories(prevSubCategories => prevSubCategories.filter(sub => sub._id !== id));
      } catch (error) {
        console.error("Failed to delete subcategory:", error);
        setError("Failed to delete subcategory. Please try again.");
      }
    }
  };

  const columns = [
    { Header: "ID", accessor: "_id" },
    { Header: "SubCategory Name", accessor: "name" },
    { Header: "Category", accessor: "category.name" },
    { Header: "Image", accessor: "image", Cell: ({ value }) => value ? <img src={value} alt="sub-category" className="w-12 h-12 rounded-md object-cover" onError={(e) => (e.target.src = "/default.jpg")} /> : "No Image" },
    { Header: "Status", accessor: "status", Cell: ({ value }) => (
        <span className={`px-3 py-1 rounded-full text-white text-sm ${value ? "bg-green-500" : "bg-red-500"}`} >
          {value ? "Active" : "Inactive"}
        </span>
      ) },
    { Header: "Sequence", accessor: "sequence" },
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
      <h2 className="text-3xl font-bold mb-6">Sub-Categories</h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

      <button onClick={() => openModal()} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md mb-4">
        + Add SubCategory
      </button>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <ImSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : subCategories.length > 0 ? (
        <DataTable columns={columns} data={subCategories} />
      ) : (
        <p className="text-gray-500">No subcategories available.</p>
      )}

      {modalOpen && (
        
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">

            <h2 className="text-xl font-bold mb-4">{editingSubCategory ? "Edit SubCategory" : "Add SubCategory"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-medium mb-1">SubCategory Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300" required />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Category:</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-md" required>
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
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
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Sequence:</label>
                <input type="number" name="sequence" value={formData.sequence} onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-green-300">
                  {submitting ? "Processing..." : editingSubCategory ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategories;