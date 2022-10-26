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

const Tutorial: NextPageWithLayout = () => {
  const router = useRouter()

  const [currentChapter, setCurrentChapter] = useState(1)
  const [currentCommandDictionary, setCurrentCommandDictionary] = useState<
    MotorCommandsDictionary
  >(MotorCommands[0])

  useEffect(() => {
    setCurrentCommandDictionary(MotorCommands[currentChapter - 1])
  }, [currentChapter])

  useEffect(() => {
    if (router.isReady) {
      const { chapterID } = router.query

      const chapter = parseInt(chapterID as string)
      if (chapter != 0 && chapter <= MotorCommands.length) {
        setCurrentChapter(chapter)
      } else {
        router.push('/404')
        setCurrentChapter(1)
      }
    }
  }, [router])

  return (
    <>
      <Head>
        <title>{`Chapter ${currentChapter ? currentChapter : ''}`}</title>
      </Head>
      <div className="flex animate__animated animate__fadeIn h-full w-full">
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
