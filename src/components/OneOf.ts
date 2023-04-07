import { Prop, type Signal } from '../prop'
import { type Clear } from '../clean'
import { type DOMContext } from '../dom-context'
import { type Renderable } from '../renderable'
import { type JSX } from '../jsx'
import { makeRenderable } from '../jsx-runtime'

export type AnyKey = string | number | symbol
export class OneOfImpl<T extends [AnyKey, unknown]> implements Renderable {
  constructor(
    private readonly match: Signal<T>,
    private readonly cases: {
      [KK in T[0]]: (value: Signal<T[1]>) => JSX.DOMNode
    }) { }

  readonly appendTo = (ctx: DOMContext): Clear => {
    const pair: [T[0], T[1]] = this.match.get()
    let key = pair[0]
    const value = pair[1]
    let prop = new Prop(value)
    let stableCtx = ctx.makeReference()
    let newCtx = stableCtx.makeReference()
    let clear = makeRenderable(this.cases[key](prop)).appendTo(newCtx)
    const cancel = this.match.subscribe(([newKey, newValue]) => {
      if (newKey !== key) {
        newCtx.requestClear(true, () => {
          newCtx = stableCtx.makeReference()
          key = newKey
          prop.clean()
          prop = new Prop(newValue)
          clear(true)
          clear = makeRenderable(this.cases[key](prop)).appendTo(newCtx)
        })
      } else {
        prop.set(newValue)
      }
    })
    return (removeTree: boolean) => {
      newCtx.requestClear(removeTree, () => {
        cancel()
        prop.clean()
        stableCtx.requestClear(removeTree, () => { })
      })
    }
  }
}

export type OneOfProps<T extends [AnyKey, unknown]> = {
  match: Signal<T>
} & {
    [KK in T[0]]: (value: Signal<T[1]>) => JSX.DOMNode
  }

// <OneOf match={counter.map(v => v % 2 == 0 ? [1, "odd"] : [2, "even"])} 1={t => <b>{t}</b>} 2={t => <i>{t}</i>} /
export function OneOf<T extends [AnyKey, unknown]>(props: OneOfProps<T>): JSX.DOMNode {
  return new OneOfImpl(props.match, props)
}
