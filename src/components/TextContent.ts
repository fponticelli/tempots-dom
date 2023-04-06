import { type Signal } from '../prop'
import { type Clear } from '../clean'
import { type DOMContext } from '../dom-context'
import { type Renderable } from '../renderable'

export class TextContentImpl implements Renderable {
  constructor (private readonly html: Signal<string> | Signal<string | undefined>) { }

  readonly appendTo = (ctx: DOMContext): Clear => {
    const el = ctx.getElement()
    const previous = el.textContent
    el.textContent = this.html.get() ?? ''
    const cancel = this.html.subscribe(value => {
      el.textContent = value ?? ''
    })
    return (removeTree: boolean) => {
      cancel()
      if (removeTree) {
        el.textContent = previous
      }
    }
  }
}

export interface TextContentProps {
  html: Signal<string> | Signal<string | undefined>
}

export function TextContent ({ html }: TextContentProps): TextContentImpl {
  return new TextContentImpl(html)
}
