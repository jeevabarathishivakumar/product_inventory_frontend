import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProductForm from '../components/ProductForm'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'
import { productAPI } from '../services/api'
import toast from 'react-hot-toast'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await productAPI.getProduct(id)
      setProduct(data.product || data)
    } catch (error) {
      console.error('Error fetching product:', error)
      setError(error.message || 'Failed to fetch product details')
      toast.error('Failed to load product details')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (productData) => {
    try {
      setSubmitLoading(true)
      const response = await productAPI.updateProduct(id, productData)
      
      toast.success('Product updated successfully!')
      navigate('/')
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error(error.message || 'Failed to update product')
      throw error
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading product details..." />
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <Alert 
              type="danger" 
              message={error}
            />
            <div className="text-center mt-3">
              <button 
                className="btn btn-primary me-2"
                onClick={fetchProduct}
              >
                Try Again
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <Alert 
              type="warning" 
              message="Product not found"
            />
            <div className="text-center mt-3">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/')}
              >
                Go Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    )
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
                Edit Product
              </li>
            </ol>
          </nav>
          <h1 className="h3 mb-3 text-gray-800">
            Edit Product: <span className="text-primary">{product.name}</span>
          </h1>
        </div>
      </div>

      <ProductForm 
        initialData={product}
        onSubmit={handleSubmit}
        loading={submitLoading}
        isEdit={true}
      />
    </div>
  )
}

export default EditProduct
