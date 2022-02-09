import { MouseEventHandler } from "react"
import { Evaluation } from "../index.js"

type Props = {
  letter: string
  evalution: Evaluation
  onClick?: MouseEventHandler
}

const GameTile = ({ letter, evalution, onClick }: Props) => {
  return (
    <div className="tile" data-evalution={evalution} onClick={onClick}>{letter}</div>
  )
}

export default GameTile
