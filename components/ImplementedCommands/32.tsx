import { useRef } from 'react'
import { ChaptersPropsType } from './0_1'
import { ErrorTypes, Uint8ArrayToString } from '../../servo-engine/utils'

export const Command32 = (props: ChaptersPropsType) => {
  const selectPayloadInputBox = useRef<HTMLSelectElement | null>(null)
  const availableDataToCapture = useRef<number[]>([0, 1])

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
          ErrorTypes.NO_ERR,
          'Please select one of the available options.',
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
        <div className="flex flex-col xl:flex-row justify-center items-center">
          <div className="m-2">{props.children}</div>
          <select
            ref={selectPayloadInputBox}
            className="select select-bordered select-sm max-w-xs m-2"
            defaultValue="Options"
          >
            <option disabled>Options</option>
            {availableDataToCapture.current.map((option: number) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-primary btn-sm mt-2"
          onClick={capture_hall_sensor}
        >
          execute
        </button>
      </div>
    </>
  )
}
