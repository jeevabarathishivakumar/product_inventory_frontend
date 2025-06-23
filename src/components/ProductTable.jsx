import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'

const ProductTable = ({ products, onDelete, deleteLoading, deletingId, startIndex = 0 }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStockBadge = (stock) => {
    if (stock === 0) return 'bg-danger'
    if (stock <= 10) return 'bg-warning'
    return 'bg-success'
  }

  const getStockText = (stock) => {
    if (stock === 0) return 'Out of Stock'
    if (stock <= 10) return 'Low Stock'
    return 'In Stock'
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Product Name</th>
            <th scope="col">Category</th>
            <th scope="col">Price</th>
            <th scope="col">Stock</th>
            <th scope="col">Status</th>
            <th scope="col">Created At</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-5">
                <div className="text-muted">
                  <div className="mb-3">
                    <i className="fas fa-search fa-3x text-gray-300">🔍</i>
                  </div>
                  <h5>No products found</h5>
                  <p>Try adjusting your search criteria or filters</p>
                  <div className="mt-3">
                    <Link to="/add" className="btn btn-primary">
                      ➕ Add New Product
                    </Link>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr key={product._id} className={product.stock === 0 ? 'table-warning' : ''}>
                <th scope="row" className="fw-bold text-muted">
                  {startIndex + index + 1}
                </th>
                <td>
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="fw-bold text-dark">{product.name}</div>
                      {product.description && (
                        <small className="text-muted">{product.description}</small>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge bg-info text-dark rounded-pill">
                    {product.category}
                  </span>
                </td>
                <td>
                  <span className="fw-bold text-success fs-6">
                    {formatCurrency(product.price)}
                  </span>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge ${getStockBadge(product.stock)} rounded-pill`}>
                      {product.stock}
                    </span>
                    <small className="text-muted">
                      {product.stock === 1 ? 'unit' : 'units'}
                    </small>
                  </div>
                </td>
                <td>
                  <span className={`badge ${getStockBadge(product.stock)} rounded-pill`}>
                    {getStockText(product.stock)}
                  </span>
                </td>
                <td className="text-muted small">
                  <div>{formatDate(product.createdAt)}</div>
                </td>
                <td>
                  <div className="btn-group" role="group" aria-label="Product actions">
                    <Link
                      to={`/edit/${product._id}`}
                      className="btn btn-outline-primary btn-sm"
                      title={`Edit ${product.name}`}
                    >
                      <i className="fas fa-edit me-1">✏️</i>
                      Edit
                    </Link>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDelete(product._id, product.name)}
                      loading={deleteLoading && deletingId === product._id}
                      disabled={deleteLoading}
                      title={`Delete ${product.name}`}
                    >
                      <i className="fas fa-trash me-1">🗑️</i>
                      {deleteLoading && deletingId === product._id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {/* Table Footer with Summary */}
      {products.length > 0 && (
        <div className="mt-2">
          <small className="text-muted">
            💡 Tip: Products with low stock (≤10 units) are highlighted. 
            Out of stock items have a warning background.
          </small>
        </div>
      )}
    </div>
  )
}

export default ProductTable