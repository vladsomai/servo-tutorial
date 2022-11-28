import { useRef } from 'react'
import { Char, ErrorTypes, stringToUint8Array } from '../../servo-engine/utils'
import { ChaptersPropsType } from './0_1'

export const Command21 = (props: ChaptersPropsType) => {
  const uniqueIdInputBox = useRef<HTMLInputElement | null>(null)
  const aliasInputBox = useRef<HTMLInputElement | null>(null)

  const execute_command = () => {
    const selectedAxis = props.getAxisSelection()
    if (selectedAxis == '') return

    if (
      aliasInputBox.current &&
      aliasInputBox &&
      uniqueIdInputBox.current &&
      uniqueIdInputBox
    ) {
      if (aliasInputBox.current.value == 'R') {
        props.LogAction(
          ErrorTypes.NO_ERR,
          'R is a reserved alias, please use something else.',
        )
        return
      }

      if (
        !(
          aliasInputBox.current.value == 'E' ||
          aliasInputBox.current.value == 'X' ||
          aliasInputBox.current.value == 'Y' ||
          aliasInputBox.current.value == 'Z'
        )
      ) {
        props.LogAction(
          ErrorTypes.NO_ERR,
          'Currently only E, X, Y, Z aliases are supported!',
        )
        return
      }

      //this will never be hit since we check the axis above
      if (aliasInputBox.current.value.length > 1) {
        props.LogAction(
          ErrorTypes.NO_ERR,
          'The alias must be only one character!',
        )
        return
      }

      if (uniqueIdInputBox.current.value.length != 16) {
        props.LogAction(
          ErrorTypes.NO_ERR,
          "The unique id must be exactly 8 bytes! e.g. '7C661210B2026558'",
        )
        return
      }

      const hexaAlias = new Char(
        aliasInputBox.current.value,
      ).getHexaASCII_Code()

      const rawData = props.constructCommand(
        selectedAxis,
        uniqueIdInputBox.current.value + hexaAlias,
      )
      props.sendDataToSerialPort(rawData)
    }
  }

  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="flex flex-col xl:flex-row justify-center items-center">
          <div className="m-2">{props.children}</div>
          <input
            ref={uniqueIdInputBox}
            type="text"
            placeholder="Unique ID in hexadecimal"
            className="input input-bordered max-w-xs input-sm m-2"
          />
          <input
            ref={aliasInputBox}
            type="text"
            placeholder="Alias"
            className="input input-bordered max-w-xs input-sm m-2"
          />
        </div>
        <button
          className="btn btn-primary btn-sm mt-2"
          onClick={execute_command}
        >
          execute
        </button>
      </div>
    </>
  )
}
