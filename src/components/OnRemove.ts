import { type Clear } from '../clean'
import { type Renderable } from '../renderable'

export class OnRemoveImpl implements Renderable {
  constructor(private readonly clear: Clear) { }

  readonly appendTo = (): Clear => {
    return (removeTree: boolean) => {
      this.clear(removeTree)
    }
  }
}

export interface OnRemoveProps {
  clear: Clear
}

export function OnRemove(props: OnRemoveProps): OnRemoveImpl {
  return new OnRemoveImpl(props.clear)
}
