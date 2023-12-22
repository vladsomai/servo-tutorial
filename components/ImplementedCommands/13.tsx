import { ChaptersPropsType } from './0_1'

export const Command13 = (props: ChaptersPropsType) => {
  const zero_position = () => {
    const selectedAxis = props.getAxisSelection()
    if (selectedAxis == '') return

    const rawData = props.constructCommand('')
    props.sendDataToSerialPort(rawData)
  }
  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="flex justify-center">
          <div className="mr-4">{props.children}</div>
          <button className="btn btn-primary btn-sm" onClick={zero_position}>
            Set origin
          </button>
        </div>
      </div>
    </>
  )
}
