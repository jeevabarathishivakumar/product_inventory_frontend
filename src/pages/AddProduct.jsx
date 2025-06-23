import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductForm from '../components/ProductForm'
import { productAPI } from '../services/api'
import toast from 'react-hot-toast'

const AddProduct = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (productData) => {
    try {
      setLoading(true)
      const response = await productAPI.createProduct(productData)
      
      toast.success('Product added successfully!')
      navigate('/')
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error(error.message || 'Failed to add product')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/" className="text-decoration-none">Products</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Add Product
              </li>
            </ol>
          </nav>
          <h1 className="h3 mb-3 text-gray-800">Add New Product</h1>
        </div>
      </div>

      <ProductForm 
        onSubmit={handleSubmit}
        loading={loading}
        isEdit={false}
      />
    </div>
  )
}

export default AddProduct