import { GetStaticProps } from "next"
import { chromium } from "playwright"

type Props = {
  words: string[]
  errors?: any
}

const Words = ({ words, errors }: Props) => (
  <ul>
    {words.map((word) => (
      <li key={word}>{word}</li>
    ))}

    <p>{errors}</p>
  </ul>
)

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
