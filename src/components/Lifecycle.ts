import { type Clear } from '../types/clean'
import { type IDOMContext } from '../types/idom-context'
import { type Renderable } from '../types/renderable'

export class LifecycleImpl implements Renderable {
  constructor (private readonly onMount: (el: HTMLElement) => void, private readonly onUnmount: (el: HTMLElement) => void) { }
  readonly appendTo = (ctx: IDOMContext): Clear => {
    this.onMount(ctx.getElement())

    return () => {
      this.onUnmount(ctx.getElement())
    }
  }
}

export interface LifecycleProps {
  onMount?: (el: HTMLElement) => void
  onUnmount?: (el: HTMLElement) => void
}

export function Lifecycle ({ onMount, onUnmount }: LifecycleProps): Renderable {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return new LifecycleImpl(onMount ?? (() => { }), onUnmount ?? (() => { }))
}
