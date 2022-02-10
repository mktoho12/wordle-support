import Input from "../lib/Input"

type Props = {
  input?: Input
  onChange: (input: Input) => void
}

const GameTile = ({ input, onChange }: Props) => (
  <div
    className="tile"
    data-evalution={input?.evaluation || "empty"}
    onClick={() => input && onChange(new Input(input.letter, input.index, input.nextEvalution()))}
  >
    {input?.letter}
  </div>
)

export default GameTile
