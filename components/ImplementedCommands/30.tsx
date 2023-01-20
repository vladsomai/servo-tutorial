import { useEffect, useRef, useState, useContext } from 'react'
import { GlobalContext } from '../../pages/_app'
import {
  RotationsToMicrosteps,
  SecondToTimesteps,
  Uint8ArrayToString,
  maximumNegativePosition,
  maximumPositivePosition,
  minimumNegativePosition,
  minimumPositivePosition,
  ErrorTypes,
  transfNumberToUint8Arr,
} from '../../servo-engine/utils'
import { ChaptersPropsType } from './0_1'

export const Command30 = (props: ChaptersPropsType) => {
  const value = useContext(GlobalContext)
  const upperLimitInputBox = useRef<HTMLInputElement | null>(null)
  const lowerLimitInputBox = useRef<HTMLInputElement | null>(null)

  //#region UPPER_LIMIT_CONVERSION
  const [upperValue, setUpperValue] = useState<number>(0)
  const [upperMicrosteps, setUpperMicrosteps] = useState<number>(0)
  const [upperMicrostepsHexaValue, setUpperMicrostepsHexaValue] = useState<
    string
  >('00000000')
  const [lowerValue, setLowerValue] = useState<number>(0)
  const [lowerMicrosteps, setLowerMicrosteps] = useState<number>(0)
  const [lowerMicrostepsHexaValue, setLowerMicrostepsHexaValue] = useState<
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
          if (inputBoxValue > minimumNegativePosition) {
            setUpperValue(inputBoxValue)
          } else if (inputBoxValue < maximumNegativePosition) {
            //max negative reached
            props.LogAction(
              ErrorTypes.ERR1001,
              `Maximum rotation value for negative position is ${maximumNegativePosition}, consider using a larger value!`,
            )
            setUpperValue(maximumNegativePosition)
            upperLimitInputBox.current.value = maximumNegativePosition.toString()
          } else {
            setUpperValue(inputBoxValue)
          }
        }
        //positive position
        else if (inputBoxValue < minimumPositivePosition) {
          setUpperValue(inputBoxValue)
        } else if (inputBoxValue > maximumPositivePosition) {
          //max positive reached
          props.LogAction(
            ErrorTypes.ERR1001,
            `Maximum rotation value for positive position is ${maximumPositivePosition}, consider using a smaller value!`,
          )
          setUpperValue(maximumPositivePosition)
          upperLimitInputBox.current.value = maximumPositivePosition.toString()
        } else {
          setUpperValue(inputBoxValue)
        }
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
    setUpperMicrosteps(RotationsToMicrosteps(upperValue))
  }, [upperValue])

  useEffect(() => {
    if (upperMicrosteps == 0) {
      setUpperMicrostepsHexaValue('00000000')
      value.codeExamplePayload.setBytes(lowerMicrostepsHexaValue + '00000000')
    } else {
      const strUpperMicrosteps = Uint8ArrayToString(
        transfNumberToUint8Arr(upperMicrosteps, 4),
      )
      setUpperMicrostepsHexaValue(strUpperMicrosteps)
      value.codeExamplePayload.setBytes(
        lowerMicrostepsHexaValue + strUpperMicrosteps,
      )
    }
  }, [upperMicrosteps, lowerMicrostepsHexaValue, value.codeExamplePayload])
  //#endregion UPPER_LIMIT_CONVERSION

  //#region LOWER_LIMIT_CONVERSION

  const onLowerLimitInputBoxChange = () => {
    if (lowerLimitInputBox && lowerLimitInputBox.current) {
      const inputBoxValue = parseFloat(lowerLimitInputBox.current.value)

      if (isNaN(inputBoxValue)) {
        setLowerValue(0)
      } else {
        if (inputBoxValue < 0) {
          //negative position
          if (inputBoxValue > minimumNegativePosition) {
            setLowerValue(inputBoxValue)
          } else if (inputBoxValue < maximumNegativePosition) {
            //max negative reached
            props.LogAction(
              ErrorTypes.ERR1001,
              `Maximum rotation value for negative position is ${maximumNegativePosition}, consider using a larger value!`,
            )
            setLowerValue(maximumNegativePosition)
            lowerLimitInputBox.current.value = maximumNegativePosition.toString()
          } else {
            setLowerValue(inputBoxValue)
          }
        }
        //positive position
        else if (inputBoxValue < minimumPositivePosition) {
          setLowerValue(inputBoxValue)
        } else if (inputBoxValue > maximumPositivePosition) {
          //max positive reached
          props.LogAction(
            ErrorTypes.ERR1001,
            `Maximum rotation value for positive position is ${maximumPositivePosition}, consider using a smaller value!`,
          )
          setLowerValue(maximumPositivePosition)
          lowerLimitInputBox.current.value = maximumPositivePosition.toString()
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
      value.codeExamplePayload.setBytes('00000000' + upperMicrostepsHexaValue)
    } else {
      const strLowerMicrosteps = Uint8ArrayToString(
        transfNumberToUint8Arr(lowerMicrosteps, 4),
      )
      setLowerMicrostepsHexaValue(strLowerMicrosteps)
      value.codeExamplePayload.setBytes(
        strLowerMicrosteps + upperMicrostepsHexaValue,
      )
    }
  }, [lowerMicrosteps, value.codeExamplePayload, upperMicrostepsHexaValue])
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
        props.LogAction(ErrorTypes.NO_ERR, 'Please enter both inputs.')
        return
      }

      if (lowerValue < 0) {
        if (lowerValue > minimumNegativePosition) {
          props.LogAction(
            ErrorTypes.ERR1002,
            `Minimum value for negative position is ${minimumNegativePosition} (one microstep), consider using a smaller value.`,
          )
        }
      } else if (lowerValue < minimumPositivePosition) {
        props.LogAction(
          ErrorTypes.ERR1002,
          `Minimum value for positive position is ${minimumPositivePosition} (one microstep), consider using a larger value.`,
        )
      }

      if (upperValue < 0) {
        if (upperValue > minimumNegativePosition) {
          props.LogAction(
            ErrorTypes.ERR1002,
            `Minimum value for negative position is ${minimumNegativePosition} (one microstep), consider using a smaller value.`,
          )
        }
      } else if (upperValue < minimumPositivePosition) {
        props.LogAction(
          ErrorTypes.ERR1002,
          `Minimum value for positive position is ${minimumPositivePosition} (one microstep), consider using a larger value.`,
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
        <div className="flex flex-col xl:flex-row justify-center items-center">
          <div className="m-2">{props.children}</div>
          <div
            className="tooltip tooltip-ghost"
            data-tip="Check out below the conversion in real-time!"
          >
            <input
              ref={lowerLimitInputBox}
              onChange={onLowerLimitInputBoxChange}
              type="number"
              placeholder="Lower rotation limit"
              className="input input-bordered basis-1/2  max-w-xs input-sm m-2"
            />
          </div>
          <div
            className="tooltip tooltip-ghost"
            data-tip="Check out below the conversion in real-time!"
          >
            <input
              ref={upperLimitInputBox}
              onChange={onUpperLimitInputBoxChange}
              type="number"
              placeholder="Upper rotation limit"
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
      <article className="mb-10 prose prose-slate max-w-full">
        <ol className="flex">
          <div className="px-5">
            <h4>Lower position conversion</h4>
            <li>
              Transforming position to Microsteps, the formula used is:
              <br></br>
              <i>Microsteps = rotations * 645120</i>
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
              <br></br>
              <i>Microsteps = rotations * 645120</i>
              <br></br>
              {`Input: ${upperValue.toString()} rotations`}
              <br></br>
              {`Output: ${upperMicrosteps.toString()} Microsteps`}
            </li>
            <li>
              Taking the output from step 3 and transforming it to 32-bit signed
              integer with little-endian format
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
