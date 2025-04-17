'use client'

import React, { useEffect, useState } from 'react'

import { formatTimeAgo } from '../../utils/time.js'

type TimeAgoProps = {
  className?: string
  timestamp: number
}

/**
 * Component for displaying relative time (e.g., "5 min ago")
 * Automatically updates periodically
 */
export const TimeAgo: React.FC<TimeAgoProps> = ({ className = '', timestamp }) => {
  const [, setCounter] = useState(0)

  // Update the component periodically to keep the time display fresh
  useEffect(() => {
    const id = setTimeout(() => {
      setCounter(prev => prev + 1)
    }, 10000) // Update every 10 seconds

    return () => {
      clearTimeout(id)
    }
  }, [])

  return (
    <span className={className}>
      {formatTimeAgo(timestamp)}
    </span>
  )
}
