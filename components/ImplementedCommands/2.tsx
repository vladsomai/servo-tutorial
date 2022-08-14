import { ReactElement, useRef } from 'react'
import { MotorAxes, MotorAxisType } from '../../servo-engine/motor-axes'
import {
  RotationsToMicrosteps,
  SecondToTimesteps,
  Uint8ArrayToString,
} from '../../servo-engine/utils'
import { ChaptersPropsType } from './0_1'

export const Command2 = (props: ChaptersPropsType) => {
  const positionInputBox = useRef<HTMLInputElement | null>(null)
  const timeInputBox = useRef<HTMLInputElement | null>(null)

  const minimumNegativePositionValue = -0.0000032
  const minimumPositivePositionValue = 0.0000016
  const minimumPositiveTimeValue = 0.000032

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
      const positionValue = parseFloat(positionInputBox.current.value)
      const timeValue = parseFloat(timeInputBox.current.value)

      if (timeValue < 0) {
        props.LogAction('Time cannot be negative!')
        return
      }

      if (timeValue < minimumPositiveTimeValue) {
        props.LogAction(
          `WARNING: Time value is considered 0 when it is below ${minimumPositiveTimeValue}, consider using a larger value.`,
        )
      }

      if (positionValue < 0) {
        //check if position is negative
        if (positionValue > minimumNegativePositionValue) {
          props.LogAction(
            `WARNING: Minimum value for negative position is ${minimumNegativePositionValue} (one microstep), consider using a smaller value`,
          )
        }
      } else if (positionValue < minimumPositivePositionValue) {
        props.LogAction(
          `WARNING: Minimum value for positive position is ${minimumPositivePositionValue} (one microstep), consider using a larger value`,
        )
      }

      //#region TIME CONVERTION
      let rawPayload_ArrayBufferForTime = new ArrayBuffer(4)
      const viewTime = new DataView(rawPayload_ArrayBufferForTime)

      props.LogAction('Step 1: Transforming time to Timesteps, the formula used is: timeInSeconds * 1000000 / 32')
      props.LogAction('Input: ' + timeValue.toString() + 's')
      const timesteps = SecondToTimesteps(timeValue)
      props.LogAction('Output: ' + timesteps.toString() + ' Timesteps')

      viewTime.setUint32(0, timesteps, true)

      props.LogAction(
        'Step 2: Taking the output from step 1 and transforming it to 32-bit unsigned integer with little-endian fromat...',
      )
      props.LogAction('Input: ' + timesteps.toString() + ' Timesteps')
      let rawTimePayload = new Uint8Array(4)
      rawTimePayload.set([viewTime.getUint8(0)], 0)
      rawTimePayload.set([viewTime.getUint8(1)], 1)
      rawTimePayload.set([viewTime.getUint8(2)], 2)
      rawTimePayload.set([viewTime.getUint8(3)], 3)

      let textPayloadForTime = Uint8ArrayToString(rawTimePayload)
      props.LogAction('Output: 0x' + textPayloadForTime)
      //#endregion

      //#region POSITION CONVERTION
      let rawPayload_ArrayBufferForPosition = new ArrayBuffer(4)
      const viewPosition = new DataView(rawPayload_ArrayBufferForPosition)

      props.LogAction('Step 3: Transforming position to Microsteps, the formula used is: rotations * 645120;')
      props.LogAction('Input: ' + positionValue.toString() + 's')
      const microsteps = RotationsToMicrosteps(positionValue)
      props.LogAction('Output: ' + microsteps.toString() + ' Microsteps')

      viewPosition.setUint32(0, microsteps, true)

      props.LogAction(
        'Step 4: Taking the output from step 3 and transforming it to 32-bit signed integer with little-endian fromat...',
      )
      props.LogAction('Input: ' + microsteps.toString() + ' Microsteps')

      let rawPositionPayload = new Uint8Array(4)
      rawPositionPayload.set([viewPosition.getUint8(0)], 0)
      rawPositionPayload.set([viewPosition.getUint8(1)], 1)
      rawPositionPayload.set([viewPosition.getUint8(2)], 2)
      rawPositionPayload.set([viewPosition.getUint8(3)], 3)
      let textPayloadForPosition = Uint8ArrayToString(rawPositionPayload)
      props.LogAction('Output: 0x' + textPayloadForPosition)
      //#endregion

      const rawData = props.constructCommand(
        selectedAxis,
        textPayloadForPosition + textPayloadForTime,
      )
      props.LogAction("Constructing the command using the output from step 2 and 4 as the payload of the command...")
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
            placeholder="Time limit (s)"
            className="input input-bordered basis-1/2  max-w-xs input-sm mr-8"
          />
          <div className="tooltip tooltip-secondary" data-tip="Let's move!">
            <button
              className="btn btn-primary btn-sm flex-col"
              onClick={trapezoid_move}
            >
              calculate &<span>execute</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
