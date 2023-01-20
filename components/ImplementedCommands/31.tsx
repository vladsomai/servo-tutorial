import { useContext, useRef, useEffect, useState } from 'react'
import { ChaptersPropsType } from './0_1'
import { ErrorTypes } from '../../servo-engine/utils'
import { GlobalContext } from '../../pages/_app'

export const Command31 = (props: ChaptersPropsType) => {
  const textPayloadInputBox = useRef<HTMLInputElement | null>(null)
  const value = useContext(GlobalContext)
  const initialText = '0123456789'

  useEffect(() => {
    handlePingbox()
    return () => value.codeExamplePayload.setBytes('')
  }, [])

  const convertTextToASCII = (textPayload: string) => {
    let payload = ''
    for (let i = 0; i < textPayload.length; i++) {
      payload += textPayload[i].charCodeAt(0).toString(16).toUpperCase()
    }
    return payload
  }
  const handlePingbox = () => {
    if (!textPayloadInputBox.current) return

    const textPayload = textPayloadInputBox.current.value

    let textCompleted = convertTextToASCII(textPayload).slice(0, 20)

    for (let i = textCompleted.length; i < initialText.length * 2; i++) {
      textCompleted += '0'
    }
    value.codeExamplePayload.setBytes(textCompleted)
  }

  const ping_command = () => {
    if (textPayloadInputBox && textPayloadInputBox.current) {
      const selectedAxis = props.getAxisSelection()
      if (selectedAxis == '') return

      if (value.codeExamplePayload.Bytes.length / 2 != 10) {
        props.LogAction(
          ErrorTypes.NO_ERR,
          'Your payload must be exactly 10 characters!',
        )
        return
      }

      const rawData = props.constructCommand(
        selectedAxis,
        value.codeExamplePayload.Bytes,
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
            ref={textPayloadInputBox}
            type="text"
            placeholder="Enter text e.g. 0123456789"
            className="input input-bordered max-w-xs input-sm m-2"
            defaultValue={initialText}
            onChange={handlePingbox}
          />
        </div>
        <div
          className="tooltip tooltip-primary"
          data-tip="Test your connection to the motor using this command."
        >
          <button
            className="btn btn-primary btn-sm mt-2"
            onClick={ping_command}
          >
            PING
          </button>
        </div>
      </div>
    </>
  )
}
