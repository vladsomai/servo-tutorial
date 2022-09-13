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
      <div className="rounded-box mx-2 h-[84vh] mt-2 w-6/12 overflow-auto ">
        <div className=" mockup-code h-16 w-full rounded-t-box rounded-b-none py-5 bg-slate-700 ">
          <div
            className={
              'tooltip tooltip-ghost absolute bottom-0 right-10 z-10'
            }
            data-tip={'Clear log window'}
          >
            <button
              className="btn btn-xs rounded-b-none border-0"
              onClick={() => props.clearLogWindow()}
            >
              {'C l e a r'}
            </button>
          </div>
          <p className="flex justify-center absolute inset-0 top-6">
            <b>Log Window</b>
          </p>
        </div>
        <div
          ref={logWindow}
          className=" bg-slate-800 rounded-b-box h-[91%] overflow-auto px-6 py-3 "
        >
          <div className="flex flex-col justify-center text-justify font-mono w-full">
            {props.logs.map((log: LogType) => {
              return (
                <div className="flex " key={log.lineNumber}>
                  <p className="mr-2 text-gray-500 text-right">
                    {log.lineNumber.toString()}&nbsp;
                  </p>
                  <LogLineServoCommand {...props.mainWindow} {...log}/>
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
