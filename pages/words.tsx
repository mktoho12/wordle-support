import { GetStaticProps } from "next"
import { useEffect, useState } from "react"
import wordListPath from "word-list"
import { readFileSync } from "fs"
import Image from "next/image"

type Props = {
  words: string[]
  errors?: any
}

type Index = 0 | 1 | 2 | 3 | 4

type Letter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' |
              'g' | 'h' | 'i' | 'j' | 'k' | 'l' |
              'm' | 'n' | 'o' | 'p' | 'q' | 'r' |
              's' | 't' | 'u' | 'v' | 'w' | 'x' |
              'y' | 'z'

enum Evaluation {
  Absent,
  Present,
  Correct
}

type EvaluationLetter = 'x' | 'o' | '!'

type Input = {
  index: Index
  letter: Letter
  evaluation: Evaluation
}

const Words = ({ words, errors }: Props) => {
  const [inputs, setInputs] = useState<Input[]>([])
  const [candidates, setCandidates] = useState<string[]>([])

  const input = (letter: Letter, index: Index, evaluation: Evaluation) => ({
    index, letter, evaluation
  })

  const word = (word: string, evaluations: string) =>
    _word(word.split("").map(letter),
          evaluations.split("").map(evaluationLetter).map(evaluation))

  const _word = (word: Letter[], evaluates: Evaluation[]) =>
    word.map((l, i) => input(l, (i as Index), evaluates[i]))

  const letter = (str: string) => {
    if(!str.match(/^[a-z]$/)) throw Error(`letter should be one length character, but given [${str}]`)
    return str as Letter
  }

  const evaluationLetter = (str: string) => {
    if(!str.match(/^[xo!]$/)) throw Error(`evaluation should be x or o or !, but given [${str}]`)
    return str as EvaluationLetter
  }

  const evaluation = (evaluationLetter: EvaluationLetter) => {
    switch(evaluationLetter) {
      case "x": return Evaluation.Absent
      case "o": return Evaluation.Present
      case "!": return Evaluation.Correct
    }
  }

  useEffect(() => {
    try {
      setInputs([
        ...word("input", "xxoox"),
        ...word("frame", "xxox!"),
      ])
    } catch (error) {
      console.error(error)
    }
  }, [])

  type Predicate = (word: string) => boolean

  // From entered letter to filter predicate.
  const predicate = ({ evaluation, letter, index }: Input): Predicate => {
    switch(evaluation) {
      case Evaluation.Correct:
        return word => word[index] === letter
      case Evaluation.Present:
        return word => word.includes(letter) && word[index] !== letter
      case Evaluation.Absent:
        return word => !word.includes(letter)
    }
  }
  
  useEffect(
    () => setCandidates(inputs.map(predicate).reduce((accm, p) => accm.filter(p), words)),
    [inputs]
  )

  const [source, setSource] = useState("")
  useEffect(() => {
    if(source.split(/\n/).some(line => line.length !== 11)) {
      return
    }

    try {
      const inputs = source.split(/\n/).map(line => {
        const [w, e] = line.split(/\s+/)
        return word(w, e)
      }).flat()
      setInputs(inputs)
    } catch (error) {
      console.error(error)
    }
  }, [source])

  return <>
    <div>
      <textarea style={{width:'20rem', height:'10rem'}} value={source} onChange={e => setSource(e.target.value)}></textarea>
      <Image src="/syntax.png" alt="syntax" width={400} height={454} />
    </div>
    <ul>
      {candidates.map((word) => (
        <li key={word}>{word}</li>
      ))}

      {/* for debug */}
      {errors && <p>{errors}</p>}
    </ul>
  </>
}

export default Words

export const getStaticProps: GetStaticProps = async () => {
  try {
    const words = readFileSync(wordListPath, 'utf8').split("\n").filter(word => word.length === 5)
    // const browser = await chromium.launch()
    // const select = () => Array.from(document.querySelectorAll('.word-block ul li')).map(li => li.textContent)
    // const words = await Promise.all('abcdefghijklmnopqrstuvwxyz'.split('').map(letter => 
    //   browser.newPage().then(page =>
    //     page.goto(`https://www.wordmom.com/5-letter-words/that-start-with-${letter}`)
    //         .then(() => page.evaluate(select))
    //   )
    // )).then(wordses => wordses.flat())
    // browser.close()
    
    return { props: { words } }
  } catch (err: any) {
    return { props: { words: [], errors: err.message } }
  }
}
