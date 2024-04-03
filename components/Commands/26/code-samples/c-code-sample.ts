export const cCode =
`#include <stdio.h>
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

    // Define all the parameters for this command
    uint8_t alias = 255;
    uint8_t motor_command = 26;
    #define motor_command_length 8
    double velocity_rpm = 0;
    double move_time_seconds = 0;

    if (move_time_seconds < 0)
    {
        printf("Time must be positive.\\n");
        fclose(portHandle);
        return -1;
    }

    // Define all the constants for this command
    const uint32_t MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION = 645120;
    const uint32_t MOVE_TIME_MOTOR_UNITS_PER_SECOND = 31250;

    // Convert input values to motor units
    double internal_velocity = (velocity_rpm / (double)60) * ((double)MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION / (double)MOVE_TIME_MOTOR_UNITS_PER_SECOND) * pow(2, 32);
    double communication_velocity = internal_velocity / pow(2, 12);
    uint32_t transmitCommVel = ConvertDoubleToUint32LittleEndian(communication_velocity);
    uint8_t bufferTransmitCommVel[4] = { 0 };
    ConvertUintTo4BytesArr(bufferTransmitCommVel, sizeof(uint32_t), transmitCommVel);

    double move_time_motor_units = move_time_seconds * (double)MOVE_TIME_MOTOR_UNITS_PER_SECOND;
    uint32_t transmitTime = ConvertDoubleToUint32LittleEndian(move_time_motor_units);
    uint8_t bufferTime[4] = { 0 };
    ConvertUintTo4BytesArr(bufferTime, sizeof(uint32_t), transmitTime);

    #define alias_cmd_len 3
    uint8_t cmd[alias_cmd_len + motor_command_length] = { alias, motor_command, motor_command_length };
    
    for (int i = 0; i < sizeof(uint32_t); i++)
    {
        cmd[alias_cmd_len + i] = bufferTransmitCommVel[i];
    }

    for (int i = 0; i < sizeof(uint32_t); i++)
    {
        cmd[alias_cmd_len + sizeof(uint32_t) + i] = bufferTime[i];
    }

    printf("Sending the following command: \\n");
    for (int i = 0; i < sizeof(cmd); i++)
    {
        printf("0x%x ", cmd[i]);
    }
    printf("\\n");

    size_t writtenBytes = fwrite(cmd, sizeof(uint8_t), sizeof(cmd), portHandle);
    fflush(portHandle);
    printf("Wrote %zd bytes.\\n", writtenBytes);

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

static const uint32_t bmask32[4] = { 0x0FF, 0xFF00, 0xFF0000, 0xFF000000 };
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
        result |= (input_s & bmask32[0]) << 24;
        result |= (input_s & bmask32[1]) << 8;
        result |= (input_s & bmask32[2]) >> 8;
        result |= (input_s & bmask32[3]) >> 24;
    }
    else
    {
        if (input > UINT32_MAX)
        {
            return 0;
        }

        uint32_t input_u = (uint32_t)input;
        result |= (input_u & bmask32[0]) << 24;
        result |= (input_u & bmask32[1]) << 8;
        result |= (input_u & bmask32[2]) >> 8;
        result |= (input_u & bmask32[3]) >> 24;
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
        buffer[j] = (number & bmask32[i]) >> (i * 8);
    }
}

`