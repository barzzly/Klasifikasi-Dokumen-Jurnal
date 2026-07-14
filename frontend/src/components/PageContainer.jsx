import PropTypes from 'prop-types'

/** Centered responsive page wrapper. */
export default function PageContainer({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

PageContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}
