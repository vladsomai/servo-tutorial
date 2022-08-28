export type MotorCommandsDictionary = {
    CommandString: string,
    CommandEnum: number,
    Description: string,
    Input: string[] | string,
    Output: string[] | string,
}

export const MotorCommands: MotorCommandsDictionary[]
    =
    [
        { CommandString: "Commands protocol", CommandEnum: 100, Description: "Here you will learn how a raw command that is being sent to the servo motor is built.", Input: "", Output: "" },
        { CommandString: "DISABLE_MOSFETS_COMMAND", CommandEnum: 0, Description: "Disable MOSFETS (note that MOSFETs are disabled after initial power on)", Input: "None", Output: "Response: success_response" },
        { CommandString: "ENABLE_MOSFETS_COMMAND", CommandEnum: 1, Description: "Enable MOSFETS", Input: "None", Output: "Response: success_response" },
        { CommandString: "SET_MAX_VELOCITY_COMMAND", CommandEnum: 3, Description: "Sets maximum velocity (this is not used at this time)", Input: "u32: Maximum velocity", Output: "Response: success_response" },
        { CommandString: "SET_POSITION_AND_FINISH_TIME_COMMAND", CommandEnum: 4, Description: "Move to this new given position and finish the move at the given absolution time", Input: ["i32: Position value","u32: Time value"], Output: "Response: success_response" },
        { CommandString: "SET_MAX_ACCELERATION_COMMAND", CommandEnum: 5, Description: "Sets max acceleration", Input: "u16: The maximum acceleration", Output: "Response: success_response" },
        { CommandString: "START_CALIBRATION_COMMAND", CommandEnum: 6, Description: "Starts a calibration, which will determine the average values of the hall sensors and will determine if they are working correctly", Input: "None", Output: "None" },
        { CommandString: "CAPTURE_HALL_SENSOR_DATA_COMMAND", CommandEnum: 7, Description: "Start sending hall sensor data (work in progress; don't send this command)", Input: "u8: Indicates the type of data to read. Currently 1 to 4 are valid. 0 indicates turning off the reading.", Output: "Response: unknown_data: Various data. This is work in progress." },
        { CommandString: "RESET_TIME_COMMAND", CommandEnum: 8, Description: "Resets the absolute time to zero (call this first before issuing any movement commands)", Input: "None", Output: "Response: success_response" },
        { CommandString: "TIME_SYNC_COMMAND", CommandEnum: 10, Description: "Sends the master time to the motor so that it can sync its own clock (do this 10 times per second)", Input: "u48: The motor absolute time that the motor should sync to (in microseconds)", Output: "Response: i32: The error in the motor's time compared to the master time. Response: u16: The contents of the RCC-ICSCR register (holds the HSICAL and HSITRIM settings)" },
        { CommandString: "GET_CURRENT_TIME_COMMAND", CommandEnum: 9, Description: "Gets the current absolute time", Input: "None", Output: "Response: u48: The current absolute time" },
        { CommandString: "GET_N_ITEMS_IN_QUEUE_COMMAND", CommandEnum: 11, Description: "Get the number of items currently in the movement queue (if this gets too large, don't queue any more movement commands)", Input: "None", Output: "Response: u8: The number of items in the movement queue. This command will return between 0 and 32. If less than 32, you can add more items to the queue to continue the movements in order without stopping." },
        { CommandString: "EMERGENCY_STOP_COMMAND", CommandEnum: 12, Description: "Emergency stop (stop all movement, disable MOSFETS, clear the queue)", Input: "None", Output: "Response: success_response" },
        { CommandString: "ZERO_POSITION_COMMAND", CommandEnum: 13, Description: "Make the current position the position zero (origin)", Input: "None", Output: "Response: success_response" },
        { CommandString: "HOMING_COMMAND", CommandEnum: 14, Description: "Homing (or in other words, move until a crash and then stop immediately)", Input: ["i32: The maximum distance to move (if a crash does not occur). This can be positive or negative. the sign determines the direction of movement.","u32: The maximum time to allow for homing. Make sure to give enough time for the motor to cover the maximum distance or the motor may move too fast or throw a fatal error."], Output: "Response: success_response" },
        { CommandString: "GET_POSITION_COMMAND", CommandEnum: 15, Description: "Gets the current position", Input: "None", Output: "Response: i32: The current position" },
        { CommandString: "GET_STATUS_COMMAND", CommandEnum: 16, Description: "Gets the status", Input: "None", Output: "Response: u8: A series of flags which are 1 bit each. These are:    Bit 0: In the bootloader (if this flag is set then the other flags below will all be 0)    Bit 1: MOSFETs are enabled    Bit 2: Motor is in closed loop mode    Bit 3: Motor is currently executing the calibration command    Bit 4: Motor is currently executing a homing command    Bit 5: Not used, set to 0    Bit 6: Not used, set to 0 Bit 7: Not used, set to 0 Response: u8: The fatal error code. If 0 then there is no fatal error. Once a fatal error happens, the motor becomes disabled and cannot do much anymore until reset. You can press the reset button on the motor or you can execute the SYSTEM_RESET_COMMAND to get out of the fatal error state." },
        { CommandString: "GO_TO_CLOSED_LOOP_COMMAND", CommandEnum: 17, Description: "Go to closed loop position control mode", Input: "None", Output: "Response: success_response" },
        { CommandString: "GET_UPDATE_FREQUENCY_COMMAND", CommandEnum: 18, Description: "Get the update frequency (reciprocal of the time step)", Input: "None", Output: "Response: u32: Update frequency in Hz. This is how often the motor executes all calculations for hall sensor position, movement, PID loop, safety, etc." },
        { CommandString: "MOVE_WITH_ACCELERATION_COMMAND", CommandEnum: 19, Description: "Move with acceleration", Input: ["i32: The acceleration (the unit is microsteps per time step per time step * 2^24).","u32: The number of time steps to apply this acceleration. Use command 18 to get the frequency of the time steps. After this many time steps, the acceleration will go to zero and velocity will be maintained."], Output: "Response: success_response" },
        { CommandString: "DETECT_DEVICES_COMMAND", CommandEnum: 20, Description: "Detect devices", Input: "None", Output: "Response: u64_unique_id: A unique ID (unique among all devices manufactured). The response is sent after a random delay of between 0 and 1 seconds. Response: u8_alias: The alias of the device that has this unique ID. Response: crc32: A CRC32 value for this packet. This is used to verify that the response is correct. However, currently this is hardcoded as 0x04030201" },
        { CommandString: "SET_DEVICE_ALIAS_COMMAND", CommandEnum: 21, Description: "Set device alias", Input: ["u64_unique_id: Unique ID of the target device.","u8_alias: The alias (short one byte ID) such as X, Y, Z, E, etc. Cannot be R because this is reserved for a response message."], Output: "Response: success_response: Indicates success" },
        { CommandString: "GET_PRODUCT_INFO_COMMAND", CommandEnum: 22, Description: "Get product information", Input: "None", Output: "Response: string8: The product code / model number (when doing a firmware upgrade, this must match between the firmware file and the target device). Response: u8: A firmware compatibility code (when doing a firmware upgrade, this must match between the firmware file and the target device). Response: u24_version_number: The hardware version stored as 3 bytes. The first byte is the patch version, followed by the minor and major versions.. Response: u32: The serial number. Response: u64_unique_id: The unique ID for the product. Response: u32: Not currently used." },
        { CommandString: "FIRMWARE_UPGRADE_COMMAND", CommandEnum: 23, Description: "Upgrade one page of flash memory (several of these are needed to do a full firmware upgrade). Documentation to be done later.", Input: "None", Output: "Response: success_response" },
        { CommandString: "GET_PRODUCT_DESCRIPTION_COMMAND", CommandEnum: 24, Description: "Get the product description. Documentation to be done later.", Input: "None", Output: "Response: string_null_term: This is a brief description of the product" },
        { CommandString: "GET_FIRMWARE_VERSION_COMMAND", CommandEnum: 25, Description: "Get the firmware version. Documentation to be done later.", Input: "None", Output: "Response: u32_version_number: The firmware version stored as 4 bytes. The first byte is the development number, then patch version, followed by the minor and major versions." },
        { CommandString: "MOVE_WITH_VELOCITY_COMMAND", CommandEnum: 26, Description: "Move with velocity", Input: ["i32: The velocity (the unit is microsteps per time step * 2^20).","u32: The number of time steps to maintain this velocity. Use command 18 to get the frequency of the time steps. After this many time steps, If the queue becomes empty, the motor will maintain the last velocity indefinitely. The velocity will take affect immediately if the queue is empty or will take affect immediately when this queued item is reached."], Output: "Response: success_response" },
        { CommandString: "SYSTEM_RESET_COMMAND", CommandEnum: 27, Description: "System reset / go to the bootloader. The motor will reset immediately and will enter the bootloader. If there is no command sent within a short time, the motor will exit the bootloader and run the application from the beginning.", Input: "None", Output: "None" },
        { CommandString: "SET_MAXIMUM_MOTOR_CURRENT", CommandEnum: 28, Description: "Set the maximum motor current and maximum regeneration current. The values are stored in non-volatile memory and survive a reset.", Input: ["u16: The motor current. The units are some arbitrary units and not amps. A value of 50 or 100 is suitable.","u16: The motor regeneration current (while it is braking). This parameter is currently not used for anything."], Output: "Response: success_response" },
        { CommandString: "MULTI_MOVE_COMMAND", CommandEnum: 29, Description: "Multi-move command", Input: ["u8: Specify how many moves are being communicated in this one shot.", "u32: Each bit specifies if the move is a (bit = 0) MOVE_WITH_ACCELERATION_COMMAND or a (bit = 1) MOVE_WITH_VELOCITY_COMMAND.", "list_2d: A 2D list in Python format (list of lists). Each item in the list is of type [i32, u32] representing a series of move commands. Each move command specifies the acceleration to move at or the velocity to instantly change to (according to the bits above) and the number of time steps over which this command is to be executed. For example: '[[100, 30000], [-200, 60000]]'. There is a limit of 32 move commands that can be listed in this one multi-move command. Each of the moves takes up one queue spot, so make sure there is enough space in the queue to store all of the commands."], Output: "Response: success_response" },
        { CommandString: "SET_SAFETY_LIMITS_COMMAND", CommandEnum: 30, Description: "Set safety limits (to prevent motion from exceeding set bounds)", Input: ["i32: The lower limit in microsteps","i32: The upper limit in microsteps"], Output: "Response: success_response" },
        { CommandString: "PING_COMMAND", CommandEnum: 31, Description: "Send a payload containing any data and the device will respond with the same data back", Input: "buf10: Any binary data payload to send to the device", Output: "Response: buf10: The same data that was sent to the device will be returned if all went well" },
        { CommandString: "CONTROL_HALL_SENSOR_STATISTICS_COMMAND", CommandEnum: 32, Description: "Turn on or off the gathering of statistics for the hall sensors and reset the statistics", Input: "u8: 0 = turn off statistics gathering, 1 = reset statistics and turn on gathering", Output: "Response: success_response" },
        { CommandString: "GET_HALL_SENSOR_STATISTICS_COMMAND", CommandEnum: 33, Description: "Read back the statistics gathered from the hall sensors. Useful for checking the hall sensor health and noise in the system.", Input: "None ", Output: "Response: u16: The maximum value of hall sensor 1 encoutered since the last statistics reset Response: u16: The maximum value of hall sensor 2 encoutered since the last statistics reset Response: u16: The maximum value of hall sensor 3 encoutered since the last statistics reset Response: u16: The minimum value of hall sensor 1 encoutered since the last statistics reset Response: u16: The minimum value of hall sensor 2 encoutered since the last statistics reset Response: u16: The minimum value of hall sensor 3 encoutered since the last statistics reset Response: u64: The sum of hall sensor 1 values collected since the last statistics reset Response: u64: The sum of hall sensor 2 values collected since the last statistics reset. Response: u64: The sum of hall sensor 3 values collected since the last statistics reset Response: u32: The number of times the hall sensors were measured since the last statistics reset" },
        { CommandString: "ADD_TO_QUEUE_TEST_COMMAND", CommandEnum: 254, Description: "Used for testing of some calculations that predict of the motion will go out of the set safety limits", Input: "None", Output: "Response: success_response" },
        { CommandString: "TRAPEZOID_MOVE_COMMAND", CommandEnum: 2, Description: "Move immediately to the given position using the currently set speed (the speed is set by a separate command)", Input: ["i32: The displacement to travel. Can be positive or negative.","u32: The time over which to do the move."], Output: "Response: success_response" },
    ]