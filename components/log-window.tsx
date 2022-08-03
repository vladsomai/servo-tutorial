import { useState, useEffect, useRef } from 'react'

export type LogType = {
  lineNumber: number
  date: Date
  log: string
}
const Log = (props: { logs: LogType[] }) => {
  const logWindow = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (logWindow && logWindow.current)
      logWindow.current.scrollTop =
        logWindow.current.scrollHeight - logWindow.current.clientHeight
  }, [props.logs])

  return (
    <>
      <div
        ref={logWindow}
        className="mockup-code border w-full overflow-show-scroll rounded-box h-96 my-5 "
      >
        <p className="text center text-lg flex justify-center">
          <b>Log Window</b>
        </p>
        <div className="flex flex-col justify-center px-5 text-justify break-word font-mono">
          {props.logs.map((log: LogType) => {
            return (
              <div className=" ml-5 flex" key={log.lineNumber}>
                <p className="mr-4 text-gray-500">
                  {log.lineNumber.toString()}&nbsp;
                </p>
                <p>
                  {log.date.getDate() +
                    '/' +
                    (log.date.getMonth() + 1) +
                    '/' +
                    log.date.getFullYear() +
                    '|' +
                    log.date.getHours() +
                    ':' +
                    log.date.getMinutes() +
                    ':' +
                    log.date.getSeconds() +
                    ': ' +
                    log.log}
                </p>
              </div>
              /* <pre
                  className=" w-10"
                  key={log.lineNumber}
                  data-prefix={log.lineNumber.toString()}
                >
                  <code>
                    {log.date.getDate() +
                      '/' +
                      (log.date.getMonth() + 1) +
                      '/' +
                      log.date.getFullYear() +
                      '|' +
                      log.date.getHours() +
                      ':' +
                      log.date.getMinutes() +
                      ':' +
                      log.date.getSeconds() +
                      ' : ' +
                      log.log}
                  </code>
                </pre> */
            )
          })}
        </div>
      </div>
    </>
  )
}
export default Log
