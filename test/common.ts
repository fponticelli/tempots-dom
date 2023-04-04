import { expect } from 'vitest'
export type Assertion = ReturnType<typeof expect>

export function expectBody (): Chai.Assertion {
  return expect(document.body.innerHTML)
}

export function expectHead (): Chai.Assertion {
  return expect(document.head.innerHTML)
}
