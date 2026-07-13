import { useEffect, useRef, useState } from 'react'
import { Player, type PlayerRef } from '@remotion/player'
import { HeroAnimation } from './HeroAnimation'

const PLAYBACK_CHECK_MS = 100
const PLAYBACK_TIMEOUT_MS = 2500

/**
 * Mounts Remotion only in the browser. Reports whether frames are advancing so
 * the CSS fallback can take over when autoplay fails on static hosts (Vercel).
 */
export function HeroPlayer({
  reduceMotion,
  onPlayingChange,
}: {
  reduceMotion: boolean
  onPlayingChange?: (playing: boolean) => void
}) {
  const [mounted, setMounted] = useState(false)
  const playerRef = useRef<PlayerRef>(null)
  const onPlayingChangeRef = useRef(onPlayingChange)

  useEffect(() => {
    onPlayingChangeRef.current = onPlayingChange
  }, [onPlayingChange])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (reduceMotion) {
      onPlayingChangeRef.current?.(true)
      return
    }

    onPlayingChangeRef.current?.(false)

    let interval: number | undefined

    const start = window.setTimeout(() => {
      const player = playerRef.current
      if (!player) {
        onPlayingChangeRef.current?.(false)
        return
      }

      const tryPlay = () => {
        try {
          player.play()
        } catch {
          // Autoplay may be blocked; CSS fallback will cover the hero.
        }
      }

      tryPlay()

      let lastFrame = player.getCurrentFrame()
      let stagnantTicks = 0
      const maxTicks = PLAYBACK_TIMEOUT_MS / PLAYBACK_CHECK_MS

      interval = window.setInterval(() => {
        const frame = player.getCurrentFrame()

        if (frame > lastFrame || player.isPlaying()) {
          onPlayingChangeRef.current?.(true)
          window.clearInterval(interval)
          return
        }

        stagnantTicks += 1
        if (stagnantTicks === 3 || stagnantTicks === 10) {
          tryPlay()
        }

        lastFrame = frame

        if (stagnantTicks >= maxTicks) {
          onPlayingChangeRef.current?.(false)
          window.clearInterval(interval)
        }
      }, PLAYBACK_CHECK_MS)
    }, 50)

    return () => {
      window.clearTimeout(start)
      if (interval !== undefined) {
        window.clearInterval(interval)
      }
    }
  }, [mounted, reduceMotion])

  if (!mounted) {
    return <div className="hero__animation-skeleton" aria-hidden />
  }

  return (
    <Player
      ref={playerRef}
      component={HeroAnimation}
      durationInFrames={240}
      fps={30}
      compositionWidth={1200}
      compositionHeight={700}
      loop={!reduceMotion}
      autoPlay={!reduceMotion}
      initiallyMuted
      initialFrame={reduceMotion ? 120 : 0}
      controls={false}
      showVolumeControls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
