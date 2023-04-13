import { type Signal } from '../prop'
import { RepeatImpl, SeparatorProps } from './Repeat'
import { type JSX, makeRenderable } from '../jsx-runtime'
import { FragmentImpl } from './Fragment'
import { OnRemove } from './OnRemove'

export interface ForProps<T> {
  of: Signal<T[]>
  separator?: (value: Signal<SeparatorProps>) => JSX.DOMNode
  children?: (value: Signal<T>, index: number) => JSX.DOMNode
}

// <For of={values} separator={() => ", "}>{(value) => <span>{value}</span>}</For>
export function For<T>({ of, children: render, separator }: ForProps<T>): JSX.DOMNode {
  const times = of.map(v => v.length)
  return new RepeatImpl(
    times,
    (index: number) => {
      const value = of.at(index)
      return new FragmentImpl([
        makeRenderable(render?.(value, index)),
        OnRemove({ clear: value.clean })
      ])
    },
    separator
  )
}
