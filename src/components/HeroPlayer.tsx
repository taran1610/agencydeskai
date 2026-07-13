import { useEffect, useState } from 'react'
import { Player } from '@remotion/player'
import { HeroAnimation } from './HeroAnimation'

/**
 * Mounts Remotion only in the browser so the hero animation works reliably
 * on static hosts (Vercel/Netlify) after the JS bundle loads.
 */
export function HeroPlayer({ reduceMotion }: { reduceMotion: boolean }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="hero__animation-skeleton" aria-hidden />
  }

  return (
    <Player
      component={HeroAnimation}
      durationInFrames={240}
      fps={30}
      compositionWidth={1200}
      compositionHeight={700}
      loop={!reduceMotion}
      autoPlay={!reduceMotion}
      initialFrame={reduceMotion ? 120 : 0}
      controls={false}
      showVolumeControls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
