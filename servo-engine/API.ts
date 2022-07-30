import { MotorAxes } from './motor-axes';
import { MotorCommandsDictionary } from './motor-commands';

export type MotorAction = {
    Axis: MotorAxes,
    Action: MotorCommandsDictionary
}