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

/**
 * Returns a Uint8Array representing the bytes from the hex string 
 * @param Input: "FF00A2" hex number as string to be converted to Uint8Array
 * @param Output: [0xFF,0,0xA2] 
 */
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

/**
 * Returns a string with the hexString converted to the format 
 * @param format format string
 * @param hexString hex number as string to be converted to the specified format
 */
export const getDisplayFormat = (format: string, hexString: string, typeWithDescription: string = "") => {

    const formatArr = format.split(',');

    if (typeWithDescription.length) {
        // version_number
        const indexOfColumn = typeWithDescription.indexOf(":");
        const typeStr = typeWithDescription.slice(0, indexOfColumn)
        if (typeStr.includes("version_number")) {
            format = '%uvn'
        }
    }

    let res = '';
    const preText = " Result converted to "
    let convertedTo = '';
    let result: string[] = []
    for (format of formatArr) {
        convertedTo = ''
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

        result.push(preText + convertedTo + res)
    }

    return result;
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

/**
 * This method inverts the hex bytes 
 */
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

import { javascriptCode } from "./CodeExamples/JavaScript";
import { pythonCode } from "./CodeExamples/Python";
import { cCode } from "./CodeExamples/C";


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
    const currentAxisASCIICode = '0x' + Uint8ArrayToString(transfNumberToUint8Arr(parseInt(_currentAxis), 1));
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

//This method will convert a string to a char when string is of length 1 or,
//convert to a decimal when input length is > 1
export function convertAxisSelectionValue(axisSelectionValue: string): number {
    let selectedAxis = parseInt(axisSelectionValue);

    if (axisSelectionValue.length == 1) {
        //convert to char if the input is only one character
        selectedAxis = new Char(axisSelectionValue).getDecimalASCII_Code();
    }
    return selectedAxis
}

export interface Device {
    UniqueID: string,
    Alias: string
}