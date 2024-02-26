export const pythonCode = `#!/usr/local/bin/python3
import serial
import platform
import struct

# Define your serial port
PORT = "COM7" 

# Define all the parameters for this command
alias = 255
acceleration_rpm2 = 0

# Define all the constants for this command
MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION = 645120
MOVE_TIME_MOTOR_UNITS_PER_SECOND = 31250
SET_MAX_ACCELERATION_MOTOR_COMMAND = 5
SET_MAX_ACCELERATION_MOTOR_COMMAND_LENGTH = 4

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
internal_acceleration = int((acceleration_rpm2 / 60 ** 2) * (645120 / 31250 ** 2) * (2 ** 32))
communication_acceleration = int(internal_acceleration / (2 ** 8))
print(f"Communication acceleration: {communication_acceleration}")

# Format of the command: uchar, uchar, uchar, int
# Reference: https://docs.python.org/3/library/struct.html#format-characters
command_format = '<BBBi'

bytes = struct.pack(command_format, alias, 
                    SET_MAX_ACCELERATION_MOTOR_COMMAND, SET_MAX_ACCELERATION_MOTOR_COMMAND_LENGTH,
                    communication_acceleration)

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