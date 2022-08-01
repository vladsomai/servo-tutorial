import { useEffect, useState, useRef, useCallback, ReactElement } from 'react'
import Log from './log-window'
import Command from './command-window'
import { Uint8ArrayToString, stringToUint8Array } from '../servo-engine/utils'
import { MotorCommandsDictionary } from '../servo-engine/motor-commands'
import { LogType } from '../components/log-window'
import { MotorAxes, MotorAxisType } from '../servo-engine/motor-axes'
import { Chapter1 } from './ImplementedCommands/1_2'
import SelectAxis from './selectAxis'
import React from 'react'

export type MainWindowProps = {
  currentChapter: number
  currentCommandDictionary: MotorCommandsDictionary
}

const Main = (props: MainWindowProps) => {
  const portSer = useRef<SerialPort | null>(null)
  const isSerialPortClosed = useRef<boolean>(false)
  const reader = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
  const controlPanelToggle = useRef<HTMLInputElement | null>(null)
  const [logs, setLogs] = useState<LogType[]>([])

  const [showControlPanel, setShowControlPanel] = useState<boolean>(true)

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
      LogAction('Connected with baudrate ' + BaudRate.toString() + '!')
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
        if (typeof dataToSend == 'string')
          data = stringToUint8Array(dataToSend.toUpperCase())
        else data = dataToSend
      } catch (err) {
        if (err instanceof Error) {
          LogAction(err!.message)
          writer.releaseLock()
          return
        }

        writer.releaseLock()
        try {
          LogAction(err as string)
        } catch (err) {
          console.log(
            'We could not log this error in the log window because it is not a string, please check the error object below: ',
          )
          console.log(err)
        }
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

  /*
  This function will create a raw command containg an array of unsigned integers that represent the data.
  Parameters to the function are only the axis and the payload, the rest of the bytes will be automatically deduced from the given arguments.

  ############### How the command is constructed ###############
  First byte: Targeted axis of the command
  Second byte: Command for the axis (what action should the axis do?)
  Third byte: Length of the payload
  Payload bytes: arguments that will be applied to the command. Each command has different arguments, in case no arguments are needed you must specify the Third byte as 0x00
  */
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

  const textPayloadInputBox = useRef<HTMLInputElement | null>(null)
  const ping_command = () => {
    if (textPayloadInputBox && textPayloadInputBox.current) {
      const selectedAxis = '' // = getAxisSelection()
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

  let currentCommandLayout: ReactElement = <></>
  if (
    props.currentCommandDictionary.CommandEnum == 0 ||
    props.currentCommandDictionary.CommandEnum == 1
  )
    currentCommandLayout = (
      <>
        <Chapter1
          {...props}
          getAxisSelection={getAxisSelection}
          sendDataToSerialPort={sendDataToSerialPort}
          LogAction={LogAction}
          constructCommand={constructCommand}
        >
          <SelectAxis LogAction={LogAction} ref={axisSelection} />
        </Chapter1>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 2)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 3)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 4)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 5)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 6)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 7)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 8)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 9)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 10)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 11)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 12)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 13)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 14)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 15)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 16)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 17)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 18)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 19)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 20)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 21)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 22)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 23)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 24)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 25)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 26)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 27)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 28)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 29)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 30)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  //#region PING_COMMAND
  else if (props.currentCommandDictionary.CommandEnum == 31)
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
  else if (props.currentCommandDictionary.CommandEnum == 32)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 33)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 254)
    currentCommandLayout = (
      <>
        <p className="text-6xl text-center">
          Command {props.currentCommandDictionary.CommandEnum} is not
          implemented
        </p>
      </>
    )
  return (
    <>
      <div className="grid w-full card bg-base-300 rounded-box h-screen-80 overflow-show-scroll px-5 pt-10 relative">
        <div className="form-control  absolute top-4 right-4">
          <label className="label cursor-pointer flex flex-col-reverse">
            <span className="label-text">Control panel</span>
            <input
              ref={controlPanelToggle}
              type="checkbox"
              className="toggle"
              checked={showControlPanel}
              onChange={() => {
                if (controlPanelToggle && controlPanelToggle.current) {
                  setShowControlPanel(!showControlPanel)
                }
              }}
            />
          </label>
        </div>
        <Command
          {...props}
          sendDataToSerialPort={sendDataToSerialPort}
          connectToSerialPort={connectToSerialPort}
          disconnectFromSerialPort={disconnectFromSerialPort}
          showControlPanel={showControlPanel}
        >
          {currentCommandLayout}
        </Command>
        <Log logs={logs} />
      </div>
    </>
  )
}
export default Main
