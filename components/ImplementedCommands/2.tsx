import { ReactElement, useRef } from 'react'
import { MotorAxes, MotorAxisType } from '../../servo-engine/motor-axes'
import {
  MilisToTimesteps,
  RotationsToMicrosteps,
  Uint8ArrayToString,
} from '../../servo-engine/utils'
import { ChaptersPropsType } from './0_1'

export const Command2 = (props: ChaptersPropsType) => {
  const positionInputBox = useRef<HTMLInputElement | null>(null)
  const timeInputBox = useRef<HTMLInputElement | null>(null)

  const trapezoid_move = () => {
    if (
      positionInputBox &&
      positionInputBox.current &&
      timeInputBox &&
      timeInputBox.current
    ) {
      const selectedAxis = props.getAxisSelection()
      if (selectedAxis == '') return

      if (
        positionInputBox.current.value == '' ||
        timeInputBox.current.value == ''
      ) {
        props.LogAction('Please enter both inputs.')
        return
      }
      const positionValue = parseInt(positionInputBox.current.value)
      const timeValue = parseInt(timeInputBox.current.value)
      if (timeValue < 0) {
        props.LogAction('Time cannot be negative!')
        return
      }

      //#region TIME CONVERTION
      let rawPayload_ArrayBufferForTime = new ArrayBuffer(4)
      const viewTime = new DataView(rawPayload_ArrayBufferForTime)
      viewTime.setUint32(0, MilisToTimesteps(timeValue), true)

      let rawTimePayload = new Uint8Array(4)
      rawTimePayload.set([viewTime.getUint8(0)], 0)
      rawTimePayload.set([viewTime.getUint8(1)], 1)
      rawTimePayload.set([viewTime.getUint8(2)], 2)
      rawTimePayload.set([viewTime.getUint8(3)], 3)
      let textPayloadForTime = Uint8ArrayToString(rawTimePayload)
      //#endregion

      //#region POSITION CONVERTION
      let rawPayload_ArrayBufferForPosition = new ArrayBuffer(4)
      const viewPosition = new DataView(rawPayload_ArrayBufferForPosition)
      viewPosition.setUint32(0, RotationsToMicrosteps(positionValue), true)

      let rawPositionPayload = new Uint8Array(4)
      rawPositionPayload.set([viewPosition.getUint8(0)], 0)
      rawPositionPayload.set([viewPosition.getUint8(1)], 1)
      rawPositionPayload.set([viewPosition.getUint8(2)], 2)
      rawPositionPayload.set([viewPosition.getUint8(3)], 3)
      let textPayloadForPosition = Uint8ArrayToString(rawPositionPayload)
      //#endregion

      const rawData = props.constructCommand(
        selectedAxis,
        textPayloadForPosition + textPayloadForTime,
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
            ref={positionInputBox}
            type="number"
            placeholder="Position (rotations)"
            className="input input-bordered basis-1/2  max-w-xs input-sm mr-8"
          />
          <input
            ref={timeInputBox}
            type="number"
            placeholder="Time limit (ms)"
            className="input input-bordered basis-1/2  max-w-xs input-sm mr-8"
          />
          <div
            className="tooltip tooltip-secondary"
            data-tip="Test your connection to the motor using this button!"
          >
            <button className="btn btn-primary btn-sm" onClick={trapezoid_move}>
              execute
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
