export const pythonCode = `#!/usr/local/bin/python3
import serial
import platform
import struct

# Define your serial port
PORT = "COM7" 

# Define all the parameters for this command
alias = 255
motor_command = 30
motor_command_length = 8
upper_rotation_limit = 0
lower_rotation_limit = 0

# Define all the constants for this command
MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION = 645120
MOVE_TIME_MOTOR_UNITS_PER_SECOND = 31250

if platform.system() == 'Windows':
    PORT_PREFIX = '\\\\\\\\.\\\\'
else:
    PORT_PREFIX = ''

try:
    serialPort = serial.Serial(PORT_PREFIX + PORT, 230400, timeout = 1)
except:
    print('Could not open serial port.')
    exit()
print(f"Successfully opened the serial port: {serialPort.name}")

#convert input values to motor units
upper_rotation_motor_units = int(upper_rotation_limit * MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION)
print(f"Uppoer rotaion limit in Microsteps: {upper_rotation_motor_units}")
lower_rotation_motor_units = int(lower_rotation_limit * MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION)
print(f"Lower rotaion limit in Microsteps: {lower_rotation_motor_units}")

# Format of the command: uchar, uchar, uchar, int, uint
# Reference: https://docs.python.org/3/library/struct.html#format-characters
command_format = '<BBBii'

bytes = struct.pack(command_format, alias, motor_command, motor_command_length,
                    lower_rotation_limit, upper_rotation_limit)

for d in bytes:
    print("0x%02X %d" % (d, d))

serialPort.write(bytes)

data = serialPort.read(1000)
print("Received %d bytes" % (len(data)))
print(data)

for d in data:
    print("0x%02X %d" % (d, d))

serialPort.close()

`