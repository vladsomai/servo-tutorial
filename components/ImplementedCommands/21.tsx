import { useRef, useContext, useState, useEffect } from 'react'
import { Char, ErrorTypes } from '../../servo-engine/utils'
import { ChaptersPropsType } from './0_1'
import { GlobalContext } from '../../pages/_app'

export const Command21 = (props: ChaptersPropsType) => {
  const value = useContext(GlobalContext)

  useEffect(
    (setBytes = value.codeExamplePayload.setBytes) => {
      return () => setBytes('')
    },
    [value.codeExamplePayload.setBytes],
  )

  const [uniqueId, setUniqueId] = useState('0000000000000000')
  const [hexAlias, setHexAlias] = useState('00')

  const uniqueIdInputBox = useRef<HTMLInputElement | null>(null)
  const aliasInputBox = useRef<HTMLInputElement | null>(null)
  const AllowedChars = '0123456789ABCDEF'
  const handleUniqueID = () => {
    if (!uniqueIdInputBox.current) return

    const currentVal = uniqueIdInputBox.current.value
    const lastChar = currentVal[currentVal.length - 1]

    if (currentVal == '') return

    if (!AllowedChars.includes(lastChar?.toUpperCase())) {
      props.LogAction(
        ErrorTypes.ERR1002,
        'You are not allowed to use non-hexadecimal characters!',
      )
      uniqueIdInputBox.current.value = currentVal.slice(
        0,
        currentVal.length - 1,
      )
      return
    }

    if (currentVal.length % 2 != 0) return
    if (currentVal.length > 16) {
      props.LogAction(
        ErrorTypes.ERR1002,
        'Length of Unique ID cannot be larger than 8 bytes.',
      )

      uniqueIdInputBox.current.value = currentVal.slice(
        0,
        currentVal.length - 1,
      )
    }
    let completedVal = currentVal
    while (completedVal.length < 16) {
      completedVal += '0'
    }
    setUniqueId(completedVal)
    value.codeExamplePayload.setBytes(completedVal + hexAlias)
  }
  const handleAlias = () => {
    if (!aliasInputBox.current) return

    if (aliasInputBox.current.value == 'R') {
      setHexAlias('00')
      value.codeExamplePayload.setBytes(uniqueId + '00')
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
      setHexAlias('00')
      value.codeExamplePayload.setBytes(uniqueId + '00')
      return
    }
    const tempHexaAlias = new Char(
      aliasInputBox.current.value,
    ).getHexaASCII_Code()
    setHexAlias(tempHexaAlias)
    value.codeExamplePayload.setBytes(uniqueId + tempHexaAlias)
  }

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
      //leaving it here since this command may suffer changes
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
        21,
      )
      props.sendDataToSerialPort(rawData, true, false)
    }
  }

  return (
    <>
      <div className="my-5">
        <p>
          Using &quot;Detect devices&quot; command you will be able to find out
          your motor&apos;s Unique ID, make sure you reset the motor using
          &quot;System reset&quot; command before and after issuing the
          &quot;Set device alias&quot; command.
        </p>
        <p>
          The Unique ID replied by &quot;Detect devices&quot; can directly be
          copy-pasted from the log window as is.
        </p>
        <p>
          The &quot;Alias&quot; of your motor will also be replied by
          &quot;Detect devices&quot;, select that alias from the left-most
          selection box below.
        </p>
      </div>
      <div className="w-full text-center mb-5">
        <div className="flex flex-col xl:flex-row justify-center items-center">
          <div className="m-2">{props.children}</div>

          <input
            ref={uniqueIdInputBox}
            type="text"
            placeholder="Unique ID in hexadecimal"
            className="input input-bordered w-full max-w-[60%] 2xl:max-w-[50%] input-sm m-2"
            onChange={handleUniqueID}
          />
          <input
            ref={aliasInputBox}
            type="text"
            placeholder="Alias"
            className="input input-bordered w-[25%] 2xl:max-w-[17%] input-sm m-2"
            onChange={handleAlias}
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
