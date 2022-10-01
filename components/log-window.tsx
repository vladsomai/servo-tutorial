import { useEffect, useRef } from 'react'
import LogLineServoCommand, { CommandPayload } from './log-line-servo-command'
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
  CommandPayload: CommandPayload
}) => {
  const logWindow = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (logWindow && logWindow.current)
      logWindow.current.scrollTop =
        logWindow.current.scrollHeight - logWindow.current.clientHeight
  }, [props.logs])

  return (
    <>
      <div className="rounded-box mx-2 my-auto h-full w-6/12 flex flex-col justify-center content-center overflow-auto ">
        <div className=" mockup-code h-16 w-full rounded-t-box rounded-b-none py-5 bg-slate-700 ">
          <div
            className={'tooltip tooltip-ghost absolute bottom-0 right-10 z-10'}
            data-tip={'Clear log window'}
          >
            <button
              className="btn btn-xs rounded-b-none border-0 bg-slate-800"
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
          className=" bg-slate-800 rounded-b-box h-[78vh] px-6 py-3 overflow-auto"
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
                    {...props.CommandPayload}
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
