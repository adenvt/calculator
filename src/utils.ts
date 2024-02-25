export const OPERATIONS = {
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '*': (a: number, b: number) => a * b,
  '/': (a: number, b: number) => a / b,
}

export type Operation = keyof typeof OPERATIONS

export function isOperation (key: string) {
  return OPERATIONS[key as Operation] !== undefined
}

export function calculate (operator: Operation, a: number, b: number) {
  return OPERATIONS[operator](a, b)
}

export function toDisplay (value: number, length: number): string {
  return Number.parseFloat(value.toFixed(length - 2)).toString().slice(0, length)
}
