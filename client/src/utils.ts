export function* range(first: number, second?: number): Generator<number> {
  const [start, end] = second !== undefined ? [first, second] : [0, first]
  for (let i = start; i < end; i++) {
    yield i
  }
}