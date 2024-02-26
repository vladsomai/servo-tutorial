export const pythonCode = `#!/usr/local/bin/python3
import serial
import platform
import struct

# Define your serial port
PORT = "COM7" 

# Define all the parameters for this command
alias = 255
motor_command = 32
motor_command_length = 1
turn_on_off_gathering = 0

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

# Format of the command: uchar, uchar, uchar, int, uint
# Reference: https://docs.python.org/3/library/struct.html#format-characters
command_format = '<BBBB'
bytes = struct.pack(command_format, alias, motor_command, motor_command_length, turn_on_off_gathering)

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