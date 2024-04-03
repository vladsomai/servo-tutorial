export const pythonCode = `#!/usr/local/bin/python3
import serial
import platform
import struct

# Define your serial port
PORT = "COM7" 

# Define all the parameters for this command
alias = 88
motor_command = 29

# add the length in bytes for the payload
# 1 byte number of moves from this shot
# 4 bytes moves types
# the rest of the bytes = moves_count * 8 (4 byte vel or acc + 4 byte time)
motor_command_length = 29
moves_types = '111'
multi_moves = [ [60, 1], [-60, 1], [0, 0.5] ]

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

moves_types_int = int(moves_types, 2)

# Format of the command: uchar, uchar, uchar, int, uint
# Reference: https://docs.python.org/3/library/struct.html#format-characters
command_format = '<BBBBI'

if len(moves_types)!=len(multi_moves):
    print('Please specify the same number of bits as the number of moves.')
    exit()

multi_moves_converted = []

#revert the move types so we can loop over them 1 to 1 with the multi_moves
moves_types_reversed = moves_types[::-1]

# Define here the indexes from where we can get the values for time, acceleration or velocity from the multi_moves array
ACC_VEL_INDEX = 0
TIME_INDEX = 1
number_of_moves = len(moves_types_reversed)

#add int and uint formats based on how many move commands we send
for i in range(number_of_moves):
    
    if(moves_types_reversed[i]=='0'):
        #move with acceleration, convert to motor units and add it to the list
        internal_acceleration = int((multi_moves[i][ACC_VEL_INDEX] / 60 ** 2) * (645120 / 31250 ** 2) * (2 ** 32))
        communication_acceleration = int(internal_acceleration / (2 ** 8))
        print(f"Communication acceleration: {communication_acceleration}")
        multi_moves_converted.append(communication_acceleration)
        
    else:
        #move with velocity, convert to motor units and add it to the list
        internal_velocity = int(multi_moves[i][ACC_VEL_INDEX] / 60) * (MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION / MOVE_TIME_MOTOR_UNITS_PER_SECOND) * (2 ** 32)
        communication_velocity = int(internal_velocity / (2 ** 12))
        print(f"Communication velocity for move command {i}: {communication_velocity}")
        multi_moves_converted.append(communication_velocity)

    #after the velocity or acceleretion was added, add the time
    move_time_motor_units = int(multi_moves[i][TIME_INDEX] * MOVE_TIME_MOTOR_UNITS_PER_SECOND)
    print(f"Timesteps: {move_time_motor_units}")
    multi_moves_converted.append(move_time_motor_units)

    #add the move and the time in the format string
    command_format+='iI'

print(multi_moves_converted[:number_of_moves*2])
bytes = struct.pack(command_format, alias, motor_command, motor_command_length, 
                    number_of_moves, moves_types_int, *multi_moves_converted)

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