export const cCode =
    `
#define COM_PORT "COM8"
#include <stdio.h>
#include <string.h>
#include <stdint.h>

#ifdef _WIN32
#include<windows.h>
#pragma warning(disable:4996)
#else
//MAC or Linux
#include<unistd.h>
#endif

FILE* OpenPort(const char* COMPort)
{

#ifdef _WIN32
    char WIN_COM_PATH[50] = "\\\\\\\\.\\\\";
    strcat(WIN_COM_PATH, COMPort);

    FILE* portHandle = fopen(WIN_COM_PATH, "rb+");
#else
    //MAC or Linux
    char COM_PATH[50] = "/dev/tty";
    strcat(COM_PATH, COMPort);

    FILE* portHandle = fopen(COM_PATH, "rb+");
#endif

    if (portHandle == NULL)
    {
        printf("Cannot open COM port.\\n");
    }

    return portHandle;
}

int main()
{
    FILE* portHandle = OpenPort(COM_PORT);

    if (!portHandle)
        return -1;

    uint8_t cmd[] = { 255, 0, 0 };
    size_t writtenBytes = fwrite(cmd, sizeof(uint8_t),
                                 sizeof(cmd), portHandle);
    fflush(portHandle);

    printf("\\nWrote %lu bytes.", writtenBytes);

    if (cmd[0] == 255)
    {
        printf("\\nNo response is expected.");
    }
    else
    {
        //default initialize to 0
        uint8_t buffer[] = { 0, 0, 0};
        size_t readBytes = fread(buffer, sizeof(uint8_t),
            sizeof(buffer), portHandle);
    
        printf("\\nReceived: ");
        for (int i = 0; i < sizeof(buffer); i++)
        {
            printf("0x%x ", buffer[i]);
        }
    }
    
    fclose(portHandle);
}
`