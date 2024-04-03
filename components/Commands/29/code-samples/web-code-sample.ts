export const webCode = 
`/*
The Web code example is diveded into 2 sections:
1. "send_command.js" -> representing the JavaScript code
2. "send_command.html" -> representing the HTML markup required to run the example. 

Create the 2 files on your local machine in the same directory, 
copy the JavaScript code to "send_command.js" 
and the html markup to "send_command.html", 
you can then open "send_command.html" using Chrome / Edge.

Open the Browser Console by pressing F12 on your keyboard while the web page is opened
to see the logs.
*/

/** "send_command.js" */
const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const executeCmd = document.getElementById("executeCmd");
const sentDataPelem = document.getElementById("sent-data-p");
const receivedDataPelem = document.getElementById("received-data-p");

let serialPort;
let serialPortReader;

connectBtn.addEventListener("click", async () => {
    navigator.serial.requestPort().then(async (port) => {
        serialPort = port;
        await serialPort.open({ baudRate: 230400 });
        alert("Connected!");
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
                receivedDataPelem.innerHTML = value.toString();
                console.log("Received: ", value);
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

/*
 * Returns a Uint8Array in a little endian format
 */
function get4BytesFromNumber(number) {
    const viewBytes = new DataView(new ArrayBuffer(4));

    viewBytes.setUint32(0, number, true);

    let result = new Uint8Array(4);

    for (let i = 0; i < 4; i++) {
        result.set([viewBytes.getUint8(i)], i);
    }

    return result;
}

executeCmd.addEventListener("click", SendDataToSerialPort);

async function SendDataToSerialPort() {
    if (!serialPort) {
        alert("Connect to the serial port first!");
        return;
    }

    // Define all constansts for the command
    // Each parameter has a specific length in bytes, define it here
    const ALIAS_PARAM_SIZE = 1;
    const COMMAND_PARAM_BYTE_SIZE = 1;
    const COMMAND_LENGTH_PARAM_BYTE_SIZE = 1;
    const COMMAND_NO_OF_MOVES_BYTE_SIZE = 1;
    const COMMAND_MOVES_TYPES_BYTE_SIZE = 4;
    const COMMAND_ONE_MOVE_BYTE_SIZE = 8; //4 bytes for vel or acc + 4 bytes time
    const MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION = 645120;
    const MOVE_TIME_MOTOR_UNITS_PER_SECOND = 31250;

    // Define all the parameters for this command
    const alias = 88;
    const motor_command = 29;

    // add the length in bytes for the payload
    // 1 byte number of moves from this shot
    // 4 bytes moves types
    // the rest of the bytes = moves_count * 8, where vel or acc are 4 bytes + and time is 4 bytes
    const moves_types = "111";
    const multi_moves = [ [60, 1], [-60, 1], [0, 0.5] ];
    const motor_command_length = 1 + 4 + multi_moves.length * 8;

    //declare a container for the bytes, set the length of the bytes array in constructor
    const bytes = new Uint8Array(
        ALIAS_PARAM_SIZE +
            COMMAND_PARAM_BYTE_SIZE +
            COMMAND_LENGTH_PARAM_BYTE_SIZE +
            COMMAND_NO_OF_MOVES_BYTE_SIZE +
            COMMAND_MOVES_TYPES_BYTE_SIZE +
            multi_moves.length * COMMAND_ONE_MOVE_BYTE_SIZE
    );

    //binary moves types string must be converted to an integer
    const moves_typesInt = parseInt(moves_types, 2);

    //revert the move types so we can loop over them 1 to 1 with the multi_moves
    const moves_types_reversed = moves_types.split("").reverse().join("");

    //Define here the indexes from where we can get the values for time, acceleration or velocity from the multi_moves array
    const ACC_VEL_INDEX = 0;
    const TIME_INDEX = 1;

    bytes.set([alias]);
    bytes.set([motor_command], 1);
    bytes.set([motor_command_length], 2);
    bytes.set([multi_moves.length], 3);
    bytes.set(get4BytesFromNumber(moves_typesInt), 4);

    const byteOffsetForCommands = 8;
    for (let i = 0, currentByteIndex = 0; i < multi_moves.length; i++) {
        if (moves_types_reversed[i] == "0") {
            //move with acceleration, convert to motor units and add it to the list
            const internal_acceleration = parseInt(
                (multi_moves[i][ACC_VEL_INDEX] / 60 ** 2) *
                    (MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION / MOVE_TIME_MOTOR_UNITS_PER_SECOND ** 2) *
                    2 ** 32
            );
            const communication_acceleration = parseInt(
                internal_acceleration / 2 ** 8
            );
            bytes.set(
                get4BytesFromNumber(communication_acceleration),
                byteOffsetForCommands + currentByteIndex
            );
        } else {
            //move with velocity, convert to motor units and add it to the list
            const internal_velocity =
            parseInt(multi_moves[i][ACC_VEL_INDEX] / 60) *
                (MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION /
                    MOVE_TIME_MOTOR_UNITS_PER_SECOND) *
                2 ** 32;
            const communication_velocity = parseInt(internal_velocity / 2 ** 12);
            bytes.set(
                get4BytesFromNumber(communication_velocity),
                byteOffsetForCommands + currentByteIndex
            );
        }

        //each time we add vel or acc, increase the current byte index by 4 (i32)
        currentByteIndex += 4;

        //after the velocity or acceleretion was added, add the time
        const move_time_motor_units =
            multi_moves[i][TIME_INDEX] * MOVE_TIME_MOTOR_UNITS_PER_SECOND;
        bytes.set(
            get4BytesFromNumber(move_time_motor_units),
            8 + currentByteIndex
        );

        //each time we add time, increase the current byte index by 4 (u32)
        currentByteIndex += 4;
    }

    sentDataPelem.innerHTML = bytes.toString();

    console.log("Sending the following bytes: ", bytes);
    const writer = serialPort.writable.getWriter();
    await writer.write(bytes);
    writer.releaseLock();
    console.log("Data sent!");
}


<!-- "send_command.html" -->
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
                <button class="btn btn-danger" id="disconnectBtn">
                    Disconnect
                </button>
            </div>

            <button class="btn btn-primary mt-5" id="executeCmd">
                Execute command
            </button>
            <div>
                <p>Sent data:</p>
                <p id="sent-data-p"></p>
            </div>
            <div>
                <p>Received data:</p>
                <p id="received-data-p"></p>
            </div>
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