import React from 'react'

const LoadingSpinner = ({ size = 'md', text = 'Loading...', center = true }) => {
  const spinnerSize = size === 'sm' ? 'spinner-border-sm' : ''
  const containerClass = center ? 'd-flex justify-content-center align-items-center' : ''

  return (
    <div className={containerClass} style={center ? { minHeight: '200px' } : {}}>
      <div className="text-center">
        <div className={`spinner-border text-primary ${spinnerSize}`} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        {text && <div className="mt-2 text-muted">{text}</div>}
      </div>
    </div>
  )
}

export default LoadingSpinner