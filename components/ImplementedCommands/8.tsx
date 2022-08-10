import { MainWindowProps } from '../main-window'
import { ReactElement, useRef } from 'react'
import { MotorAxes, MotorAxisType } from '../../servo-engine/motor-axes'
import { ChaptersPropsType } from './1_2'

export interface ResetCommandType extends ChaptersPropsType {
  master_time_start: number
  setMaster_time_start:Function
}

export const Command8 = (props: ResetCommandType) => {
  const reset_time = () => {
    const selectedAxis = props.getAxisSelection()
    if (selectedAxis == '') return

    props.setMaster_time_start(Date.now())
    const rawData = props.constructCommand(selectedAxis, '00000000')
    props.sendDataToSerialPort(rawData)
  }

  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="flex justify-center">
          {props.children}
          <button className="btn btn-primary btn-sm" onClick={reset_time}>
            Reset
          </button>
        </div>
      </div>
    </>
  )
}
