import { useEffect, useRef, useState } from 'react'
import { LogType } from './log-window'
import { MainWindowProps } from './main-window'

export interface LogLineServoCommandType extends LogType, MainWindowProps {}
export interface CommandBytesType {
  Value: string
  Color: string
  Description: string
}

const LogLineServoCommand = (props: LogLineServoCommandType) => {
  const byteColor = useRef<string[]>([
    ' text-blue-500',
    ' text-red-500',
    ' text-yellow-500',
    ' text-green-500',
  ])
  const byteDescription = useRef<string[]>([
    'This is the axis byte!',
    'This is the command byte!',
    'This is the length byte, it represents the payload length.',
    'The rest of the bytes are the payload bytes!',
  ])

  const [componentIsACommand, setComponentIsACommand] = useState<boolean>(false)
  const stringTo0x = useRef<string>('')
  const rawCommand = useRef<string>('')
  const commandBytes = useRef<CommandBytesType[]>([])

  useEffect(() => {
    if (props.log.includes('0x')) {
      setComponentIsACommand(true)
      const indexOf0x = props.log.indexOf('0x')
      stringTo0x.current = props.log.slice(0, indexOf0x)

      rawCommand.current = props.log.slice(indexOf0x + 2, props.log.length)

      for (let i = 0; i < rawCommand.current.length; i += 2) {
        if (i == 0) {
          commandBytes.current.push({
            Value: rawCommand.current.slice(0, 2),
            Description: byteDescription.current[0],
            Color: byteColor.current[0],
          })
        } else if (i == 2) {
          commandBytes.current.push({
            Value: rawCommand.current.slice(2, 4),
            Description: byteDescription.current[1],
            Color: byteColor.current[1],
          })
        } else if (i == 4) {
          commandBytes.current.push({
            Value: rawCommand.current.slice(4, 6),
            Description: byteDescription.current[2],
            Color: byteColor.current[2],
          })
        } else {
          commandBytes.current.push({
            Value: rawCommand.current.slice(6, rawCommand.current.length),
            Description: byteDescription.current[3],
            Color: byteColor.current[3],
          })
          break
        }
      }
    }
  }, [props.log])

  return (
    <>
      <div className="w-11/12">
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
          <div className="inline">
            <p className='inline'>{stringTo0x.current + '0x'}</p>
            {commandBytes.current.map((byte) => (
              <div
                key={commandBytes.current.indexOf(byte)}
                className={
                  'tooltip ml-2 tooltip-secondary inline' + byte.Color
                }
                data-tip={byte.Description}
              >
                <p className="inline">{byte.Value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className='inline'>{props.log}</p>
        )}
      </div>
    </>
  )
}
export default LogLineServoCommand
