/**
 * @jsxImportSource ../src
 */

import { render, If, Prop, For, Signal, conjuctions } from '../src'

describe('For', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  test('without separator', () => {
    const prop = Prop.of([1, 2, 3])
    const view = <For of={prop}>{(v: Signal<number>) => v.map(String)}</For>
    render(view, document.body)
    expect(document.body.innerHTML).toBe('123')
    prop.set([4, 5])
    expect(document.body.innerHTML).toBe('45')
    prop.set([])
    expect(document.body.innerHTML).toBe('')
    prop.set([9, 8, 7, 6, 5, 4, 3, 2, 1])
    expect(document.body.innerHTML).toBe('987654321')
  })

  test('with separator', () => {
    const prop = Prop.of([1, 2, 3])
    const view = <For
      of={prop}
      separator={conjuctions(',', '!', ':')}
    >{(v: Signal<number>) => v.map(String)}</For>
    render(view, document.body)
    expect(document.body.innerHTML).toBe('1:2!3')
    prop.set([4, 5])
    expect(document.body.innerHTML).toBe('4!5')
    prop.set([6])
    expect(document.body.innerHTML).toBe('6')
    prop.set([])
    expect(document.body.innerHTML).toBe('')
    prop.set([9, 8, 7, 6, 5, 4, 3, 2, 1])
    expect(document.body.innerHTML).toBe('9:8,7,6,5,4,3,2!1')
  })
})
