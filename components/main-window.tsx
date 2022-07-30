import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
  ReactElement,
} from 'react'
import { GlobalContext, GlobalStateType } from '../pages/_app'
import Log from './log-window'
import Command from './command-window'
import { Uint8ArrayToString, stringToUint8Array } from '../servo-engine/utils'
import { MotorCommandsDictionary } from '../servo-engine/motor-commands'
import { LogType } from '../components/log-window'
import { MotorAxes, MotorAxisType } from '../servo-engine/motor-axes'

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
  const sendDataToSerialPort = async (dataToSend: string | Uint8Array) => {
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
        if (typeof dataToSend == 'string') data = stringToUint8Array(dataToSend)
        else data = dataToSend
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

  const constructCommand = (_axis: string, _payload: string): Uint8Array => {
    //allocate the raw array
    const axisSize = 1
    const commandSize = 1
    const lengthByteSize = 1
    const initialRawBytes = new Uint8Array(
      axisSize + commandSize + lengthByteSize,
    )

    //get value of axis
    let axisCode = 0
    for (const motorAxis of MotorAxes) {
      if (motorAxis.AxisName == _axis) axisCode = motorAxis.AxisCode
    }
    initialRawBytes.set([axisCode])

    //get value of command_id
    initialRawBytes.set([props.currentCommandDictionary.CommandEnum], 1)

    //get hex value of payload

    let payload = stringToUint8Array(_payload)

    initialRawBytes.set([payload.length], 2)

    const finalRawBytes = new Uint8Array(
      initialRawBytes.length + payload.length,
    )

    //introduce the initial bytes(axis,command,length)
    finalRawBytes.set(initialRawBytes)

    //introduce the final bytes(payload)
    finalRawBytes.set(payload, initialRawBytes.length)

    return finalRawBytes
  }

  const axisSelection = useRef<HTMLSelectElement | null>(null)
  const getAxisSelection = (): string => {
    if (axisSelection && axisSelection.current) {
      let selectedAxis =
        axisSelection.current.options[axisSelection.current.selectedIndex].text

      if (selectedAxis == 'Select axis') {
        LogAction('You must select an axis!')
        return ''
      }
      return selectedAxis
    }
    return ''
  }

  //#region DISABLE_MOSFETS | ENABLE_MOSFETS
  const disable_enable_MOSFETS = () => {
    const selectedAxis = getAxisSelection()
    if (selectedAxis == '') return

    const rawData = constructCommand(selectedAxis, '')

    sendDataToSerialPort(rawData)
  }
  //#endregion

  //#region PING_COMMAND
  const textPayloadInputBox = useRef<HTMLInputElement | null>(null)
  const ping_command = () => {
    if (textPayloadInputBox && textPayloadInputBox.current) {
      const selectedAxis = getAxisSelection()
      if (selectedAxis == '') return

      const textPayload: string = textPayloadInputBox.current.value
      if (textPayload.length != 10) {
        LogAction('Your payload must be exactly 10 characters!')
        return
      }

      let payload = ''
      for (let i = 0; i < textPayload.length; i++) {
        payload += textPayload[i].charCodeAt(0).toString(16)
      }

      const rawData = constructCommand(selectedAxis, payload.toUpperCase())
      sendDataToSerialPort(rawData)
    }
  }
  //#endregion

  let currentCommandLayout: ReactElement = <></>
  //#region DISABLE_MOSFETS | ENABLE_MOSFETS
  if (props.currentChapter == 1 || props.currentChapter == 2)
    currentCommandLayout = (
      <>
        <div className="w-full text-center mb-5">
          {props.currentChapter == 1 ? (
            <p className="mb-2">Let&apos;s disable the MOSFETS.</p>
          ) : (
            <p className="mb-2">Let&apos;s enable the MOSFETS.</p>
          )}

          <div className="flex justify-center">
            <select
              ref={axisSelection}
              className="select select-bordered select-sm w-full max-w-xs mr-8"
              defaultValue="Select axis"
            >
              <option disabled>Select axis</option>
              {MotorAxes.map((axis: MotorAxisType) => (
                <option key={axis.AxisCode}>{axis.AxisName}</option>
              ))}
            </select>
            <div
              className="tooltip"
              data-tip={
                props.currentChapter == 1
                  ? 'This button will create a raw command that disables the MOSFETS on the specified axis'
                  : 'This button will create a raw command that enables the MOSFETS on the specified axis'
              }
            >
              <button
                className="btn btn-primary btn-sm"
                onClick={disable_enable_MOSFETS}
              >
                {props.currentChapter == 1
                  ? 'DISABLE MOSFETS'
                  : 'ENABLE MOSFETS'}
              </button>
            </div>
          </div>
        </div>
      </>
    )
  //#endregion
  else if (props.currentChapter == 3) currentCommandLayout = <></>
  else if (props.currentChapter == 4) currentCommandLayout = <></>
  else if (props.currentChapter == 5) currentCommandLayout = <></>
  else if (props.currentChapter == 6) currentCommandLayout = <></>
  else if (props.currentChapter == 7) currentCommandLayout = <></>
  else if (props.currentChapter == 8) currentCommandLayout = <></>
  else if (props.currentChapter == 9) currentCommandLayout = <></>
  else if (props.currentChapter == 10) currentCommandLayout = <></>
  else if (props.currentChapter == 11) currentCommandLayout = <></>
  else if (props.currentChapter == 12) currentCommandLayout = <></>
  else if (props.currentChapter == 13) currentCommandLayout = <></>
  else if (props.currentChapter == 14) currentCommandLayout = <></>
  else if (props.currentChapter == 15) currentCommandLayout = <></>
  else if (props.currentChapter == 16) currentCommandLayout = <></>
  else if (props.currentChapter == 17) currentCommandLayout = <></>
  else if (props.currentChapter == 18) currentCommandLayout = <></>
  else if (props.currentChapter == 19) currentCommandLayout = <></>
  else if (props.currentChapter == 20) currentCommandLayout = <></>
  else if (props.currentChapter == 21) currentCommandLayout = <></>
  else if (props.currentChapter == 22) currentCommandLayout = <></>
  else if (props.currentChapter == 23) currentCommandLayout = <></>
  else if (props.currentChapter == 24) currentCommandLayout = <></>
  else if (props.currentChapter == 25) currentCommandLayout = <></>
  else if (props.currentChapter == 26) currentCommandLayout = <></>
  else if (props.currentChapter == 27) currentCommandLayout = <></>
  else if (props.currentChapter == 28) currentCommandLayout = <></>
  else if (props.currentChapter == 29) currentCommandLayout = <></>
  else if (props.currentChapter == 30) currentCommandLayout = <></>
  else if (props.currentChapter == 31) currentCommandLayout = <></>
  //#region PING_COMMAND
  else if (props.currentChapter == 32)
    currentCommandLayout = (
      <>
        <div className="w-full text-center mb-5">
          <div className="flex justify-center">
            <select
              ref={axisSelection}
              className="select select-bordered select-sm w-full max-w-xs mr-8"
              defaultValue="Select axis"
            >
              <option disabled>Select axis</option>
              {MotorAxes.map((axis: MotorAxisType) => (
                <option key={axis.AxisCode}>{axis.AxisName}</option>
              ))}
            </select>
            <input
              ref={textPayloadInputBox}
              type="text"
              placeholder="Enter text e.g. 0123456789"
              className="input input-bordered basis-1/2  max-w-xs input-sm mr-8"
              defaultValue={'0123456789'}
            />
            <div
              className="tooltip"
              data-tip="Test your connection to the motor using this button!"
            >
              <button className="btn btn-primary btn-sm" onClick={ping_command}>
                PING
              </button>
            </div>
          </div>
        </div>
      </>
    )
  //#endregion PING_COMMAND
  else if (props.currentChapter == 33) currentCommandLayout = <></>
  else if (props.currentChapter == 34) currentCommandLayout = <></>
  else if (props.currentChapter == 35) currentCommandLayout = <></>
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
        <Command {...props} sendDataToSerialPort={sendDataToSerialPort}>
          {currentCommandLayout}
        </Command>
        <Log logs={logs} />
      </div>
    </>
  )
}
export default Main
