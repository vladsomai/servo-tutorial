import { forwardRef, SyntheticEvent, useRef } from 'react'
import { MotorAxes, MotorAxisType } from '../servo-engine/motor-axes'

export type SelectAxisPropsType = {
  LogAction: Function
  axisSelectionValue: string
  setAxisSelectionValue: Function
}

const SelectAxis = (props: SelectAxisPropsType) => {
  const selectionRef = useRef<HTMLSelectElement | null>(null)

  const onSelectionChange = () => {
    if (selectionRef && selectionRef.current) {
      let selectedAxis =
        selectionRef.current.options[selectionRef.current.selectedIndex].text

      props.setAxisSelectionValue(selectedAxis)
    }
  }

  return (
    <select
      ref={selectionRef}
      className="select select-bordered select-sm w-full max-w-xs mr-8"
      defaultValue={props.axisSelectionValue}
      onChange={onSelectionChange}
    >
      {MotorAxes.map((axis: MotorAxisType) => (
        <option key={axis.AxisCode}>{axis.AxisName}</option>
      ))}
    </select>
  )
}

SelectAxis.displayName = 'SelectAxis'
export default SelectAxis

// const SelectAxis = forwardRef<HTMLSelectElement | null, SelectAxisPropsType>(
//   (props: SelectAxisPropsType, ref) => {
//     const test = (e:SyntheticEvent)=>{
//       console.log(e)
//       // setAxisSelectionValue()
//     }
//     return (
//       <select
//         ref={ref}
//         className="select select-bordered select-sm w-full max-w-xs mr-8"
//         defaultValue={props.axisSelectionValue}
//         onChange={test}
//       >
//         {MotorAxes.map((axis: MotorAxisType) => (
//           <option key={axis.AxisCode}>{axis.AxisName}</option>
//         ))}
//       </select>
//     )
//   },
// )
