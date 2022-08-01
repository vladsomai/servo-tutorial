import { MainWindowProps } from '../main-window'
import { ReactElement } from 'react'

interface ChaptersPropsType extends MainWindowProps {
  sendDataToSerialPort: Function
  LogAction: Function
  constructCommand: Function
  getAxisSelection: Function
  children: ReactElement
}

export const Chapter1 = (props: ChaptersPropsType) => {
  const disable_enable_MOSFETS = () => {
    const selectedAxis = props.getAxisSelection()
    if (selectedAxis == '') return

    const rawData = props.constructCommand(selectedAxis, '')

    props.sendDataToSerialPort(rawData)
  }
  return (
    <>
      <div className="w-full text-center mb-5">
        {props.currentCommandDictionary.CommandEnum == 0 ? (
          <p className="mb-2">Let&apos;s disable the MOSFETS.</p>
        ) : (
          <p className="mb-2">Let&apos;s enable the MOSFETS.</p>
        )}

        <div className="flex justify-center">
          {props.children}
          <div
            className="tooltip"
            data-tip={
              props.currentCommandDictionary.CommandEnum == 0
                ? 'This button will create a raw command that disables the MOSFETS on the specified axis'
                : 'This button will create a raw command that enables the MOSFETS on the specified axis'
            }
          >
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
      </div>
    </>
  )
}
