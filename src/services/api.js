import axios from 'axios'

// Base URL for API - Change this to your backend URL
const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// API service functions
export const productAPI = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/products')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get single product by ID
  getProduct: async (id) => {
    try {
      const response = await api.get(`/products/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}

export default api