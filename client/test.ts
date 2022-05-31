function* range(first: number, second?: number): Generator<number> {
  const [start, end] = second !== undefined ? [first, second] : [0, first]
  for (let i = start; i < end; i++) {
    yield i
  }
}

function* reversed<T>(iterable: Iterable<T>): Generator<T> {
  const arr = Array.from(iterable)
  for (let i = arr.length - 1; i >= 0; i--) {
    yield arr[i]
  }
}

console.log(Array.from(reversed(range(5))))