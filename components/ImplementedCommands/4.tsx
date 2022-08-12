import { ReactElement, useRef } from 'react'
import { MotorAxes, MotorAxisType } from '../../servo-engine/motor-axes'
import { ChaptersPropsType } from './0_1'

export const Command4 = (props: ChaptersPropsType) => {
  const positionInputBox = useRef<HTMLInputElement | null>(null)
  const timeInputBox = useRef<HTMLInputElement | null>(null)

  const set_position_and_finish_time = () => {
    if (
      positionInputBox &&
      positionInputBox.current &&
      timeInputBox &&
      timeInputBox.current
    ) {
      const selectedAxis = props.getAxisSelection()
      if (selectedAxis == '') return

      const rawData = props.constructCommand(selectedAxis, 'FF')
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
            <button
              className="btn btn-primary btn-sm"
              onClick={set_position_and_finish_time}
            >
              execute
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
