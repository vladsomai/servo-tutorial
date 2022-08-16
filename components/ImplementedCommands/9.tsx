import { ChaptersPropsType } from './0_1'

export const Command9 = (props: ChaptersPropsType) => {
  const get_current_time = () => {
    const selectedAxis = props.getAxisSelection()
    if (selectedAxis == '') return

    const rawData = props.constructCommand(selectedAxis, '')
    props.sendDataToSerialPort(rawData)
  }
  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="flex justify-center">
          {props.children}
          <div
            className="tooltip tooltip-secondary"
            data-tip="Get current time!"
          >
            <button
              className="btn btn-primary btn-sm"
              onClick={get_current_time}
            >
              execute
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
