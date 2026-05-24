import type { CSSProperties } from 'react'
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

// Composition dimensions: 1200 x 700 (set by the Player).
// All coordinates below are in composition pixels.

type Pdf = {
  name: string
  sub: string
  color: string
}

type Field = {
  label: string
  value: string
  flag?: boolean
}

const pdfs: Pdf[] = [
  { name: 'ACORD 125', sub: 'Commercial application', color: '#d8dee8' },
  { name: 'Loss Runs', sub: 'Carrier export · 5 yrs', color: '#b9c1cf' },
  { name: 'Policy Dec', sub: 'Declarations page', color: '#a8b0bd' },
  { name: 'Schedule', sub: 'Locations · Vehicles', color: '#c8ced8' },
]

const fields: Field[] = [
  { label: 'Named insured', value: 'Pinecrest Logistics LLC' },
  { label: 'Renewal date', value: 'Mar 14, 2026' },
  { label: 'Locations', value: '7 sites · CA, OR, NV' },
  { label: 'Missing', value: 'Signed COI request', flag: true },
]

const PANEL_W = 320
const PANEL_H = 500
const PANEL_Y = 100
const PANEL_LEFT_X = 60
const PANEL_RIGHT_X = 820
const PANEL_HEADER_H = 64
const CARD_H = 88
const CARD_GAP = 14
const CARD_INSET = 20
const CARD_W = PANEL_W - CARD_INSET * 2

const FIELD_H = 80
const FIELD_GAP = 10

const PROCESSOR_X = 600
const PROCESSOR_Y = 350
const PROCESSOR_R = 96

const GHOST_DELAY_PER_CARD = 50
const GHOST_FLIGHT_FRAMES = 36
const FIELD_FADE_FRAMES = 18
const FIELD_DELAY_AFTER_LANDING = 4

const BG = '#0c1014'
const PANEL_BG = 'rgba(255, 255, 255, 0.04)'
const PANEL_BORDER = 'rgba(255, 255, 255, 0.10)'
const TEXT_PRIMARY = '#f3f5f7'
const TEXT_SECONDARY = '#8d96a3'
const ACCENT = '#d8dee8'

const fontStack =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

const cardOriginY = (i: number) =>
  PANEL_Y + PANEL_HEADER_H + i * (CARD_H + CARD_GAP)
const cardOriginCenter = (i: number) => ({
  cx: PANEL_LEFT_X + CARD_INSET + CARD_W / 2,
  cy: cardOriginY(i) + CARD_H / 2,
})

type DocGlyphProps = { color: string; size?: number; opacity?: number }
const DocGlyph = ({ color, size = 36, opacity = 1 }: DocGlyphProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    style={{ flexShrink: 0, opacity }}
  >
    <rect
      x="6"
      y="3"
      width="20"
      height="26"
      rx="2.5"
      fill="#f3f5f7"
      stroke={color}
      strokeWidth="1.2"
    />
    <rect x="10" y="9" width="12" height="1.6" rx="0.8" fill="#0c1014" opacity="0.55" />
    <rect x="10" y="13" width="9" height="1.6" rx="0.8" fill="#0c1014" opacity="0.35" />
    <rect x="10" y="17" width="11" height="1.6" rx="0.8" fill="#0c1014" opacity="0.35" />
    <rect x="10" y="21" width="7" height="1.6" rx="0.8" fill="#0c1014" opacity="0.35" />
    <rect x="6" y="3" width="3" height="26" rx="1.5" fill={color} />
  </svg>
)

type PdfCardProps = {
  pdf: Pdf
  width: number
  height: number
  scale?: number
}
const PdfCard = ({ pdf, width, height, scale = 1 }: PdfCardProps) => (
  <div
    style={{
      width,
      height,
      background: '#f5f6f4',
      border: '1px solid rgba(12, 16, 20, 0.08)',
      borderRadius: 8,
      padding: 16 * scale,
      display: 'flex',
      alignItems: 'center',
      gap: 14 * scale,
      boxShadow:
        '0 6px 18px rgba(0, 0, 0, 0.28), 0 1px 0 rgba(255, 255, 255, 0.04) inset',
      boxSizing: 'border-box',
    }}
  >
    <DocGlyph color={pdf.color} size={40 * scale} />
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div
        style={{
          color: '#0c1014',
          fontFamily: fontStack,
          fontSize: 17 * scale,
          fontWeight: 600,
          letterSpacing: -0.2,
          lineHeight: 1.15,
        }}
      >
        {pdf.name}
      </div>
      <div
        style={{
          color: '#5b6473',
          fontFamily: fontStack,
          fontSize: 12.5 * scale,
          marginTop: 4 * scale,
          letterSpacing: 0.1,
        }}
      >
        {pdf.sub}
      </div>
    </div>
  </div>
)

type PanelHeaderProps = { eyebrow: string; title: string; tone: 'teal' | 'coral' }
const PanelHeader = ({ eyebrow, title, tone }: PanelHeaderProps) => {
  const dotColor = tone === 'teal' ? ACCENT : '#a8b0bd'
  return (
    <div
      style={{
        padding: '18px 20px 14px',
        borderBottom: `1px solid ${PANEL_BORDER}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: fontStack,
          fontSize: 11,
          letterSpacing: 1.6,
          textTransform: 'uppercase',
          color: TEXT_SECONDARY,
          fontWeight: 600,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            background: dotColor,
            boxShadow: `0 0 12px ${dotColor}88`,
          }}
        />
        {eyebrow}
      </div>
      <div
        style={{
          fontFamily: fontStack,
          fontSize: 18,
          fontWeight: 600,
          color: TEXT_PRIMARY,
          letterSpacing: -0.2,
        }}
      >
        {title}
      </div>
    </div>
  )
}

export const HeroAnimation = () => {
  const frame = useCurrentFrame()
  const { width: compWidth, height: compHeight, durationInFrames } =
    useVideoConfig()

  // Subtle ambient bob for resting PDF cards.
  const bob = (i: number) =>
    Math.sin((frame + i * 18) / 22) * 1.6

  // For each card we compute a "ghost" copy that flies to the processor.
  type Ghost = {
    x: number
    y: number
    scale: number
    opacity: number
    visible: boolean
  }

  const ghosts: Ghost[] = pdfs.map((_, i) => {
    const start = i * GHOST_DELAY_PER_CARD
    const end = start + GHOST_FLIGHT_FRAMES
    const visible = frame >= start && frame <= end + 2
    const progress = interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.55, 0.05, 0.25, 1),
    })

    const origin = cardOriginCenter(i)
    const targetX = PROCESSOR_X
    const targetY = PROCESSOR_Y

    // Curve the flight with a control y that lifts the path slightly.
    const controlY = (origin.cy + targetY) / 2 - 40

    // Quadratic Bezier interpolation
    const t = progress
    const cx =
      (1 - t) * (1 - t) * origin.cx +
      2 * (1 - t) * t * ((origin.cx + targetX) / 2) +
      t * t * targetX
    const cy =
      (1 - t) * (1 - t) * origin.cy +
      2 * (1 - t) * t * controlY +
      t * t * targetY

    const scale = interpolate(progress, [0, 0.85, 1], [1, 0.62, 0.4], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
    const opacity = interpolate(progress, [0, 0.75, 1], [1, 0.85, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })

    return { x: cx, y: cy, scale, opacity, visible }
  })

  // Processor pulse — peaks every time a ghost lands.
  const processorPulse = pdfs.reduce((acc, _, i) => {
    const landing = i * GHOST_DELAY_PER_CARD + GHOST_FLIGHT_FRAMES
    const p = interpolate(
      frame,
      [landing - 4, landing, landing + 20],
      [0, 1, 0],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      },
    )
    return Math.max(acc, p)
  }, 0)

  // Continuous rotation for the dashed inner ring.
  const ringRotation = (frame * 1.6) % 360

  // Field appearance: each field fades + slides in after its ghost lands.
  const fieldEntry = (i: number) => {
    const appearAt =
      i * GHOST_DELAY_PER_CARD + GHOST_FLIGHT_FRAMES + FIELD_DELAY_AFTER_LANDING
    const progress = interpolate(
      frame,
      [appearAt, appearAt + FIELD_FADE_FRAMES],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      },
    )
    // Fade out near loop end so the loop is clean.
    const fadeOut = interpolate(
      frame,
      [durationInFrames - 24, durationInFrames - 4],
      [1, 0],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.in(Easing.cubic),
      },
    )
    return {
      opacity: progress * fadeOut,
      translate: (1 - progress) * 12,
    }
  }

  // Connection lines (left panel → processor → right panel).
  const lineDash = (frame * 1.2) % 12

  return (
    <AbsoluteFill style={{ background: BG, overflow: 'hidden' }}>
      {/* Vignette wash to keep edges quiet */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 80% at 50% 50%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.45) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Grid pattern */}
      <svg
        width={compWidth}
        height={compHeight}
        style={{ position: 'absolute', inset: 0, opacity: 0.35 }}
      >
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="rgba(255,255,255,0.045)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width={compWidth} height={compHeight} fill="url(#grid)" />
      </svg>

      {/* Connection lines */}
      <svg
        width={compWidth}
        height={compHeight}
        style={{ position: 'absolute', inset: 0 }}
      >
        <line
          x1={PANEL_LEFT_X + PANEL_W}
          y1={PROCESSOR_Y}
          x2={PROCESSOR_X - PROCESSOR_R}
          y2={PROCESSOR_Y}
          stroke="rgba(216, 222, 232, 0.32)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          strokeDashoffset={-lineDash}
        />
        <line
          x1={PROCESSOR_X + PROCESSOR_R}
          y1={PROCESSOR_Y}
          x2={PANEL_RIGHT_X}
          y2={PROCESSOR_Y}
          stroke="rgba(168, 176, 189, 0.32)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          strokeDashoffset={lineDash}
        />
      </svg>

      {/* LEFT PANEL — Inbound packet */}
      <div
        style={{
          position: 'absolute',
          left: PANEL_LEFT_X,
          top: PANEL_Y,
          width: PANEL_W,
          height: PANEL_H,
          background: PANEL_BG,
          border: `1px solid ${PANEL_BORDER}`,
          borderRadius: 8,
          backdropFilter: 'blur(4px)',
          boxSizing: 'border-box',
        }}
      >
        <PanelHeader
          eyebrow="Inbound packet"
          title="renewal_pinecrest_2026.pdf"
          tone="teal"
        />
        <div
          style={{
            padding: `0 ${CARD_INSET}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: CARD_GAP,
            marginTop: 16,
          }}
        >
          {pdfs.map((pdf, i) => (
            <div
              key={pdf.name}
              style={{ transform: `translateY(${bob(i)}px)` }}
            >
              <PdfCard pdf={pdf} width={CARD_W} height={CARD_H} />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL — Review queue */}
      <div
        style={{
          position: 'absolute',
          left: PANEL_RIGHT_X,
          top: PANEL_Y,
          width: PANEL_W,
          height: PANEL_H,
          background: PANEL_BG,
          border: `1px solid ${PANEL_BORDER}`,
          borderRadius: 8,
          backdropFilter: 'blur(4px)',
          boxSizing: 'border-box',
        }}
      >
        <PanelHeader
          eyebrow="Review queue"
          title="Extracted fields · awaiting approval"
          tone="coral"
        />
        <div
          style={{
            padding: `16px ${CARD_INSET}px 0`,
            display: 'flex',
            flexDirection: 'column',
            gap: FIELD_GAP,
          }}
        >
          {fields.map((field, i) => {
            const entry = fieldEntry(i)
            const isFlag = field.flag
            return (
              <div
                key={field.label}
                style={{
                  height: FIELD_H,
                  borderRadius: 8,
                  background: isFlag
                    ? 'rgba(216, 222, 232, 0.10)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${
                    isFlag ? 'rgba(216, 222, 232, 0.32)' : PANEL_BORDER
                  }`,
                  padding: '12px 14px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 4,
                  opacity: entry.opacity,
                  transform: `translateY(${entry.translate}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: fontStack,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 1.4,
                    textTransform: 'uppercase',
                    color: isFlag ? '#d8dee8' : TEXT_SECONDARY,
                  }}
                >
                  {field.label}
                </div>
                <div
                  style={{
                    fontFamily: fontStack,
                    fontSize: 16,
                    fontWeight: 500,
                    color: TEXT_PRIMARY,
                    letterSpacing: -0.1,
                  }}
                >
                  {field.value}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* PROCESSOR — center */}
      <svg
        width={PROCESSOR_R * 2 + 80}
        height={PROCESSOR_R * 2 + 80}
        viewBox={`0 0 ${PROCESSOR_R * 2 + 80} ${PROCESSOR_R * 2 + 80}`}
        style={{
          position: 'absolute',
          left: PROCESSOR_X - PROCESSOR_R - 40,
          top: PROCESSOR_Y - PROCESSOR_R - 40,
        }}
      >
        <circle
          cx={PROCESSOR_R + 40}
          cy={PROCESSOR_R + 40}
          r={PROCESSOR_R + 20 + processorPulse * 8}
          fill="none"
          stroke="rgba(216, 222, 232, 0.18)"
          strokeWidth="1"
        />
        <circle
          cx={PROCESSOR_R + 40}
          cy={PROCESSOR_R + 40}
          r={PROCESSOR_R}
          fill="#11161d"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
        <g
          transform={`rotate(${ringRotation} ${PROCESSOR_R + 40} ${
            PROCESSOR_R + 40
          })`}
        >
          <circle
            cx={PROCESSOR_R + 40}
            cy={PROCESSOR_R + 40}
            r={PROCESSOR_R - 14}
            fill="none"
            stroke="rgba(216, 222, 232, 0.50)"
            strokeWidth="1.4"
            strokeDasharray="2 8"
          />
        </g>
        {/* hexagon mark */}
        <g
          transform={`translate(${PROCESSOR_R + 40} ${PROCESSOR_R + 40})`}
          opacity={0.95}
        >
          <polygon
            points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15"
            fill="none"
            stroke="#d8dee8"
            strokeWidth="1.6"
          />
          <polygon
            points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8"
            fill="rgba(216,222,232,0.14)"
            stroke="#d8dee8"
            strokeWidth="1.2"
          />
          <circle r={3 + processorPulse * 4} fill="#d8dee8" />
        </g>
      </svg>

      {/* Processor label */}
      <div
        style={{
          position: 'absolute',
          left: PROCESSOR_X - 110,
          top: PROCESSOR_Y + PROCESSOR_R + 18,
          width: 220,
          textAlign: 'center',
          fontFamily: fontStack,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: TEXT_SECONDARY,
          }}
        >
          AgencyDesk AI
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            color: TEXT_PRIMARY,
            opacity: 0.85,
            fontFamily:
              'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
          }}
        >
          processing…
        </div>
      </div>

      {/* Section eyebrow at top */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          fontFamily: fontStack,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        <span>Intake</span>
        <span style={{ opacity: 0.4 }}>→</span>
        <span>AI review</span>
        <span style={{ opacity: 0.4 }}>→</span>
        <span>Human approval</span>
      </div>

      {/* GHOST CARDS — rendered last so they sit above panels */}
      {ghosts.map((g, i) => {
        if (!g.visible) return null
        const w = CARD_W * g.scale
        const h = CARD_H * g.scale
        const style: CSSProperties = {
          position: 'absolute',
          left: g.x - w / 2,
          top: g.y - h / 2,
          opacity: g.opacity,
          filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.45))',
        }
        return (
          <div key={`ghost-${i}`} style={style}>
            <PdfCard pdf={pdfs[i]} width={w} height={h} scale={g.scale} />
          </div>
        )
      })}
    </AbsoluteFill>
  )
}
