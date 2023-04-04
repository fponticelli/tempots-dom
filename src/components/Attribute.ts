import { type IDOMContext } from '../types/idom-context'
import { type Signal } from '../prop'
import { type Clear } from '../types/clean'
import { type Renderable } from '../types/renderable'
import { subscribeToSignal } from './Text'

export class AttributeImpl implements Renderable {
  constructor (private readonly name: string, private readonly value: Signal<string>) { }

  readonly appendTo = (ctx: IDOMContext): Clear => {
    const [set, clear] = ctx.createAttribute(this.name, this.value.get())
    return subscribeToSignal(this.value, set, clear)
  }
}

export interface AttributeProps {
  name: string
  value: Signal<string>
}

export function Attribute ({ name, value }: AttributeProps): Renderable {
  return new AttributeImpl(name, value)
}
