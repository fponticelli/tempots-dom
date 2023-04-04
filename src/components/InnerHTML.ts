import { type Signal } from '../prop'
import { type Clear } from '../types/clean'
import { type IDOMContext } from '../types/idom-context'
import { type Renderable } from '../types/renderable'

export class InnerHTMLImpl implements Renderable {
  constructor (private readonly html: Signal<string> | Signal<string | undefined>) { }

  readonly appendTo = (ctx: IDOMContext): Clear => {
    const el = ctx.getElement()
    const previous = el.innerHTML
    el.innerHTML = this.html.get() ?? ''
    const cancel = this.html.subscribe(value => {
      el.innerHTML = value ?? ''
    })
    return (removeTree: boolean) => {
      cancel()
      if (removeTree) {
        el.innerHTML = previous
      }
    }
  }
}

export interface InnerHTMLProps {
  html: Signal<string> | Signal<string | undefined>
}

export function InnerHTML ({ html }: InnerHTMLProps): InnerHTMLImpl {
  return new InnerHTMLImpl(html)
}
