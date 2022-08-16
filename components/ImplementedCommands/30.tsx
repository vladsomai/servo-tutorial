import { ReactElement, useEffect, useRef, useState } from 'react'
import {
  RotationsToMicrosteps,
  SecondToTimesteps,
  Uint8ArrayToString,
  maximumNegativePositionValue,
  maximumPositivePositionValue,
  minimumNegativePositionValue,
  minimumPositivePositionValue,
} from '../../servo-engine/utils'
import { ChaptersPropsType } from './0_1'

export const Command30 = (props: ChaptersPropsType) => {
  const upperLimitInputBox = useRef<HTMLInputElement | null>(null)
  const lowerLimitInputBox = useRef<HTMLInputElement | null>(null)

  //#region UPPER_LIMIT_CONVERSION
  const [upperValue, setUpperValue] = useState<number>(0)
  const [upperMicrosteps, setUpperMicrosteps] = useState<number>(0)
  const [upperMicrostepsHexaValue, setUpperMicrostepsHexaValue] = useState<
    string
  >('00000000')

  const onUpperLimitInputBoxChange = () => {
    if (upperLimitInputBox && upperLimitInputBox.current) {
      const inputBoxValue = parseFloat(upperLimitInputBox.current.value)

      if (isNaN(inputBoxValue)) {
        setUpperValue(0)
      } else {
        if (inputBoxValue < 0) {
          //negative position
          if (inputBoxValue > minimumNegativePositionValue) {
            setUpperValue(inputBoxValue)
          } else if (inputBoxValue < maximumNegativePositionValue) {
            //max negative reached
            props.LogAction(
              `WARNING: Maximum rotation value for negative position is ${maximumNegativePositionValue}, consider using a larger value!`,
            )
            setUpperValue(maximumNegativePositionValue)
            upperLimitInputBox.current.value = maximumNegativePositionValue.toString()
          } else {
            setUpperValue(inputBoxValue)
          }
        }
        //positive position
        else if (inputBoxValue < minimumPositivePositionValue) {
          setUpperValue(inputBoxValue)
        } else if (inputBoxValue > maximumPositivePositionValue) {
          //max positive reached
          props.LogAction(
            `WARNING: Maximum rotation value for positive position is ${maximumPositivePositionValue}, consider using a smaller value!`,
          )
          setUpperValue(maximumPositivePositionValue)
          upperLimitInputBox.current.value = maximumPositivePositionValue.toString()
        } else {
          setUpperValue(inputBoxValue)
        }
      }
    }
  }

  useEffect(() => {
    setUpperMicrosteps(RotationsToMicrosteps(upperValue))
  }, [upperValue])

  useEffect(() => {
    if (upperMicrosteps == 0) {
      setUpperMicrostepsHexaValue('00000000')
    } else {
      let rawPayload_ArrayBufferForTime = new ArrayBuffer(4)
      const viewTime = new DataView(rawPayload_ArrayBufferForTime)

      viewTime.setUint32(0, upperMicrosteps, true)

      let rawTimePayload = new Uint8Array(4)
      rawTimePayload.set([viewTime.getUint8(0)], 0)
      rawTimePayload.set([viewTime.getUint8(1)], 1)
      rawTimePayload.set([viewTime.getUint8(2)], 2)
      rawTimePayload.set([viewTime.getUint8(3)], 3)

      setUpperMicrostepsHexaValue(Uint8ArrayToString(rawTimePayload))
    }
  }, [upperMicrosteps])
  //#endregion UPPER_LIMIT_CONVERSION

  //#region LOWER_LIMIT_CONVERSION
  const [lowerValue, setLowerValue] = useState<number>(0)
  const [lowerMicrosteps, setLowerMicrosteps] = useState<number>(0)
  const [lowerMicrostepsHexaValue, setLowerMicrostepsHexaValue] = useState<
    string
  >('00000000')

  const onLowerLimitInputBoxChange = () => {
    if (lowerLimitInputBox && lowerLimitInputBox.current) {
      const inputBoxValue = parseFloat(lowerLimitInputBox.current.value)

      if (isNaN(inputBoxValue)) {
        setLowerValue(0)
      } else {
        if (inputBoxValue < 0) {
          //negative position
          if (inputBoxValue > minimumNegativePositionValue) {
            setLowerValue(inputBoxValue)
          } else if (inputBoxValue < maximumNegativePositionValue) {
            //max negative reached
            props.LogAction(
              `WARNING: Maximum rotation value for negative position is ${maximumNegativePositionValue}, consider using a larger value!`,
            )
            setLowerValue(maximumNegativePositionValue)
            lowerLimitInputBox.current.value = maximumNegativePositionValue.toString()
          } else {
            setLowerValue(inputBoxValue)
          }
        }
        //positive position
        else if (inputBoxValue < minimumPositivePositionValue) {
          setLowerValue(inputBoxValue)
        } else if (inputBoxValue > maximumPositivePositionValue) {
          //max positive reached
          props.LogAction(
            `WARNING: Maximum rotation value for positive position is ${maximumPositivePositionValue}, consider using a smaller value!`,
          )
          setLowerValue(maximumPositivePositionValue)
          lowerLimitInputBox.current.value = maximumPositivePositionValue.toString()
        } else {
          setLowerValue(inputBoxValue)
        }
      }
    }
  }

  useEffect(() => {
    setLowerMicrosteps(RotationsToMicrosteps(lowerValue))
  }, [lowerValue])

  useEffect(() => {
    if (lowerMicrosteps == 0) {
      setLowerMicrostepsHexaValue('00000000')
    } else {
      let rawPayload_ArrayBufferForPosition = new ArrayBuffer(4)
      const viewPosition = new DataView(rawPayload_ArrayBufferForPosition)
      viewPosition.setUint32(0, lowerMicrosteps, true)

      let rawPositionPayload = new Uint8Array(4)
      rawPositionPayload.set([viewPosition.getUint8(0)], 0)
      rawPositionPayload.set([viewPosition.getUint8(1)], 1)
      rawPositionPayload.set([viewPosition.getUint8(2)], 2)
      rawPositionPayload.set([viewPosition.getUint8(3)], 3)

      setLowerMicrostepsHexaValue(Uint8ArrayToString(rawPositionPayload))
    }
  }, [lowerMicrosteps])
  //#endregion LOWER_LIMIT_CONVERSION

  const execute_command = () => {
    if (
      lowerLimitInputBox &&
      lowerLimitInputBox.current &&
      upperLimitInputBox &&
      upperLimitInputBox.current
    ) {
      const selectedAxis = props.getAxisSelection()
      if (selectedAxis == '') return

      if (
        lowerLimitInputBox.current.value == '' ||
        upperLimitInputBox.current.value == ''
      ) {
        props.LogAction('Please enter both inputs.')
        return
      }

      if (lowerValue < 0) {
        if (lowerValue > minimumNegativePositionValue) {
          props.LogAction(
            `WARNING: Minimum value for negative position is ${minimumNegativePositionValue} (one microstep), consider using a smaller value.`,
          )
        }
      } else if (lowerValue < minimumPositivePositionValue) {
        props.LogAction(
          `WARNING: Minimum value for positive position is ${minimumPositivePositionValue} (one microstep), consider using a larger value.`,
        )
      }

      if (upperValue < 0) {
        if (upperValue > minimumNegativePositionValue) {
          props.LogAction(
            `WARNING: Minimum value for negative position is ${minimumNegativePositionValue} (one microstep), consider using a smaller value.`,
          )
        }
      } else if (upperValue < minimumPositivePositionValue) {
        props.LogAction(
          `WARNING: Minimum value for positive position is ${minimumPositivePositionValue} (one microstep), consider using a larger value.`,
        )
      }

      const rawData = props.constructCommand(
        selectedAxis,
        lowerMicrostepsHexaValue + upperMicrostepsHexaValue,
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
              ref={lowerLimitInputBox}
              onChange={onLowerLimitInputBoxChange}
              type="number"
              placeholder="Lower rotation limit"
              className="input input-bordered basis-1/2  max-w-xs input-sm mr-8"
            />
          </div>
          <div
            className="tooltip tooltip-secondary"
            data-tip="Check out below the conversion in real-time!"
          >
            <input
              ref={upperLimitInputBox}
              onChange={onUpperLimitInputBoxChange}
              type="number"
              placeholder="Upper rotation limit"
              className="input input-bordered basis-1/2  max-w-xs input-sm mr-8"
            />
          </div>
          <div className="tooltip tooltip-secondary" data-tip="Let's move!">
            <button
              className="btn btn-primary btn-sm flex-col"
              onClick={execute_command}
            >
              execute
            </button>
          </div>
        </div>
      </div>
      <article className="mb-10 prose prose-slate max-w-full">
        <ol className="flex">
          <div className="px-5">
            <h4>Lower position conversion</h4>
            <li>
              Transforming position to Microsteps, the formula used is:
              Microsteps = rotations * 645120
              <br></br>
              {`Input: ${lowerValue.toString()} rotations`}
              <br></br>
              {`Output: ${lowerMicrosteps.toString()} Microsteps`}
            </li>
            <li>
              Taking the output from step 1 and transforming it to 32-bit signed
              integer with little-endian fromat
              <br></br>
              {`Input: ${lowerMicrosteps.toString()} Microsteps`}
              <br></br>
              {`Output: 0x${lowerMicrostepsHexaValue}`}
            </li>{' '}
          </div>
          <div className="px-5">
            <h4>Upper position conversion</h4>
            <li>
              Transforming position to Microsteps, the formula used is:
              Microsteps = rotations * 645120
              <br></br>
              {`Input: ${upperValue.toString()} rotations`}
              <br></br>
              {`Output: ${upperMicrosteps.toString()} Microsteps`}
            </li>
            <li>
              Taking the output from step 3 and transforming it to 32-bit signed
              integer with little-endian fromat
              <br></br>
              {`Input: ${upperMicrosteps.toString()} Microsteps`}
              <br></br>
              {`Output: 0x${upperMicrostepsHexaValue}`}
            </li>{' '}
          </div>
        </ol>
      </article>
    </>
  )
}
