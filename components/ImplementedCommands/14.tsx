import { ReactElement, useEffect, useRef, useState } from 'react'
import {
  RotationsToMicrosteps,
  SecondToTimesteps,
  Uint8ArrayToString,
  maximumNegativePosition,
  maximumPositivePosition,
  minimumNegativePosition,
  minimumPositivePosition,
  minimumPositiveTime,
  maximumPositiveTime,
} from '../../servo-engine/utils'
import { ChaptersPropsType } from './0_1'

export const Command14 = (props: ChaptersPropsType) => {
  const positionInputBox = useRef<HTMLInputElement | null>(null)
  const timeInputBox = useRef<HTMLInputElement | null>(null)

  //#region TIME_CONVERSION
  const [timeValue, setTimeValue] = useState<number>(0)
  const [timesteps, setTimestepsValue] = useState<number>(0)
  const [timestepsHexa, setTimestepsHexaValue] = useState<string>('00000000')

  const onTimeInputBoxChange = () => {
    if (timeInputBox && timeInputBox.current) {
      const inputBoxValue = parseFloat(timeInputBox.current.value)

      if (isNaN(inputBoxValue) || inputBoxValue < 0) {
        setTimeValue(0)
      } else if (inputBoxValue > maximumPositiveTime) {
        //max reached
        props.LogAction(
          `WARNING: Maximum value for time is ${maximumPositiveTime}, consider using a smaller value!`,
        )
        setTimeValue(maximumPositiveTime)
        timeInputBox.current.value = maximumPositiveTime.toString()
      } else {
        setTimeValue(inputBoxValue)
      }
    }
  }

  useEffect(() => {
    setTimestepsValue(SecondToTimesteps(timeValue))
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
        if (inputBoxValue < 0) {
          //negative position
          if (inputBoxValue > minimumNegativePosition) {
            setPositionValue(inputBoxValue)
          } else if (inputBoxValue < maximumNegativePosition) {
            //max negative reached
            props.LogAction(
              `WARNING: Maximum rotation value for negative position is ${maximumNegativePosition}, consider using a larger value!`,
            )
            setPositionValue(maximumNegativePosition)
            positionInputBox.current.value = maximumNegativePosition.toString()
          } else {
            setPositionValue(inputBoxValue)
          }
        }
        //positive position
        else if (inputBoxValue < minimumPositivePosition) {
          setPositionValue(inputBoxValue)
        } else if (inputBoxValue > maximumPositivePosition) {
          //max positive reached
          props.LogAction(
            `WARNING: Maximum rotation value for positive position is ${maximumPositivePosition}, consider using a smaller value!`,
          )
          setPositionValue(maximumPositivePosition)
          positionInputBox.current.value = maximumPositivePosition.toString()
        } else {
          setPositionValue(inputBoxValue)
        }
      }
    }
  }

  useEffect(() => {
    setMicrostepsValue(RotationsToMicrosteps(positionValue))
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

  const execute_command = () => {
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

      if (parseFloat(timeInputBox.current.value) < 0) {
        props.LogAction('Time cannot be negative!')
        return
      }

      if (timeValue < minimumPositiveTime) {
        props.LogAction(
          `WARNING: Time value is considered 0 when it is below ${minimumPositiveTime}, consider using a larger value.`,
        )
      }

      if (positionValue < 0) {
        if (positionValue > minimumNegativePosition) {
          props.LogAction(
            `WARNING: Minimum value for negative position is ${minimumNegativePosition} (one microstep), consider using a smaller value.`,
          )
        }
      } else if (positionValue < minimumPositivePosition) {
        props.LogAction(
          `WARNING: Minimum value for positive position is ${minimumPositivePosition} (one microstep), consider using a larger value.`,
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
        <div>
          <div className="flex flex-col xl:flex-row justify-center items-center">
            <div className="m-2">{props.children}</div>
            <div
              className="tooltip tooltip-ghost"
              data-tip="Check out below the conversion in real-time!"
            >
              <input
                ref={positionInputBox}
                onChange={onPositionInputBoxChange}
                type="number"
                placeholder="Position (rotations)"
                className="input input-bordered basis-1/2  max-w-xs input-sm m-2"
              />
            </div>
            <div
              className="tooltip tooltip-ghost"
              data-tip="Check out below the conversion in real-time!"
            >
              <input
                ref={timeInputBox}
                onChange={onTimeInputBoxChange}
                type="number"
                placeholder="Time limit (s)"
                className="input input-bordered basis-1/2  max-w-xs input-sm m-2"
              />
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm mt-2"
            onClick={execute_command}
          >
            execute
          </button>
        </div>
      </div>
      <article className="mb-10 prose prose-slate max-w-full">
        <ol className="flex">
          <div className="px-5">
            <h4>Position conversion</h4>
            <li>
              Transforming position to Microsteps, the formula used is:
              <br></br>
              <i>Microsteps = rotations * 645120</i>
              <br></br>
              {`Input: ${positionValue.toString()} rotations`}
              <br></br>
              {`Output: ${microsteps.toString()} Microsteps`}
            </li>
            <li>
              Taking the output from step 1 and transforming it to 32-bit signed
              integer with little-endian format
              <br></br>
              {`Input: ${microsteps.toString()} Microsteps`}
              <br></br>
              {`Output: 0x${microstepsHexa}`}
            </li>{' '}
          </div>
          <div className="px-5">
            <h4>Time conversion</h4>
            <li>
              Transforming time to Timesteps, the formula used is:
              <br></br>
              <i>Timesteps = timeInSeconds * 1000000 / 32</i>
              <br></br>
              {`Input: ${timeValue.toString()}s`}
              <br></br>
              {`Output: ${timesteps.toString()} Timesteps`}
            </li>
            <li>
              Taking the output from step 3 and transforming it to 32-bit
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
