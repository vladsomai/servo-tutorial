import { useEffect, useRef } from 'react'
import LogLineServoCommand from './log-line-servo-command'
import { MainWindowProps } from './main-window'

export type LogType = {
  lineNumber: number
  date: Date
  log: string
}

const Log = (props: {
  logs: LogType[]
  mainWindow: MainWindowProps
  clearLogWindow: Function
}) => {
  const logWindow = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (logWindow && logWindow.current)
      logWindow.current.scrollTop =
        logWindow.current.scrollHeight - logWindow.current.clientHeight
  }, [props.logs])

  return (
    <>
      <div className="absolute bottom-0 w-full h-3/6 rounded-box pr-0.5">
        <div className="mockup-code w-full h-1/6 rounded-t-box rounded-b-none py-5 bg-slate-700">
          <button
            className="btn btn-xs absolute bottom-0 right-1 z-10 rounded-b-none"
            onClick={() => props.clearLogWindow()}
          >
            Clear
          </button>
          <p className="flex justify-center absolute inset-0 top-6">
            <b>Log Window</b>
          </p>
        </div>
        <div
          ref={logWindow}
          className=" bg-slate-800 overflow-show-scroll h-5/6 rounded-b-box"
        >
          <div className="flex flex-col justify-center p-5 text-justify break-word font-mono ">
            {props.logs.map((log: LogType) => {
              return (
                <div className="flex relative" key={log.lineNumber}>
                  <p className="mr-2 text-gray-500 text-right w-16">
                    {log.lineNumber.toString()}&nbsp;
                  </p>
                  <LogLineServoCommand {...props.mainWindow} {...log} />
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
