export const zeroTo = (i: number) => Array(i).fill(null).map((_, i) => i)

export const assign = <T,>(array: T[], index: number, value: T): T[] => array.map((v, i) => i === index ? value : v)

export const sliceBy = <T,>(n: number) => (accm: T[][], value: T) => accm.every(e => e.length === n) ?
  [...accm, [value]] :
  [...accm.slice(0, -1), [...accm[accm.length - 1], value]]
