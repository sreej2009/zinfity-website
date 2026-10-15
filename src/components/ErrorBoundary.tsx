import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { fallback: ReactNode; children: ReactNode; resetKey?: unknown }
type State = { failed: boolean; key?: unknown }

/** Catches render/lazy-load failures so one broken part never blanks the page. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false, key: this.props.resetKey }

  static getDerivedStateFromError(): Partial<State> {
    return { failed: true }
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    // Reset when the key changes (e.g. navigating to another route).
    return props.resetKey !== state.key ? { failed: false, key: props.resetKey } : null
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('[Zinfity] Section failed to render; showing fallback.', error, info.componentStack)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
