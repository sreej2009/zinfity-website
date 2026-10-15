import { brandAssets } from '@/config/site'

type Variant = 'logoOnDark' | 'logoOnLight' | 'lockupOnDark' | 'lockupOnLight' | 'mark'

const dims: Record<Variant, [number, number]> = {
  logoOnDark: [436, 122],
  logoOnLight: [640, 181],
  lockupOnDark: [482, 138],
  lockupOnLight: [482, 136],
  mark: [284, 248],
}

type Props = {
  variant?: Variant
  className?: string
  alt?: string
  priority?: boolean
}

/** Renders the supplied Zinfity logo assets untouched (WebP with PNG fallback). */
export function Logo({ variant = 'logoOnLight', className, alt = 'Zinfity Technologies', priority }: Props) {
  const src = brandAssets[variant]
  const [w, h] = dims[variant]
  return (
    <picture>
      <source srcSet={`${src}.webp`} type="image/webp" />
      <img
        src={`${src}.png`}
        width={w}
        height={h}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        draggable={false}
      />
    </picture>
  )
}
