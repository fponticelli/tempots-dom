/** @jsxImportSource .. */
import { type Signal } from '../prop'
import { type Renderable } from '../renderable'
import { type JSX } from '../jsx'
import { type Clear } from '../clean'
import { type DOMContext } from '../dom-context'
import { If } from './If'
import { makeRenderable } from '../jsx-runtime'

export type Condition<T> =
  | Signal<T | null | undefined>
  | Signal<T | undefined>
  | Signal<T | null>
  | Signal<T>

export class ShowImpl<T> implements Renderable {
  constructor (private readonly on: Condition<T>, private readonly otherwise: JSX.DOMNode, private readonly children: (value: Signal<NonNullable<T>>) => JSX.DOMNode) { }

  readonly appendTo = (ctx: DOMContext): Clear => {
    const condition = this.on.map(v => v != null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const el = makeRenderable(<If is={condition} then={this.children(this.on as any)} otherwise={this.otherwise} />)
    return el.appendTo(ctx)
  }
}

export interface ShowProps<T> {
  when: Condition<T>
  otherwise?: JSX.DOMNode
  children?: (value: Signal<NonNullable<T>>) => JSX.DOMNode
}

export function Show<T> ({ when, children, otherwise }: ShowProps<T>): ShowImpl<T> {
  return new ShowImpl(when, otherwise, children ?? (() => <></>))
}
