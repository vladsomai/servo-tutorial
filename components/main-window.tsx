import { useEffect, useState } from 'react'

type LogType = {
  lineNumber: number
  date: Date
  log: string
}

const Main = () => {
  const [logs, setLogs] = useState<LogType[]>([])

  useEffect(() => {
    let logs: LogType[] = []

    for (let i = 1; i < 200; i++) {
      logs.push({ lineNumber: i, date: new Date(), log: '0xFFFFFFF' })
    }

    setLogs(logs)
  }, [])

  return (
    <>
      <div className="grid w-full card bg-base-300 rounded-box place-items-center h-screen-80 overflow-show-scroll p-5">
        <div className="w-full h-full my-10">
          <div>
            <p className='text-center'>In this chapter you will learn how to XYZ</p>
          </div>
          <div className="flex justify-evenly w-full items-center  h-full">
            <input
              type="text"
              placeholder="Set torque"
              className="input input-bordered  max-w-xs input-sm md:input-md"
            />{' '}
            <input
              type="text"
              placeholder="Set speed"
              className="input input-bordered  max-w-xs input-sm md:input-md"
            />
            <input
              type="text"
              placeholder="Maximum drown current"
              className="input input-bordered max-w-xs input-sm md:input-md"
            />
            <button className="btn btn-success max-w-xs btn-xs sm:btn-sm md:btn-md place-self-center">
              Execute command!
            </button>
          </div>
        </div>

        <div className="mockup-code border bg-base-200 w-full h-full overflow-show-scroll">
          <p className="text center text-lg flex justify-center">Log window</p>
          <div className="flex flex-col justify-center p-5 bg-base-100">
            {logs.map((log: LogType) => {
              return (
                <pre key={log.lineNumber} data-prefix={log.lineNumber.toString()}>
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
                </pre>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
export default Main
