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
        <div className="flex justify-center">
          {props.children}
          <input
            ref={textPayloadInputBox}
            type="text"
            placeholder="Enter text e.g. 0123456789"
            className="input input-bordered basis-1/2  max-w-xs input-sm mr-8"
            defaultValue={'0123456789'}
          />
          <div
            className="tooltip tooltip-secondary"
            data-tip="Test your connection to the motor using this button!"
          >
            <button className="btn btn-primary btn-sm" onClick={ping_command}>
              PING
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
