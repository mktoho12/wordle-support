import { GetStaticProps } from "next"
import { useCallback, useEffect, useState } from "react"
import wordListPath from "word-list"
import { readFileSync } from "fs"
import GameRow from "../components/GameRow"
import { Evaluation, Index, Input, Letter, Predicate } from "../index.d"
import Image from "next/image"

export type Props = {
  words: string[]
  errors?: any
}

const Home = ({ words, errors }: Props) => {
  const [inputs, setInputs] = useState<Input[]>([])
  const [candidates, setCandidates] = useState<string[]>([])

  const nextEvalution = (ev: Evaluation) => {
    switch(ev) {
      case Evaluation.Absent: return Evaluation.Present
      case Evaluation.Present: return Evaluation.Correct
      case Evaluation.Correct: return Evaluation.Absent
    }
  }

  const input = (letter: Letter, index: Index, evaluation: Evaluation, wordIndex: number) => ({
    index,
    letter,
    evaluation,
    wordIndex,
    toggle: () => setInputs(prev => {
      const r = [...prev]
      const totalIndex = wordIndex * 5 + index
      r[totalIndex] = Object.assign(prev[totalIndex], { evaluation: nextEvalution(prev[totalIndex].evaluation) })
      return r
    })
  })

  // const word = (word: string, evaluations: string) =>
  //   _word(word.split("").map(letter),
  //         evaluations.split("").map(evaluationLetter).map(evaluation))

  // const _word = (word: Letter[], evaluates: Evaluation[]) =>
  //   word.map((l, i) => input(l, (i as Index), evaluates[i]))

  // const letter = (str: string) => {
  //   if(!str.match(/^[a-z]$/)) throw Error(`letter should be one length character, but given [${str}]`)
  //   return str as Letter
  // }

  // const evaluationLetter = (str: string) => {
  //   if(!str.match(/^[xo!]$/)) throw Error(`evaluation should be x or o or !, but given [${str}]`)
  //   return str as EvaluationLetter
  // }

  // const evaluation = (evaluationLetter: EvaluationLetter) => {
  //   switch(evaluationLetter) {
  //     case "x": return Evaluation.Absent
  //     case "o": return Evaluation.Present
  //     case "!": return Evaluation.Correct
  //   }
  // }

  // From entered letter to filter predicate.
  const predicate = ({ evaluation, letter, index }: Input): Predicate => {
    switch(evaluation) {
      case Evaluation.Correct:
        return word => word[index] === letter
      case Evaluation.Present:
        return word => word.includes(letter) && word[index] !== letter
      case Evaluation.Absent:
        return word => !word.includes(letter)
      default:
        return _ => false
    }
  }
  
  useEffect(() => {
    setCandidates(inputs.map(predicate).reduce((accm, p) => accm.filter(p), words))
  }, [inputs, words])

  // const [source, setSource] = useState("")
  // useEffect(() => {
  //   if(source.split(/\n/).some(line => line.length !== 11)) {
  //     return
  //   }

  //   try {
  //     const inputs = source.split(/\n/).map(line => {
  //       const [w, e] = line.split(/\s+/)
  //       return word(w, e)
  //     }).flat()
  //     setInputs(inputs)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }, [source])

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Backspace") {
      setInputs(prev => prev.slice(0, -1))
      return
    }

    if (!event.key.match(/^[a-z]$/)) return;

    setInputs(prev => [...prev, input(event.key as Letter, prev.length % 5 as Index, Evaluation.Absent, Math.floor(prev.length / 5))].slice(0, 30))
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })

  return <>
    <div id="layout">
      <header>
        <h1>WORDLE cheating</h1>
        <p>Don&apos;t use it if you want to enjoy <a href="https://www.powerlanguage.co.uk/wordle/" target="_blank" rel="noreferrer">WORDLE</a>.</p>
      </header>
      <div id="board-container">
        <div id="board">
          <GameRow length={5} inputs={inputs.slice(0, 5)}/>
          <GameRow length={5} inputs={inputs.slice(5, 10)}/>
          <GameRow length={5} inputs={inputs.slice(10, 15)}/>
          <GameRow length={5} inputs={inputs.slice(15, 20)}/>
          <GameRow length={5} inputs={inputs.slice(20, 25)}/>
          <GameRow length={5} inputs={inputs.slice(25, 30)}/>
        </div>

        <div id="candidates">
          {candidates.length > 100 ? 
             <p>There are 100+ words that can be the correct answer.</p> :
           candidates.length > 1 ?
             <p>There are {candidates.length} words that can be the correct answer.</p> :
           candidates.length > 0 ?
             <p>The correct word is</p> :
             <p>There is no word that can be the correct answer. Let&apos;s give up and try again tomorrow.</p>
          }
          <ul>
            {candidates.slice(0, 15).map((word) => (
              <li key={word}>{word}</li>
            ))}

            {/* for debug */}
            {errors && <p>{errors}</p>}
          </ul>

          {candidates.length > 15 && <span>...</span>}

        </div>
      </div>
      <footer>
        <p>Type keyboard and click letter.</p>
      </footer>
      <div className="github">
        <a href="https://github.com/mktoho12/wordle-support" target="_blank" rel="noreferrer"><Image src="/github.png" alt="github repository" width={60} height={60} /></a>
      </div>
    </div>
  </>
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  try {
    const words = readFileSync(wordListPath, 'utf8').split("\n").filter(word => word.length === 5)
    
    return { props: { words } }
  } catch (err: any) {
    return { props: { words: [], errors: err.message } }
  }
}
