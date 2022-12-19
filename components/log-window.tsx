import { useEffect, useMemo, useRef } from 'react'
import LogLineServoCommand from './log-line-servo-command'
import { MainWindowProps } from './main-window'

export type LogType = {
  lineNumber: number
  date: Date
  log: string
  logError: string
}

const Log = (props: {
  logs: LogType[]
  mainWindow: MainWindowProps
  clearLogWindow: Function
  sendDataToSerialPort: Function
  connectToSerialPort: Function
  disconnectFromSerialPort: Function
  isConnected: boolean
  getAxisCode: number
  constructCommand: (_axis: string, _payload: string) => Uint8Array
}) => {
  const logWindow = useRef<HTMLDivElement | null>(null)
  const currentCommand = useRef<number>(0)

  const disable_enable_MOSFETS = (enable: boolean) => {
    const selectedAxis = props.getAxisCode

    const command = new Uint8Array([selectedAxis, enable ? 1 : 0, 0])

    props.sendDataToSerialPort(command)
  }
  const getStatus = () => {
    const selectedAxis = props.getAxisCode

    const command = new Uint8Array([selectedAxis, 16, 0])

    props.sendDataToSerialPort(command)
  }
  useEffect(() => {
    if (logWindow && logWindow.current) {
      logWindow.current.scrollTop =
        logWindow.current.scrollHeight - logWindow.current.clientHeight
    }
  }, [props.logs])

  return (
    <>
      <div className="rounded-box px-2 py-2 h-full w-6/12 flex flex-col justify-center content-center overflow-auto ">
        <div className=" relative h-16 w-full rounded-t-box rounded-b-none py-5 bg-slate-700 ">
          <div className="w-full flex items-end justify-center absolute bottom-0">
            <div className="w-full flex items-end justify-around">
              {props.isConnected ? (
                <button
                  className="z-10 btn btn-success rounded-b-none btn-sm h-[2.3rem] text-md btn-primary hover:opacity-90 border-0 flex flex-col normal-case"
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
                  className="z-10 btn btn-error btn-sm h-[2.3rem] rounded-b-none text-md hover:opacity-90 flex flex-col normal-case"
                  onClick={() => {
                    props.connectToSerialPort()
                  }}
                >
                  Disconnected
                  <span className="text-[10px] normal-case">
                    Press to connect
                  </span>
                </button>
              )}
              <button
                className="btn btn-xs rounded-b-none border-0 bg-slate-800 tracking-widest z-10 hidden xl:block"
                onClick={() => disable_enable_MOSFETS(false)}
              >
                {'Disable FETS'}
              </button>

              <button
                className="btn btn-xs rounded-b-none border-0 bg-slate-800 tracking-widest z-10 hidden xl:block"
                onClick={() => disable_enable_MOSFETS(true)}
              >
                {'Enable FETS'}
              </button>
              <button
                className="btn btn-xs rounded-b-none border-0 bg-slate-800 tracking-widest z-10 hidden xl:block"
                onClick={() => getStatus()}
              >
                {'Get status'}
              </button>
              <button
                className="btn btn-xs rounded-b-none border-0 bg-slate-800 tracking-widest z-10"
                onClick={() => props.clearLogWindow()}
              >
                {'Clear'}
              </button>
            </div>
          </div>

          <p className="flex justify-center absolute inset-0 top-2">
            <b>Log Window</b>
          </p>
        </div>
        <div
          ref={logWindow}
          className=" bg-slate-800 rounded-b-box h-full px-6 py-3 overflow-auto"
        >
          <div className="flex flex-col justify-center text-justify font-mono w-full">
            {props.logs.map((log: LogType) => {
              return (
                <div className="flex " key={log.lineNumber}>
                  <p className="mr-2 text-gray-500 text-right">
                    {log.lineNumber.toString()}&nbsp;
                  </p>
                  <LogLineServoCommand
                    {...props.mainWindow}
                    {...log}
                    currentCommand={currentCommand}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
export default Log
