import { MainWindowProps } from '../main-window'
import { ReactElement } from 'react'

export interface ChaptersPropsType extends MainWindowProps {
  sendDataToSerialPort: (dataToSend: string | Uint8Array) => void
  LogAction: (log: string) => void
  constructCommand: (_axis: string, _payload: string) => Uint8Array
  getAxisSelection: () => string
  children: ReactElement
}

export const Command1 = (props: ChaptersPropsType) => {
  const disable_enable_MOSFETS = () => {
    const selectedAxis = props.getAxisSelection()
    if (selectedAxis == '') return

    const rawData = props.constructCommand(selectedAxis, '')

    props.sendDataToSerialPort(rawData)
  }
  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="flex justify-center">
          <div className="mr-4">{props.children}</div>
          <button
            className="btn btn-primary btn-sm"
            onClick={disable_enable_MOSFETS}
          >
            {props.currentCommandDictionary.CommandEnum == 0
              ? 'DISABLE MOSFETS'
              : 'ENABLE MOSFETS'}
          </button>
        </div>
      </div>
    </>
  )
}
