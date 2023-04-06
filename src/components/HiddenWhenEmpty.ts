import { type Renderable } from '../renderable'
import { type DOMContext } from '../dom-context'
import { type Clear } from '../clean'

export class HiddenWhenEmptyImpl implements Renderable {
  appendTo (ctx: DOMContext): Clear {
    ctx.setStyle(':empty', 'display: none')
    return (removeTree) => {
      if (removeTree) ctx.setStyle(':empty', null)
    }
  }
}

export function HiddenWhenEmpty (): HiddenWhenEmptyImpl {
  return new HiddenWhenEmptyImpl()
}
