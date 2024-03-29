import { ChaptersPropsType } from './0_1'

export const Command12 = (props: ChaptersPropsType) => {
  const e_stop = () => {
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
          <button className="btn btn-primary btn-sm" onClick={e_stop}>
            STOP
          </button>
        </div>
      </div>
    </>
  )
}
