import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormInput from './FormInputs'
import FormSelect from './FormSelect'
import Button from './Button'
import Alert from './Alert'

const ProductForm = ({ 
  initialData = {}, 
  onSubmit, 
  isEdit = false, 
  loading = false 
}) => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    price: initialData.price || '',
    category: initialData.category || '',
    stock: initialData.stock || ''
  })
  
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  // Category options
  const categoryOptions = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Toys',
    'Food & Beverages',
    'Health & Beauty',
    'Automotive',
    'Other'
  ]

  // Validation function
  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Product name must be at least 3 characters long'
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = 'Price is required'
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number'
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    // Stock validation
    if (formData.stock === '') {
      newErrors.stock = 'Stock quantity is required'
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number'
    }

    return newErrors
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    // Validate form
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Prepare data for submission
    const submitData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock)
    }

    try {
      await onSubmit(submitData)
    } catch (error) {
      setSubmitError(error.message || 'An error occurred while saving the product')
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h4 className="card-title mb-0">
              {isEdit ? '✏️ Edit Product' : '➕ Add New Product'}
            </h4>
          </div>
          
          <div className="card-body">
            {submitError && (
              <Alert 
                type="danger" 
                message={submitError}
                dismissible
                onClose={() => setSubmitError('')}
              />
            )}

            <form onSubmit={handleSubmit}>
              <FormInput
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter product name"
                required
              />

              <FormInput
                label="Price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />

              <FormSelect
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={categoryOptions}
                error={errors.category}
                placeholder="Select a category"
                required
              />

              <FormInput
                label="Stock Quantity"
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                error={errors.stock}
                placeholder="0"
                min="0"
                required
              />

              <div className="d-flex gap-2 justify-content-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={loading}
                >
                  {isEdit ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductForm