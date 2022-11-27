import { useEffect, useRef, useState, MutableRefObject } from 'react'
import {
  getDisplayFormat,
  getNoOfBytesFromDescription,
  stringToUint8Array,
} from '../servo-engine/utils'
import { LogType } from './log-window'
import { MainWindowProps } from './main-window'
import { useContext } from 'react'
import { GlobalContext } from '../pages/_app'
import {
  troubleshootConnection,
  troubleshootIncompleteResponse,
} from './modalComponents'
import { Tooltip } from 'flowbite-react'

export interface LogLineServoCommandType extends LogType, MainWindowProps {
  currentCommand: MutableRefObject<number>
}

export interface CommandBytesType {
  Value: string
  Color: string
  Description: string
}

export interface CommandParameter {
  Description: string
  NoOfBytes: number
}

enum TroubleshootType {
  connection,
  incompleteMessage,
}

const LogLineServoCommand = (props: LogLineServoCommandType) => {
  const globalContext = useContext(GlobalContext)

  const troubleshootType = useRef<TroubleshootType>(TroubleshootType.connection)

  const troubleshoot = () => {
    switch (troubleshootType.current) {
      case TroubleshootType.connection:
        globalContext.modal.setTitle('Troubleshooting guide')
        globalContext.modal.setDescription(troubleshootConnection)
        break
      case TroubleshootType.incompleteMessage:
        globalContext.modal.setTitle('Troubleshooting guide')
        globalContext.modal.setDescription(troubleshootIncompleteResponse)
        break
      default:
        break
    }
  }
  const byteColor = [
    ' text-violet-400',
    ' text-violet-500',
    ' text-violet-400',
    ' text-blue-400',
    ' text-blue-500',
  ]
  const byteDescriptionSend = [
    'Targeted axis byte',
    'Command byte',
    'Length byte',
    'Payload bytes!',
  ]

  const byteDescriptionReceived = [
    'Sender ID (R)',
    'Response status',
    'Length byte',
    'Payload bytes!',
  ]

  const [componentIsACommand, setComponentIsACommand] = useState<boolean>(false)
  const [componentIsATroubleshoot, setComponentIsATroubleshoot] = useState<
    boolean
  >(false)

  const commandBytes = useRef<CommandBytesType[]>([])
  const stringTo0x = useRef('')

  useEffect(() => {
    setComponentIsACommand(false)
    setComponentIsATroubleshoot(false)
    const isSendCommand = props.log.includes('Sent') ? true : false
    const isReceiveCommand = props.log.includes('Received') ? true : false
    let sendingPayload: CommandParameter[] = []
    let receivingPayload: CommandParameter[] = []

    if (isSendCommand || isReceiveCommand) {
      setComponentIsACommand(true)
      const indexOf0x = props.log.indexOf('0x')
      stringTo0x.current = props.log.slice(0, indexOf0x)

      const rawCommand = props.log.slice(indexOf0x + 2, props.log.length)

      let receiveLength = stringToUint8Array(rawCommand.slice(4, 6))[0]

      if (isSendCommand) {
        props.currentCommand.current = stringToUint8Array(
          rawCommand.slice(2, 4),
        )[0]
      }

      let NoOfBytes = 0
      let currentParameterStart = 6
      let currentParameterEnd = 0
      for (const command of props.MotorCommands.current) {
        if (command.CommandEnum == props.currentCommand.current) {
          if (isSendCommand && typeof command.Input != 'string') {
            for (const input of command.Input) {
              let currentPayloadDescription = input.Description

              NoOfBytes = getNoOfBytesFromDescription(input.Description)
              if (NoOfBytes == 0) {
                //try getting the no of bytes from the receive length
                NoOfBytes = receiveLength
              }

              currentParameterEnd = currentParameterStart + NoOfBytes * 2
              const currentParameter = rawCommand.slice(
                currentParameterStart,
                currentParameterEnd,
              )
              currentParameterStart = currentParameterEnd

              currentPayloadDescription += getDisplayFormat(
                input.TooltipDisplayFormat as string,
                currentParameter,
              )

              sendingPayload.push({
                Description: currentPayloadDescription,
                NoOfBytes: NoOfBytes,
              })
            }
          } else if (isReceiveCommand && typeof command.Output != 'string') {
            for (const output of command.Output) {
              //for command 16
              if (output.Description.includes('Bit')) continue

              let currentPayloadDescription = output.Description

              
              NoOfBytes = getNoOfBytesFromDescription(output.Description)
              if (NoOfBytes == 0) {
                //try getting the no of bytes from the receive length
                NoOfBytes = receiveLength
              }

              currentParameterEnd = currentParameterStart + NoOfBytes * 2
              const currentParameter = rawCommand.slice(
                currentParameterStart,
                currentParameterEnd,
              )
              currentParameterStart = currentParameterEnd

              currentPayloadDescription += getDisplayFormat(
                output.TooltipDisplayFormat as string,
                currentParameter,
              )

              receivingPayload.push({
                Description: currentPayloadDescription,
                NoOfBytes: NoOfBytes,
              })
            }
          }
        }
      }

      for (let i = 0; i < rawCommand.length; i += 2) {
        if (i == 0) {
          commandBytes.current.push({
            Value: rawCommand.slice(0, 2),
            Description: isSendCommand
              ? byteDescriptionSend[0]
              : byteDescriptionReceived[0],
            Color: byteColor[0],
          })
        } else if (i == 2) {
          commandBytes.current.push({
            Value: rawCommand.slice(2, 4),
            Description: isSendCommand
              ? byteDescriptionSend[1]
              : byteDescriptionReceived[1],
            Color: byteColor[1],
          })
        } else if (i == 4) {
          commandBytes.current.push({
            Value: rawCommand.slice(4, 6),
            Description: isSendCommand
              ? byteDescriptionSend[2]
              : byteDescriptionReceived[2],
            Color: byteColor[2],
          })
        } else {
          if (isSendCommand) {
            if (sendingPayload.length == 0) {
              //in case we do not define sending payload in the main-window just print the payload
              commandBytes.current.push({
                Value: rawCommand.slice(6, rawCommand.length),
                Description: byteDescriptionSend[3], //inline "if" is not needed here
                Color: byteColor[3],
              })
            } else {
              let currentStart = 6
              let NoOfChars = 0
              for (let i = 0; i < sendingPayload.length; i++) {
                NoOfChars = sendingPayload.at(i)!.NoOfBytes * 2
                commandBytes.current.push({
                  Value: rawCommand.slice(
                    currentStart,
                    currentStart + NoOfChars,
                  ),
                  Description: sendingPayload.at(i)!.Description,
                  Color: byteColor[i % 2 == 0 ? 3 : 4],
                })
                currentStart += NoOfChars
              }
            }
          } else if (isReceiveCommand) {
            let currentStart = 6 //start from the 6th char in the response
            let NoOfChars = 0
            for (let i = 0; i < receivingPayload.length; i++) {
              const payloadAtI = receivingPayload.at(i) as CommandParameter
              NoOfChars = payloadAtI.NoOfBytes * 2

              commandBytes.current.push({
                Value: rawCommand.slice(currentStart, currentStart + NoOfChars),
                Description: payloadAtI.Description,
                Color: byteColor[i % 2 == 0 ? 3 : 4],
              })
              currentStart += NoOfChars
            }
          }
          break
        }
      }
    } else if (props.log.includes('timed out')) {
      setComponentIsATroubleshoot(true)
      troubleshootType.current = TroubleshootType.connection
    } else if (props.log.includes('incomplete')) {
      setComponentIsATroubleshoot(true)
      troubleshootType.current = TroubleshootType.incompleteMessage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.log])

  return (
    <>
      <div className="inline-block">
        <p className="inline-block mr-1">
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
          <div className="inline">
            <p className="inline-block">{stringTo0x.current + '0x'}</p>
            {commandBytes.current.map((byte) => (
              <div
                className="inline-block ml-1 break-words "
                key={commandBytes.current.indexOf(byte)}
              >
                <Tooltip
                  content={byte.Description}
                  placement="top"
                  className=' w-auto max-w-md bg-[#3abff8] text-slate-800 font-extrabold border-opacity-0 '
                  animation="duration-500"
                  role="tooltip"
                  style='auto'
                >
                  <p
                    className={`inline break-all cursor-pointer ${byte.Color}`}
                  >
                    {byte.Value}
                  </p>
                </Tooltip>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="inline-block">{props.log}</p>
            {componentIsATroubleshoot && (
              <>
                <label
                  className="inline-block link text-yellow-300"
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
