import { forwardRef } from 'react'
import { MotorAxes, MotorAxisType } from '../servo-engine/motor-axes'

export type SelectAxisPropsType = {
  LogAction: Function
  ref: any
  selectionValue: string
}

const SelectAxis = forwardRef<HTMLSelectElement | null, SelectAxisPropsType>(
  (props: SelectAxisPropsType, ref) => {
    return (
      <select
        ref={ref}
        className="select select-bordered select-sm w-full max-w-xs mr-8"
        defaultValue={props.selectionValue}
      >
        {MotorAxes.map((axis: MotorAxisType) => (
          <option key={axis.AxisCode}>{axis.AxisName}</option>
        ))}
      </select>
    )
  },
)

SelectAxis.displayName = 'SelectAxis'
export default SelectAxis
