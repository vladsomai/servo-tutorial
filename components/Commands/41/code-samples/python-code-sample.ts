export const pythonCode = `#!/usr/local/bin/python3
import serial
import platform
import struct

# Define your serial port
PORT = "COM7" 

# Define all the parameters for this command
alias = 255
motor_command = 41
motor_command_length = 8
unique_id = ''

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

#convert the unique id hex string to a unsigned long long 
unique_id_int_little_endian = int(unique_id, 16)
bytes_u_id_big_endian = struct.pack('>Q',unique_id_int_little_endian)
unique_id_int = int.from_bytes(bytes_u_id_big_endian, "little")
print(unique_id_int)

command_format = '<BBBQ'
bytes = struct.pack(command_format, alias, motor_command, motor_command_length, unique_id_int)

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