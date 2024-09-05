import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = ({ className, size }: { className?: string, size?: number }) => {
  return (
    <Loader2 className={`animate-spin duration-300 ${className}`} size={size} />
  )
}

export default Loading