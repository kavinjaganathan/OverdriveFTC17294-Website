import { Component } from 'react'

/** Keeps the page usable if WebGL / model loading fails. */
export default class ModelBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(e) { console.warn('3D model unavailable:', e) }
  render() {
    return this.state.failed ? <div className="model-fallback">3D preview unavailable</div> : this.props.children
  }
}
