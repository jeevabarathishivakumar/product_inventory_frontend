import React from 'react'

const Alert = ({ 
  type = 'info', 
  message, 
  onClose,
  dismissible = false,
  className = ''
}) => {
  if (!message) return null

  return (
    <div className={`alert alert-${type} ${dismissible ? 'alert-dismissible' : ''} ${className}`} role="alert">
      {message}
      {dismissible && onClose && (
        <button 
          type="button" 
          className="btn-close" 
          onClick={onClose}
          aria-label="Close"
        ></button>
      )}
    </div>
  )
}

export default Alert