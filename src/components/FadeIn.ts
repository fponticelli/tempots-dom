import { Clear } from "../clean"
import { DOMContext } from "../dom-context"
import { Renderable } from "../renderable"
import { getComputedAnimatable, Animatable, applyInterpolatedAnimatable, applyAnimatable } from "./animatable"

export class FadeInImpl implements Renderable {
  constructor(
    private readonly end: Animatable,
    private readonly start: Animatable | undefined,
    private readonly duration: number,
    private readonly delay: number
  ) { }

  appendTo(ctx: DOMContext): Clear {
    const el = ctx.getElement()
    const start = (() => {
      if (this.start != null) {
        applyAnimatable(el, this.start)
        return this.start
      } else {
        return getComputedAnimatable(el, this.end)
      }
    })()
    const startTime = Date.now() + this.delay
    const { duration, end } = this
    let nextFrameId: null | number = null
    function frame() {
      const now = Date.now()
      if (now < startTime) {
        nextFrameId = requestAnimationFrame(frame)
        return
      }

      const progress = Math.min((now - startTime) / duration, 1)
      applyInterpolatedAnimatable(el, start, end, progress)
      if (progress < 1) {
        nextFrameId = requestAnimationFrame(frame)
      } else {
        nextFrameId = null
      }
    }
    frame()

    return (_: boolean) => {
      if (nextFrameId != null) cancelAnimationFrame(nextFrameId)
    }
  }
}

export interface FadeInProps extends Animatable {
  start?: Animatable,
  duration?: number,
  delay?: number
}

export function FadeIn(props: FadeInProps): Renderable {
  const { start, duration, delay, ...end } = props
  return new FadeInImpl(end, start, duration ?? 200, delay ?? 0)
}
