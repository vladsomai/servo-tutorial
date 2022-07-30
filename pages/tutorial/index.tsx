import Head from 'next/head'
import { ReactElement, useEffect, useState } from 'react'
import type { NextPageWithLayout } from '../_app'
import Layout from '../../components/layout'
import 'animate.css'
import Chapters from '../../components/chapter-window'
import Main from '../../components/main-window'
import {
  MotorCommands,
  MotorCommandsDictionary,
} from '../../servo-engine/motor-commands'

const Tutorial: NextPageWithLayout = () => {
  const [currentChapter, setCurrentChapter] = useState(1)
  const [currentCommandDictionary, setCurrentCommandDictionary] = useState<
    MotorCommandsDictionary
  >(MotorCommands[0])

  useEffect(() => {
    setCurrentCommandDictionary(MotorCommands[currentChapter - 1])
  }, [currentChapter])

  let currentCommandLayout: ReactElement = <></>
  if (currentChapter == 1)
    currentCommandLayout = (
      <>
        <p>you just got it!!!</p>
      </>
    )
  else if (currentChapter == 2) currentCommandLayout = <></>
  else if (currentChapter == 3) currentCommandLayout = <></>
  else if (currentChapter == 4) currentCommandLayout = <></>
  else if (currentChapter == 5) currentCommandLayout = <></>
  else if (currentChapter == 6) currentCommandLayout = <></>
  else if (currentChapter == 7) currentCommandLayout = <></>
  else if (currentChapter == 8) currentCommandLayout = <></>
  else if (currentChapter == 9) currentCommandLayout = <></>
  else if (currentChapter == 10) currentCommandLayout = <></>
  else if (currentChapter == 11) currentCommandLayout = <></>
  else if (currentChapter == 12) currentCommandLayout = <></>
  else if (currentChapter == 13) currentCommandLayout = <></>
  else if (currentChapter == 14) currentCommandLayout = <></>
  else if (currentChapter == 15) currentCommandLayout = <></>
  else if (currentChapter == 16) currentCommandLayout = <></>
  else if (currentChapter == 17) currentCommandLayout = <></>
  else if (currentChapter == 18) currentCommandLayout = <></>
  else if (currentChapter == 19) currentCommandLayout = <></>
  else if (currentChapter == 20) currentCommandLayout = <></>
  else if (currentChapter == 21) currentCommandLayout = <></>
  else if (currentChapter == 22) currentCommandLayout = <></>
  else if (currentChapter == 23) currentCommandLayout = <></>
  else if (currentChapter == 24) currentCommandLayout = <></>
  else if (currentChapter == 25) currentCommandLayout = <></>
  else if (currentChapter == 26) currentCommandLayout = <></>
  else if (currentChapter == 27) currentCommandLayout = <></>
  else if (currentChapter == 28) currentCommandLayout = <></>
  else if (currentChapter == 29) currentCommandLayout = <></>
  else if (currentChapter == 30) currentCommandLayout = <></>
  else if (currentChapter == 31) currentCommandLayout = <></>
  else if (currentChapter == 32) currentCommandLayout = <></>
  else if (currentChapter == 33) currentCommandLayout = <></>
  else if (currentChapter == 34) currentCommandLayout = <></>
  else if (currentChapter == 35) currentCommandLayout = <></>

  return (
    <>
      <Head>
        <title>Tutorial</title>
      </Head>
      <div className="flex animate__animated animate__fadeIn mt-5">
        <Chapters {...{ currentChapter, setCurrentChapter }} />
        <div className="divider divider-horizontal"></div>
        <Main {...{ currentChapter, currentCommandDictionary }}>
          {currentCommandLayout}
        </Main>
      </div>
    </>
  )
}

Tutorial.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Tutorial
