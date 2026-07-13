// Hook to access the analysis context.
import { useContext } from 'react'

import { AnalysisContext } from '../context/AnalysisContext'

export function useAnalysis() {
  const ctx = useContext(AnalysisContext)
  if (!ctx) {
    throw new Error('useAnalysis harus digunakan di dalam AnalysisProvider.')
  }
  return ctx
}
