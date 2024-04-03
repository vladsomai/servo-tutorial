import { DataToCapture } from "../../components/Commands/7/7";

export function changeCommandPythonCode(motor_command: number, pythonCode: string) {
    const regEx = new RegExp('motor_command\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "motor_command = " + motor_command.toString() + '\n');
}

export function changeAliasPythonCode(alias: number, pythonCode: string): string {
    const regEx = new RegExp('alias\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "alias = " + alias.toString() + '\n');
}

export function changeDisplacementPythonCode(position: number, pythonCode: string): string {
    const regEx = new RegExp('move_displacement_rotations\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "move_displacement_rotations = " + position.toString() + '\n');
}

export function changeTimePythonCode(time: number, pythonCode: string): string {
    const regEx = new RegExp('move_time_seconds\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "move_time_seconds = " + time.toString() + '\n');
}

export function changeVelocityPythonCode(velocity_rpm: number, pythonCode: string): string {
    const regEx = new RegExp('velocity_rpm\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "velocity_rpm = " + velocity_rpm.toString() + '\n');
}

export function changeAccelerationPythonCode(acceleration_rpm2: number, pythonCode: string): string {
    const regEx = new RegExp('acceleration_rpm2\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "acceleration_rpm2 = " + acceleration_rpm2.toString() + '\n');
}

export function changeHallSensorDataTypePythonCode(dataType: DataToCapture, pythonCode: string): string {
    const regEx = new RegExp('data_to_capture\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "data_to_capture = " + dataType.toString() + '\n');
}

export function changeElapsedTimeSinceResetPythonCode(elapsedTime: BigInt, pythonCode: string): string {
    const regEx = new RegExp('elapsed_time_since_reset\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "elapsed_time_since_reset = " + elapsedTime.toString() + '\n');
}

export function changeUniqueIdPythonCode(uniqueId: string, pythonCode: string): string {
    const regEx = new RegExp('unique_id\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "unique_id = \'" + uniqueId.toString() + '\'\n');
}

export function changeNewAlisPythonCode(newAlias: number, pythonCode: string): string {
    const regEx = new RegExp('new_alias\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "new_alias = " + newAlias.toString() + '\n');
}

export function changeMotorCurrentPythonCode(motorCurrent: number, pythonCode: string): string {
    const regEx = new RegExp('motor_current\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "motor_current = " + motorCurrent.toString() + '\n');
}

export function changeRegenCurrentPythonCode(regenCurrent: number, pythonCode: string): string {
    const regEx = new RegExp('regeneration_current\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "regeneration_current = " + regenCurrent.toString() + '\n');
}

export function changeCommandLengthPythonCode(commandLength: number, pythonCode: string): string {
    const regEx = new RegExp('motor_command_length\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "motor_command_length = " + commandLength.toString() + '\n');
}

export function changeMultiMovesPythonCode(multiMoves: string, pythonCode: string): string {
    const regEx = new RegExp('multi_moves\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "multi_moves = [" + multiMoves.toString() + ' ]\n');
}

export function changeMovesTypesPythonCode(movesTypes: string, pythonCode: string): string {
    const regEx = new RegExp('moves_types\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "moves_types = \'" + movesTypes.toString() + '\'\n');
}

export function changeLowerRotationLimitPythonCode(lowerRotationLimit: number, pythonCode: string): string {
    const regEx = new RegExp('lower_rotation_limit\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "lower_rotation_limit = " + lowerRotationLimit.toString() + '\n');
}

export function changeUpperRotationUpperLimitPythonCode(upperRotationLimit: number, pythonCode: string): string {
    const regEx = new RegExp('upper_rotation_limit\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "upper_rotation_limit = " + upperRotationLimit.toString() + '\n');
}

export function changePingTextPythonCode(pingText: string, pythonCode: string): string {
    const regEx = new RegExp('ping_text\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "ping_text = \'" + pingText + '\'\n');
}

export function changeTurnOnOffGatheringPythonCode(turnOnOffGathering: string, pythonCode: string): string {
    const regEx = new RegExp('turn_on_off_gathering\\s=\\s.*\\n')
    return pythonCode.replace(regEx, "turn_on_off_gathering = " + turnOnOffGathering + '\n');
}

export function changeStepsPerRevolutionPythonCode(stepsPerRevolution: number, clangCode: string): string {
    const regEx = new RegExp('MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION\\s=\\s.*\\n')
    return clangCode.replace(regEx, "MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION = " + stepsPerRevolution + '\n');
}