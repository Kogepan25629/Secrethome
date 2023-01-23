'use client'
import 'client-only'
import { useEffect, useMemo, useRef, useState } from 'react'
import { browserName, detectOS, Browser } from 'detect-browser'
import Hls from 'hls.js'
import css from './VideoPlayer.module.scss'
import VideoControl from './VideoControl'

type Props = {
  src: string
}

const VideoPlayer = (props: Props) => {
  //const isSupportBrowser = useMemo(() => Hls.isSupported(), [])
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    /*
    if (!isSupportBrowser) {
      return;
    }
    */
    setIsIOS(typeof window !== 'undefined' && browserName(window.navigator.userAgent) == 'ios')

    var hls = new Hls({ enableWorker: false })
    hls.attachMedia(videoRef.current!)
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.loadSource(props.src)
    })

    return () => {
      hls.removeAllListeners()
      hls.stopLoad()
    }
  }, [])

  return (
    <div className={css.video_container} ref={videoContainerRef}>
      <div className={css.video_wrapper}>
        {(() => {
          if (typeof window !== 'undefined' && browserName(window.navigator.userAgent) !== 'ios') {
            return (
              <>
                <video className={css.video} ref={videoRef}></video>
                <VideoControl videoRef={videoRef} videoContainerRef={videoContainerRef}></VideoControl>
              </>
            )
          } else {
            return <video className={css.video} src={props.src} poster={props.src.replace('m3u8', 'webp')} controls playsInline></video>
          }
        })()}
      </div>
    </div>
  )
  /*
  if (isIOS) {
    // ios
    return (
      <div className={css.video_container}  ref={videoContainerRef}>
        <div className={css.video_wrapper}>
          <video className={css.video} src={props.src} poster={props.src.replace("m3u8", "webp")} controls playsInline></video>
        </div>
      </div>
    )
  } else {
    // other
    return (
      <div className={css.video_container}  ref={videoContainerRef}>
        <div className={css.video_wrapper}>
        <video className={css.video} ref={videoRef}></video>
          {(() => {
            if (typeof window !== "undefined" && browserName(window.navigator.userAgent) !== "ios") {
              return (
                <>
                  <VideoControl videoRef={videoRef} videoContainerRef={videoContainerRef}></VideoControl>
                </>
              )
            }
          })()}
        </div>
      </div>
    )
  }
  */
}

export default VideoPlayer
