import { ChaptersPropsType } from './0_1'

export const Command11 = (props: ChaptersPropsType) => {
  const get_queue = () => {
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
          <button className="btn btn-primary btn-sm" onClick={get_queue}>
            Get queue size
          </button>
        </div>
      </div>
    </>
  )
}
