// Context that holds the latest analysis result, backed by sessionStorage.
import { createContext, useMemo } from 'react'
import PropTypes from 'prop-types'

import { SESSION_RESULT_KEY } from '../utils/constants'
import { useSessionStorage } from '../hooks/useSessionStorage'

// eslint-disable-next-line react-refresh/only-export-components
export const AnalysisContext = createContext(null)

export function AnalysisProvider({ children }) {
  const [result, setResult, clearResult] = useSessionStorage(
    SESSION_RESULT_KEY,
    null,
  )

  const value = useMemo(
    () => ({ result, setResult, clearResult }),
    [result, setResult, clearResult],
  )

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  )
}

AnalysisProvider.propTypes = {
  children: PropTypes.node,
}
