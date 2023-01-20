import { useMemoOne } from '@react-spring/shared'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { GlobalContext } from '../../pages/_app'

import {
  SecondToTimesteps,
  InternalAccelerationToCommAcceleration,
  maximumNegativeAcceleration,
  maximumPositiveAcceleration,
  maximumPositiveTime,
  minimumNegativeAcceleration,
  minimumPositiveAcceleration,
  RPMSquared_ToInternalAcceleration,
  Uint8ArrayToString,
  minimumPositiveTime,
  ErrorTypes,
} from '../../servo-engine/utils'
import { ChaptersPropsType } from './0_1'

export const Command19 = (props: ChaptersPropsType) => {
  const value = useContext(GlobalContext)

  const AccelerationInputBox = useRef<HTMLInputElement | null>(null)
  const timeInputBox = useRef<HTMLInputElement | null>(null)

  //#region TIME_CONVERSION
  const [timeValue, setTimeValue] = useState<number>(0)
  const [timesteps, setTimestepsValue] = useState<number>(0)
  const [timestepsHexa, setTimestepsHexaValue] = useState<string>('00000000')

  const [AccelerationRPM, setAccelerationRPM] = useState<number>(0)
  const [internalAcceleration, setInternalAcceleration] = useState<number>(0)
  const [commAcceleration, setCommAcceleration] = useState<number>(0)
  const [commAccelerationHexa, setCommAccelerationHexa] = useState<string>(
    '00000000',
  )

  const onTimeInputBoxChange = () => {
    if (timeInputBox && timeInputBox.current) {
      const inputBoxValue = parseFloat(timeInputBox.current.value)

      if (isNaN(inputBoxValue) || inputBoxValue < 0) {
        setTimeValue(0)
      } else if (inputBoxValue > maximumPositiveTime) {
        //max reached
        props.LogAction(
          ErrorTypes.ERR1001,
          `Maximum value for time is ${maximumPositiveTime}, consider using a smaller value!`,
        )
        setTimeValue(maximumPositiveTime)
        timeInputBox.current.value = maximumPositiveTime.toString()
      } else {
        setTimeValue(inputBoxValue)
      }
    }
  }

  useEffect(
    (setBytes = value.codeExamplePayload.setBytes) => {
      return () => setBytes('')
    },
    [value.codeExamplePayload.setBytes],
  )

  useEffect(() => {
    setTimestepsValue(SecondToTimesteps(timeValue))
  }, [timeValue])

  useEffect(
    (setBytes = value.codeExamplePayload.setBytes) => {
      if (timesteps == 0) {
        setTimestepsHexaValue('00000000')
        setBytes(commAccelerationHexa + '00000000')
      } else {
        let rawPayload_ArrayBufferForTime = new ArrayBuffer(4)
        const viewTime = new DataView(rawPayload_ArrayBufferForTime)

        viewTime.setUint32(0, timesteps, true)

        let rawTimePayload = new Uint8Array(4)
        rawTimePayload.set([viewTime.getUint8(0)], 0)
        rawTimePayload.set([viewTime.getUint8(1)], 1)
        rawTimePayload.set([viewTime.getUint8(2)], 2)
        rawTimePayload.set([viewTime.getUint8(3)], 3)

        const strTimesteps = Uint8ArrayToString(rawTimePayload)
        setTimestepsHexaValue(strTimesteps)
        setBytes(commAccelerationHexa + strTimesteps)
      }
    },
    [timesteps, value.codeExamplePayload.setBytes, commAccelerationHexa],
  )
  //#endregion TIME_CONVERSION

  //#region Acceleration_CONVERSION

  const onAccelerationInputBoxChange = () => {
    if (AccelerationInputBox && AccelerationInputBox.current) {
      const inputBoxValue = parseFloat(AccelerationInputBox.current.value)
      if (isNaN(inputBoxValue)) {
        setAccelerationRPM(0)
      } else {
        if (inputBoxValue < 0) {
          //negative Acceleration
          if (inputBoxValue > minimumNegativeAcceleration) {
            setAccelerationRPM(inputBoxValue)
          } else if (inputBoxValue < maximumNegativeAcceleration) {
            //max negative reached
            props.LogAction(
              ErrorTypes.ERR1001,
              `Maximum value for negative acceleration is ${maximumNegativeAcceleration}, consider using a larger value!`,
            )
            setAccelerationRPM(maximumNegativeAcceleration)
            AccelerationInputBox.current.value = maximumNegativeAcceleration.toString()
          } else {
            setAccelerationRPM(inputBoxValue)
          }
        }
        //positive Acceleration
        else if (inputBoxValue < minimumPositiveAcceleration) {
          setAccelerationRPM(inputBoxValue)
        } else if (inputBoxValue >= maximumPositiveAcceleration) {
          //max positive reached
          props.LogAction(
            ErrorTypes.ERR1001,
            `Maximum value for positive acceleration is ${maximumPositiveAcceleration}, consider using a smaller value!`,
          )
          setAccelerationRPM(maximumPositiveAcceleration)
          AccelerationInputBox.current.value = maximumPositiveAcceleration.toString()
        } else {
          setAccelerationRPM(inputBoxValue)
        }
      }
    }
  }

  useEffect(() => {
    setInternalAcceleration(RPMSquared_ToInternalAcceleration(AccelerationRPM))
  }, [AccelerationRPM])

  useEffect(() => {
    setCommAcceleration(
      InternalAccelerationToCommAcceleration(internalAcceleration),
    )
  }, [internalAcceleration])

  useEffect(
    (setBytes = value.codeExamplePayload.setBytes) => {
      if (commAcceleration == 0) {
        setCommAccelerationHexa('00000000')
        setBytes('00000000' + timestepsHexa)
      } else {
        let rawPayload_ArrayBufferForAcceleration = new ArrayBuffer(4)
        const viewAcceleration = new DataView(
          rawPayload_ArrayBufferForAcceleration,
        )
        viewAcceleration.setUint32(0, commAcceleration, true)

        let rawAccelerationPayload = new Uint8Array(4)
        rawAccelerationPayload.set([viewAcceleration.getUint8(0)], 0)
        rawAccelerationPayload.set([viewAcceleration.getUint8(1)], 1)
        rawAccelerationPayload.set([viewAcceleration.getUint8(2)], 2)
        rawAccelerationPayload.set([viewAcceleration.getUint8(3)], 3)

        const strComAcc = Uint8ArrayToString(rawAccelerationPayload)
        setCommAccelerationHexa(strComAcc)
        setBytes(strComAcc + timestepsHexa)
      }
    },
    [commAcceleration, value.codeExamplePayload.setBytes, timestepsHexa],
  )
  //#endregion Acceleration_CONVERSION

  const execute_command = () => {
    if (
      AccelerationInputBox &&
      AccelerationInputBox.current &&
      timeInputBox &&
      timeInputBox.current
    ) {
      const selectedAxis = props.getAxisSelection()
      if (selectedAxis == '') return

      if (
        AccelerationInputBox.current.value == '' ||
        timeInputBox.current.value == ''
      ) {
        props.LogAction(ErrorTypes.NO_ERR, 'Please enter both inputs.')
        return
      }

      if (parseFloat(timeInputBox.current.value) < 0) {
        props.LogAction(ErrorTypes.NO_ERR, 'Time cannot be negative!')
        return
      }

      if (timeValue < minimumPositiveTime) {
        props.LogAction(
          ErrorTypes.ERR1002,
          `Time value is considered 0 when it is below ${minimumPositiveTime}, consider using a larger value.`,
        )
      }

      if (AccelerationRPM < 0) {
        if (AccelerationRPM > minimumNegativeAcceleration) {
          props.LogAction(
            ErrorTypes.ERR1002,
            `Minimum value for negative acceleration is ${minimumNegativeAcceleration}, consider using a smaller value.`,
          )
        }
      } else if (AccelerationRPM < minimumPositiveAcceleration) {
        props.LogAction(
          ErrorTypes.ERR1002,
          `Minimum value for positive acceleration is ${minimumPositiveAcceleration}, consider using a larger value.`,
        )
      }

      const rawData = props.constructCommand(
        selectedAxis,
        commAccelerationHexa + timestepsHexa,
      )
      props.sendDataToSerialPort(rawData)
    }
  }
  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="flex flex-col xl:flex-row justify-center items-center">
          <div className="m-2">{props.children}</div>
          <div
            className="tooltip tooltip-ghost"
            data-tip="Check out below the conversion in real-time!"
          >
            <input
              ref={AccelerationInputBox}
              onChange={onAccelerationInputBoxChange}
              type="number"
              placeholder="Acceleration (RPM^2)"
              className="input input-bordered basis-1/2 max-w-xs input-sm m-2"
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
              className="input input-bordered basis-1/2 max-w-xs input-sm m-2"
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

      <article className="mb-10 prose prose-slate max-w-full">
        <ol className="flex">
          <div className="px-5">
            <h4>Acceleration conversion</h4>
            <li>
              Transforming acceleration to internal Acceleration, the formula
              used is:
              <br></br>
              <i>
                Internal_Acceleration = (RPM^2 / 60^2) * (645120 / 31250^2) *
                (2^32)
              </i>
              <br></br>
              {`Input: ${AccelerationRPM.toString()} RPM^2`}
              <br></br>
              {`Output: ${internalAcceleration.toString()} Internal Acceleration`}
            </li>
            <li>
              Taking the output from step 1 and transforming it to communication
              acceleration:
              <br></br>
              <i>Communication_Acceleration = Internal_Acceleration / (2^8)</i>
              <br></br>
              {`Input: ${internalAcceleration.toString()} Internal Acceleration`}
              <br></br>
              {`Output: ${commAcceleration.toString()} Communication Acceleration`}
            </li>{' '}
            <li>
              Taking the output from step 2 and transforming it to 32-bit signed
              integer with little-endian format
              <br></br>
              {`Input: ${commAcceleration.toString()} Communication Acceleration`}
              <br></br>
              {`Output: 0x${commAccelerationHexa.toString()}`}
            </li>
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
              Taking the output from step 4 and transforming it to 32-bit
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
