export const cCode =
`
#include <stdio.h>
#include <string.h>
#include <stdint.h>
#include <stdlib.h>
#include <math.h>

// Change the "serialPortName" based on your specific case
#ifdef _WIN32
#include<windows.h>
const char* serialPortName = "\\\\\\\\.\\\\COM7";
#else
// MAC or Linux
#include <unistd.h>
#include <fcntl.h>
#include <termios.h>
const char* serialPortName = "/dev/ttyUSB0";
#endif

void SetupSerialPort();
FILE* OpenPort(const char* serialPort);
size_t GetRecvCommandSize(uint8_t cmdCode);
uint32_t ConvertDoubleToUint32LittleEndian(const double input);
void ConvertUintTo4BytesArr(uint8_t* buffer, uint8_t buffSize, uint32_t number);

int main(int argc, char* argv[])
{
	SetupSerialPort();
	FILE* portHandle = OpenPort(serialPortName);

	if (!portHandle)
		return -1;

	// Define all the constants for this command
	const uint32_t MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION = 645120;
	const uint32_t MOVE_TIME_MOTOR_UNITS_PER_SECOND = 31250;

	const COMMAND_ONE_MOVE_BYTE_SIZE = 8; //4 bytes for vel or acc + 4 bytes time
	//Define here the indexes from where we can get the values for time, acceleration or velocity from the multi_moves array
	const uint8_t ACC_VEL_INDEX = 0;
	const uint8_t TIME_INDEX = 1;

	// Define all the parameters for this command
	uint8_t alias = 255;
	uint8_t motor_command = 29;

	const char* moves_types = "";
	double multi_moves[][2] = { {0, 0} };

	const uint32_t multi_moves_len = sizeof(multi_moves) / (2 * sizeof(double));//8 bytes acc or vel + 8 bytes time 
	const uint32_t number_of_moves = (uint32_t)strlen(moves_types);
	if (multi_moves_len != number_of_moves)
	{
		printf("The number of moves must be equal to the move_types length. Each move should have its own move_type\\n");
		return -1;
	}
	// add the length in bytes for the payload
	// 1 byte number of moves from this shot
	// 4 bytes moves types
	// the rest of the bytes = moves_count * 8
	const uint8_t motor_command_length = 29;

#define alias_cmd_len 3
	uint8_t* cmd = (uint8_t*)malloc(alias_cmd_len + motor_command_length);
	if (cmd == NULL)
	{
		printf("Could not allocate memory for the command\\n");
		return -1;
	}

	memset(cmd, 0, alias_cmd_len + motor_command_length);

	cmd[0] = alias;
	cmd[1] = motor_command;
	cmd[2] = motor_command_length;
	cmd[3] = (uint8_t)number_of_moves;
	int currentCmdByteIdx = alias_cmd_len + 1;

	char* pEnd = NULL;
	const uint32_t movesTypesNum = (uint32_t)strtol(moves_types, &pEnd, 2);
	const uint32_t movesTypesLittleEnd = ConvertDoubleToUint32LittleEndian(movesTypesNum);
	uint8_t bufferMovesTypes[4] = { 0 };
	ConvertUintTo4BytesArr(bufferMovesTypes, sizeof(uint32_t), movesTypesLittleEnd);

	for (int j = 0; j < sizeof(uint32_t); j++)
	{
		cmd[currentCmdByteIdx] = bufferMovesTypes[j];
		currentCmdByteIdx++;
	}

	for (uint32_t i = 0; i < multi_moves_len; i++)
	{
		uint32_t transmitCommAccOrVel = 0;
		if (moves_types[i] == '0')
		{
			// Convert input values to motor units
			double internal_acceleration = (multi_moves[i][ACC_VEL_INDEX] / (double)pow(60, 2)) * ((double)MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION / (double)pow(MOVE_TIME_MOTOR_UNITS_PER_SECOND, 2)) * pow(2, 32);
			double communication_acceleration = internal_acceleration / pow(2, 8);
			transmitCommAccOrVel = ConvertDoubleToUint32LittleEndian(communication_acceleration);
		}
		else
		{
			double internal_velocity = (multi_moves[i][ACC_VEL_INDEX] / (double)60) * ((double)MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION / (double)MOVE_TIME_MOTOR_UNITS_PER_SECOND) * pow(2, 32);
			double communication_velocity = internal_velocity / pow(2, 12);
			transmitCommAccOrVel = ConvertDoubleToUint32LittleEndian(communication_velocity);
		}

		uint8_t bufferTransmitCommAccOrVel[4] = { 0 };
		ConvertUintTo4BytesArr(bufferTransmitCommAccOrVel, sizeof(uint32_t), transmitCommAccOrVel);

		for (int j = 0; j < sizeof(uint32_t); j++)
		{
			cmd[currentCmdByteIdx] = bufferTransmitCommAccOrVel[j];
			currentCmdByteIdx++;
		}

		const double move_time_seconds = multi_moves[i][TIME_INDEX];
		if (move_time_seconds < 0)
		{
			printf("Time must be positive for the %dth command.\\n", i + 1);
			fclose(portHandle);
			free(cmd);
			cmd = NULL;
			return -1;
		}

		double move_time_motor_units = move_time_seconds * (double)MOVE_TIME_MOTOR_UNITS_PER_SECOND;
		uint32_t transmitTime = ConvertDoubleToUint32LittleEndian(move_time_motor_units);
		uint8_t bufferTime[4] = { 0 };
		ConvertUintTo4BytesArr(bufferTime, sizeof(uint32_t), transmitTime);

		for (int j = 0; j < sizeof(uint32_t); j++)
		{
			cmd[currentCmdByteIdx] = bufferTime[j];
			currentCmdByteIdx++;
		}
	}

	printf("Sending the following command: \\n");
	for (int i = 0; i < alias_cmd_len + motor_command_length; i++)
	{
		printf("%x ", cmd[i]);
	}
	printf("\\n");

	size_t writtenBytes = fwrite(cmd, sizeof(uint8_t), alias_cmd_len + motor_command_length, portHandle);
	fflush(portHandle);
	printf("Wrote %zd bytes.\\n", writtenBytes);

	free(cmd);
	cmd = NULL;

	const size_t recvSize = GetRecvCommandSize(motor_command);

	if (alias == 255 || recvSize == 0)
	{
		/*
		  1. When sending the command to alias 255 we do not expect a response.
		  2. Some commands do not expect a response. (See the implementation of GetRecvCommandSize)
		*/
		printf("No response is expected.\\n");
	}
	else
	{
		uint8_t* recv_buffer = (uint8_t*)malloc(recvSize);

		if (recv_buffer == NULL)
		{
			printf("Could not allocate memory for the receive buffer.\\n");
			fclose(portHandle);
			return -1;
		}

		memset(recv_buffer, 0, recvSize);

		size_t readBytes = fread(recv_buffer, sizeof(uint8_t),
			recvSize, portHandle);

		if (readBytes != recvSize)
		{
			//do not return as we still need to clean up
			printf("Command timed out or the response had a wrong size.\\n");
		}

		printf("Received: ");
		for (int i = 0; i < recvSize; i++)
		{
			printf("0x%x ", recv_buffer[i]);
		}
		printf("\\n");

		//always clean up the mess left by dynamic memory allocation
		memset(recv_buffer, 0, recvSize);
		free(recv_buffer);
		recv_buffer = NULL;
	}

	printf("\\n\\n");

	fclose(portHandle);

	return 0;
}

FILE* OpenPort(const char* serialPort)
{
	FILE* portHandle = fopen(serialPort, "rb+");

	if (portHandle == NULL)
	{
		printf("Cannot open COM port.\\n");
	}
	else
	{
		// Make sure there is no data waiting to be flushed after opening
		fflush(portHandle);
	}

	return portHandle;
}

enum Commands {
	DisableMOSFETs,
	EnableMOSFETs,
	TrapezoidMove,
	SetMaximumVelocity,
	SetPositionAndFinishTime,
	SetMaxAcceleration,
	StartCalibration,
	CaptureHallSensorData,
	ResetTime,
	GetCurrentTime,
	TimeSync,
	GetQueueSize,
	EmergencyStop,
	ZeroPosition,
	Homing,
	GetCurrentPosition,
	GetStatus,
	GoToClosedLoop,
	GetUpdateFrequency,
	MoveWithAcceleration,
	DetectDevices,
	SetDeviceAlias,
	GetProductInfoCmd,
	FirmWareUpgrade,
	GetProductDescription,
	GetFirmwareVersion,
	MoveWithVelocity,
	Reset,
	SetMaxMotorCurrent,
	MultiMove,
	SetSafetyLimits,
	Ping,
	ControlHallSensorStatistics,
	GetHallSensorStatistics,
	Identify = 41,
	AddToQueueTest = 254,
};


/*This method will map the number of receive bytes for each command */
size_t GetRecvCommandSize(uint8_t cmdCode)
{
	const size_t None = 0;
	const size_t SuccessResponse = 3;
	const size_t Bytes1_8bits = 1;
	const size_t Bytes2_16bits = 2;
	const size_t Bytes4_32bits = 4;
	const size_t Bytes6_48bits = 6;
	const size_t Bytes8_64bits = 8;

	switch (cmdCode)
	{
	case DisableMOSFETs:
		return SuccessResponse;
	case EnableMOSFETs:
		return SuccessResponse;
	case TrapezoidMove:
		return SuccessResponse;
	case SetMaximumVelocity:
		return SuccessResponse;
	case SetPositionAndFinishTime:
		return SuccessResponse;
	case SetMaxAcceleration:
		return SuccessResponse;
	case StartCalibration:
		return None;
	case CaptureHallSensorData:
		return None;
	case ResetTime:
		return SuccessResponse;
	case TimeSync:
		return SuccessResponse + Bytes6_48bits;
	case GetCurrentTime:
		return SuccessResponse + Bytes6_48bits;
	case GetQueueSize:
		return SuccessResponse + Bytes1_8bits;
	case EmergencyStop:
		return SuccessResponse;
	case ZeroPosition:
		return SuccessResponse;
	case Homing:
		return SuccessResponse;
	case GetCurrentPosition:
		return SuccessResponse + Bytes4_32bits;
	case GetStatus:
		return SuccessResponse + Bytes1_8bits;
	case GoToClosedLoop:
		return SuccessResponse;
	case GetUpdateFrequency:
		return SuccessResponse + Bytes4_32bits;
	case MoveWithAcceleration:
		return SuccessResponse;
	case DetectDevices:
		return SuccessResponse + Bytes8_64bits + Bytes1_8bits + Bytes4_32bits;
	case SetDeviceAlias:
		return SuccessResponse;
	case GetProductInfoCmd:
		return None;
	case FirmWareUpgrade:
		return SuccessResponse;
	case GetProductDescription:
		return None;
	case GetFirmwareVersion:
		return SuccessResponse + Bytes4_32bits;
	case MoveWithVelocity:
		return SuccessResponse;
	case Reset:
		return None;
	case SetMaxMotorCurrent:
		return SuccessResponse;
	case MultiMove:
		return SuccessResponse;
	case SetSafetyLimits:
		return SuccessResponse;
	case Ping:
		return 13;
	case ControlHallSensorStatistics:
		return SuccessResponse;
	case GetHallSensorStatistics:
		return SuccessResponse + Bytes2_16bits + Bytes2_16bits + Bytes2_16bits + Bytes2_16bits +
			Bytes2_16bits + Bytes2_16bits + Bytes8_64bits + Bytes8_64bits + Bytes8_64bits + Bytes4_32bits;
	case Identify:
		return SuccessResponse;
	case AddToQueueTest:
		return SuccessResponse;

	default:
		break;
	}
	return 0;
}

/* This method will assure the port is in a valid state to be opened using the generic fopen
   Each OS has different APIs to set the serial port settings */
void SetupSerialPort()
{
#ifdef WIN32

	HANDLE hComm = CreateFile(serialPortName,
		GENERIC_READ | GENERIC_WRITE,
		0,
		NULL,
		OPEN_EXISTING,
		0,
		NULL);

	if (hComm == INVALID_HANDLE_VALUE)
	{
		printf("Port %s is invalid, also make sure you set the read/write access writes.\\n", serialPortName);
		return;
	}

	//abort any read/writes and clear the input/output buffers
	PurgeComm(hComm, PURGE_RXABORT | PURGE_RXCLEAR | PURGE_TXABORT | PURGE_TXCLEAR);

	DCB dcbSerialParams;
	SecureZeroMemory(&dcbSerialParams, sizeof(DCB));
	dcbSerialParams.DCBlength = sizeof(DCB);

	dcbSerialParams.fBinary = TRUE;
	dcbSerialParams.XoffLim = 0x4000;
	dcbSerialParams.XonChar = 0x11;
	dcbSerialParams.XoffChar = 0x13;

	dcbSerialParams.BaudRate = 230400;
	dcbSerialParams.ByteSize = 8;
	dcbSerialParams.StopBits = ONESTOPBIT;
	dcbSerialParams.Parity = NOPARITY;
	BOOL Status = SetCommState(hComm, &dcbSerialParams);
	if (Status == FALSE)
	{
		printf("Cannot setup port %s.\\n", serialPortName);
		CloseHandle(hComm);
		return;
	}

	COMMTIMEOUTS timeouts;
	SecureZeroMemory(&timeouts, sizeof(COMMTIMEOUTS));
	GetCommTimeouts(hComm, &timeouts);

	timeouts.ReadIntervalTimeout = MAXDWORD;
	timeouts.ReadTotalTimeoutMultiplier = MAXDWORD;
	//read timeout to 2 seconds
	timeouts.ReadTotalTimeoutConstant = 2000;
	timeouts.WriteTotalTimeoutMultiplier = 0;
	timeouts.WriteTotalTimeoutConstant = 0;

	if (!SetCommTimeouts(hComm, &timeouts))
		printf("Error timeouts.\\n");

	Sleep(500);
	SecureZeroMemory(&dcbSerialParams, sizeof(DCB));
	dcbSerialParams.DCBlength = sizeof(DCB);

	GetCommState(hComm, &dcbSerialParams);
	printf("Baudrate: %d\\nStopBits: %d\\nParity: %d\\nByteSize: %d\\n\\n",
		dcbSerialParams.BaudRate,
		dcbSerialParams.StopBits,
		dcbSerialParams.Parity,
		dcbSerialParams.ByteSize);

	CloseHandle(hComm);

#else

	/* Open and configure the serial port using posix calls */
	int fd = open(serialPortName, O_RDWR | O_NOCTTY);
	if (fd < 0)
	{
		printf("Port %s is invalid, also make sure you set the read/write access writes.\\n", serialPortName);
		return;
	}

	struct termios options; /* Serial port settings */
	memset(&options, 0, sizeof(struct termios));

	/* Set up serial port
	baudRate: 230400
	StopBits: 1
	Parity: None
	DataBits 8 */
	options.c_cflag = 6323;
	options.c_iflag = IGNBRK;
	options.c_oflag = 0;
	options.c_lflag = 0;

	/* Apply the settings */
	tcflush(fd, TCIOFLUSH);//discard any input/output that may sit in the buffer
	cfmakeraw(&options);
	tcsetattr(fd, TCSANOW, &options);
	usleep(500 * 1000);

	close(fd);
#endif

}

static const uint64_t bmask64[8] = { 0xFF, 0xFF00, 0xFF0000, 0xFF000000, 0xFF00000000, 0xFF0000000000, 0xFF000000000000, 0xFF00000000000000 };

uint32_t ConvertDoubleToUint32LittleEndian(const double input)
{
	uint32_t result = 0;

	if (input < 0)
	{
		if (input < INT32_MIN)
		{
			return 0;
		}

		int32_t input_s = (int32_t)input;
		result |= (input_s & bmask64[0]) << 24;
		result |= (input_s & bmask64[1]) << 8;
		result |= (input_s & bmask64[2]) >> 8;
		result |= (input_s & bmask64[3]) >> 24;
	}
	else
	{
		if (input > UINT32_MAX)
		{
			return 0;
		}

		uint32_t input_u = (uint32_t)input;
		result |= (input_u & bmask64[0]) << 24;
		result |= (input_u & bmask64[1]) << 8;
		result |= (input_u & bmask64[2]) >> 8;
		result |= (input_u & bmask64[3]) >> 24;
	}

	return result;
}

void ConvertUintTo4BytesArr(uint8_t* buffer, uint8_t buffSize, uint32_t number)
{
	if (buffSize != sizeof(uint32_t))
	{
		//assure the buffer size is 4 bytes
		return;
	}

	for (int i = buffSize - 1, j = 0; i >= 0; i--, j++)
	{
        buffer[j] = (uint8_t)((number & bmask64[i]) >> (i * 8));
	}
}

`