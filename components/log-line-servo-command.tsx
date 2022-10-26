import { useEffect, useRef, useState, SyntheticEvent } from 'react'
import { hexStringToASCII } from '../servo-engine/utils'
import { LogType } from './log-window'
import { MainWindowProps } from './main-window'
import { useContext } from 'react'
import { GlobalContext } from '../pages/_app'

export interface LogLineServoCommandType
  extends LogType,
    MainWindowProps,
    CommandPayload {}

export interface CommandBytesType {
  Value: string
  Color: string
  Description: string
}

export interface CommandParameter {
  Description: string
  NoOfBytes: number
}
export interface CommandPayload {
  SendingPayload: CommandParameter[]
  ReceivingPayload: CommandParameter[]
}
const LogLineServoCommand = (props: LogLineServoCommandType) => {
  const globalContext = useContext(GlobalContext)
  const descriptionObj = (
    <>
      <article className="mb-5 prose prose-lg max-w-full spacin tracking-wide">
        <p className='text-xl mt-10'>Please verify each of the following is true:</p>
        <ol className=''>
          <li>You are connected to the serial port.</li>
          <li>You selected the correct axis.</li>
          <li>The motor is powered on.</li>
          <li>The motor is connected to the USB port.</li>
        </ol>
      </article>
    </>
  )
  const troubleshoot = () => {
    globalContext.modal.setTitle('Troubleshooting guide')
    globalContext.modal.setDescription(descriptionObj)
  }
  const byteColor = useRef<string[]>([
    ' text-violet-400',
    ' text-violet-500',
    ' text-violet-400',
    ' text-blue-400',
    ' text-blue-500',
  ])
  const byteDescriptionSend = useRef<string[]>([
    'Targeted axis byte',
    'Command byte',
    'Length byte',
    'Payload bytes!',
  ])

  const byteDescriptionReceived = useRef<string[]>([
    'Sender ID (R)',
    'Response status',
    'Length byte',
    'Payload bytes!',
  ])

  const [componentIsACommand, setComponentIsACommand] = useState<boolean>(false)
  const [componentIsATroubleshoot, setComponentIsATroubleshoot] = useState<
    boolean
  >(false)
  const stringTo0x = useRef<string>('')
  const rawCommand = useRef<string>('')
  const commandBytes = useRef<CommandBytesType[]>([])

  useEffect(
    (
      sendingPayload = props.SendingPayload,
      receivingPayload = props.ReceivingPayload,
    ) => {
      setComponentIsACommand(false)
      setComponentIsATroubleshoot(false)

      if (props.log.includes('Sent')) {
        setComponentIsACommand(true)
        const indexOf0x = props.log.indexOf('0x')
        stringTo0x.current = props.log.slice(0, indexOf0x)

        rawCommand.current = props.log.slice(indexOf0x + 2, props.log.length)

        for (let i = 0; i < rawCommand.current.length; i += 2) {
          if (i == 0) {
            commandBytes.current.push({
              Value: rawCommand.current.slice(0, 2),
              Description: byteDescriptionSend.current[0],
              Color: byteColor.current[0],
            })
          } else if (i == 2) {
            commandBytes.current.push({
              Value: rawCommand.current.slice(2, 4),
              Description: byteDescriptionSend.current[1],
              Color: byteColor.current[1],
            })
          } else if (i == 4) {
            commandBytes.current.push({
              Value: rawCommand.current.slice(4, 6),
              Description: byteDescriptionSend.current[2],
              Color: byteColor.current[2],
            })
          } else {
            if (sendingPayload.length == 0) {
              commandBytes.current.push({
                Value: rawCommand.current.slice(6, rawCommand.current.length),
                Description: byteDescriptionSend.current[3],
                Color: byteColor.current[3],
              })
            } else {
              let currentStart = 6
              let NoOfChars = 0
              for (let i = 0; i < sendingPayload.length; i++) {
                NoOfChars = sendingPayload.at(i)!.NoOfBytes * 2
                commandBytes.current.push({
                  Value: rawCommand.current.slice(
                    currentStart,
                    currentStart + NoOfChars,
                  ),
                  Description: sendingPayload.at(i)!.Description,
                  Color: byteColor.current[i % 2 == 0 ? 3 : 4],
                })
                currentStart += NoOfChars
              }
            }

            break
          }
        }
      } else if (props.log.includes('Received')) {
        setComponentIsACommand(true)
        const indexOf0x = props.log.indexOf('0x')
        stringTo0x.current = props.log.slice(0, indexOf0x)

        rawCommand.current = props.log.slice(indexOf0x + 2, props.log.length)

        for (let i = 0; i < rawCommand.current.length; i += 2) {
          if (i == 0) {
            commandBytes.current.push({
              Value: rawCommand.current.slice(0, 2),
              Description: byteDescriptionReceived.current[0],
              Color: byteColor.current[0],
            })
          } else if (i == 2) {
            commandBytes.current.push({
              Value: rawCommand.current.slice(2, 4),
              Description: byteDescriptionReceived.current[1],
              Color: byteColor.current[1],
            })
          } else if (i == 4) {
            commandBytes.current.push({
              Value: rawCommand.current.slice(4, 6),
              Description: byteDescriptionReceived.current[2],
              Color: byteColor.current[2],
            })
          } else {
            if (receivingPayload.length == 0) {
              commandBytes.current.push({
                Value: rawCommand.current.slice(6, rawCommand.current.length),
                Description: byteDescriptionSend.current[3],
                Color: byteColor.current[3],
              })
            } else {
              let currentStart = 6
              let NoOfChars = 0
              for (let i = 0; i < receivingPayload.length; i++) {
                const payloadAtI = receivingPayload.at(i) as CommandParameter
                NoOfChars = payloadAtI.NoOfBytes * 2

                //convert the payload to ascii if command 24 comes
                const currentPayloadDescription =
                  props.currentCommandDictionary.CommandEnum == 24
                    ? hexStringToASCII(
                        rawCommand.current.slice(6, rawCommand.current.length),
                      )
                    : payloadAtI.Description

                commandBytes.current.push({
                  Value: rawCommand.current.slice(
                    currentStart,
                    currentStart + NoOfChars,
                  ),
                  Description: currentPayloadDescription,
                  Color: byteColor.current[i % 2 == 0 ? 3 : 4],
                })
                currentStart += NoOfChars
              }
            }

            break
          }
        }
      } else if (props.log.includes('timed out')) {
        setComponentIsATroubleshoot(true)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.log],
  )

  return (
    <>
      <div className="">
        <p className="inline">
          {('0' + props.date.getDate().toString()).slice(-2) +
            '/' +
            ('0' + (props.date.getMonth() + 1).toString()).slice(-2) +
            '/' +
            props.date.getFullYear() +
            '|' +
            ('0' + props.date.getHours().toString()).slice(-2) +
            ':' +
            ('0' + props.date.getMinutes().toString()).slice(-2) +
            ':' +
            ('0' + props.date.getSeconds().toString()).slice(-2) +
            ': '}
        </p>

        {componentIsACommand ? (
          <div className="inline ">
            <p className="inline">{stringTo0x.current + '0x'}</p>
            {commandBytes.current.map((byte) => (
              <div
                key={commandBytes.current.indexOf(byte)}
                className={
                  `tooltip tooltip-primary ml-1 inline ${
                    props.lineNumber < 3 ? ' tooltip-left ' : '   '
                  }` + byte.Color
                }
                data-tip={byte.Description}
              >
                <p className="inline break-all">{byte.Value}</p>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="inline">{props.log}</p>
            {componentIsATroubleshoot && (
              <>
                <label
                  className="inline link text-yellow-300"
                  onClick={troubleshoot}
                  htmlFor="my-modal-4"
                >
                  Troubleshoot
                </label>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}
export default LogLineServoCommand
