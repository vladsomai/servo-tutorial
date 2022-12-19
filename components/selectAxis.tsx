import { useRef } from 'react'
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
      className="select select-bordered select-sm max-w-xs"
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