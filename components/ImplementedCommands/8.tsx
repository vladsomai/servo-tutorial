import { ChaptersPropsType } from './0_1'

export interface ResetCommandType extends ChaptersPropsType {
  master_time_start: number
  setMaster_time_start: Function
}

export const Command8 = (props: ResetCommandType) => {
  const reset_time = () => {
    const selectedAxis = props.getAxisSelection()
    if (selectedAxis == '') return

    props.setMaster_time_start(Date.now())
    const rawData = props.constructCommand('')
    props.sendDataToSerialPort(rawData)
  }

  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="flex justify-center">
          <div className="mr-4">{props.children}</div>
          <button className="btn btn-primary btn-sm" onClick={reset_time}>
            Reset
          </button>
        </div>
      </div>
    </>
  )
}
