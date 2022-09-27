import { useRef, useState, ReactElement, useEffect } from 'react'
import { MainWindowProps } from './main-window'
import 'animate.css'
import CommandsProtocol from './ImplementedCommands/commands-protocol'

interface CommandWindowProps extends MainWindowProps {
  sendDataToSerialPort: Function
  connectToSerialPort: Function
  disconnectFromSerialPort: Function
  children: ReactElement
  isConnected: boolean
}
const Command = (props: CommandWindowProps, children: ReactElement) => {
  const rawCommandInputBox = useRef<HTMLInputElement | null>(null)
  const controlPanelDiv = useRef<HTMLDivElement | null>(null)
  const AvailableBaudrates = useRef<number[]>([
    9600,
    14400,
    19200,
    28800,
    38400,
    57600,
    115200,
    230400,
  ])
  const [input, setInput] = useState<string>('')

  useEffect(() => {}, [])

  const BaudrateSelection = useRef<HTMLSelectElement | null>(null)
  const getBaudrateSelection = (): number => {
    if (BaudrateSelection && BaudrateSelection.current) {
      let selectedBaudrate =
        BaudrateSelection.current.options[
          BaudrateSelection.current.selectedIndex
        ].text

      return parseInt(selectedBaudrate)
    }

    //return default baudrate as the largest baudrate
    return AvailableBaudrates.current.at(
      AvailableBaudrates.current.length - 1,
    ) as number
  }

  return (
    <>
      <div
        className={`overflow-auto relative px-5 mx-2 ${
          props.currentCommandDictionary.CommandEnum !== 100
            ? 'w-6/12'
            : 'w-full'
        }`}
      >
        {props.currentCommandDictionary.CommandEnum !== 100 ? (
          <div className="absolute top-4 right-2">
            {props.isConnected ? (
              <button
                className="btn btn-success btn-sm h-[2.3rem] text-md btn-primary hover:opacity-90 border-0 flex flex-col normal-case"
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
                className="btn btn-error btn-sm h-[2.3rem] text-md hover:opacity-90 flex flex-col normal-case"
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
          </div>
        ) : null}
        {props.currentCommandDictionary.CommandEnum !== 100 ? (
          <div className="mb-5 mt-16">
            <p className="text-center mb-5 text-2xl">
              <strong>{props.currentCommandDictionary.CommandString}</strong>
            </p>{' '}
            <p className="text-center mb-5 text-xl">
              <strong>
                Command {props.currentCommandDictionary.CommandEnum}
              </strong>
            </p>
            <p className="mb-2">
              <b>Description:&nbsp;</b>{' '}
              {props.currentCommandDictionary.Description}
            </p>
            <article className="prose w-full max-w-full">
              <h4>Inputs:&nbsp;</h4>
              <ol className="m-0">
                {typeof props.currentCommandDictionary.Input == 'string' ? (
                  <li>
                    <p>{props.currentCommandDictionary.Input}</p>
                  </li>
                ) : (
                  props.currentCommandDictionary.Input.map((item) => {
                    return (
                      <li
                        key={props.currentCommandDictionary.Input.indexOf(item)}
                      >
                        <p>{item}</p>
                      </li>
                    )
                  })
                )}
              </ol>
            </article>
            <p className="mb-2">
              <b>Output:&nbsp;</b>
              {props.currentCommandDictionary.Output}
            </p>
          </div>
        ) : (
          <CommandsProtocol
            currentCommandDictionary={props.currentCommandDictionary}
            currentChapter={props.currentChapter}
          />
        )}

        {props.children}

        {/* <div
          ref={controlPanelDiv}
          className={`mockup-code border rounded-box mt-5 p-5 animate__animated ${
            props.showControlPanel ? 'animate__fadeIn' : 'hidden'
          }`}
        >
          <p className="text-center mb-5 text-2xl font-bold">Control Panel</p>
          <div className="flex justify-evenly w-full mb-5">
            <div className="form-control">
              <div className="input-group">
                <select
                  ref={BaudrateSelection}
                  className="select select-bordered select-sm w-full max-w-xs "
                  defaultValue="230400"
                >
                  {AvailableBaudrates.current.map((baudrate: number) => (
                    <option key={baudrate}>{baudrate}</option>
                  ))}
                </select>
                <div className="tooltip tooltip-secondary" data-tip="Connect to the serial port!">
                  <button
                    className="btn btn-success btn-sm hover:bg-green-500"
                    onClick={() => {
                      props.connectToSerialPort(getBaudrateSelection())
                    }}
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
            <div className="tooltip tooltip-secondary" data-tip="Disonnect from the serial port!">
              <button
                className="btn btn-error btn-sm hover:bg-red-500"
                onClick={() => {
                  props.disconnectFromSerialPort()
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
          <div
            className="tooltip w-full tooltip-secondary"
            data-tip="Only experts may use this feature dear scholar, are you hardcore enough?"
          >
            <p className="text-center mb-5 ">
              Lets send some raw commands! &nbsp; The value you input must be
              hexadecimal.
            </p>
          </div>
          <div className="flex flex-row justify-evenly items-center">
            <div className="form-control">
              <div className="input-group">
                <input
                  ref={rawCommandInputBox}
                  type="text"
                  placeholder="Raw command e.g. 410000"
                  className="input input-bordered max-w-xs input-sm w-72"
                />
                <div
                  className="tooltip tooltip-secondary"
                  data-tip="You will send a raw command to the servo motor."
                >
                  <button
                    className="btn btn-primary max-w-xs btn-sm place-self-center"
                    onClick={() => {
                      props.sendDataToSerialPort(
                        rawCommandInputBox.current?.value,
                      )
                    }}
                  >
                    Execute command!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  )
}
export default Command
