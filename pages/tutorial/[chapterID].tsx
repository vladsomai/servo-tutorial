import Head from 'next/head'
import { ReactElement, useEffect, useRef, useState } from 'react'
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
  const [currentCommandDictionary, setCurrentCommandDictionary] = useState<
    MotorCommandsDictionary|null
  >(null)

  useEffect(()=>{
    MotorCommands.current = [
      CommandsProtocoolChapter,
      ...RawMotorCommands,
    ] as MotorCommandsDictionary[]

  }, [])

  useEffect(() => {
    if (router.isReady) {
      const commandIdStr  = router.query.chapterID
      
      const CommandID = parseInt(commandIdStr as string)
      
      let commandFound=false
     
      for(const command of MotorCommands.current)
      {
        if(CommandID==command.CommandEnum)
        {
          setCurrentCommandDictionary(command)
          commandFound=true
        }
      }
      
      if (!commandFound) {
        router.push('/404')
      }

    }
  }, [router])

  return (
    <>
      <Head>
        <title>{currentCommandDictionary?.CommandEnum == 100? 'Commands protocol':`Command ${currentCommandDictionary?.CommandEnum}`}</title>
      </Head>
      {currentCommandDictionary != null ? (
        <div className="flex animate__animated animate__fadeIn h-full w-full">
          <Chapters {...{MotorCommands,currentCommandDictionary,setCurrentCommandDictionary}} />
          <Main
            {...({
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