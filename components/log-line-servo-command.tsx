import { useEffect, useRef, useState, SyntheticEvent } from 'react'
import { LogType } from './log-window'
import { MainWindowProps } from './main-window'

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
  const byteColor = useRef<string[]>([
    ' text-blue-500',
    ' text-red-500',
    ' text-yellow-500',
    ' text-green-500',
    ' text-green-600',
  ])
  const byteDescriptionSend = useRef<string[]>([
    'Targeted axis byte',
    'Command byte',
    'Length byte',
    'Payload bytes!',
  ])

  const byteDescriptionReceived = useRef<string[]>([
    'Sender ID (R)',
    'No. of params received',
    'Length byte',
    'Payload bytes!',
  ])

  const [componentIsACommand, setComponentIsACommand] = useState<boolean>(false)
  const stringTo0x = useRef<string>('')
  const rawCommand = useRef<string>('')
  const commandBytes = useRef<CommandBytesType[]>([])

  useEffect(
    (
      sendingPayload = props.SendingPayload,
      receivingPayload = props.ReceivingPayload,
    ) => {
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
                NoOfChars = receivingPayload.at(i)!.NoOfBytes * 2
                commandBytes.current.push({
                  Value: rawCommand.current.slice(
                    currentStart,
                    currentStart + NoOfChars,
                  ),
                  Description: receivingPayload.at(i)!.Description,
                  Color: byteColor.current[i % 2 == 0 ? 3 : 4],
                })
                currentStart += NoOfChars
              }
            }

            break
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.log],
  )

  return (
    <>
      <div className="">
        <p className="inline">
          {props.date.getDate() +
            '/' +
            (props.date.getMonth() + 1) +
            '/' +
            props.date.getFullYear() +
            '|' +
            props.date.getHours() +
            ':' +
            props.date.getMinutes() +
            ':' +
            props.date.getSeconds() +
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
                    props.lineNumber < 3 ? ' tooltip-left ' : '  '
                  }` + byte.Color
                }
                data-tip={byte.Description}
              >
                <p className="inline break-all">{byte.Value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="inline">{props.log}</p>
        )}
      </div>
    </>
  )
}
export default LogLineServoCommand
