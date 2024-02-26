export const pythonCode = `#!/usr/local/bin/python3
import serial
import platform
import struct

# Define your serial port
PORT = "COM7"

# Define all the parameters for this command
alias = 88
motor_command = 10
motor_command_length = 6
elapsed_time_since_reset = 0

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

command_format = '<Q'
bytes = struct.pack(command_format, elapsed_time_since_reset)

command_format = '<BBB6s'
bytes = struct.pack(command_format, alias, motor_command, motor_command_length, bytes[:6])
for d in bytes:
    print("0x%02X %d" % (d, d))
    
serialPort.write(bytes)

data = serialPort.read(1000)
print("Received %d bytes" % (len(data)))

for d in data:
    print("0x%02X %d" % (d, d))

serialPort.close()

`