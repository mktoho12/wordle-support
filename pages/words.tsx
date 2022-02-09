import { GetStaticProps } from "next"
import * as puppeteer from "puppeteer"

type Props = {
  words: string[]
}

const Words = ({ words }: Props) => (
  <ul>
    {words.map((word) => (
      <li key={word}>{word}</li>
    ))}
  </ul>
)

export default Words

export const getStaticProps: GetStaticProps = async () => {
  try {
    const browser = await puppeteer.launch()
    const select = () => Array.from(document.querySelectorAll('.word-block ul li')).map(li => li.textContent)
    const words = await Promise.all('a'.split('').map(letter => 
      browser.newPage().then(page =>
        page.goto(`https://www.wordmom.com/5-letter-words/that-start-with-${letter}`)
            .then(() =>
              page.evaluate(select)
                  .then(words => {
                    page.close()
                    return words
                  })
            )
      )
    )).then(wordses => wordses.flat())
    
    return { props: { words } }
  } catch (err: any) {
    return { props: { errors: err.message } }
  }
}
