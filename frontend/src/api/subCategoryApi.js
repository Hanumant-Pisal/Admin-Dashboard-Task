import axios from "axios";

const API_URL = "http://localhost:5000/api/sub-category";


export const getSubCategories = async (token) => {
  if (!token) {
    throw new Error("No authentication token provided."); 
  }

  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }, 
  });
};


export const getSubCategoriesByCategory = async (categoryId, token) => {
  if (!token) {
    throw new Error("No authentication token provided.");
  }
  return axios.get(`${API_URL}?category=${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addSubCategory = async (data, token) => {
  return axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateSubCategory = async (id, data, token) => {
  return axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteSubCategory = async (id, token) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
