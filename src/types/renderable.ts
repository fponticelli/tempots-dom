import { type IDOMContext } from './idom-context'
import { type Clear } from './clean'

export interface Renderable {
  appendTo: (ctx: IDOMContext) => Clear
}
