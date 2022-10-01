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
export const RPM_ToInternalVelocity = (rpm: number): number => {
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
