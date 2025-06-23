import React from 'react'
import Button from './Button'

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false
}) => {
  if (!isOpen) return null

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="modal-backdrop fade show" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div 
        className="modal fade show d-block" 
        tabIndex="-1" 
        role="dialog"
        style={{ zIndex: 1055 }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={loading}
              ></button>
            </div>
            
            <div className="modal-body">
              <p className="mb-0">{message}</p>
            </div>
            
            <div className="modal-footer">
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                {cancelText}
              </Button>
              <Button
                variant={confirmVariant}
                onClick={onConfirm}
                loading={loading}
                disabled={loading}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmationModal