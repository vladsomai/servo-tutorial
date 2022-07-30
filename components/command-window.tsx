import { GlobalContext, GlobalStateType } from '../pages/_app'
import {
  useContext,
  useRef,
  useEffect,
  useState,
  ReactComponentElement,
  ReactElement,
} from 'react'
import { MotorCommands } from '../servo-engine/motor-commands'
import { MainWindowProps } from './main-window'

interface CommandWindowProps extends MainWindowProps {
  sendDataToSerialPort: Function
  children:ReactElement
}
const Command = (props: CommandWindowProps, children: ReactElement) => {
  const GlobalState: GlobalStateType = useContext(GlobalContext)
  const rawCommandInputBox = useRef<HTMLInputElement | null>(null)
  const [input, setInput] = useState<string>('')

  //***************************** TODO - THIS WILL SPLIT MULTIPLE INPUTS IN SEPARATE LINES ****************************
  // useEffect(()=>{
  //   let inputStr = props.currentCommandDictionary.Input
  //   const multipleInputs: string[] = [];

  //   let breakFound =false;
  //   let i=0;
  //   do
  //   {
  //     const indexOfBreak = inputStr.indexOf('\n')
  //     if(indexOfBreak)
  //     {
  //       multipleInputs[i] = inputStr.slice(0,indexOfBreak)
  //       i++;
  //       console.log("input contains a break line at: ", indexOfBreak)
  //       breakFound=true;
  //     }
  //     else
  //     {
  //       breakFound=false;
  //     }
  //   }while(!breakFound)

  // },[props.currentCommandDictionary.CommandString])

  return (
    <>
      <div className="w-full">
        <div className="mb-5">
          <p className="text-center mb-5 text-2xl">
            <strong>{props.currentCommandDictionary.CommandString}</strong>
          </p>
          <p className="mb-2">
            <b>Description:&nbsp;</b>{' '}
            {props.currentCommandDictionary.Description}
          </p>
          <p className="mb-2">
            <b>Input:&nbsp;</b>
            {props.currentCommandDictionary.Input}
          </p>
          <p className="mb-2">
            <b>Output:&nbsp;</b>
            {props.currentCommandDictionary.Output}
          </p>
        </div>
        {props.children}
        <hr className='my-10'></hr>
        <div className="border rounded-box p-5">
          <div
            className="tooltip w-full"
            data-tip="Only experts may use this feature dear scholar, are you hardcore enough?"
          >
            <p className="text-center mb-5 ">
              <b>
                Lets send some raw commands! &nbsp; The value you input must be
                hexadecimal.
              </b>
            </p>
          </div>
          <div className="flex flex-row justify-evenly items-center">
            <input
              ref={rawCommandInputBox}
              type="text"
              placeholder="Raw command e.g. 410000"
              className="input input-bordered basis-1/2  max-w-xs input-sm"
            />
            <div
              className="tooltip"
              data-tip="You will send a raw command to the servo motor."
            >
              <button
                className="btn btn-primary max-w-xs btn-sm place-self-center"
                onClick={() => {
                  props.sendDataToSerialPort(rawCommandInputBox.current?.value)
                }}
              >
                Execute command!
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Command
