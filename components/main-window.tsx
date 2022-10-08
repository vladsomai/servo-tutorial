import { useEffect, useState, useRef, useCallback, ReactElement } from 'react'
import Log from './log-window'
import Command from './command-window'
import { Uint8ArrayToString, stringToUint8Array } from '../servo-engine/utils'
import { MotorCommandsDictionary } from '../servo-engine/motor-commands'
import { LogType } from '../components/log-window'
import { MotorAxes } from '../servo-engine/motor-axes'
import { Command1 } from './ImplementedCommands/0_1'
import { Command31 } from './ImplementedCommands/31'
import SelectAxis from './selectAxis'
import React from 'react'
import { Command10 } from './ImplementedCommands/10'
import { Command8 } from './ImplementedCommands/8'
import { Command4 } from './ImplementedCommands/4'
import { Command2 } from './ImplementedCommands/2'
import { Command7 } from './ImplementedCommands/7'
import { Command6 } from './ImplementedCommands/6'
import { Command9 } from './ImplementedCommands/9'
import { Command11 } from './ImplementedCommands/11'
import { Command12 } from './ImplementedCommands/12'
import { Command13 } from './ImplementedCommands/13'
import { Command15 } from './ImplementedCommands/15'
import { Command16 } from './ImplementedCommands/16'
import { Command17 } from './ImplementedCommands/17'
import { Command18 } from './ImplementedCommands/18'
import { Command20 } from './ImplementedCommands/20'
import { Command22 } from './ImplementedCommands/22'
import { Command23 } from './ImplementedCommands/23'
import { Command24 } from './ImplementedCommands/24'
import { Command25 } from './ImplementedCommands/25'
import { Command27 } from './ImplementedCommands/27'
import { Command33 } from './ImplementedCommands/33'
import { Command254 } from './ImplementedCommands/254'
import { Command32 } from './ImplementedCommands/32'
import { Command30 } from './ImplementedCommands/30'
import { Command28 } from './ImplementedCommands/28'
import { Command3 } from './ImplementedCommands/3'
import { Command5 } from './ImplementedCommands/5'
import { Command14 } from './ImplementedCommands/14'
import { Command19 } from './ImplementedCommands/19'
import { Command26 } from './ImplementedCommands/26'
import { Command29, MoveCommand } from './ImplementedCommands/29'
import { CommandPayload } from './log-line-servo-command'
import { Command21 } from './ImplementedCommands/21'
import { animated, useTransition } from '@react-spring/web'

export type MainWindowProps = {
  currentChapter: number
  currentCommandDictionary: MotorCommandsDictionary
}

const Main = (props: MainWindowProps) => {
  const portSer = useRef<SerialPort | null>(null)
  const reader = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
  const [logs, setLogs] = useState<LogType[]>([])
  const currentCommandRecvLength = useRef<number>(0)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [axisSelectionValue, setAxisSelectionValue] = useState<string>(
    'All axes',
  )
  const timerHandle = useRef<NodeJS.Timeout>()
  const receivedPartial = useRef<boolean>(false)
  const partialData = useRef<string>('')

  //State is lifted up from command 29 to save the state between chapter change
  const [MoveCommands, setMoveCommands] = useState<MoveCommand[]>([])

  const [master_time_start, setMaster_time_start] = useState<number>(0)
  const setMaster_time_startWrapper = (time: number) =>
    setMaster_time_start(time)
  const lineNumber = useRef<number>(0)
  const LogAction = (log: string): void => {
    lineNumber.current++
    setLogs((prev) => [
      ...prev,
      { lineNumber: lineNumber.current, date: new Date(), log: log },
    ])
  }

  const clearLogWindow = () => {
    lineNumber.current = 0
    setLogs([])
  }

  const connectToSerialPort = async (BaudRate: number = 230400) => {
    try {
      if (portSer.current) {
        LogAction(
          'You are trying to open a new serial port, we will close the current one for you.',
        )
        disconnectFromSerialPort()
      }
      portSer.current = await navigator.serial.requestPort()
      await portSer.current.open({ baudRate: BaudRate })
      readDataFromSerialPortUntilClosed()
      setIsConnected(true)
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
    }
  }, [])

  useEffect(() => {
    currentCommandRecvLength.current =
      props.currentCommandDictionary.ReceiveLength
  }, [props.currentCommandDictionary])

  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnectFromSerialPort()
      }
    }
  }, [disconnectFromSerialPort, isConnected])

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
    if (portSer && portSer.current && portSer.current.writable) {
      const writer = portSer.current.writable.getWriter()

      let data: Uint8Array = new Uint8Array([])
      if (typeof dataToSend == 'string') {
        data = stringToUint8Array(dataToSend.toUpperCase())
        if (data.length == 0) {
          LogAction(
            'Your message has an invalid length, the number of bytes are not correct.',
          )
          return
        }
      } else data = dataToSend

      let hexString = Uint8ArrayToString(data)
      await writer.write(data)

      LogAction('Sent: 0x' + hexString.toUpperCase())

      timerHandle.current = setTimeout(() => {
        LogAction('The command timed out.')
      }, 1000)

      writer.releaseLock()
    } else {
      LogAction('Sending data is not possible, you must connect first!')
    }
  }

  const readDataFromSerialPortUntilClosed = async () => {
    if (portSer && portSer.current) {
      if (portSer.current.readable) {
        reader.current = await portSer.current.readable.getReader()

        if (reader && reader.current) {
          try {
            while (true) {
              if (portSer.current != null && portSer.current.readable) {
                const { value, done } = await reader.current!.read()
                if (done) {
                  LogAction('Reader is now closed!')
                  reader.current.releaseLock()
                  break
                } else {
                  clearTimeout(timerHandle.current)
                  const receivedBytes = Uint8ArrayToString(value)
                  if (
                    receivedBytes.length <
                    currentCommandRecvLength.current * 2
                  ) {
                    if (receivedPartial.current) {
                      LogAction(
                        'Received: 0x' + partialData.current + receivedBytes,
                      )
                      receivedPartial.current = false
                    } else {
                      partialData.current = receivedBytes
                      receivedPartial.current = true
                    }
                  } else {
                    LogAction('Received: 0x' + receivedBytes)
                  }
                }
              }
            }
          } catch (err) {
            if (err instanceof Error) {
              LogAction(err!.message)
              reader.current.releaseLock()
              return
            }
            reader.current.releaseLock()
            console.log(err)
            return
          } finally {
            LogAction('Waiting for the serial port to disconnect..')
            await portSer.current.close()
            setIsConnected(false)
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

  const getAxisSelection = (): string => {
    return axisSelectionValue
  }

  let currentCommandLayout: ReactElement = <></>
  let currentCommandPayload: CommandPayload = {
    SendingPayload: [],
    ReceivingPayload: [],
  }
  if (
    props.currentCommandDictionary.CommandEnum == 0 ||
    props.currentCommandDictionary.CommandEnum == 1
  )
    currentCommandLayout = (
      <>
        <Command1
          {...props}
          getAxisSelection={getAxisSelection}
          sendDataToSerialPort={sendDataToSerialPort}
          LogAction={LogAction}
          constructCommand={constructCommand}
        >
          <SelectAxis
            LogAction={LogAction}
            axisSelectionValue={axisSelectionValue}
            setAxisSelectionValue={setAxisSelectionValue}
          />
        </Command1>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 2) {
    currentCommandPayload.SendingPayload.push({
      Description: 'Position bytes',
      NoOfBytes: 4,
    })
    currentCommandPayload.SendingPayload.push({
      Description: 'Time bytes',
      NoOfBytes: 4,
    })
    currentCommandLayout = (
      <>
        <Command2
          {...props}
          getAxisSelection={getAxisSelection}
          sendDataToSerialPort={sendDataToSerialPort}
          LogAction={LogAction}
          constructCommand={constructCommand}
        >
          <SelectAxis
            LogAction={LogAction}
            axisSelectionValue={axisSelectionValue}
            setAxisSelectionValue={setAxisSelectionValue}
          />
        </Command2>
      </>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 3) {
    currentCommandPayload.SendingPayload.push({
      Description: 'Max velocity',
      NoOfBytes: 4,
    })
    currentCommandLayout = (
      <>
        <Command3
          {...props}
          getAxisSelection={getAxisSelection}
          sendDataToSerialPort={sendDataToSerialPort}
          LogAction={LogAction}
          constructCommand={constructCommand}
        >
          <SelectAxis
            LogAction={LogAction}
            axisSelectionValue={axisSelectionValue}
            setAxisSelectionValue={setAxisSelectionValue}
          />
        </Command3>
      </>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 4) {
    currentCommandPayload.SendingPayload.push({
      Description: 'Position bytes',
      NoOfBytes: 4,
    })
    currentCommandPayload.SendingPayload.push({
      Description: 'Time bytes',
      NoOfBytes: 4,
    })
    currentCommandLayout = (
      <>
        <Command4
          {...props}
          getAxisSelection={getAxisSelection}
          sendDataToSerialPort={sendDataToSerialPort}
          LogAction={LogAction}
          constructCommand={constructCommand}
        >
          <SelectAxis
            LogAction={LogAction}
            axisSelectionValue={axisSelectionValue}
            setAxisSelectionValue={setAxisSelectionValue}
          />
        </Command4>
      </>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 5) {
    currentCommandPayload.SendingPayload.push({
      Description: 'Max acceleration bytes',
      NoOfBytes: 4,
    })
    currentCommandLayout = (
      <>
        <Command5
          {...props}
          getAxisSelection={getAxisSelection}
          sendDataToSerialPort={sendDataToSerialPort}
          LogAction={LogAction}
          constructCommand={constructCommand}
        >
          <SelectAxis
            LogAction={LogAction}
            axisSelectionValue={axisSelectionValue}
            setAxisSelectionValue={setAxisSelectionValue}
          />
        </Command5>
      </>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 6)
    currentCommandLayout = (
      <Command6
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command6>
    )
  else if (props.currentCommandDictionary.CommandEnum == 7) {
    currentCommandLayout = (
      <Command7
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command7>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 8)
    currentCommandLayout = (
      <>
        <Command8
          {...props}
          getAxisSelection={getAxisSelection}
          sendDataToSerialPort={sendDataToSerialPort}
          LogAction={LogAction}
          constructCommand={constructCommand}
          master_time_start={master_time_start}
          setMaster_time_start={setMaster_time_startWrapper}
        >
          <SelectAxis
            LogAction={LogAction}
            axisSelectionValue={axisSelectionValue}
            setAxisSelectionValue={setAxisSelectionValue}
          />
        </Command8>
      </>
    )
  else if (props.currentCommandDictionary.CommandEnum == 9) {
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Current absolute time',
      NoOfBytes: 6,
    })
    currentCommandLayout = (
      <Command9
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command9>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 10) {
    currentCommandPayload.SendingPayload.push({
      Description: 'Absolute time bytes',
      NoOfBytes: 6,
    })

    currentCommandPayload.ReceivingPayload.push({
      Description: 'Error difference',
      NoOfBytes: 4,
    })

    currentCommandPayload.ReceivingPayload.push({
      Description: 'RCC-ICSCR register',
      NoOfBytes: 2,
    })
    currentCommandLayout = (
      <>
        <Command10
          {...props}
          getAxisSelection={getAxisSelection}
          sendDataToSerialPort={sendDataToSerialPort}
          LogAction={LogAction}
          constructCommand={constructCommand}
          master_time_start={master_time_start}
          setMaster_time_start={setMaster_time_startWrapper}
        >
          <SelectAxis
            LogAction={LogAction}
            axisSelectionValue={axisSelectionValue}
            setAxisSelectionValue={setAxisSelectionValue}
          />
        </Command10>
      </>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 11) {
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Queue size',
      NoOfBytes: 1,
    })
    currentCommandLayout = (
      <Command11
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command11>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 12)
    currentCommandLayout = (
      <Command12
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command12>
    )
  else if (props.currentCommandDictionary.CommandEnum == 13)
    currentCommandLayout = (
      <Command13
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command13>
    )
  else if (props.currentCommandDictionary.CommandEnum == 14) {
    currentCommandPayload.SendingPayload.push({
      Description: 'Position bytes',
      NoOfBytes: 4,
    })
    currentCommandPayload.SendingPayload.push({
      Description: 'Time bytes',
      NoOfBytes: 4,
    })
    currentCommandLayout = (
      <Command14
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command14>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 15) {
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Current position bytes',
      NoOfBytes: 4,
    })
    currentCommandLayout = (
      <Command15
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command15>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 16) {
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Status',
      NoOfBytes: 1,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Fatal error code',
      NoOfBytes: 1,
    })
    currentCommandLayout = (
      <Command16
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command16>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 17)
    currentCommandLayout = (
      <Command17
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command17>
    )
  else if (props.currentCommandDictionary.CommandEnum == 18) {
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Update frequency',
      NoOfBytes: 4,
    })
    currentCommandLayout = (
      <Command18
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command18>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 19) {
    currentCommandPayload.SendingPayload.push({
      Description: 'Acceleration bytes',
      NoOfBytes: 4,
    })
    currentCommandPayload.SendingPayload.push({
      Description: 'Time bytes',
      NoOfBytes: 4,
    })
    currentCommandLayout = (
      <Command19
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command19>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 20) {
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Unique ID bytes',
      NoOfBytes: 8,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Alias byte',
      NoOfBytes: 1,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'CRC32 bytes',
      NoOfBytes: 4,
    })
    currentCommandLayout = (
      <Command20
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command20>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 21) {
    currentCommandPayload.SendingPayload.push({
      Description: 'Unique ID',
      NoOfBytes: 8,
    })
    currentCommandPayload.SendingPayload.push({
      Description: 'Alias',
      NoOfBytes: 1,
    })
    currentCommandLayout = (
      <Command21
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command21>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 22) {
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Product code',
      NoOfBytes: 1,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'FW compatibility code',
      NoOfBytes: 1,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'HW version',
      NoOfBytes: 3,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Serial Number',
      NoOfBytes: 4,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Unique ID',
      NoOfBytes: 8,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Not used',
      NoOfBytes: 4,
    })
    currentCommandLayout = (
      <Command22
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command22>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 23)
    currentCommandLayout = (
      <Command23
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command23>
    )
  else if (props.currentCommandDictionary.CommandEnum == 24) {
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Convert to ASCII string',
      NoOfBytes: 11,
    })
    currentCommandLayout = (
      <Command24
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command24>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 25) {
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Dev no.',
      NoOfBytes: 1,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Patch version',
      NoOfBytes: 1,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Minor version',
      NoOfBytes: 1,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Major version',
      NoOfBytes: 1,
    })
    currentCommandLayout = (
      <Command25
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command25>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 26) {
    currentCommandPayload.SendingPayload.push({
      Description: 'Velocity bytes',
      NoOfBytes: 4,
    })
    currentCommandPayload.SendingPayload.push({
      Description: 'Time bytes',
      NoOfBytes: 4,
    })
    currentCommandLayout = (
      <Command26
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command26>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 27)
    currentCommandLayout = (
      <Command27
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command27>
    )
  else if (props.currentCommandDictionary.CommandEnum == 28)
    currentCommandLayout = (
      <Command28
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command28>
    )
  else if (props.currentCommandDictionary.CommandEnum == 29) {
    currentCommandPayload.SendingPayload.push({
      Description: 'Number of movement commands',
      NoOfBytes: 1,
    })

    currentCommandPayload.SendingPayload.push({
      Description: 'Movement types',
      NoOfBytes: 4,
    })

    for (let i = 0; i < MoveCommands.length; i++) {
      currentCommandPayload.SendingPayload.push({
        Description: `${MoveCommands[i].MovementType.Name} for command ${
          i + 1
        }`,
        NoOfBytes: 4,
      })
      currentCommandPayload.SendingPayload.push({
        Description: `Time for command ${i + 1}`,
        NoOfBytes: 4,
      })
    }

    currentCommandLayout = (
      <Command29
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
        MoveCommands={MoveCommands}
        setMoveCommands={setMoveCommands}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command29>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 30) {
    currentCommandPayload.SendingPayload.push({
      Description: 'Lower limit',
      NoOfBytes: 4,
    })

    currentCommandPayload.SendingPayload.push({
      Description: 'Upper limit',
      NoOfBytes: 4,
    })
    currentCommandLayout = (
      <Command30
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command30>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 31)
    currentCommandLayout = (
      <Command31
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command31>
    )
  else if (props.currentCommandDictionary.CommandEnum == 32) {
    currentCommandPayload.SendingPayload.push({
      Description: 'Gathering',
      NoOfBytes: 1,
    })
    currentCommandLayout = (
      <Command32
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command32>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 33) {
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Max val. HS1',
      NoOfBytes: 2,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Max val. HS2',
      NoOfBytes: 2,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Max val. HS3',
      NoOfBytes: 2,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Min val. HS1',
      NoOfBytes: 2,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Min val. HS2',
      NoOfBytes: 2,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Min val. HS3',
      NoOfBytes: 2,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Sum val. HS1',
      NoOfBytes: 8,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Sum val. HS2',
      NoOfBytes: 8,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'Sum val. HS3',
      NoOfBytes: 8,
    })
    currentCommandPayload.ReceivingPayload.push({
      Description: 'No. of measurements HS123',
      NoOfBytes: 4,
    })
    currentCommandLayout = (
      <Command33
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command33>
    )
  } else if (props.currentCommandDictionary.CommandEnum == 254)
    currentCommandLayout = (
      <Command254
        {...props}
        getAxisSelection={getAxisSelection}
        sendDataToSerialPort={sendDataToSerialPort}
        LogAction={LogAction}
        constructCommand={constructCommand}
      >
        <SelectAxis
          LogAction={LogAction}
          axisSelectionValue={axisSelectionValue}
          setAxisSelectionValue={setAxisSelectionValue}
        />
      </Command254>
    )

  return (
    <>
      <div className="flex w-full bg-base-300 h-[85vh] rounded-box overflow-auto" >
        <Command
          {...props}
          sendDataToSerialPort={sendDataToSerialPort}
          connectToSerialPort={connectToSerialPort}
          disconnectFromSerialPort={disconnectFromSerialPort}
          isConnected={isConnected}
          >
          {currentCommandLayout}
        </Command>

        {props.currentCommandDictionary.CommandEnum === 100 ? null : (
          <Log
            logs={logs}
            mainWindow={props}
            clearLogWindow={clearLogWindow}
            CommandPayload={currentCommandPayload}
          />
        )}
      </div>
    </>
  )
}
export default Main
