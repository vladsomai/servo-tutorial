import { MainWindowProps } from '../main-window'
import { ReactElement, useRef } from 'react'
import { MotorAxes, MotorAxisType } from '../../servo-engine/motor-axes'
import { ChaptersPropsType } from './0_1'
import { Uint8ArrayToString } from '../../servo-engine/utils'

export const Command28 = (props: ChaptersPropsType) => {
  const maxCurrentInputBox = useRef<HTMLInputElement | null>(null)
  const regenerationInputBox = useRef<HTMLInputElement | null>(null)

  const execute_command = () => {
    if (
      maxCurrentInputBox &&
      maxCurrentInputBox.current &&
      regenerationInputBox &&
      regenerationInputBox.current
    ) {
      const selectedAxis = props.getAxisSelection()
      if (selectedAxis == '') return

      const maxCurrentStr = maxCurrentInputBox.current.value
      const regenCurrentStr = regenerationInputBox.current.value

      if (maxCurrentStr == '' || regenCurrentStr == '') {
        props.LogAction('Please enter both inputs.')
        return
      }

      const maxCurrent: number = parseInt(maxCurrentStr)
      const regenCurrent: number = parseInt(regenCurrentStr)

      let rawPayload_ArrayBufferForPosition = new ArrayBuffer(4)
      const viewPosition = new DataView(rawPayload_ArrayBufferForPosition)
      viewPosition.setUint16(0, maxCurrent, true)
      viewPosition.setUint16(2, regenCurrent, true)

      let rawPositionPayload = new Uint8Array(4)
      rawPositionPayload.set([viewPosition.getUint8(0)], 0)
      rawPositionPayload.set([viewPosition.getUint8(1)], 1)
      rawPositionPayload.set([viewPosition.getUint8(2)], 2)
      rawPositionPayload.set([viewPosition.getUint8(3)], 3)

      const rawData = props.constructCommand(
        selectedAxis,
        Uint8ArrayToString(rawPositionPayload),
      )
      props.sendDataToSerialPort(rawData)
    }
  }
  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="flex justify-center">
          {props.children}
          <input
            ref={maxCurrentInputBox}
            type="text"
            placeholder="Motor current"
            defaultValue={50}
            className="input input-bordered basis-1/2  max-w-xs input-sm mr-8"
          />{' '}
          <input
            ref={regenerationInputBox}
            type="text"
            placeholder="Regeneration current"
            defaultValue={0}
            className="input input-bordered basis-1/2  max-w-xs input-sm mr-8"
          />
          <div
            className="tooltip tooltip-secondary"
            data-tip="Test your connection to the motor using this button!"
          >
            <button
              className="btn btn-primary btn-sm"
              onClick={execute_command}
            >
              Execute
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
