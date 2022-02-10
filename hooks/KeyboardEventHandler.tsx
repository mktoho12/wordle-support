import { Dispatch, SetStateAction, useEffect } from "react";
import { Letter, Index, Evaluation } from "../index.d";
import { sliceBy } from "../lib/arrays";
import Input from "../lib/Input";

const useKeyboardEventHandler = (setInputs: Dispatch<SetStateAction<Input[][]>>) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Backspace") {
      setInputs(prev => prev.flat().slice(0, -1).reduce(sliceBy(5), []))
      return
    }

    if (!event.key.match(/^[a-z]$/)) return;

    const input = (index: Index) => new Input(event.key as Letter, index, Evaluation.Absent)
    setInputs(prev => prev.every(inputs => inputs.length === 5) ?
      [...prev, [input(0)]].slice(0, 6) :
      [...prev.slice(0, -1),
        [
          ...prev[prev.length - 1],
          input(prev[prev.length - 1].length % 5 as Index)
        ]
      ])
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })
}

export default useKeyboardEventHandler