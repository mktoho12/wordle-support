import { assign, zeroTo } from "../lib/arrays"
import Input from "../lib/Input"
import GameTile from "./GameTile"

type Props = {
  length: number
  inputs: Input[]
  onChange: (inputs: Input[]) => void
}

const GameRow = ({ length, inputs = [], onChange }: Props) => (
  <div className="row">
    {zeroTo(length).map(i => (
      <GameTile
        key={i}
        input={inputs[i]}
        onChange={input => onChange(assign(inputs, i, input))}
      />)
    )}
  </div>
)

export default GameRow
