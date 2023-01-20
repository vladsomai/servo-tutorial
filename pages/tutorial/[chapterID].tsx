import Head from 'next/head'
import { ReactElement, useEffect, useRef, useState } from 'react'
import Layout from '../../components/layout'
import Chapters from '../../components/chapter-window'
import Main, { MainWindowProps } from '../../components/main-window'
import {
  MotorCommandsDictionary, CommandsProtocoolChapter
} from '../../servo-engine/motor-commands'
import RawMotorCommands from '../../public/motor_commands.json' assert {type: 'json'};
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { GlobalContext } from '../_app'

const Tutorial = () => {
  const router = useRouter()
  const value = useContext(GlobalContext)
  const codeAlertWasShown = useRef(false);
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

      if(!codeAlertWasShown.current && CommandID!=100)
      {
        codeAlertWasShown.current = true
        value.alert.setTitle('Check out the \'Code examples\' section!')
        value.alert.setDescription(<><p>The code automatically changes when you select a different axis, change the parameters or navigate through the commands.</p></>)
        setTimeout(()=>{value.alert.setShow(true)},2000)
        setTimeout(()=>{value.alert.setShow(false)},17200)
      }
    }
  }, [router,value.alert])

  return (
    <>
      <Head>
        <title>{currentCommandDictionary?.CommandEnum == 100? 'Commands protocol':`Command ${currentCommandDictionary?.CommandEnum}`}</title>
      </Head>
      {currentCommandDictionary != null ? (
        <div className="flex h-full w-full">
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