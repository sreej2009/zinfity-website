import type { LucideIcon } from 'lucide-react'
import { AppWindow, Braces, LayoutGrid, Megaphone, Network, PenTool, ShoppingBag, Smartphone, Sparkles } from 'lucide-react'

export const serviceIcons: Record<string, LucideIcon> = {
  web: AppWindow,
  mobile: Smartphone,
  software: Braces,
  erp: Network,
  marketing: Megaphone,
  uiux: PenTool,
  commerce: ShoppingBag,
  ai: Sparkles,
  microsoft: LayoutGrid,
}
