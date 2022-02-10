import { Index, Letter, Evaluation } from "../index.d"

export default class Input {
  letter: Letter
  index: Index
  evaluation: Evaluation

  constructor(letter: Letter, index: Index, evaluation: Evaluation) {
    this.letter = letter
    this.index = index
    this.evaluation = evaluation
  }

  nextEvalution = () => {
    switch(this.evaluation) {
      case Evaluation.Absent: return Evaluation.Present
      case Evaluation.Present: return Evaluation.Correct
      case Evaluation.Correct: return Evaluation.Absent
    }
  }
}