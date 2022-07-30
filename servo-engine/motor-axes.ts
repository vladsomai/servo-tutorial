export type MotorAxisType = {
    AxisName: string
    AxisCode: number
}
export const MotorAxes: MotorAxisType[] = [
    { AxisName: "ASCII_R", AxisCode: 82 },
    { AxisName: "ASCII_X", AxisCode: 88 },
    { AxisName: "ASCII_Y", AxisCode: 89 },
    { AxisName: "ASCII_Z", AxisCode: 90 },
    { AxisName: "ALL_AXES", AxisCode: 255 },
]