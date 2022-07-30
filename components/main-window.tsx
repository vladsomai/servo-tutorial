import { useEffect, useState, useRef, useCallback, useContext } from 'react'
import { GlobalContext, GlobalStateType } from '../pages/_app'
import Log from './log-window'
import Command from './command-window'
import { Uint8ArrayToString, stringToUint8Array } from '../servo-engine/utils'
import { MotorCommandsDictionary } from '../servo-engine/motor-commands'
import { LogType } from '../components/log-window'

export type MainWindowProps = {
  currentChapter: number
  currentCommandDictionary: MotorCommandsDictionary
}

const Main = (props: MainWindowProps) => {
  const portSer = useRef<SerialPort | null>(null)
  const isSerialPortClosed = useRef<boolean>(false)
  const reader = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
  const [logs, setLogs] = useState<LogType[]>([])

  const logsStaticArr = useRef<LogType[]>([])
  const lineNumber = useRef<number>(0)
  const LogAction = (log: string): void => {
    lineNumber.current++
    logsStaticArr.current = [
      ...logsStaticArr.current,
      { lineNumber: lineNumber.current, date: new Date(), log: log },
    ]

    setLogs(logsStaticArr.current)
  }

  const connectToSerialPort = async (BaudRate: number) => {
    try {
      portSer.current = await navigator.serial.requestPort()
      await portSer.current.open({ baudRate: BaudRate })
      readDataFromSerialPortUntilClosed()
      isSerialPortClosed.current = false
      LogAction('Connected!')
    } catch (err) {
      if (err instanceof Error) {
        LogAction(err!.message)
        return
      } else {
        console.log(err)
        return
      }
    }
  }

  // const disconnectFromSerialPort = async () => {

  const disconnectFromSerialPort = useCallback(async () => {
    if (portSer && portSer.current) {
      try {
        reader.current?.cancel()
      } catch (err) {
        if (err instanceof Error) {
          LogAction(err!.message)
          return
        } else {
          console.log(err)
          return
        }
      }
    } else {
      LogAction('Disconnecting not possible, you must connect first!')
    }
  }, [])

  useEffect(() => {
    return () => {
      if (!isSerialPortClosed.current) disconnectFromSerialPort()
    }
  }, [disconnectFromSerialPort])
  /*This function will take an input like string that represents hexadecimal bytes
    e.g. "410000" , it will send on the serial port the raw binary repr. of that string e.g. [0x41,0,0]
    when sending succeds, the function will output the send bytes on the log windows as a hexa decima string
 */
  const sendDataToSerialPort = async (dataToSend: string) => {
    if (dataToSend.length === 0) {
      LogAction(
        'We know you are impatient dear scholar, but you must enter at least one byte!',
      )
      return
    }
    if (portSer && portSer.current) {
      const writer = portSer.current.writable!.getWriter()

      let data: Uint8Array = new Uint8Array([])
      try {
        data = stringToUint8Array(dataToSend)
      } catch (err) {
        if (err instanceof Error) {
          LogAction(err!.message)
          writer.releaseLock()
          return
        }

        writer.releaseLock()
        console.log(err)
        return
      }

      let hexString = Uint8ArrayToString(data)

      await writer.write(data)
      LogAction('Sent: 0x' + hexString.toUpperCase())
      writer.releaseLock()
    } else {
      LogAction('Sending data not possible, you must connect first!')
    }
  }

  const readDataFromSerialPortUntilClosed = async () => {
    if (portSer && portSer.current) {
      if (portSer.current.readable) {
        reader.current = await portSer.current.readable!.getReader()

        if (reader && reader.current) {
          try {
            while (true) {
              if (portSer.current != null && portSer.current.readable) {
                const { value, done } = await reader.current!.read()
                if (done) {
                  LogAction('Reader is now closed!')
                  reader.current!.releaseLock()
                  break
                } else {
                  LogAction('Received: 0x' + Uint8ArrayToString(value))
                }
              }
            }
          } catch (err) {
            if (err instanceof Error) {
              LogAction(err!.message)
              LogAction('Reader is closed')
              reader.current.releaseLock()
              return
            }

            LogAction('Reader is closed')
            reader.current.releaseLock()
            console.log(err)
            return
          } finally {
            await portSer.current.close()
            isSerialPortClosed.current = true
            portSer.current = null
            LogAction('Disconnected!')
          }
        }
      }
    }
  }

  return (
    <>
      <div className="grid w-full card bg-base-300 rounded-box place-items-center h-screen-80 overflow-show-scroll px-5 pt-10">
        <div className="flex justify-evenly w-full mb-5">
          <div className="tooltip" data-tip="Connect to the serial port!">
            <button
              className="btn btn-success btn-sm"
              onClick={() => {
                connectToSerialPort(230400)
              }}
            >
              Connect
            </button>
          </div>
          <div className="tooltip" data-tip="Disonnect from the serial port!">
            <button
              className="btn btn-error btn-sm"
              onClick={() => {
                disconnectFromSerialPort()
              }}
            >
              Disconnect
            </button>
          </div>
        </div>
        <Command {...props} sendDataToSerialPort={sendDataToSerialPort} />
        <Log logs={logs} />
      </div>
    </>
  )
}
export default Main
