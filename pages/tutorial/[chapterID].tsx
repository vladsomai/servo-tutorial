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
import { useRouter } from 'next/router'
import Link from 'next/link'

const Tutorial: NextPageWithLayout = () => {
  const router = useRouter()
  const { chapterID } = router.query

  const [currentChapter, setCurrentChapter] = useState(1)
  const [currentCommandDictionary, setCurrentCommandDictionary] = useState<
    MotorCommandsDictionary
  >(MotorCommands[0])

  useEffect(() => {
    setCurrentCommandDictionary(MotorCommands[currentChapter - 1])
  }, [currentChapter])

  useEffect(() => {
    if (chapterID !== undefined) {
      setCurrentChapter(parseInt(chapterID as string))
    }
  }, [chapterID])
  return (
    <>
      <Head>
        <title>{`Chapter ${chapterID ? chapterID : ''}`}</title>
      </Head>
      <div className="flex animate__animated animate__fadeIn">
        <Chapters {...{ currentChapter, setCurrentChapter }} />
        <Main {...{ currentChapter, currentCommandDictionary }} />
      </div>
    </>
  )
}

Tutorial.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Tutorial
