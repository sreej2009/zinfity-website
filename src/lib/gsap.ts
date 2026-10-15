import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP)

gsap.defaults({ ease: 'expo.out', duration: 1.1 })
ScrollTrigger.config({ ignoreMobileResize: true })

/** Media conditions shared by every animated component. */
export const MOTION = '(prefers-reduced-motion: no-preference)'
export const REDUCED = '(prefers-reduced-motion: reduce)'
export const DESKTOP = '(min-width: 1024px)'

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP }
