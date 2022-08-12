import { MainWindowProps } from '../main-window'
import { ReactElement, useRef } from 'react'
import { MotorAxes, MotorAxisType } from '../../servo-engine/motor-axes'
import { ChaptersPropsType } from './0_1'
import { Uint8ArrayToString } from '../../servo-engine/utils'

export const Command7 = (props: ChaptersPropsType) => {
  const selectPayloadInputBox = useRef<HTMLSelectElement | null>(null)
  const availableDataToCapture = useRef<number[]>([0, 1, 2, 3, 4])

  const capture_hall_sensor = () => {
    if (selectPayloadInputBox && selectPayloadInputBox.current) {
      const selectedAxis = props.getAxisSelection()
      if (selectedAxis == '') return

      const inputSelection = parseInt(
        selectPayloadInputBox.current.options[
          selectPayloadInputBox.current.selectedIndex
        ].text,
      )

      if (!availableDataToCapture.current.includes(inputSelection)) {
        props.LogAction(
          'Please select one of the available data to be captured.',
        )
        return
      }

      let rawPayload = new Uint8Array(1)
      rawPayload.set([inputSelection])
      let textRawPayload = Uint8ArrayToString(rawPayload)

      const rawData = props.constructCommand(
        selectedAxis,
        textRawPayload.toUpperCase(),
      )
      props.sendDataToSerialPort(rawData)
    }
  }
  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="flex justify-center">
          {props.children}
          <select
            ref={selectPayloadInputBox}
            className="select select-bordered select-sm w-full max-w-xs mr-8"
            defaultValue="Select data to capture"
          >
            <option disabled>Select data to capture</option>
            {availableDataToCapture.current.map((option: number) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <div
            className="tooltip tooltip-secondary"
            data-tip="Test your connection to the motor using this button!"
          >
            <button
              className="btn btn-primary btn-sm"
              onClick={capture_hall_sensor}
            >
              execute
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
