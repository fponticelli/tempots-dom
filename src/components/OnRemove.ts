import { type Clear } from '../types/clean'
import { type Renderable } from '../types/renderable'

export class OnRemoveImpl implements Renderable {
  constructor (private readonly clear: Clear) { }

  readonly appendTo = (): Clear => {
    return (removeTree: boolean) => {
      this.clear(removeTree)
    }
  }
}

export interface OnRemoveProps {
  clear: Clear
}

export function OnRemove (props: OnRemoveProps): OnRemoveImpl {
  return new OnRemoveImpl(props.clear)
}
