import { type JSX } from '../jsx'
import { type Signal } from '../prop'
import { OneOfImpl } from './OneOf'

export interface IfProps {
  is: Signal<boolean>
  then?: JSX.DOMNode
  otherwise?: JSX.DOMNode
}

export function If ({ is, then, otherwise }: IfProps): JSX.DOMNode {
  return new OneOfImpl(
    is.map(v => v ? { 1: true } : { 2: false }),
    {
      1: () => then,
      2: () => otherwise
    }
  )
}

export interface WhenProps {
  is: Signal<boolean>
  children?: JSX.DOMNode
}

export function When ({ is, children }: WhenProps): JSX.DOMNode {
  return new OneOfImpl(
    is.map(v => v ? { 1: true } : { 2: false }),
    {
      1: () => children,
      2: () => null
    }
  )
}

export function Unless ({ is, children }: WhenProps): JSX.DOMNode {
  return new OneOfImpl(
    is.map(v => v ? { 1: true } : { 2: false }),
    {
      1: () => null,
      2: () => children
    }
  )
}
