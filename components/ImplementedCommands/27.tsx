import { ChaptersPropsType } from './0_1'
import Image from 'next/image'

export const Command27 = (props: ChaptersPropsType) => {
  const execute_command = () => {
    const selectedAxis = props.getAxisSelection()
    if (selectedAxis == '') return

    const rawData = props.constructCommand(selectedAxis, '')
    props.sendDataToSerialPort(rawData,true, false)
  }
  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="flex justify-center">
          <div className="mr-4">{props.children}</div>
          <button className="btn btn-primary btn-sm" onClick={execute_command}>
            execute
          </button>
        </div>
      </div>
      {/* <div className="w-[50%] bg-primary text-black rounded-box py-3 px-3 prose prose-slate text-sm mt-11 ">
        <div className="flex  justify-center">
          <Image
            className="mask mask-squircle self-center"
            src={'/info-circle-fill.svg'}
            width={iconSize}
            height={iconSize}
            alt="main picture"
            priority
          ></Image>
          <p className="ml-3">This command supports shortcuts</p>
        </div>
        <ul className="mt-0 pt-0">
          <li>
            <kbd className="kbd text-neutral-content">ctrl</kbd>+
            <kbd className="kbd text-neutral-content">r</kbd>
            <p className="inline"> to reset the current selected axis</p>
          </li>
          <li>
            <kbd className="kbd text-neutral-content">ctrl</kbd>+
            <kbd className="kbd text-neutral-content">R</kbd>
            <p className="inline"> to reset all axes</p>
          </li>
        </ul>
      </div> */}
    </>
  )
}
