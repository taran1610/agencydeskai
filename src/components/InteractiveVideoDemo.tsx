import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react'

interface InteractiveVideoDemoProps {
  onSwitchToSandbox?: () => void
}

const CHAPTERS = [
  {
    id: 'pile',
    time: 0,
    endTime: 6,
    num: '01',
    label: 'The Inbound Pile',
    desc: 'Intake eats your broker week',
    badge: '0:00',
  },
  {
    id: 'jobs',
    time: 6,
    endTime: 14,
    num: '02',
    label: '4 Core Jobs',
    desc: 'Read, summarize, audit & stage',
    badge: '0:06',
  },
  {
    id: 'audit',
    time: 14,
    endTime: 20,
    num: '03',
    label: 'Missing Work Audit',
    desc: 'Flags stale loss runs & gaps',
    badge: '0:14',
  },
  {
    id: 'ams',
    time: 20,
    endTime: 24,
    num: '04',
    label: 'Zero AMS Overwrites',
    desc: 'Human verification required',
    badge: '0:20',
  },
] as const

export function InteractiveVideoDemo({ onSwitchToSandbox }: InteractiveVideoDemoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(24)
  const [isMuted, setIsMuted] = useState(true)
  const [volume, setVolume] = useState(0.85)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  // Track active chapter as time updates
  useEffect(() => {
    const idx = CHAPTERS.findIndex(
      (c) => currentTime >= c.time && currentTime < c.endTime
    )
    if (idx !== -1) {
      setActiveChapterIndex(idx)
    } else if (currentTime >= 20) {
      setActiveChapterIndex(3)
    }
  }, [currentTime])

  // Handle time update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)
  }

  // Handle metadata loaded
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return
    if (videoRef.current.duration && !Number.isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration)
    }
  }

  // Play / Pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play().catch(() => {
        // autoplay may be restricted, muted fallback
        if (videoRef.current) {
          videoRef.current.muted = true
          setIsMuted(true)
          videoRef.current.play()
        }
      })
      setIsPlaying(true)
      setHasStarted(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  // Restart video
  const handleRestart = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = 0
    videoRef.current.play()
    setIsPlaying(true)
  }

  // Seek to specific chapter
  const handleJumpToChapter = (time: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = time
    setHasStarted(true)
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  // Scrubber click
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number.parseFloat(e.target.value)
    if (!videoRef.current) return
    videoRef.current.currentTime = val
    setCurrentTime(val)
  }

  // Mute toggle
  const toggleMute = () => {
    if (!videoRef.current) return
    const nextMuted = !videoRef.current.muted
    videoRef.current.muted = nextMuted
    setIsMuted(nextMuted)
    if (!nextMuted && videoRef.current.volume === 0) {
      videoRef.current.volume = 0.8
      setVolume(0.8)
    }
  }

  // Volume slider
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number.parseFloat(e.target.value)
    if (!videoRef.current) return
    videoRef.current.volume = val
    setVolume(val)
    if (val === 0) {
      videoRef.current.muted = true
      setIsMuted(true)
    } else if (isMuted) {
      videoRef.current.muted = false
      setIsMuted(false)
    }
  }

  // Playback speed cycle
  const cyclePlaybackSpeed = () => {
    if (!videoRef.current) return
    const speeds = [1, 1.25, 1.5]
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length
    const nextSpeed = speeds[nextIdx]
    videoRef.current.playbackRate = nextSpeed
    setPlaybackSpeed(nextSpeed)
  }

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="video-demo-card" ref={containerRef}>
      {/* Top Window Bar (Clean White Chrome) */}
      <div className="video-demo-card__topbar">
        <div className="video-demo-card__dots">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>

        <div className="video-demo-card__title-badge">
          <span className="video-demo-card__status-dot" />
          <span className="video-demo-card__filename">AgencyDesk AI · Product Tour (24s)</span>
          <span className="video-demo-card__tag">Interactive Walkthrough</span>
        </div>

        <div className="video-demo-card__meta">
          <span className="video-demo-card__res">1080p HD</span>
          <span className="video-demo-card__audio-pill">
            {isMuted ? 'Muted' : 'Audio Active'}
          </span>
        </div>
      </div>

      {/* Main Video Viewport Container */}
      <div className="video-demo-card__stage">
        <video
          ref={videoRef}
          className="video-demo-card__video"
          playsInline
          muted={isMuted}
          preload="metadata"
          poster="/agencydesk-demo-poster.jpg"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onClick={togglePlay}
          aria-label="AgencyDesk AI Product Walkthrough Video"
        >
          <source src="/agencydesk-demo.mp4" type="video/mp4" />
          <source src="/agencydesk-demo.mov" type="video/quicktime" />
          Your browser does not support the video tag.
        </video>

        {/* Big Central Glass Play Button (when paused) */}
        {!isPlaying && (
          <button
            type="button"
            className="video-demo-card__center-play"
            onClick={togglePlay}
            aria-label={hasStarted ? 'Resume video' : 'Play product demo video'}
          >
            <div className="video-demo-card__play-icon-wrap">
              <Play size={28} fill="currentColor" />
            </div>
            <div className="video-demo-card__play-text">
              <span className="video-demo-card__play-main">
                {hasStarted ? 'Resume Walkthrough' : 'Watch Product Demo'}
              </span>
              <span className="video-demo-card__play-sub">24-second fast overview</span>
            </div>
          </button>
        )}

        {/* Muted audio prompt badge */}
        {isMuted && isPlaying && (
          <button
            type="button"
            className="video-demo-card__unmute-banner"
            onClick={toggleMute}
            aria-label="Click to unmute sound"
          >
            <VolumeX size={15} />
            <span>Sound is muted · Click to listen</span>
          </button>
        )}

        {/* Sleek Floating Bottom Control Bar */}
        <div className="video-demo-card__controls">
          {/* Progress Timeline Scrubber with Chapter Markers */}
          <div className="video-demo-card__timeline-wrapper">
            <input
              type="range"
              min="0"
              max={duration || 24}
              step="0.1"
              value={currentTime}
              onChange={handleScrubberChange}
              className="video-demo-card__timeline-slider"
              aria-label="Video seek scrubber"
              style={{
                background: `linear-gradient(to right, #0284c7 0%, #0284c7 ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%, rgba(255,255,255,0.2) 100%)`,
              }}
            />
            {/* Chapter Notch Indicators */}
            <div className="video-demo-card__timeline-ticks">
              {CHAPTERS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`timeline-tick ${activeChapterIndex === CHAPTERS.indexOf(c) ? 'timeline-tick--active' : ''}`}
                  style={{ left: `${(c.time / (duration || 24)) * 100}%` }}
                  onClick={() => handleJumpToChapter(c.time)}
                  title={`Jump to ${c.label}`}
                />
              ))}
            </div>
          </div>

          <div className="video-demo-card__controls-row">
            {/* Left Controls: Play/Pause, Restart, Time */}
            <div className="video-demo-card__controls-left">
              <button
                type="button"
                className="video-ctrl-btn"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={17} fill="currentColor" />
                ) : (
                  <Play size={17} fill="currentColor" />
                )}
              </button>

              <button
                type="button"
                className="video-ctrl-btn"
                onClick={handleRestart}
                aria-label="Replay from start"
                title="Restart from beginning"
              >
                <RotateCcw size={15} />
              </button>

              <div className="video-demo-card__time-display">
                <span className="time-current">{formatTime(currentTime)}</span>
                <span className="time-sep">/</span>
                <span className="time-total">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls: Volume, Speed, Fullscreen */}
            <div className="video-demo-card__controls-right">
              <div className="video-volume-group">
                <button
                  type="button"
                  className="video-ctrl-btn"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="video-volume-slider"
                  aria-label="Volume level"
                />
              </div>

              <button
                type="button"
                className="video-ctrl-btn video-speed-btn"
                onClick={cyclePlaybackSpeed}
                aria-label={`Playback speed: ${playbackSpeed}x`}
              >
                {playbackSpeed}x
              </button>

              <button
                type="button"
                className="video-ctrl-btn"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Chapter Selector Bar */}
      <div className="video-demo-card__chapters">
        <div className="video-demo-card__chapters-header">
          <span className="chapters-title">INTERACTIVE SCENE JUMP</span>
          <span className="chapters-hint">Click any chapter to jump the video directly to that step</span>
        </div>

        <div className="video-demo-card__chapters-grid">
          {CHAPTERS.map((c, idx) => {
            const isActive = activeChapterIndex === idx
            return (
              <button
                key={c.id}
                type="button"
                className={`chapter-card ${isActive ? 'chapter-card--active' : ''}`}
                onClick={() => handleJumpToChapter(c.time)}
              >
                <div className="chapter-card__top">
                  <span className="chapter-card__num">{c.num}</span>
                  <span className="chapter-card__badge">{c.badge}</span>
                </div>
                <div className="chapter-card__title">{c.label}</div>
                <div className="chapter-card__desc">{c.desc}</div>
                {isActive && <div className="chapter-card__active-bar" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom Features & Action Strip */}
      <div className="video-demo-card__footer">
        <div className="video-demo-card__pillars">
          <div className="pillar-item">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>0 Automatic AMS Overwrites</span>
          </div>
          <div className="pillar-item">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>100% Source Page Citations</span>
          </div>
          <div className="pillar-item">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>Applied Epic &amp; AMS360 Ready</span>
          </div>
        </div>

        {onSwitchToSandbox && (
          <button
            type="button"
            className="video-demo-card__sandbox-cta"
            onClick={onSwitchToSandbox}
          >
            <Sparkles size={14} />
            <span>Try interactive dummy data sandbox</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
