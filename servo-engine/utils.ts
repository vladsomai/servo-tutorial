import { languages } from "prismjs";

/*
This Class will be used to register any values like 'F', Since TypeScript does not have a char type.
toString(): will return the string representation of that char: e.g.:'A'
getASCII_Code(): will return the ASCII number of that char: e.g. 'A' = 65
*/
export class Char {
    readonly char: string;
    constructor(char: string) {
        if (char.length !== 1) {
            throw new Error(char + " is not a single character");
        }
        this.char = char;
    }

    toString(): string {
        return this.char;
    }

    getDecimalASCII_Code(): number {
        return this.char.charCodeAt(0);
    }
    getHexaASCII_Code(): string {
        return this.char.charCodeAt(0).toString(16);
    }
}

/*
This Class will be used to register any values like "FF".
toString(): will return the string representation of that byte: e.g.:"FF"
toHex(): will return the hexadecimal repr. of that byte: e.g. 0xFF
*/
export class ByteStringType {
    readonly LSB: Char;
    readonly MSB: Char;

    constructor(lsb: Char, msb: Char) {
        this.LSB = lsb;
        this.MSB = msb;
    }
    toString(): string {
        return this.MSB.toString() + this.LSB.toString();
    }

    toHexValue() {
        let Byte: number = 0;
        let input: string = this.toString().toUpperCase();

        for (let i = 0; i < 2; i++) {
            switch (input[i]) {
                case '0':
                    if (i == 0)
                        Byte = 0x0 << 4;
                    else
                        Byte |= 0x0;
                    break;

                case '1':
                    if (i == 0)
                        Byte = 0x1 << 4;
                    else
                        Byte |= 0x1;
                    break;

                case '2':
                    if (i == 0)
                        Byte = 0x2 << 4;
                    else
                        Byte |= 0x2;
                    break;

                case '3':
                    if (i == 0)
                        Byte = 0x3 << 4;
                    else
                        Byte |= 0x3;
                    break;

                case '4':
                    if (i == 0)
                        Byte = 0x4 << 4;
                    else
                        Byte |= 0x4;
                    break;

                case '5':
                    if (i == 0)
                        Byte = 0x5 << 4;
                    else
                        Byte |= 0x5;
                    break;

                case '6':
                    if (i == 0)
                        Byte = 0x6 << 4;
                    else
                        Byte |= 0x6;
                    break;

                case '7':
                    if (i == 0)
                        Byte = 0x7 << 4;
                    else
                        Byte |= 0x7;
                    break;

                case '8':
                    if (i == 0)
                        Byte = 0x8 << 4;
                    else
                        Byte |= 0x8;
                    break;

                case '9':
                    if (i == 0)
                        Byte = 0x9 << 4;
                    else
                        Byte |= 0x9;
                    break;

                case 'A':
                    if (i == 0)
                        Byte = 0xA << 4;
                    else
                        Byte |= 0xA;
                    break;

                case 'B':
                    if (i == 0)
                        Byte = 0xB << 4;
                    else
                        Byte |= 0xB;
                    break;

                case 'C':
                    if (i == 0)
                        Byte = 0xC << 4;
                    else
                        Byte |= 0xC;
                    break;

                case 'D':
                    if (i == 0)
                        Byte = 0xD << 4;
                    else
                        Byte |= 0xD;
                    break;

                case 'E':
                    if (i == 0)
                        Byte = 0xE << 4;
                    else
                        Byte |= 0xE;
                    break;

                case 'F':
                    if (i == 0)
                        Byte = 0xF << 4;
                    else
                        Byte |= 0xF;
                    break;

                default:
                    throw "Invalid hexadecimal argument received!";
            }
        }
        return Byte;
    }
}

//Input: "FF00A2"
//Output: [0xFF,0,0xA2]
export const stringToUint8Array = (_value: string): Uint8Array => {
    const message = _value;

    if (message.length % 2 !== 0) {
        return new Uint8Array([]);
    }

    let stringDataBytes: ByteStringType[] = [];

    for (let i = 0; i < message.length; i += 2) {
        let byte = new ByteStringType(new Char(message[i + 1]), new Char(message[i]));
        stringDataBytes.push(byte);
    }

    //Convert all the bytes from the stringDataBytes to hex-> e.g. "FA" -> 0xFA
    let RawBytes = new Uint8Array(stringDataBytes.length)
    let i = 0;
    for (const stringByte of stringDataBytes) {
        RawBytes[i] = stringByte.toHexValue();
        i++;
    }
    return RawBytes;
}

//Input: Uint8Array e.g. [0xFF,0xA0,0]
//Output: hexString e.g. "FFA000"
export const Uint8ArrayToString = (data: Uint8Array | undefined): string => {
    if (data != undefined) {
        let hexString = ''
        for (let i = 0; i < data.length; i++) {
            let prefix = ''
            let postfix = ''
            if (data[i] <= 0xF) prefix = '0'
            else prefix = ''

            hexString += prefix + data[i].toString(16) + postfix
        }
        return hexString.toUpperCase();
    } else
        return ""
}


//#region Position
export const RotationsToMicrosteps = (rotations: number): number => {
    return rotations * 645120;
}

export const minimumNegativePosition = -0.0000032
export const maximumNegativePosition = -3328.8126985

export const minimumPositivePosition = 0.0000016
export const maximumPositivePosition = 3328.8126968626
//#endregion Postion

//#region Time
export const SecondToTimesteps = (timeInSeconds: number): number => {
    return timeInSeconds * 1000000 / 32;
}

export const minimumPositiveTime = 0.000032
export const maximumPositiveTime = 137438.95344
//#endregion Time

//#region Velocity
export const RPM_ToInternalVelocity = (_rpm: number | string): number => {
    let rpm = 0

    if (typeof _rpm == 'string') {
        rpm = parseFloat(_rpm)
    }
    else {
        rpm = _rpm
    }

    return (rpm / 60) * (645120 / 31250) * (2 ** 32);
}

export const InternalVelocityToCommVelocity = (internalVelocity: number): number => {
    return internalVelocity / (2 ** 12)
}

export const minimumNegativeVelocity = -0.0000055
export const maximumNegativeVelocity = -5952.380953

export const minimumPositiveVelocity = 0.0000027
export const maximumPositiveVelocity = 99.20634916015264 * 60

// max internal velocity = 8796093018112
// MAX_RPS = internal_velocity / (645120 / 31250) * (2^32)
// MAX_RPS = 8796093018112 / 20.64384 * 4294967296
// MAX_RPS = 99.2063491601526500686766609313
// MAX_RPM = MAX_RPS * 60
//#endregion Velocity

//#region Acceleration
export const RPMSquared_ToInternalAcceleration = (rpmsq: number): number => {
    return (rpmsq / 60 ** 2) * (645120 / 31250 ** 2) * (2 ** 32);
}

export const InternalAccelerationToCommAcceleration = (internalAcceleration: number): number => {
    return internalAcceleration / (2 ** 8)
}

export const minimumNegativeAcceleration = -0.0000055
export const maximumNegativeAcceleration = -697544642.86

export const minimumPositiveAcceleration = 0.4
export const maximumPositiveAcceleration = 697544642.54
//export const maximumPositiveAcceleration = 193762.40071 * 60**2

//the following computation is done to find the maximum positive acceleration for rotations/second sqared
//it will then be used to transform it to RPM^2
// max internal acc = 549755813632 = x * (645120 / 31250**2) * (2 ** 32);
// MAX_ACC_RPS^2 = (internal_acc) / (645120 / 31250^2) * (2^32))
// MAX_ACC_RPS^2 = (internal_acc) / (645120 / 976562500) * (4294967296))
// MAX_ACC_RPS^2 = (internal_acc) / (0.00066060288) * (4294967296))
// MAX_ACC_RPS^2 = (internal_acc) / 2,837,267.76524341248

//#endregion Acceleration


export const makeCRCTable = () => {
    let c;
    let crcTable = [];
    for (let n = 0; n < 256; n++) {
        c = n;
        for (let k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable
}

export const crcTable = makeCRCTable();

export const crc32 = (data: Uint8Array) => {
    let crc = 0 ^ (-1);
    for (let i = 0; i < data.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
};

export const uint32ToUint8Arr = (uint32: number) => {
    let uint32Str = uint32.toString(16)

    //Not a 32bit number
    if (uint32Str.length > 8) return;

    let noOfZeros = 8 - uint32Str.length;
    let zeroArr = ''
    for (let i = 0; i < noOfZeros; i++) {
        zeroArr += '0';
    }

    uint32Str = zeroArr + uint32Str

    let ret = stringToUint8Array(uint32Str)
    return ret
}

export const sleep = (time_ms: number) =>
    new Promise((resolve, reject) => {
        setTimeout(resolve, time_ms)
    })


export const hexStringToASCII = (_input: string): string => {

    let strToNumberArr = stringToUint8Array(_input)

    let ret = ''
    for (let i = 0; i < strToNumberArr.length; i++) {
        if (strToNumberArr[i] == 0) break;

        ret += String.fromCharCode(strToNumberArr[i]);
    }

    return ret.trim()
}


export const types = new Map<string, number>([
    ["i8", 1],
    ["u8", 1],
    ["i16", 2],
    ["u16", 2],
    ["i24", 3],
    ["u24", 3],
    ["i32", 4],
    ["u32", 4],
    ["i48", 6],
    ["u48", 6],
    ["i64", 8],
    ["u64", 8],
    ["string8", 8],
    ["u24_version_number", 3],
    ["u32_version_number", 4],
    ["u64_unique_id", 8],
    ["u8_alias", 1],
    ["crc32", 4],
    ["buf10", 10],
    ["list_2d", 0],
    ["string_null_term", 0],
    ["unknown_data", 0],
    ["success_response", 0],
]);

//temporary solution, ask tom about creating a "type" attribute for each input/output object
export const getNoOfBytesFromDescription = (typeWithDescription: string): number => {
    const indexOfColon = typeWithDescription.indexOf(":");
    const typeStr = typeWithDescription.slice(0, indexOfColon)
    let noOfBytes = types.get(typeStr);

    if (noOfBytes === undefined) {
        noOfBytes = 0;
    }
    return noOfBytes;
}

export const getNoOfBytesFromType = () => {

}


/**
 * Returns a string with the hexString converted to the format 
 * @param format format string
 * @param hexString hex number as string to be converted to the specified format
 */
export const getDisplayFormat = (format: string, hexString: string, typeWithDescription: string = "") => {

    if (typeWithDescription.length) {
        // version_number
        const indexOfColumn = typeWithDescription.indexOf(":");
        const typeStr = typeWithDescription.slice(0, indexOfColumn)
        if (typeStr.includes("version_number")) {
            format = '%uvn'
        }
    }

    let res = '';
    let convertedTo = " Result converted to ";

    switch (format) {
        case '%c':
            convertedTo += "char: "
            res = '\'' + hexStringToASCII(
                hexString
            ) + '\''
            break
        case '%s':
            convertedTo += "string: "
            res = '\'' + hexStringToASCII(
                hexString
            ) + '\''
            break
        case '%d':
            convertedTo += "decimal: "
            res = hexStringToInt32(
                hexString, false
            ).toString()
            break
        case '%u':
            convertedTo += "unsigned decimal: "
            res = hexStringToInt32(
                hexString, true
            ).toString()
            break
        case '%b':
            const number = hexStringToInt32(hexString, true);
            const binaryStr = dec2bin(number as number)
            convertedTo += "binary: "
            res = binaryStr
            break
        case '%uvn':
            convertedTo += "version number: "
            res = getVersionNumber(
                hexString
            )
            break
        case '%x':
            convertedTo += "hexadecimal: "
            res = '0x' + littleEndianToBigEndian(hexString)
            break
        default:
            res = '0'
            break
    }

    if (res == '0') {
        return ''
    }
    return convertedTo + res;
}

function dec2bin(dec: number) {
    return (dec >>> 0).toString(2);
}

/**
 * Returns a uint32_t e.g. 1935360 
 * @param _value the hex string value to be converted to uint32_t e.g. "00881D00"
 */
export const hexStringToInt32 = (_value: string, isUnsigned: boolean): bigint | number => {
    const message = _value;

    if (message.length % 2 !== 0) {
        return 0
    }
    let isBigInt = false;
    let bytes = stringToUint8Array(message);
    if (bytes.length > 4) {
        isBigInt = true;
    }

    if (bytes.length <= 8) {
        const newbyte = new Uint8Array(8 - bytes.length).fill(0);
        bytes = new Uint8Array([...bytes, ...newbyte])
    }

    let dataview = new DataView(bytes.buffer);

    if (isUnsigned) {
        if (isBigInt) {
            return dataview.getBigUint64(0, true);
        }
        else {
            return dataview.getUint32(0, true);
        }
    }
    else {
        if (isBigInt) {
            return dataview.getBigInt64(0, true);
        }
        else {

            return dataview.getInt32(0, true);
        }
    }

}
export type ByteSizes = 1 | 2 | 4 | 8
export const transfNumberToUint8Arr = (
    intNum: bigint | number,
    size: ByteSizes,
    littleEndian = true
): Uint8Array => {
    let rawArrBuffer = new ArrayBuffer(size)
    const view = new DataView(rawArrBuffer)

    switch (size) {
        case 1:
            view.setUint8(0, Number(intNum))
            break
        case 2:
            view.setUint16(0, Number(intNum), littleEndian)
            break
        case 4:
            view.setUint32(0, Number(intNum), littleEndian)
            break
        case 8:
            view.setBigUint64(0, BigInt(intNum), littleEndian)
            break
    }

    let rawCurrent = new Uint8Array(size)

    for (let i = 0; i < size; i++) {
        rawCurrent.set([view.getUint8(i)], i)
    }

    return rawCurrent
}


export const tranfASCIIStringToUint8Arr = (str: string): Uint8Array => {
    let rawArrBuffer = new ArrayBuffer(str.length)
    const view = new DataView(rawArrBuffer)

    for (let i = 0; i < str.length; i++) {
        view.setUint8(i, str.charCodeAt(i))
    }

    let rawCurrent = new Uint8Array(str.length)

    for (let i = 0; i < str.length; i++) {
        rawCurrent.set([view.getUint8(i)], i)
    }
    console.log(Uint8ArrayToString(rawCurrent))
    return rawCurrent
}

export const ErrorTypes = {
    /**No error */
    "NO_ERR": "No error",
    /**Maximum value exceeded error */
    "ERR1001": "Maximum value",
    /**Minumum value exceeded error */
    "ERR1002": "Minimum value",
    /**Command time out */
    "ERR1003": "Command time out",
    /**Incomplete message received */
    "ERR1004": "Incomplete message received",
    /**Message has an invalid length */
    "ERR1005": "Message has an invalid length",
    /**Firmware file exceeded maximum size */
    "ERR1006": "Firmware file exceeded maximum size",
    /**Firmware file is not avaialble */
    "ERR1007": "Firmware file is not avaialble",
    /**Unknown error */
    "ERR1999": "Unknown error",
}

const getVersionNumber = (hexString: string): string => {
    let bytes = stringToUint8Array(hexString);

    let res = ''

    for (let i = bytes.length - 1; i >= 0; i--) {
        res += bytes[i].toString() + '.'
    }
    return res.substring(0, res.lastIndexOf('.'))
}

export const littleEndianToBigEndian = (hexString: string): string => {
    let res = ''
    for (let i = hexString.length; i >= 0; i -= 2) {
        res += hexString.substring(i, i + 2)

    }
    return res
}

export const genuid = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
    }
    return (
        s4() +
        s4() +
        '-' +
        s4() +
        '-' +
        s4() +
        '-' +
        s4() +
        '-' +
        s4() +
        s4() +
        s4()
    )
}

export const getCurrentBrowser = (): 'Opera' | 'Edge' | 'Chrome' | 'Safari' | 'Firefox' | 'IE' | 'unknown' => {
    if (
        (navigator.userAgent.indexOf('Opera') ||
            navigator.userAgent.indexOf('OPR')) != -1
    ) {
        return 'Opera'
    } else if (navigator.userAgent.indexOf('Edg') != -1) {
        return 'Edge'
    } else if (navigator.userAgent.indexOf('Chrome') != -1) {
        return 'Chrome'
    } else if (navigator.userAgent.indexOf('Safari') != -1) {
        return 'Safari'
    } else if (navigator.userAgent.indexOf('Firefox') != -1) {
        return 'Firefox'
    } else if (
        navigator.userAgent.indexOf('MSIE') != -1 ||
        !!document.DOCUMENT_NODE == true
    ) {
        //IF IE > 10
        return 'IE'
    } else {
        return 'unknown'
    }
}

const cCode =
    `#define COM_PORT "COM8"
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

const javascriptCode = `/*
The JavaScript code example is diveded into 2 sections:
1. "send_command.js" -> representing the JavaScript code
2. "send_command.html" -> representing the html markup required to run the example. 

Create the 2 files on your local machine in the same directory, 
copy the JavaScript code to "send_command.js" 
and the html markup to "send_command.html", 
you can then open "send_command.html" using Chrome / Edge.
*/


/** "send_command.js" */
connectBtn = document.getElementById("connectBtn");
disconnectBtn = document.getElementById("disconnectBtn");
executeCmd = document.getElementById("executeCmd");

let serialPort;
let serialPortReader;

connectBtn.addEventListener("click", async () => {
  navigator.serial.requestPort().then(async (port) => {
    serialPort = port;
    await serialPort.open({ baudRate: 230400 });
    ReadFromSerialPortUntilClosed();
  });
});

disconnectBtn.addEventListener("click", () => {
  if (serialPortReader) {
    serialPortReader.cancel();
  } else {
    alert("Connect to the serial port first!");
  }
});

async function ReadFromSerialPortUntilClosed() {
  while (serialPort?.readable) {
    serialPortReader = serialPort.readable.getReader();
    try {
      while (true) {
        const { value, done } = await serialPortReader.read();
        if (done) {
          break;
        }
        console.log(value);
      }
    } catch (error) {
      console.log(error);
    } finally {
      serialPortReader.releaseLock();
      await serialPort.close();
      serialPort = null;
      serialPortReader = null;
      alert("Serial port is now closed.");
    }
  }
}

executeCmd.addEventListener("click", SendDataToSerialPort);

async function SendDataToSerialPort() {
  if (!serialPort) {
    alert("Connect to the serial port first!");
    return;
  }
  const writer = serialPort.writable.getWriter();
  await writer.write(new Uint8Array([0x58, 0x02, 0x08, 0x00, 0x88, 0x1D, 0x00, 0x36, 0x6E, 0x01, 0x00]));
  writer.releaseLock();
}



/** "send_command.html" */
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Servo tutorial</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
      crossorigin="anonymous"
    />
  </head>
  <body>
    <div
      class="d-flex flex-column justify-content-center align-items-center vh-100 vw-100"
    >
      <div class="w-25 d-flex justify-content-around">
        <button class="btn btn-success" id="connectBtn">Connect</button>
        <button class="btn btn-danger" id="disconnectBtn">Disconnect</button>
      </div>

      <button class="btn btn-primary mt-5" id="executeCmd">
        Execute command
      </button>
    </div>

    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
      crossorigin="anonymous"
    ></script>
    <script src="send_command.js"></script>
  </body>
</html>

`
const pythonCode = `#!/usr/local/bin/python3

import serial
import platform

PORT = "COM8"

if platform.system() == 'Windows':
    PORT_PREFIX = '\\\\\\\\.\\\\'
else:
    PORT_PREFIX = '/dev/tty'

try:
    serialPort = serial.Serial(PORT_PREFIX+PORT,
                               230400,
                               timeout=1)
except:
    # print(NameError)
    print('Could not open serial port.')
    exit()

print(serialPort.name)
serialPort.write(bytearray([0x58, 0x1F, 0x0A, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39]))


data = serialPort.read(1000)
print("Received %d bytes" % (len(data)))
print(data)

for d in data:
    print("0x%02X %d" % (d, d))

serialPort.close()
`

export const firmwareUpgradePyCode = `#!/usr/bin/env python3

# 1. Copy the whole code into a new python file  called "upgrade_firmware.py"
# 2. Put the firmware file into the same folder as the "upgrade_firmware.py"
# 3. Execute the python code using the following command:
# py upgrade_firmware.py -p COM8 -P firmware.firmware
import argparse
import time
import binascii
import struct
import serial_functions

FIRMWARE_UPGRADE_COMMAND = 23
SYSTEM_RESET_COMMAND = 27
FLASH_BASE_ADDRESS = 0x8000000
FLASH_PAGE_SIZE = 2048
BOOTLOADER_N_PAGES = 5    # 10kB bootloader
FIRST_FIRMWARE_PAGE_NUMBER = (BOOTLOADER_N_PAGES)
LAST_FIRMWARE_PAGE_NUMBER = 30
FLASH_SETTINGS_PAGE_NUMBER = 31

MODEL_CODE_LENGTH = 8
FIRMWARE_COMPATIBILITY_CODE_LENGTH = 1
FIRMWARE_PAGE_NUMBER_LENGTH = 1
CRC32_SIZE = 4
MINIMUM_FIRWARE_SIZE = FLASH_PAGE_SIZE - CRC32_SIZE

def read_binary(filename):
    print("Reading firmware file from:", filename)
    with open(filename, "rb") as fh:
        data = fh.read()
    firmware_data_size = len(data) - MODEL_CODE_LENGTH - FIRMWARE_COMPATIBILITY_CODE_LENGTH
    if firmware_data_size < MINIMUM_FIRWARE_SIZE:
        print("Error: the firmware size (%d) is less than one page of flash memory (%d)" % (firmware_size, FLASH_PAGE_SIZE))
        exit(1)
    print("The firmware file, including the header contents, has size:", len(data))
    model_code = data[0 : MODEL_CODE_LENGTH]
    firmware_compatibility_code = int.from_bytes(data[MODEL_CODE_LENGTH : MODEL_CODE_LENGTH + FIRMWARE_COMPATIBILITY_CODE_LENGTH], byteorder = 'little')
    firmware_data = data[MODEL_CODE_LENGTH + FIRMWARE_COMPATIBILITY_CODE_LENGTH : ]
    return model_code, firmware_compatibility_code, firmware_data

def program_one_page(ser, model_code, firmware_compatibility_code, page_number, data):
    assert len(data) == FLASH_PAGE_SIZE
    assert len(model_code) == MODEL_CODE_LENGTH
    print("Writing to page:", page_number)
    command = int(255).to_bytes(1, "little") + FIRMWARE_UPGRADE_COMMAND.to_bytes(1, "little")
    command = command + int(255).to_bytes(1, "little") + (MODEL_CODE_LENGTH + FIRMWARE_COMPATIBILITY_CODE_LENGTH + FIRMWARE_PAGE_NUMBER_LENGTH + FLASH_PAGE_SIZE).to_bytes(2, "little")
    command = command + model_code
    command = command + int(firmware_compatibility_code).to_bytes(FIRMWARE_COMPATIBILITY_CODE_LENGTH, "little")
    command = command + int(page_number).to_bytes(FIRMWARE_PAGE_NUMBER_LENGTH, "little")
    command = command + data
    print("Writing %d bytes" % (len(command)))

    # write the bytes in three shots with a time delay betwoen, otherwise there is a strange bug where bytes get dropped
    ser.write(command[0:1000])
    time.sleep(0.05)
    ser.write(command[1000:2000])
    time.sleep(0.05)
    ser.write(command[2000:])

def system_reset_command(ser):
    print("Resettting the newly programmed device...")
    command = int(255).to_bytes(1, "little") + SYSTEM_RESET_COMMAND.to_bytes(1, "little") + int(0).to_bytes(1, "little")
    print("Writing %d bytes" % (len(command)))
    ser.write(command)

# Define the arguments for this program. This program takes in an optional -p option to specify the serial port device
# and it also takes a mandatory firmware file name
parser = argparse.ArgumentParser(description='Upgrade the firmware on a device')
parser.add_argument('-p', '--port', help='serial port device', default=None)
parser.add_argument('-P', '--PORT', help='show all ports on the system and let the user select from a menu', action="store_true")
parser.add_argument('firmware_filename', help='new firmware file to send to the device')
args = parser.parse_args()

if args.PORT == True:
    serial_port = "MENU"
else:
    serial_port = args.port
firmware_filename = args.firmware_filename

model_code, firmware_compatibility_code, data = read_binary(firmware_filename)

print("This firmware is for a device with model [%s] and firmware compatibility code [%d]" % (model_code, firmware_compatibility_code))

# pad zeros until the length of the data is divisable by 4
while len(data) & 0x03 != 0:
    data = data + b'\x00'

print("The firmware size after padding zeros to make the firmware size divisible by 4 is:", len(data))

data_uint32 = []
for item in struct.iter_unpack('<I', data):  # unpack as little endian unsigned 32-bit integers
    data_uint32.append(item[0])

# we are finished manipulating, so now repack it back into bytes
data2 = b''
for item in data_uint32:
    data2 = data2 + struct.pack('<I', item)

firmware_size = (len(data) >> 2) - 1
firmware_crc = binascii.crc32(data[4:])
print("Firmware size is %u 32-bit values. Firmware CRC32 is 0x%08X." % (firmware_size, firmware_crc))

# replacing the first 32-bit number with the firmware size. this first number contained the stack location, 
# but we have moved this stack location to the 9th position in the startup script
data = firmware_size.to_bytes(4, "little") + data[4:] + firmware_crc.to_bytes(4, "little")

print("Will write this many bytes:", len(data))

ser = serial_functions.open_serial_port(serial_port, 230400, 0.05)

system_reset_command(ser)
time.sleep(0.1) # wait for it to reset

page_number = FIRST_FIRMWARE_PAGE_NUMBER
while len(data) > 0:
    if page_number > LAST_FIRMWARE_PAGE_NUMBER:
        print("Error: the firmware is too big to fit in the flash")
        exit(1)
    print("Size left:", len(data))
    if len(data) < FLASH_PAGE_SIZE:
        data = data + bytearray([0]) * (FLASH_PAGE_SIZE - len(data))
        print("Size left after append:", len(data))
    assert len(data) >= FLASH_PAGE_SIZE
    program_one_page(ser, model_code, firmware_compatibility_code, page_number, data[0 : FLASH_PAGE_SIZE])
    time.sleep(0.1)
    data = data[FLASH_PAGE_SIZE:]
    page_number = page_number + 1

system_reset_command(ser)

time.sleep(0.1)

ser.close()

`

export type languages = "python" | "c" | "javascript"

export const SupportedCodeExamples = {
    "Python": {
        "prismLanguage": "python",
        "code": pythonCode
    },
    "C": {
        "prismLanguage": "c",
        "code": cCode
    },
    "JavaScript": {
        "prismLanguage": "javascript",
        "code": javascriptCode
    }
}


import RawMotorCommands from '../public/motor_commands.json' assert {type: 'json'};

export const alterCodeSample = (_currentCommand: number, _currentAxis: string, currentCode: string, payload = ''): string => {

    let sendLength = 0;
    let rcvLength = 0;

    RawMotorCommands.map((item) => {
        if (item.CommandEnum == _currentCommand) {
            for (const input of item.Input) {
                if (typeof input == 'object') {
                    sendLength += getNoOfBytesFromDescription(input.Description)
                }
            }
            for (const output of item.Output) {
                if (typeof output == 'object') {
                    rcvLength += getNoOfBytesFromDescription(output.Description)
                }
            }
        }
    })

    const currentAxisASCIICode = '0x' + Uint8ArrayToString(transfNumberToUint8Arr(_currentAxis == 'All axes' ? 255 : _currentAxis.charCodeAt(0), 1));
    const currentCommandInHex = '0x' + Uint8ArrayToString(transfNumberToUint8Arr(_currentCommand, 1))
    let alteredCodeSample = ''

    if (currentCode == SupportedCodeExamples.C.prismLanguage) {
        const cCodeCmdToken = 'uint8_t cmd'
        const cCodeBufferToken = 'uint8_t buffer'

        {
            const indexOfCmd = SupportedCodeExamples.C.code.indexOf(cCodeCmdToken)
            const indexOfComma = SupportedCodeExamples.C.code.substring(indexOfCmd).indexOf(';')
            alteredCodeSample = SupportedCodeExamples.C.code.substring(0, indexOfCmd)

            let params = ''
            if (payload != '') {
                sendLength = payload.length / 2

                for (let i = 0; i < payload.length; i += 2) {
                    params += ', 0x' + payload[i].toUpperCase() + payload[i + 1].toUpperCase()
                }

            } else {
                //set all bytes to 0, we don't know any parameters
                for (let i = 0; i < sendLength; i++) {
                    params += ', 0'
                }
            }
            const sendLengthInHex = '0x' + Uint8ArrayToString(transfNumberToUint8Arr(sendLength, 1))

            alteredCodeSample += `uint8_t cmd[] = { ${currentAxisASCIICode}, ${currentCommandInHex}, ${sendLengthInHex}${params} };`
            alteredCodeSample += SupportedCodeExamples.C.code.substring(indexOfCmd + indexOfComma + 1)
        }
        {
            const alteredCodeAfterSendCmd = alteredCodeSample
            const indexOfBuffer = alteredCodeAfterSendCmd.indexOf(cCodeBufferToken)
            const indexOfComma = alteredCodeAfterSendCmd.substring(indexOfBuffer).indexOf(';')
            alteredCodeSample = alteredCodeAfterSendCmd.substring(0, indexOfBuffer)
            let buffer = ''
            for (let i = 0; i < rcvLength; i++) {
                buffer += ', 0'
            }
            alteredCodeSample += `uint8_t buffer[] = { 0, 0, 0${buffer} };`
            alteredCodeSample += alteredCodeAfterSendCmd.substring(indexOfBuffer + indexOfComma + 1)
        }
    }
    else if (currentCode == SupportedCodeExamples.JavaScript.prismLanguage) {
        const javascriptCodeCmdToken = 'Uint8Array(['

        const indexOfCmdStart = SupportedCodeExamples.JavaScript.code.indexOf(javascriptCodeCmdToken)
        const indexOfCmdEnd = SupportedCodeExamples.JavaScript.code.substring(indexOfCmdStart).indexOf(']))')
        alteredCodeSample = SupportedCodeExamples.JavaScript.code.substring(0, indexOfCmdStart)

        let params = ''
        if (payload != '') {
            sendLength = payload.length / 2

            for (let i = 0; i < payload.length; i += 2) {
                params += ', 0x' + payload[i].toUpperCase() + payload[i + 1].toUpperCase()
            }

        } else {
            //set all bytes to 0, we don't know any parameters
            for (let i = 0; i < sendLength; i++) {
                params += ', 0'
            }
        }
        const sendLengthInHex = '0x' + Uint8ArrayToString(transfNumberToUint8Arr(sendLength, 1))

        alteredCodeSample += `Uint8Array([${currentAxisASCIICode}, ${currentCommandInHex}, ${sendLengthInHex}${params}]`
        alteredCodeSample += SupportedCodeExamples.JavaScript.code.substring(indexOfCmdStart + indexOfCmdEnd + 1)

    }
    else if (currentCode == SupportedCodeExamples.Python.prismLanguage) {
        const pythonCodeCmdToken = 'bytearray'

        const indexOfCmdStart = SupportedCodeExamples.Python.code.indexOf(pythonCodeCmdToken)
        const indexOfCmdEnd = SupportedCodeExamples.Python.code.substring(indexOfCmdStart).indexOf(']))')
        alteredCodeSample = SupportedCodeExamples.Python.code.substring(0, indexOfCmdStart)

        let params = ''
        if (payload != '') {
            sendLength = payload.length / 2

            for (let i = 0; i < payload.length; i += 2) {
                params += ', 0x' + payload[i].toUpperCase() + payload[i + 1].toUpperCase()
            }

        } else {
            //set all bytes to 0, we don't know any parameters
            for (let i = 0; i < sendLength; i++) {
                params += ', 0'
            }
        }
        const sendLengthInHex = '0x' + Uint8ArrayToString(transfNumberToUint8Arr(sendLength, 1))

        alteredCodeSample += `bytearray([${currentAxisASCIICode}, ${currentCommandInHex}, ${sendLengthInHex}${params}]`
        alteredCodeSample += SupportedCodeExamples.Python.code.substring(indexOfCmdStart + indexOfCmdEnd + 1)

    }

    return alteredCodeSample;
}