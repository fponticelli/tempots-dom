import { Prop, Signal } from '../prop'
import { type Clear } from '../clean'
import { type DOMContext } from '../dom-context'
import { type Renderable } from '../renderable'
import { Fragment } from './Fragment'
import { JSX } from '../jsx'
import { makeRenderable } from '../jsx-runtime'

export interface SeparatorProps {
  first: boolean
  last: boolean
  index: number
}

export class RepeatImpl implements Renderable {
  constructor(
    private readonly times: Signal<number>,
    private readonly children: (index: number) => JSX.DOMNode,
    private readonly separator?: (sep: Signal<SeparatorProps>) => JSX.DOMNode
  ) { }

  readonly appendTo = (ctx: DOMContext): Clear => {
    if (!this.separator) {
      return this.appendToWithoutSeparator(ctx)
    } else {
      return this.appendToWithSeparator(ctx, this.separator)
    }
  }

  readonly appendToWithoutSeparator = (ctx: DOMContext): Clear => {
    const newCtx = ctx.makeReference()
    const count = this.times.get()
    const clears = new Array<Clear>(count)
    for (let i = 0; i < count; i++) {
      clears[i] = makeRenderable(this.children(i)).appendTo(newCtx)
    }
    const cancel = this.times.subscribe(
      (newCount) => {
        while (newCount < clears.length) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          clears.pop()!(true)
        }
        for (let i = clears.length; i < newCount; i++) {
          clears[i] = makeRenderable(this.children(i)).appendTo(newCtx)
        }
      }
    )

    return (removeTree: boolean) => {
      newCtx.requestClear(removeTree, () => {
        cancel()
        clears.forEach(clear => { clear(removeTree) })
      })
    }
  }

  readonly appendToWithSeparator = (ctx: DOMContext, separator: (sep: Signal<SeparatorProps>) => JSX.DOMNode): Clear => {
    const newCtx = ctx.makeReference()
    const count = this.times.get()
    const separatorProps = new Array<Prop<SeparatorProps>>(Math.max(0, count - 1))
    const separatorClears = new Array<Clear>(Math.max(0, count - 1))
    const clears = new Array<Clear>(count)
    for (let i = 0; i < count; i++) {
      clears[i] = makeRenderable(this.children(i)).appendTo(newCtx)
      if (i < count - 1) {
        separatorProps[i] = Prop.of({
          first: i === 0,
          last: i === count - 2,
          index: i
        })
        separatorClears[i] = makeRenderable(separator(separatorProps[i])).appendTo(newCtx)
      }
    }
    const cancel = this.times.subscribe(
      (newCount) => {
        while (newCount < clears.length) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          clears.pop()!(true)
          if (separatorClears.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            separatorClears.pop()!(true)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            separatorProps.pop()!.clean()
          }
        }
        for (let i = 0; i < separatorProps.length; i++) {
          separatorProps[i].set({
            first: i === 0,
            last: i === newCount - 2,
            index: i
          })
        }
        for (let i = clears.length; i < newCount; i++) {
          clears[i] = makeRenderable(this.children(i)).appendTo(newCtx)
          if (i < newCount - 1) {
            separatorProps[i] = Prop.of({
              first: i === 0,
              last: i === newCount - 2,
              index: i
            })
            separatorClears[i] = makeRenderable(separator(separatorProps[i])).appendTo(newCtx)
          }
        }
      }
    )
    return (removeTree: boolean) => {
      newCtx.requestClear(removeTree, () => {
        cancel()
        clears.forEach(clear => { clear(removeTree) })
        separatorClears.forEach(clear => { clear(removeTree) })
        separatorProps.forEach(signal => { signal.clean() })
      })
    }
  }
}

export interface RepeatProps {
  times: Signal<number>
  children?: (index: number) => JSX.DOMNode
  separator?: (sep: Signal<SeparatorProps>) => JSX.DOMNode
}

export function Repeat(props: RepeatProps): Renderable {
  return new RepeatImpl(
    props.times,
    props.children ?? (() => Fragment({ children: [] })),
    props.separator
  )
}

export function conjuctions(other: JSX.DOMNode, lastConjunction?: JSX.DOMNode, firstConjunction?: JSX.DOMNode): (sep: Signal<SeparatorProps>) => JSX.DOMNode {
  return (sep: Signal<SeparatorProps>) => {
    return sep.map(({ first, last }) => {
      if (last) {
        return lastConjunction ?? other
      } else if (first) {
        return firstConjunction ?? other
      } else {
        return other
      }
    })
  }
}
