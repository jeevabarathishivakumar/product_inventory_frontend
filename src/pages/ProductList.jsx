import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { productAPI } from '../services/api'
import ProductTable from '../components/ProductTable'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'
import Button from '../components/Button'
import ConfirmationModal from '../components/ConfirmationModel'
import toast from 'react-hot-toast'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  
  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState({ id: null, name: '' })

  // Search and Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [stockFilter, setStockFilter] = useState('')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await productAPI.getAllProducts()
      setProducts(data.products || data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setError(error.message || 'Failed to fetch products')
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))]
    return uniqueCategories.filter(Boolean).sort()
  }, [products])

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === '' || product.category === categoryFilter
      
      const matchesStock = stockFilter === '' || 
                          (stockFilter === 'in-stock' && product.stock > 0) ||
                          (stockFilter === 'low-stock' && product.stock > 0 && product.stock <= 10) ||
                          (stockFilter === 'out-of-stock' && product.stock === 0)
      
      return matchesSearch && matchesCategory && matchesStock
    })
  }, [products, searchTerm, categoryFilter, stockFilter])

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter, stockFilter, itemsPerPage])

  const handleDeleteClick = (productId, productName) => {
    setProductToDelete({ id: productId, name: productName })
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true)
      setDeletingId(productToDelete.id)
      
      await productAPI.deleteProduct(productToDelete.id)
      
      // Remove the deleted product from the state
      setProducts(prevProducts => 
        prevProducts.filter(product => product._id !== productToDelete.id)
      )
      
      toast.success(`Product "${productToDelete.name}" deleted successfully!`)
      setShowDeleteModal(false)
      setProductToDelete({ id: null, name: '' })
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error(error.message || 'Failed to delete product')
    } finally {
      setDeleteLoading(false)
      setDeletingId(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setProductToDelete({ id: null, name: '' })
  }

  const handleRefresh = () => {
    fetchProducts()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('')
    setStockFilter('')
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    pages.push(
      <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
      </li>
    )

    // First page and ellipsis
    if (startPage > 1) {
      pages.push(
        <li key={1} className="page-item">
          <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
        </li>
      )
      if (startPage > 2) {
        pages.push(
          <li key="ellipsis1" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        )
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      )
    }

    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <li key="ellipsis2" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        )
      }
      pages.push(
        <li key={totalPages} className="page-item">
          <button className="page-link" onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </button>
        </li>
      )
    }

    // Next button
    pages.push(
      <li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </li>
    )

    return (
      <nav aria-label="Product pagination">
        <ul className="pagination justify-content-center mb-0">
          {pages}
        </ul>
      </nav>
    )
  }

  if (loading) {
    return <LoadingSpinner text="Loading products..." />
  }

  return (
    <div className="container-fluid">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-3 text-gray-800">Products Inventory</h1>
              <p className="text-muted">
                Manage your product inventory with ease
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                onClick={handleRefresh}
                disabled={loading}
              >
                🔄 Refresh
              </Button>
              <Link to="/add" className="btn btn-primary">
                ➕ Add New Product
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Products
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {products.length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-boxes fa-2x text-gray-300">📦</i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    In Stock
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {products.filter(p => p.stock > 0).length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-check-circle fa-2x text-gray-300">✅</i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Low Stock
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {products.filter(p => p.stock > 0 && p.stock <= 10).length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-exclamation-triangle fa-2x text-gray-300">⚠️</i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-danger shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                    Out of Stock
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {products.filter(p => p.stock === 0).length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-times-circle fa-2x text-gray-300">❌</i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="row mb-4">
          <div className="col">
            <Alert 
              type="danger" 
              message={error}
              dismissible
              onClose={() => setError('')}
            />
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="row mb-4">
        <div className="col">
          <div className="card shadow">
            <div className="card-body">
              <div className="row g-3">
                {/* Search Input */}
                <div className="col-md-4">
                  <label htmlFor="search" className="form-label fw-bold">
                    🔍 Search Products
                  </label>
                  <input
                    type="text"
                    id="search"
                    className="form-control"
                    placeholder="Search by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Category Filter */}
                <div className="col-md-3">
                  <label htmlFor="category" className="form-label fw-bold">
                    📂 Category
                  </label>
                  <select
                    id="category"
                    className="form-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock Filter */}
                <div className="col-md-3">
                  <label htmlFor="stock" className="form-label fw-bold">
                    📊 Stock Status
                  </label>
                  <select
                    id="stock"
                    className="form-select"
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                  >
                    <option value="">All Stock Levels</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock (≤10)</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="col-md-2 d-flex align-items-end">
                  <Button
                    variant="outline-secondary"
                    onClick={clearFilters}
                    className="w-100"
                  >
                    🗑️ Clear
                  </Button>
                </div>
              </div>

              {/* Filter Summary */}
              {(searchTerm || categoryFilter || stockFilter) && (
                <div className="mt-3 pt-3 border-top">
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <span className="text-muted fw-bold">Active filters:</span>
                    {searchTerm && (
                      <span className="badge bg-primary">
                        Search: "{searchTerm}"
                      </span>
                    )}
                    {categoryFilter && (
                      <span className="badge bg-info">
                        Category: {categoryFilter}
                      </span>
                    )}
                    {stockFilter && (
                      <span className="badge bg-warning text-dark">
                        Stock: {stockFilter.replace('-', ' ')}
                      </span>
                    )}
                    <span className="text-muted ms-2">
                      Showing {filteredProducts.length} of {products.length} products
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="row">
        <div className="col">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold text-primary">
                Products List ({filteredProducts.length} items)
              </h6>
              
              {/* Items per page selector */}
              <div className="d-flex align-items-center gap-2">
                <label className="text-muted small mb-0">Items per page:</label>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 'auto' }}
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            <div className="card-body">
              <ProductTable
                products={currentProducts}
                onDelete={handleDeleteClick}
                deleteLoading={deleteLoading}
                deletingId={deletingId}
                startIndex={startIndex}
              />
              
              {/* Pagination Info and Controls */}
              {filteredProducts.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                  <div className="text-muted small">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} entries
                  </div>
                  {renderPagination()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  )
}

export default ProductList