import { GetStaticProps } from "next"
import { MouseEvent, useEffect, useState } from "react"
import wordListPath from "word-list"
import { readFileSync } from "fs"
import GameRow from "../components/GameRow"
import { Evaluation, Predicate } from "../index.d"
import Image from "next/image"
import useKeyboardEventHandler from "../hooks/KeyboardEventHandler"
import Input from "../lib/Input"
import { assign, zeroTo } from "../lib/arrays"
import Head from "next/head"

export type Props = {
  words: string[]
  errors?: any
}

const Home = ({ words, errors }: Props) => {
  const [inputs, setInputs] = useState<Input[][]>([])
  const [candidates, setCandidates] = useState<string[]>([])

  useKeyboardEventHandler(setInputs)

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
    () => setCandidates(inputs.flat().map(predicate).reduce((accm, p) => accm.filter(p), words)),
    [inputs, words]
  )

  const keyPress = (event: MouseEvent<HTMLButtonElement>) => {
    let key = event.currentTarget.dataset.key
    if(!key) return;

    document.dispatchEvent(new KeyboardEvent("keydown", { key: key === "←" ? "Backspace" : key }))
  }

  const renderKey = (key: string) => <button data-key={key} onClick={keyPress} key={key}>{key}</button>

  return <>
    <Head>
      <title>WORDLE cheating</title>
      <meta name="description" content="Tool for cheating in WORDLE. do not use it if you want to enjoy the game."/>

      <meta property="og:title" content="WORDLE cheating"/>
      <meta property="og:type" content="cheat tool"/>
      <meta property="og:url" content="https://wordle.mktoho.dev/"/>
      <meta property="og:image" content="https://wordle.mktoho.dev/og.png"/>

      <link rel="icon" href="/favicon.ico" sizes="any"/>
      <link rel="icon shortcut" href="/favicon-32x32.png" sizes="3232"/>
      <link rel="apple-touch-icon" href="/favicon-192x192.png"/>
    </Head>

    <div id="layout">
      <header>
        <h1>WORDLE cheating</h1>
        <p>Don&apos;t use it if you want to enjoy <a href="https://www.powerlanguage.co.uk/wordle/" target="_blank" rel="noreferrer">WORDLE</a>.</p>
      </header>
      <div id="board-container">
        <div id="board">
          {zeroTo(6).map(i => 
            <GameRow
              key={i}
              length={5}
              inputs={inputs[i]}
              onChange={row => setInputs(assign(inputs, i, row))}
            />
          )}
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
        <div id="keyboard">
          <div className="row">
            {"qwertyuiop".split("").map(renderKey)}
          </div>
          <div className="row">
            <div className="spacer half"></div>
            {"asdfghjkl".split("").map(renderKey)}
            <div className="spacer half"></div>
          </div>
          <div className="row">
            <div className="spacer one-and-a-half"></div>
            {"zxcvbnm".split("").map(renderKey)}
            <button data-key="←" className="one-and-a-half" onClick={keyPress}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path fill="var(--color-tone-1)" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
              </svg>
            </button>
          </div>
        </div>
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
