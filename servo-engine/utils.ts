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

    getASCII_Code(): number {
        return this.char.charCodeAt(0);
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
        let input: string = this.toString();

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

    if (message.length % 2 !== 0)
        throw new Error("Your message has an invalid length, the number of bytes are not correct.")

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
