import { ReactElement, useEffect } from 'react'
import { MainWindowProps } from './main-window'
import CommandsProtocol from './ImplementedCommands/commands-protocol'
import Image from 'next/image'
import { useContext } from 'react'
import { GlobalContext } from '../pages/_app'
import { animated, useSpring, config } from '@react-spring/web'
import {ResetCmd, DisableCmd, EnableCmd} from './modalComponents'

interface CommandWindowProps extends MainWindowProps {
  sendDataToSerialPort: Function
  connectToSerialPort: Function
  disconnectFromSerialPort: Function
  children: ReactElement
  isConnected: boolean
}
const Command = (props: CommandWindowProps, children: ReactElement) => {
  const commandsWithShortcuts = [0, 1, 27]
  const globalContext = useContext(GlobalContext)
  const iconSize = 25

  const shortcuts = (currentCommand: number) => {
    let title = 'This command supports shortcuts'
    let descriptionObj = <></>

    switch (currentCommand) {
      case 27:
        descriptionObj = ResetCmd
        break
      case 0:
        descriptionObj = DisableCmd
        break
      case 1:
        descriptionObj = EnableCmd
        break
      default:
        title =
          'You should not see this text, please contact your administrator.'
        break
    }
    globalContext.modal.setTitle(title)
    globalContext.modal.setDescription(descriptionObj)
  }
  const [fade, api] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.molasses,
  }))

  useEffect(() => {
    api.start({
      from: { opacity: 0 },
      to: { opacity: 1 },
      config: config.molasses,
    })
  }, [props.currentChapter, api])

  if (props.currentCommandDictionary.CommandEnum !== 100)
    return (
      <div className={`overflow-auto relative px-5 w-6/12`}>
        <div className="absolute top-4 right-2">
          {props.isConnected ? (
            <button
              className="btn btn-success btn-sm h-[2.3rem] text-md btn-primary hover:opacity-90 border-0 flex flex-col normal-case"
              onClick={() => {
                props.disconnectFromSerialPort()
              }}
            >
              Connected
              <span className="text-[10px] normal-case">
                Press to disconnect
              </span>
            </button>
          ) : (
            <button
              className="btn btn-error btn-sm h-[2.3rem] text-md hover:opacity-90 flex flex-col normal-case"
              onClick={() => {
                props.connectToSerialPort()
              }}
            >
              Disconnected
              <span className="text-[10px] normal-case">Press to connect</span>
            </button>
          )}
        </div>
        {commandsWithShortcuts.includes(
          props.currentCommandDictionary.CommandEnum,
        ) ? (
          <animated.div
            style={fade}
            className="bg-primary rounded-full absolute top-4 left-4 pt-2 px-2 m-0"
          >
            <label
              className="inline link"
              onClick={() => {
                shortcuts(props.currentCommandDictionary.CommandEnum)
              }}
              htmlFor="my-modal-4"
            >
              <Image
                className="mask mask-squircle p-0 m-0"
                src={'/info-circle-fill.svg'}
                width={iconSize}
                height={iconSize}
                alt="main picture"
                priority
              ></Image>
            </label>
          </animated.div>
        ) : null}
        <animated.div style={fade}>
          <div className="mb-5 mt-16">
            <p className="text-center mb-5 text-2xl">
              <strong>{props.currentCommandDictionary.CommandString}</strong>
            </p>{' '}
            <p className="text-center mb-5 text-xl">
              <strong>
                Command {props.currentCommandDictionary.CommandEnum}
              </strong>
            </p>
            <p className="mb-2">
              <b>Description:&nbsp;</b>{' '}
              {props.currentCommandDictionary.Description}
            </p>
            <article className="prose w-full max-w-full">
              <h4>Inputs:&nbsp;</h4>
              <ol className="m-0">
                {typeof props.currentCommandDictionary.Input == 'string' ? (
                  <li>
                    <p>{props.currentCommandDictionary.Input}</p>
                  </li>
                ) : (
                  props.currentCommandDictionary.Input.map((item) => {
                    return (
                      <li
                        key={props.currentCommandDictionary.Input.indexOf(item)}
                      >
                        <p>{item}</p>
                      </li>
                    )
                  })
                )}
              </ol>
            </article>
            <article className="prose w-full max-w-full">
              <h4>Outputs:&nbsp;</h4>
              <ol className="m-0">
                {typeof props.currentCommandDictionary.Output == 'string' ? (
                  <li>
                    <p>{props.currentCommandDictionary.Output}</p>
                  </li>
                ) : (
                  props.currentCommandDictionary.Output.map((item) => {
                    //for command 16
                    if (item.startsWith('Bit'))
                      return (
                        <p
                          key={props.currentCommandDictionary.Output.indexOf(
                            item,
                          )}
                          className="ml-10"
                        >
                          {item}
                        </p>
                      )
                    else
                      return (
                        <li
                          key={props.currentCommandDictionary.Output.indexOf(
                            item,
                          )}
                        >
                          <p>{item}</p>
                        </li>
                      )
                  })
                )}
              </ol>
            </article>
          </div>
          {props.children}
        </animated.div>
      </div>
    )
  else
    return (
      <animated.div style={fade} className={`overflow-auto relative`}>
        <CommandsProtocol
          MotorCommands={props.MotorCommands}
          currentCommandDictionary={props.currentCommandDictionary}
          currentChapter={props.currentChapter}
        />
      </animated.div>
    )
}
export default Command
