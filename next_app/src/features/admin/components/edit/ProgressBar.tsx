'use client'
import { useMemo, useState } from 'react'
import css from './EditContentForm.module.scss'

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div>
      <p>{progress}%</p>
      <progress value={progress} max="100" />
    </div>
  )
}

export const useProgressBar = ({ enabled }: { enabled: boolean }) => {
  const [progress, setProgress] = useState(0)

  const onProgress = (progressEvent: any) => {
    console.log(Math.round((progressEvent.loaded / progressEvent.total) * 100))
    setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100))
  }

  const progressBar = useMemo(() => (enabled ? <ProgressBar progress={progress} /> : null), [enabled])

  return {
    ProgressBar: progressBar,
    onProgress: onProgress,
  }
}
