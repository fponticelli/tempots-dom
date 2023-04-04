import { type Renderable } from '../types/renderable'
import { type IDOMContext } from '../types/idom-context'
import { type Clear } from '../types/clean'

export class HiddenWhenEmptyImpl implements Renderable {
  appendTo (ctx: IDOMContext): Clear {
    ctx.setStyle(':empty', 'display: none')
    return (removeTree) => {
      if (removeTree) ctx.setStyle(':empty', null)
    }
  }
}

export function HiddenWhenEmpty (): HiddenWhenEmptyImpl {
  return new HiddenWhenEmptyImpl()
}
