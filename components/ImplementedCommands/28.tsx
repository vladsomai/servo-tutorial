import { useRef, useContext, useState, useEffect } from 'react'
import { GlobalContext } from '../../pages/_app'
import { ChaptersPropsType } from './0_1'
import {
  ErrorTypes,
  Uint8ArrayToString,
  transfNumberToUint8Arr,
} from '../../servo-engine/utils'

export const Command28 = (props: ChaptersPropsType) => {
  const value = useContext(GlobalContext)

  const maxCurrentInputBox = useRef<HTMLInputElement | null>(null)
  const regenerationInputBox = useRef<HTMLInputElement | null>(null)

  const [maxCurrent, setMaxCurrent] = useState<Uint8Array>()
  const [regenCurrent, setRegenCurrent] = useState<Uint8Array>()

  useEffect(() => {
    const maxCurrentTemp = transfNumberToUint8Arr(150, 2)
    const regenCurrentTemp = transfNumberToUint8Arr(150, 2)

    setMaxCurrent(maxCurrentTemp)
    setRegenCurrent(regenCurrentTemp)

    value.codeExamplePayload.setBytes(
      Uint8ArrayToString(maxCurrentTemp) + Uint8ArrayToString(regenCurrentTemp),
    )

    return () => value.codeExamplePayload.setBytes('')
  }, [])

  const execute_command = () => {
    const selectedAxis = props.getAxisSelection()
    if (selectedAxis == '') return

    if (
      maxCurrentInputBox.current?.value == '' ||
      regenerationInputBox.current?.value == ''
    ) {
      props.LogAction(ErrorTypes.NO_ERR, 'Please enter both inputs.')
      return
    }

    const rawData = props.constructCommand(
      selectedAxis,
      value.codeExamplePayload.Bytes,
    )
    props.sendDataToSerialPort(rawData)
  }

  const handleCurrent = () => {
    if (maxCurrentInputBox.current == null) return

    const maxCurrentStr = maxCurrentInputBox.current.value
    if (maxCurrentStr.trim()[0] == '-') {
      props.LogAction(ErrorTypes.ERR1002, 'You cannot use negative numbers.')
      maxCurrentInputBox.current.value = ''
      return
    }
    const maxCurrentNum: number = parseInt(maxCurrentStr)
    const rawMaxCurrent = transfNumberToUint8Arr(maxCurrentNum, 2)

    setMaxCurrent(rawMaxCurrent)
    value.codeExamplePayload.setBytes(
      Uint8ArrayToString(rawMaxCurrent) + Uint8ArrayToString(regenCurrent),
    )
  }
  const handleRegen = () => {
    if (regenerationInputBox.current == null) return

    const regenCurrentStr = regenerationInputBox.current.value
    if (regenCurrentStr.trim()[0] == '-') {
      props.LogAction(ErrorTypes.ERR1002, 'You cannot use negative numbers.')
      regenerationInputBox.current.value = ''
      return
    }
    const regenCurrentNum: number = parseInt(regenCurrentStr)
    const rawRegenCurrent = transfNumberToUint8Arr(regenCurrentNum, 2)

    setRegenCurrent(rawRegenCurrent)
    value.codeExamplePayload.setBytes(
      Uint8ArrayToString(maxCurrent) + Uint8ArrayToString(rawRegenCurrent),
    )
  }
  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="flex flex-col xl:flex-row justify-center items-center">
          <div className="m-2">{props.children}</div>
          <input
            ref={maxCurrentInputBox}
            onChange={handleCurrent}
            type="text"
            placeholder="Motor current"
            defaultValue={150}
            className="input input-bordered  max-w-xs input-sm m-2"
          />{' '}
          <input
            ref={regenerationInputBox}
            onChange={handleRegen}
            type="text"
            placeholder="Regeneration current"
            defaultValue={150}
            className="input input-bordered max-w-xs input-sm m-2"
          />
        </div>
        <button
          className="btn btn-primary btn-sm mt-2"
          onClick={execute_command}
        >
          Execute
        </button>
      </div>
    </>
  )
}
