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

  return (
    <>
      <Head>
        <title>Tutorial</title>
      </Head>
      <div className="flex animate__animated animate__fadeIn mt-5">
        <Chapters {...{ currentChapter, setCurrentChapter }} />
        <div className="divider divider-horizontal"></div>
        <Main {...{ currentChapter, currentCommandDictionary }}/>
      </div>
    </>
  )
}

Tutorial.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Tutorial
