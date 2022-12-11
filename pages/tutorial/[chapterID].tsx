import Head from 'next/head'
import { ReactElement, useEffect, useRef, useState } from 'react'
import type { NextPageWithLayout } from '../_app'
import Layout from '../../components/layout'
import 'animate.css'
import Chapters from '../../components/chapter-window'
import Main, { MainWindowProps } from '../../components/main-window'
import {
  MotorCommandsDictionary, CommandsProtocoolChapter
} from '../../servo-engine/motor-commands'
import RawMotorCommands from '../../public/motor_commands.json' assert {type: 'json'};
import { useRouter } from 'next/router'

const Tutorial = () => {
  const router = useRouter()

  const MotorCommands = useRef<
    MotorCommandsDictionary[] 
  >([])
  const [currentChapter, setCurrentChapter] = useState(0)
  const [currentCommandDictionary, setCurrentCommandDictionary] = useState<
    MotorCommandsDictionary|null
  >(null)

  useEffect(()=>{
    MotorCommands.current = [
      CommandsProtocoolChapter,
      ...RawMotorCommands,
    ] as MotorCommandsDictionary[]

    setCurrentCommandDictionary(MotorCommands.current[0])
  }, [])

  useEffect(() => {
    setCurrentCommandDictionary(MotorCommands.current[currentChapter - 1])
  }, [currentChapter])

  useEffect(() => {
    if (router.isReady) {
      const { chapterID } = router.query

      const chapter = parseInt(chapterID as string)
      if (chapter != 0 && chapter <= MotorCommands.current.length) {
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
      {currentCommandDictionary != null ? (
        <div className="flex animate__animated animate__fadeIn h-full w-full">
          <Chapters {...{ currentChapter, setCurrentChapter, MotorCommands}} />
          <Main
            {...({
              currentChapter,
              currentCommandDictionary,
              MotorCommands
            } as MainWindowProps)}
          />
        </div>
        
      ) : null}
    </>
  )
}

Tutorial.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Tutorial