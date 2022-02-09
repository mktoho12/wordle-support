import { Evaluation, Input } from "../index.d"
import GameTile from "./GameTile"

type Props = {
  length: number
  inputs: Input[]
}

const GameRow = ({ length, inputs }: Props) => {

  return (
    <div className="row">
      {Array(length).fill(null).map((_, i) => inputs[i] ? 
        <GameTile key={i} letter={inputs[i].letter} evalution={inputs[i].evaluation} onClick={inputs[i].toggle}/> :
        <GameTile key={i} letter="" evalution={Evaluation.Empty}/>
      )}
    </div>
  )
}

export default GameRow
