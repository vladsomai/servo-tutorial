import { ReactElement, useEffect, useRef, useState } from 'react'
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

  //#region TIME_CONVERSION
  const [timeValue, setTimeValue] = useState<number>(0)
  const [timesteps, setTimestepsValue] = useState<number>(0)
  const [timestepsHexa, setTimestepsHexaValue] = useState<string>('00000000')

  const onTimeInputBoxChange = () => {
    if (timeInputBox && timeInputBox.current) {
      const inputBoxValue = parseFloat(timeInputBox.current.value)
      if (isNaN(inputBoxValue)) {
        setTimeValue(0)
      } else {
        setTimeValue(inputBoxValue)
      }
    }
  }

  useEffect(() => {
    if (isNaN(timeValue)) {
      setTimestepsValue(0)
    } else {
      setTimestepsValue(SecondToTimesteps(timeValue))
    }
  }, [timeValue])

  useEffect(() => {
    if (timesteps == 0) {
      setTimestepsHexaValue('00000000')
    } else {
      let rawPayload_ArrayBufferForTime = new ArrayBuffer(4)
      const viewTime = new DataView(rawPayload_ArrayBufferForTime)

      viewTime.setUint32(0, timesteps, true)

      let rawTimePayload = new Uint8Array(4)
      rawTimePayload.set([viewTime.getUint8(0)], 0)
      rawTimePayload.set([viewTime.getUint8(1)], 1)
      rawTimePayload.set([viewTime.getUint8(2)], 2)
      rawTimePayload.set([viewTime.getUint8(3)], 3)

      setTimestepsHexaValue(Uint8ArrayToString(rawTimePayload))
    }
  }, [timesteps])
  //#endregion TIME_CONVERSION

  //#region POSITION_CONVERSION

  const [positionValue, setPositionValue] = useState<number>(0)
  const [microsteps, setMicrostepsValue] = useState<number>(0)
  const [microstepsHexa, setMicrostepsHexaValue] = useState<string>('00000000')

  const onPositionInputBoxChange = () => {
    if (positionInputBox && positionInputBox.current) {
      const inputBoxValue = parseFloat(positionInputBox.current.value)
      if (isNaN(inputBoxValue)) {
        setPositionValue(0)
      } else {
        setPositionValue(inputBoxValue)
      }
    }
  }

  useEffect(() => {
    if (isNaN(positionValue)) {
      setMicrostepsValue(0)
    } else {
      setMicrostepsValue(RotationsToMicrosteps(positionValue))
    }
  }, [positionValue])

  useEffect(() => {
    if (microsteps == 0) {
      setMicrostepsHexaValue('00000000')
    } else {
      let rawPayload_ArrayBufferForPosition = new ArrayBuffer(4)
      const viewPosition = new DataView(rawPayload_ArrayBufferForPosition)
      viewPosition.setUint32(0, microsteps, true)

      let rawPositionPayload = new Uint8Array(4)
      rawPositionPayload.set([viewPosition.getUint8(0)], 0)
      rawPositionPayload.set([viewPosition.getUint8(1)], 1)
      rawPositionPayload.set([viewPosition.getUint8(2)], 2)
      rawPositionPayload.set([viewPosition.getUint8(3)], 3)

      setMicrostepsHexaValue(Uint8ArrayToString(rawPositionPayload))
    }
  }, [microsteps])
  //#endregion POSITION_CONVERSION

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
      const rawData = props.constructCommand(
        selectedAxis,
        microstepsHexa + timestepsHexa,
      )
      props.sendDataToSerialPort(rawData)
    }
  }
  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="flex justify-center">
          {props.children}
          <div
            className="tooltip tooltip-secondary"
            data-tip="Check out below the conversion in real-time!"
          >
            <input
              ref={positionInputBox}
              onChange={onPositionInputBoxChange}
              type="number"
              placeholder="Position (rotations)"
              className="input input-bordered basis-1/2  max-w-xs input-sm mr-8"
            />
          </div>
          <div
            className="tooltip tooltip-secondary"
            data-tip="Check out below the conversion in real-time!"
          >
            <input
              ref={timeInputBox}
              onChange={onTimeInputBoxChange}
              type="number"
              placeholder="Time limit (s)"
              className="input input-bordered basis-1/2  max-w-xs input-sm mr-8"
            />
          </div>
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
      <article className="mb-10 prose prose-slate max-w-full">
        <ol className="flex">
          <div className="px-5">
            <h4>Position conversion</h4>
            <li>
              Transforming position to Microsteps, the formula used is:
              Microsteps = rotations * 645120
              <br></br>
              {`Input: ${positionValue.toString()} rotations`}
              <br></br>
              {`Output: ${microsteps.toString()} Microsteps`}
            </li>
            <li>
              Taking the output from step 3 and transforming it to 32-bit signed
              integer with little-endian fromat
              <br></br>
              {`Input: ${microsteps.toString()} Microsteps`}
              <br></br>
              {`Output: 0x${microstepsHexa}`}
            </li>{' '}
          </div>
          <div className="px-5">
            <h4>Time conversion</h4>
            <li>
              Transforming time to Timesteps, the formula used is: Timesteps =
              timeInSeconds * 1000000 / 32
              <br></br>
              {`Input: ${timeValue.toString()}s`}
              <br></br>
              {`Output: ${timesteps.toString()} Timesteps`}
            </li>
            <li>
              Taking the output from step 1 and transforming it to 32-bit
              unsigned integer with little-endian fromat
              <br></br>
              {`Input: ${timesteps.toString()} Timesteps`}
              <br></br>
              {`Output: 0x${timestepsHexa}`}
            </li>
          </div>
        </ol>
      </article>
    </>
  )
}
