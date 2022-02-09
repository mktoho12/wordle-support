import { GetStaticProps } from "next"
import { chromium } from "playwright"
import { useEffect, useState } from "react"

type Props = {
  words: string[]
  errors?: any
}

type Letter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' |
              'G' | 'H' | 'I' | 'J' | 'K' | 'L' |
              'M' | 'N' | 'O' | 'P' | 'Q' | 'R' |
              'S' | 'T' | 'U' | 'V' | 'W' | 'X' |
              'Y' | 'Z'

enum HitBlowState {
  Hit, Blow, None
}

type Input = {
  index: 0 | 1 | 2 | 3 | 4
  letter: Letter
  state: HitBlowState
}

const Words = ({ words, errors }: Props) => {
  const [inputs, setInputs] = useState<Input[]>([])
  const [fulfill, setFulfill] = useState<string[]>([])

  useEffect(() => {
    setInputs([
      {
        index: 0,
        letter: 'I',
        state: HitBlowState.None,
      },
      {
        index: 1,
        letter: 'N',
        state: HitBlowState.None,
      },
      {
        index: 2,
        letter: 'P',
        state: HitBlowState.None,
      },
      {
        index: 3,
        letter: 'U',
        state: HitBlowState.Blow,
      },
      {
        index: 4,
        letter: 'T',
        state: HitBlowState.None,
      },
      {
        index: 0,
        letter: 'F',
        state: HitBlowState.None,
      },
      {
        index: 1,
        letter: 'R',
        state: HitBlowState.Blow,
      },
      {
        index: 2,
        letter: 'A',
        state: HitBlowState.None,
      },
      {
        index: 3,
        letter: 'M',
        state: HitBlowState.Blow,
      },
      {
        index: 4,
        letter: 'E',
        state: HitBlowState.None,
      },
    ])
  }, [])

  useEffect(() => {
    const filtered = inputs.map(input =>
      input.state === HitBlowState.None ? (word: string) => !word.includes(input.letter.toLowerCase()) :
      input.state === HitBlowState.Hit ? (word: string) => word[input.index] === input.letter.toLowerCase() :
      (word: string) => word.includes(input.letter.toLowerCase()) && word[input.index] !== input.letter.toLowerCase()
    ).reduce((accm, fn) => accm.filter(fn), words)

    setFulfill(filtered)
  }, [inputs])

  return <>
    <div>
    </div>
    <ul>
      {fulfill.map((word) => (
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
    const browser = await chromium.launch()
    const select = () => Array.from(document.querySelectorAll('.word-block ul li')).map(li => li.textContent)
    const words = await Promise.all('abcdefghijklmnopqrstuvwxyz'.split('').map(letter => 
      browser.newPage().then(page =>
        page.goto(`https://www.wordmom.com/5-letter-words/that-start-with-${letter}`)
            .then(() => page.evaluate(select))
      )
    )).then(wordses => wordses.flat())
    browser.close()
    
    return { props: { words } }
  } catch (err: any) {
    return { props: { words: [], errors: err.message } }
  }
}
