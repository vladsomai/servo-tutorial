export type MotorAxisType = {
    AxisName: string
    AxisCode: number
}
export const MotorAxes: MotorAxisType[] = [
    { AxisName: "Theta", AxisCode: 82 },
    { AxisName: "X", AxisCode: 88 },
    { AxisName: "Y", AxisCode: 89 },
    { AxisName: "Z", AxisCode: 90 },
    { AxisName: "All axes", AxisCode: 255 },
]