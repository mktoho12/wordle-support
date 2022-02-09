export type Index = 0 | 1 | 2 | 3 | 4

export type Letter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' |
              'g' | 'h' | 'i' | 'j' | 'k' | 'l' |
              'm' | 'n' | 'o' | 'p' | 'q' | 'r' |
              's' | 't' | 'u' | 'v' | 'w' | 'x' |
              'y' | 'z'

export enum Evaluation {
  Absent = "absent",
  Present = "present",
  Correct = "correct",
  Empty = "empty",
}

export type EvaluationLetter = 'x' | 'o' | '!'

export type Input = {
  index: Index
  letter: Letter
  evaluation: Evaluation
  wordIndex: number
  toggle?: () => void
}

export type Predicate = (word: string) => boolean
