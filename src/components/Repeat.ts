import { type Signal } from '../prop'
import { type Clear } from '../clean'
import { type DOMContext } from '../dom-context'
import { type Renderable } from '../renderable'
import { Fragment } from './Fragment'

export class RepeatImpl implements Renderable {
  constructor(
    private readonly times: Signal<number>,
    private readonly children: (index: number) => Renderable
  ) { }

  readonly appendTo = (ctx: DOMContext): Clear => {
    const newCtx = ctx.makeReference()
    const count = this.times.get()
    const clears = new Array<Clear>(count)
    for (let i = 0; i < count; i++) {
      clears[i] = this.children(i).appendTo(newCtx)
    }
    const cancel = this.times.subscribe(
      (newCount) => {
        while (newCount < clears.length) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          clears.pop()!(true)
        }
        for (let i = clears.length; i < newCount; i++) {
          clears[i] = this.children(i).appendTo(newCtx)
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
}

export interface RepeatProps {
  times: Signal<number>
  children?: (index: number) => Renderable
}

export function Repeat(props: RepeatProps): Renderable { return new RepeatImpl(props.times, props.children ?? (() => Fragment({ children: [] }))) }
