import { MainWindowProps } from '../main-window'
import { ReactElement, useRef } from 'react'
import { MotorAxes, MotorAxisType } from '../../servo-engine/motor-axes'
import { ResetCommandType } from './8'
import { Uint8ArrayToString } from '../../servo-engine/utils'
import { arrayBuffer } from 'stream/consumers'

export const Command10 = (props: ResetCommandType) => {
  const textPayloadInputBox = useRef<HTMLInputElement | null>(null)

  const sync_time = () => {
    const selectedAxis = props.getAxisSelection()
    if (selectedAxis == '') return

    const elapsedTimeFromReset_ms = Date.now() - props.master_time_start
    const elapsedTimeFromReset_us = elapsedTimeFromReset_ms * 1000

    let rawPayload_ArrayBuffer = new ArrayBuffer(4)
    const view = new DataView(rawPayload_ArrayBuffer)
    view.setUint32(0, elapsedTimeFromReset_us, true)

    let rawPayload = new Uint8Array(4)
    rawPayload.set([view.getUint8(0)], 0)
    rawPayload.set([view.getUint8(1)], 1)
    rawPayload.set([view.getUint8(2)], 2)
    rawPayload.set([view.getUint8(3)], 3)
    let textPayload = Uint8ArrayToString(rawPayload)

    const rawData = props.constructCommand(selectedAxis, textPayload)
    props.sendDataToSerialPort(rawData)
  }
  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="flex justify-center">
          {props.children}
          <button className="btn btn-primary btn-sm" onClick={sync_time}>
            Sync time
          </button>
        </div>
      </div>
    </>
  )
}
