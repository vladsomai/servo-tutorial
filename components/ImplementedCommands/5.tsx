import { useContext, useEffect, useRef, useState } from 'react'
import { GlobalContext } from '../../pages/_app'
import {
  ErrorTypes,
  InternalAccelerationToCommAcceleration,
  maximumNegativeAcceleration,
  maximumPositiveAcceleration,
  minimumNegativeAcceleration,
  minimumPositiveAcceleration,
  RPMSquared_ToInternalAcceleration,
  Uint8ArrayToString,
} from '../../servo-engine/utils'
import { ChaptersPropsType } from './0_1'

export const Command5 = (props: ChaptersPropsType) => {
  const value = useContext(GlobalContext)
  useEffect(
    (setBytes = value.codeExamplePayload.setBytes) => {
      return () => setBytes('')
    },
    [value.codeExamplePayload.setBytes],
  )
  const AccelerationInputBox = useRef<HTMLInputElement | null>(null)

  //#region Acceleration_CONVERSION
  const [AccelerationRPM, setAccelerationRPM] = useState<number>(0)
  const [internalAcceleration, setInternalAcceleration] = useState<number>(0)
  const [commAcceleration, setCommAcceleration] = useState<number>(0)
  const [commAccelerationHexa, setCommAccelerationHexa] = useState<string>(
    '00000000',
  )

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

  useEffect(() => {
    if (commAcceleration == 0) {
      setCommAccelerationHexa('00000000')
      value.codeExamplePayload.setBytes('00000000')
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
      value.codeExamplePayload.setBytes(strComAcc)
    }
  }, [commAcceleration, value.codeExamplePayload])
  //#endregion Acceleration_CONVERSION

  const execute_command = () => {
    if (AccelerationInputBox && AccelerationInputBox.current) {
      const selectedAxis = props.getAxisSelection()
      if (selectedAxis == '') return

      if (AccelerationInputBox.current.value == '') {
        props.LogAction(ErrorTypes.NO_ERR, 'Please enter acceleration.')
        return
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

      const rawData = props.constructCommand(commAccelerationHexa)
      props.sendDataToSerialPort(rawData)
    }
  }
  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="flex justify-center">
          <div className="mx-2">{props.children}</div>

          <div
            className="tooltip tooltip-ghost"
            data-tip="Check out below the conversion in real-time!"
          >
            <input
              ref={AccelerationInputBox}
              onChange={onAccelerationInputBoxChange}
              type="number"
              placeholder="Acceleration (RPM^2)"
              className="input input-bordered max-w-xs input-sm mx-2"
            />
          </div>
        </div>
        <button
          className="btn btn-primary btn-sm mt-4"
          onClick={execute_command}
        >
          set max Acceleration
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
        </ol>
      </article>
    </>
  )
}
