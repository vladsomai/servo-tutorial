import { DataToCapture } from "../../components/Commands/7/7";

export function changeCommandClangCode(motor_command: number, clangCode: string) {
    const regEx = new RegExp('motor_command\\s=\\s.*\\n')
    return clangCode.replace(regEx, "motor_command = " + motor_command.toString() + ';\n');
}

export function changeRecvLenClangCode(recv_cmd_len: number, clangCode: string) {
    const regEx = new RegExp('motor_command_recv_len\\s.*\\n')
    return clangCode.replace(regEx, "motor_command_recv_len " + recv_cmd_len.toString() + ';\n');
}

export function changeAliasClangCode(alias: number, clangCode: string): string {
    const regEx = new RegExp('alias\\s=\\s.*\\n')
    return clangCode.replace(regEx, "alias = " + alias.toString() + ';\n');
}

export function changeDisplacementClangCode(position: number, clangCode: string): string {
    const regEx = new RegExp('move_displacement_rotations\\s=\\s.*\\n')
    return clangCode.replace(regEx, "move_displacement_rotations = " + position.toString() + ';\n');
}

export function changeTimeClangCode(time: number, clangCode: string): string {
    const regEx = new RegExp('move_time_seconds\\s=\\s.*\\n')
    return clangCode.replace(regEx, "move_time_seconds = " + time.toString() + ';\n');
}

export function changeVelocityClangCode(velocity_rpm: number, clangCode: string): string {
    const regEx = new RegExp('velocity_rpm\\s=\\s.*\\n')
    return clangCode.replace(regEx, "velocity_rpm = " + velocity_rpm.toString() + ';\n');
}

export function changeAccelerationClangCode(acceleration_rpm2: number, clangCode: string): string {
    const regEx = new RegExp('acceleration_rpm2\\s=\\s.*\\n')
    return clangCode.replace(regEx, "acceleration_rpm2 = " + acceleration_rpm2.toString() + ';\n');
}

export function changeHallSensorDataTypeClangCode(dataType: DataToCapture, clangCode: string): string {
    const regEx = new RegExp('data_to_capture\\s=\\s.*\\n')
    return clangCode.replace(regEx, "data_to_capture = " + dataType.toString() + ';\n');
}

export function changeElapsedTimeSinceResetClangCode(elapsedTime: BigInt, clangCode: string): string {
    const regEx = new RegExp('elapsed_time_since_reset\\s=\\s.*\\n')
    return clangCode.replace(regEx, "elapsed_time_since_reset = " + elapsedTime.toString() + ';\n');
}

export function changeUniqueIdClangCode(uniqueId: string, clangCode: string): string {
    const regEx = new RegExp('unique_id\\s=\\s.*\\n')
    return clangCode.replace(regEx, "unique_id = \"" + uniqueId.toString() + '\";\n');
}

export function changeNewAlisClangCode(newAlias: number, clangCode: string): string {
    const regEx = new RegExp('new_alias\\s=\\s.*\\n')
    return clangCode.replace(regEx, "new_alias = " + newAlias.toString() + ';\n');
}

export function changeMotorCurrentClangCode(motorCurrent: number, clangCode: string): string {
    const regEx = new RegExp('motor_current\\s=\\s.*\\n')
    return clangCode.replace(regEx, "motor_current = " + motorCurrent.toString() + ';\n');
}

export function changeRegenCurrentClangCode(regenCurrent: number, clangCode: string): string {
    const regEx = new RegExp('regeneration_current\\s=\\s.*\\n')
    return clangCode.replace(regEx, "regeneration_current = " + regenCurrent.toString() + ';\n');
}

export function changeCommandLengthClangCode(commandLength: number, clangCode: string): string {
    const regEx = new RegExp('motor_command_length\\s=\\s.*\\n')
    return clangCode.replace(regEx, "motor_command_length = " + commandLength.toString() + ';\n');
}

export function changeMultiMovesClangCode(multiMoves: string, clangCode: string): string {
    const regEx = new RegExp('multi_moves\\[\\]\\[2\\]\\s=\\s.*\\n')
    return clangCode.replace(regEx, "multi_moves\[\]\[2\] = { " + multiMoves + ' };\n');
}

export function changeMovesTypesClangCode(movesTypes: string, clangCode: string): string {
    const regEx = new RegExp('moves_types\\s=\\s.*\\n')
    return clangCode.replace(regEx, "moves_types = \"" + movesTypes.toString() + '\";\n');
}

export function changeLowerRotationLimitClangCode(lowerRotationLimit: number, clangCode: string): string {
    const regEx = new RegExp('lower_rotation_limit\\s=\\s.*\\n')
    return clangCode.replace(regEx, "lower_rotation_limit = " + lowerRotationLimit.toString() + ';\n');
}

export function changeUpperRotationUpperLimitClangCode(upperRotationLimit: number, clangCode: string): string {
    const regEx = new RegExp('upper_rotation_limit\\s=\\s.*\\n')
    return clangCode.replace(regEx, "upper_rotation_limit = " + upperRotationLimit.toString() + ';\n');
}

export function changePingTextClangCode(pingText: string, clangCode: string): string {
    const regEx = new RegExp('ping_text\\s=\\s.*\\n')
    return clangCode.replace(regEx, "ping_text = \"" + pingText + '\";\n');
}

export function changeTurnOnOffGatheringClangCode(turnOnOffGathering: string, clangCode: string): string {
    const regEx = new RegExp('turn_on_off_gathering\\s=\\s.*\\n')
    return clangCode.replace(regEx, "turn_on_off_gathering = " + turnOnOffGathering + ';\n');
}

export function changeStepsPerRevolutionClangCode(stepsPerRevolution: number, clangCode: string): string {
    const regEx = new RegExp('MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION\\s=\\s.*\\n')
    return clangCode.replace(regEx, "MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION = " + stepsPerRevolution + ';\n');
}