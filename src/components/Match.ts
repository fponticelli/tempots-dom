import { type Signal } from '../prop'
import { type DOMContext } from '../dom-context'
import { type AnyKey } from './OneOf'
import { type JSX, makeRenderable } from '../jsx-runtime'
import { type Clear } from '../clean'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class MatchImpl<T extends { [_ in K]: any }, K extends keyof T> {
  constructor (
    private readonly on: Signal<T>,
    private readonly using: K,
    private readonly matches: {
      [KIND in T[K]]: (
        _: Signal<T & { [KK in K]: KIND extends T[KK] ? KIND : never }>
      ) => JSX.DOMNode
    }
  ) { }

  readonly appendTo = (ctx: DOMContext): Clear => {
    let newCtx = ctx.makeReference()
    const value = this.on.get()
    let key = value[this.using]
    let derived = this.on.map(v => v)
    let renderable = makeRenderable(this.matches[key](derived))
    let clear = renderable.appendTo(newCtx)
    const cancel = this.on.subscribe(newValue => {
      const newKey = newValue[this.using]
      if (newKey === key) return
      newCtx.requestClear(true, () => {
        clear(true)
        derived.clean()
        key = newKey
        derived = this.on.map(v => v)
        newCtx = newCtx.makeReference()
        renderable = makeRenderable(this.matches[key](derived))
        clear = renderable.appendTo(newCtx)
      })
    })

    return (removeTree: boolean) => {
      newCtx.requestClear(removeTree, () => {
        cancel()
        derived.clean()
        clear(removeTree)
      })
    }
  }
}

export type MatchProps<T extends { [_ in K]: AnyKey }, K extends keyof T> = {
  on: Signal<T>
  using: K
} & {
  matches: {
    [KIND in T[K]]: (
      _: Signal<T & { [KK in K]: KIND extends T[KK] ? KIND : never }>
    ) => JSX.DOMNode
  }
}

export function Match<T extends { [_ in K]: AnyKey }, K extends keyof T> ({
  on,
  using,
  matches
}: MatchProps<T, K>): JSX.DOMNode {
  return new MatchImpl(on, using, matches)
}
