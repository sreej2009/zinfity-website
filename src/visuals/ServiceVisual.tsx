import { useId, type CSSProperties, type ReactNode, type SVGProps } from 'react'
import type { ServiceVisualKey } from '@/content/services'

/**
 * Original line-art compositions for each service. Strokes draw in on mount
 * (CSS, disabled under reduced motion). Remount via `key` to replay.
 */

const d = (i: number) => ({ '--d': i }) as CSSProperties

type ShapeProps = { i?: number; accent?: boolean; fill?: string } & Omit<SVGProps<SVGPathElement>, 'fill'>

function Line({ i = 0, accent, fill = 'none', ...rest }: ShapeProps & { d: string }) {
  return (
    <path
      pathLength={1}
      className="draw"
      style={d(i)}
      fill={fill}
      stroke={accent ? 'var(--acc)' : 'var(--ink-line)'}
      strokeWidth={accent ? 1.6 : 1}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      {...rest}
    />
  )
}

function Box({ x, y, w, h, r = 6, i = 0, accent }: { x: number; y: number; w: number; h: number; r?: number; i?: number; accent?: boolean }) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      pathLength={1}
      className="draw"
      style={d(i)}
      fill="none"
      stroke={accent ? 'var(--acc)' : 'var(--ink-line)'}
      strokeWidth={accent ? 1.6 : 1}
      vectorEffect="non-scaling-stroke"
    />
  )
}

function Fill({ x, y, w, h, r = 3, i = 0, o = 0.08, accent }: { x: number; y: number; w: number; h: number; r?: number; i?: number; o?: number; accent?: boolean }) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      className="fade-in"
      style={d(i)}
      fill={accent ? 'var(--acc-fill)' : '#ede9e3'}
      fillOpacity={accent ? 1 : o}
    />
  )
}

function Dot({ cx, cy, r = 3, i = 0, accent = true }: { cx: number; cy: number; r?: number; i?: number; accent?: boolean }) {
  return <circle cx={cx} cy={cy} r={r} className="fade-in" style={d(i)} fill={accent ? 'var(--acc-solid)' : '#ede9e3'} />
}

function Label({ x, y, children, i = 0, anchor = 'start' }: { x: number; y: number; children: ReactNode; i?: number; anchor?: 'start' | 'middle' | 'end' }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className="fade-in"
      style={{ ...d(i), fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.14em' }}
      fill="#a6a39d"
    >
      {children}
    </text>
  )
}

const compositions: Record<ServiceVisualKey, () => ReactNode> = {
  web: () => (
    <>
      <Box x={50} y={40} w={300} h={210} r={10} i={0} />
      <Line d="M50 66 H350" i={1} />
      <Dot cx={64} cy={53} r={2.5} i={2} accent={false} />
      <Dot cx={74} cy={53} r={2.5} i={2} accent={false} />
      <Dot cx={84} cy={53} r={2.5} i={2} />
      <Fill x={150} y={48} w={120} h={10} r={5} i={3} o={0.06} />
      <Fill x={70} y={86} w={150} h={12} i={4} o={0.22} />
      <Fill x={70} y={104} w={110} h={12} i={5} o={0.22} />
      <Fill x={70} y={126} w={130} h={5} i={6} o={0.1} />
      <Fill x={70} y={136} w={100} h={5} i={6} o={0.1} />
      <Box x={70} y={152} w={58} h={18} r={9} i={7} accent />
      <Box x={236} y={84} w={96} h={96} r={4} i={5} />
      <Line d="M236 180 L284 128 L332 180" i={8} accent />
      <Line d="M256 84 C280 120 300 110 332 140" i={9} />
      <Box x={70} y={192} w={80} h={42} r={4} i={9} />
      <Box x={160} y={192} w={80} h={42} r={4} i={10} />
      <Box x={250} y={192} w={82} h={42} r={4} i={11} />
      <Line d="M300 214 L316 226 L312 212 L326 210 Z" i={12} accent fill="var(--acc-fill)" />
    </>
  ),
  mobile: () => (
    <>
      <g transform="rotate(-8 150 150)">
        <Box x={95} y={40} w={110} h={220} r={18} i={0} />
        <Line d="M135 52 H165" i={1} />
        <Fill x={108} y={70} w={84} h={70} r={8} i={2} o={0.1} />
        <Fill x={108} y={150} w={60} h={7} i={3} o={0.22} />
        <Fill x={108} y={163} w={84} h={5} i={3} o={0.1} />
        <Fill x={108} y={190} w={84} h={24} r={12} i={4} accent />
      </g>
      <g transform="rotate(6 250 160)">
        <Box x={200} y={60} w={110} h={220} r={18} i={2} accent />
        <Line d="M240 72 H270" i={3} />
        {[0, 1, 2, 3].map((n) => (
          <g key={n}>
            <Box x={213} y={92 + n * 38} w={28} h={28} r={7} i={4 + n} />
            <Fill x={250} y={98 + n * 38} w={46} h={6} i={5 + n} o={0.22} />
            <Fill x={250} y={110 + n * 38} w={30} h={4} i={5 + n} o={0.1} />
          </g>
        ))}
      </g>
      <Line d="M60 240 C120 270 250 290 340 250" i={10} />
    </>
  ),
  software: () => (
    <>
      <Line d="M90 90 V190 M310 90 V190 M200 140 V240" i={0} />
      {[2, 1, 0].map((n) => {
        const cy = 90 + n * 50
        return (
          <Line
            key={n}
            d={`M200 ${cy - 50} L310 ${cy} L200 ${cy + 50} L90 ${cy} Z`}
            i={(2 - n) * 2 + 1}
            accent={n === 0}
            fill={n === 0 ? 'var(--acc-fill)' : 'rgb(8 9 12 / 0.85)'}
          />
        )
      })}
      <Line d="M160 72 L182 60 M218 60 L240 72" i={7} />
      <Label x={40} y={52} i={8}>
        API
      </Label>
      <Label x={360} y={52} i={8} anchor="end">
        {'{ }'}
      </Label>
      <Line d="M40 60 H90 V90" i={9} />
      <Line d="M360 60 H310 V90" i={9} />
      <Label x={200} y={272} i={10} anchor="middle">
        INTERFACE · SERVICES · DATA
      </Label>
    </>
  ),
  erp: () => {
    const nodes = [
      { x: 200, y: 50, l: 'SALES' },
      { x: 320, y: 120, l: 'FINANCE' },
      { x: 280, y: 245, l: 'INVENTORY' },
      { x: 120, y: 245, l: 'PEOPLE' },
      { x: 80, y: 120, l: 'CRM' },
    ]
    return (
      <>
        <circle cx={200} cy={150} r={70} pathLength={1} className="draw" fill="none" stroke="var(--ink-line)" strokeDasharray="1" vectorEffect="non-scaling-stroke" />
        {nodes.map((n, k) => (
          <g key={n.l}>
            <Line d={`M200 150 L${n.x} ${n.y}`} i={k + 1} accent={k % 2 === 0} />
            <Box x={n.x - 30} y={n.y - 13} w={60} h={26} r={13} i={k + 3} />
            <Label x={n.x} y={n.y + 3} i={k + 4} anchor="middle">
              {n.l}
            </Label>
          </g>
        ))}
        <Box x={170} y={120} w={60} h={60} r={14} i={0} accent />
        <Fill x={170} y={120} w={60} h={60} r={14} i={1} accent />
        <Label x={200} y={153} i={2} anchor="middle">
          CORE
        </Label>
      </>
    )
  },
  marketing: () => (
    <>
      {[110, 80, 50].map((r, k) => (
        <circle key={r} cx={140} cy={170} r={r} pathLength={1} className="draw" style={d(k)} fill="none" stroke="var(--ink-line)" vectorEffect="non-scaling-stroke" />
      ))}
      <Dot cx={140} cy={170} r={6} i={3} />
      <Line d="M140 170 C200 160 230 120 260 100 S320 60 350 50" i={4} accent />
      <Line d="M338 44 L352 50 L344 62" i={6} accent />
      {[
        [196, 152],
        [244, 112],
        [300, 72],
      ].map(([x, y], k) => (
        <g key={k}>
          <Dot cx={x} cy={y} r={3.5} i={6 + k} accent={false} />
          <Line d={`M${x} ${y} V250`} i={7 + k} />
        </g>
      ))}
      <Line d="M40 250 H360" i={10} />
      <Label x={196} y={266} i={11} anchor="middle">
        REACH
      </Label>
      <Label x={244} y={266} i={11} anchor="middle">
        ENGAGE
      </Label>
      <Label x={300} y={266} i={11} anchor="middle">
        CONVERT
      </Label>
    </>
  ),
  uiux: () => (
    <>
      <Box x={60} y={50} w={180} h={200} r={8} i={0} />
      <Line d="M60 90 H240 M120 50 V250" i={1} strokeDasharray="2 4" className="fade-in" pathLength={undefined} />
      <Fill x={76} y={64} w={30} h={12} r={6} i={2} o={0.22} />
      <Fill x={136} y={104} w={88} h={10} i={3} o={0.22} />
      <Fill x={136} y={120} w={60} h={6} i={3} o={0.1} />
      <Box x={136} y={140} w={88} h={50} r={6} i={4} />
      <Fill x={136} y={204} w={50} h={22} r={11} i={5} accent />
      <Line d="M190 230 C230 120 300 260 340 120" i={6} accent />
      {[
        [190, 230],
        [340, 120],
      ].map(([x, y], k) => (
        <rect key={k} x={x - 4} y={y - 4} width={8} height={8} className="fade-in" style={d(8)} fill="#08090c" stroke="var(--acc-solid)" />
      ))}
      <Line d="M190 230 L230 150 M340 120 L300 200" i={7} />
      <Dot cx={230} cy={150} r={3} i={9} accent={false} />
      <Dot cx={300} cy={200} r={3} i={9} accent={false} />
      <Box x={276} y={40} w={84} h={50} r={6} i={8} />
      {[0, 1, 2].map((n) => (
        <circle key={n} cx={294 + n * 24} cy={65} r={8} className="fade-in" style={d(9 + n)} fill={n === 0 ? 'var(--acc-solid)' : '#ede9e3'} fillOpacity={n === 0 ? 1 : 0.15 + n * 0.12} />
      ))}
    </>
  ),
  commerce: () => (
    <>
      <Box x={50} y={50} w={130} h={170} r={8} i={0} />
      <Fill x={62} y={62} w={106} h={96} r={4} i={1} o={0.08} />
      <Line d="M90 140 C100 100 130 100 140 140" i={2} accent />
      <Fill x={62} y={170} w={70} h={7} i={3} o={0.22} />
      <Fill x={62} y={184} w={40} h={6} i={3} accent />
      <Line d="M180 135 H230" i={4} strokeDasharray="3 4" />
      <Line d="M230 105 h14 l12 52 h52 l10 -36 h-68" i={5} accent />
      <Dot cx={266} cy={172} r={5} i={7} accent={false} />
      <Dot cx={300} cy={172} r={5} i={7} accent={false} />
      {['CART', 'PAY', 'SHIP'].map((l, k) => (
        <g key={l}>
          <Box x={60 + k * 105} y={242} w={80} h={24} r={12} i={8 + k} accent={k === 1} />
          <Label x={100 + k * 105} y={257} i={9 + k} anchor="middle">
            {l}
          </Label>
          {k < 2 && <Line d={`M${140 + k * 105} 254 H${165 + k * 105}`} i={9 + k} />}
        </g>
      ))}
    </>
  ),
  ai: () => {
    const layers = [
      [80, 110, 190],
      [170, 70, 150, 230],
      [260, 110, 190],
    ]
    const pts = layers.flatMap(([x, ...ys]) => ys.map((y) => ({ x, y })))
    const edges: string[] = []
    for (let a = 0; a < layers.length - 1; a++) {
      const [x1, ...y1] = layers[a]
      const [x2, ...y2] = layers[a + 1]
      y1.forEach((ya) => y2.forEach((yb) => edges.push(`M${x1} ${ya} L${x2} ${yb}`)))
    }
    return (
      <>
        {edges.map((e, k) => (
          <Line key={k} d={e} i={k % 6} />
        ))}
        <Line d="M80 110 L170 150 L260 190" i={4} accent />
        <Line d="M260 190 C300 190 310 150 340 150" i={8} accent />
        <Box x={326} y={132} w={40} h={36} r={8} i={9} accent />
        <Line d="M337 150 l5 5 l10 -11" i={11} accent />
        <Line d="M30 150 H62" i={1} />
        <Label x={30} y={138} i={2}>
          IN
        </Label>
        {pts.map((p, k) => (
          <circle key={k} cx={p.x} cy={p.y} r={7} className="fade-in" style={d(3 + k * 0.4)} fill="#0e1015" stroke={k === 0 || k === 4 || k === 8 ? 'var(--acc-solid)' : 'rgb(237 233 227 / 0.5)'} />
        ))}
      </>
    )
  },
}

export function ServiceVisual({ visual, className = '' }: { visual: ServiceVisualKey; className?: string }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      aria-hidden="true"
      focusable="false"
      style={
        {
          '--ink-line': 'rgb(237 233 227 / 0.42)',
          '--acc': `url(#acc-${uid})`,
          '--acc-fill': `url(#accf-${uid})`,
          '--acc-solid': '#d9b690',
        } as CSSProperties
      }
    >
      <defs>
        <linearGradient id={`acc-${uid}`} gradientUnits="userSpaceOnUse" x1="40" y1="30" x2="360" y2="270">
          <stop offset="0" stopColor="#f0d9bd" />
          <stop offset="0.55" stopColor="#c28b5c" />
          <stop offset="1" stopColor="#8f959e" />
        </linearGradient>
        <linearGradient id={`accf-${uid}`} gradientUnits="userSpaceOnUse" x1="40" y1="30" x2="360" y2="270">
          <stop offset="0" stopColor="#d9b690" stopOpacity="0.55" />
          <stop offset="1" stopColor="#8a5634" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      {compositions[visual]()}
    </svg>
  )
}
