import { MainWindowProps } from '../main-window'
import { ReactElement, useRef } from 'react'
import { MotorAxes, MotorAxisType } from '../../servo-engine/motor-axes'
import { ChaptersPropsType } from './0_1'

export const Command31 = (props: ChaptersPropsType) => {
  const textPayloadInputBox = useRef<HTMLInputElement | null>(null)

  const ping_command = () => {
    if (textPayloadInputBox && textPayloadInputBox.current) {
      const selectedAxis = props.getAxisSelection()
      if (selectedAxis == '') return

      const textPayload: string = textPayloadInputBox.current.value
      if (textPayload.length != 10) {
        props.LogAction('Your payload must be exactly 10 characters!')
        return
      }

      let payload = ''
      for (let i = 0; i < textPayload.length; i++) {
        payload += textPayload[i].charCodeAt(0).toString(16)
      }

      const rawData = props.constructCommand(
        selectedAxis,
        payload.toUpperCase(),
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
            defaultValue={'0123456789'}
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
