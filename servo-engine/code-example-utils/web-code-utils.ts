import { DataToCapture } from "../../components/Commands/7/7";

export function changeCommandWebCode(motor_command: number, webCode: string) {
    const regEx = new RegExp('const motor_command\\s=\\s.*\\n')
    return webCode.replace(regEx, "const motor_command = " + motor_command.toString() + '\n');
}

export function changeAliasWebCode(alias: number, webCode: string): string {
    const regEx = new RegExp('const alias\\s=\\s.*\\n')
    return webCode.replace(regEx, "const alias = " + alias.toString() + '\n');
}

export function changeDisplacementWebCode(position: number, webCode: string): string {
    const regEx = new RegExp('const move_displacement_rotations\\s=\\s.*\\n')
    return webCode.replace(regEx, "const move_displacement_rotations = " + position.toString() + '\n');
}

export function changeTimeWebCode(time: number, webCode: string): string {
    const regEx = new RegExp('const move_time_seconds\\s=\\s.*\\n')
    return webCode.replace(regEx, "const move_time_seconds = " + time.toString() + '\n');
}

export function changeVelocityWebCode(velocity_rpm: number, webCode: string): string {
    const regEx = new RegExp('const velocity_rpm\\s=\\s.*\\n')
    return webCode.replace(regEx, "const velocity_rpm = " + velocity_rpm.toString() + '\n');
}

export function changeAccelerationWebCode(acceleration_rpm2: number, webCode: string): string {
    const regEx = new RegExp('const acceleration_rpm2\\s=\\s.*\\n')
    return webCode.replace(regEx, "const acceleration_rpm2 = " + acceleration_rpm2.toString() + '\n');
}

export function changeHallSensorDataTypeWebCode(dataType: DataToCapture, webCode: string): string {
    const regEx = new RegExp('const data_to_capture\\s=\\s.*\\n')
    return webCode.replace(regEx, "const data_to_capture = " + dataType.toString() + '\n');
}

export function changeElapsedTimeSinceResetWebCode(elapsedTime: BigInt, webCode: string): string {
    const regEx = new RegExp('const elapsed_time_since_reset\\s=\\s.*\\n')
    return webCode.replace(regEx, "const elapsed_time_since_reset = " + elapsedTime.toString() + '\n');
}

export function changeUniqueIdWebCode(uniqueId: string, webCode: string): string {
    const regEx = new RegExp('const unique_id\\s=\\s.*\\n')
    return webCode.replace(regEx, "const unique_id = \'" + uniqueId.toString() + '\'\n');
}

export function changeNewAlisWebCode(newAlias: number, webCode: string): string {
    const regEx = new RegExp('const new_alias\\s=\\s.*\\n')
    return webCode.replace(regEx, "const new_alias = " + newAlias.toString() + '\n');
}

export function changeMotorCurrentWebCode(motorCurrent: number, webCode: string): string {
    const regEx = new RegExp('const motor_current\\s=\\s.*\\n')
    return webCode.replace(regEx, "const motor_current = " + motorCurrent.toString() + '\n');
}

export function changeRegenCurrentWebCode(regenCurrent: number, webCode: string): string {
    const regEx = new RegExp('const regeneration_current\\s=\\s.*\\n')
    return webCode.replace(regEx, "const regeneration_current = " + regenCurrent.toString() + '\n');
}

export function changeCommandLengthWebCode(commandLength: number, webCode: string): string {
    const regEx = new RegExp('const motor_command_length\\s=\\s.*\\n')
    return webCode.replace(regEx, "const motor_command_length = " + commandLength.toString() + '\n');
}

export function changeMultiMovesWebCode(multiMoves: string, webCode: string): string {
    const regEx = new RegExp('const multi_moves\\s=\\s.*\\n')
    return webCode.replace(regEx, "const multi_moves = [" + multiMoves.toString() + ' ]\n');
}

export function changeMovesTypesWebCode(movesTypes: string, webCode: string): string {
    const regEx = new RegExp('const moves_types\\s=\\s.*\\n')
    return webCode.replace(regEx, "const moves_types = \'" + movesTypes.toString() + '\'\n');
}

export function changeLowerRotationLimitWebCode(lowerRotationLimit: number, webCode: string): string {
    const regEx = new RegExp('const lower_rotation_limit\\s=\\s.*\\n')
    return webCode.replace(regEx, "const lower_rotation_limit = " + lowerRotationLimit.toString() + '\n');
}

export function changeUpperRotationUpperLimitWebCode(upperRotationLimit: number, webCode: string): string {
    const regEx = new RegExp('const upper_rotation_limit\\s=\\s.*\\n')
    return webCode.replace(regEx, "const upper_rotation_limit = " + upperRotationLimit.toString() + '\n');
}

export function changePingTextWebCode(pingText: string, webCode: string): string {
    const regEx = new RegExp('const ping_text\\s=\\s.*\\n')
    return webCode.replace(regEx, "const ping_text = \'" + pingText + '\'\n');
}

export function changeTurnOnOffGatheringWebCode(turnOnOffGathering: string, webCode: string): string {
    const regEx = new RegExp('const turn_on_off_gathering\\s=\\s.*\\n')
    return webCode.replace(regEx, "const turn_on_off_gathering = " + turnOnOffGathering + '\n');
}
