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
const receivedDataPelem = document.getElementById("received-data-p");
const sentDataPelem = document.getElementById("sent-data-p");

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

executeCmd.addEventListener("click", SendDataToSerialPort);

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
    const COMMAND_DISPLACEMENT_SIZE = 4
    const COMMAND_MOVE_SIZE = 4

    const MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION = 645120
    const MOVE_TIME_MOTOR_UNITS_PER_SECOND = 31250

    // Define all the parameters for this command
    const alias = 255;
    const motor_command = 2;
    const motor_command_length = 8;
    const move_displacement_rotations = 0
    const move_time_seconds = 0

    //declare a container for the bytes, set the length of the bytes array in constructor
    const bytes = new Uint8Array(
            ALIAS_PARAM_SIZE +
            COMMAND_PARAM_BYTE_SIZE +
            COMMAND_LENGTH_PARAM_BYTE_SIZE +
            COMMAND_DISPLACEMENT_SIZE +
            COMMAND_MOVE_SIZE
    );

    //convert input values to motor units
    const move_displacement_motor_units = get4BytesFromNumber(
        move_displacement_rotations * MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION
    );
    const move_time_motor_units = get4BytesFromNumber(
        move_time_seconds * MOVE_TIME_MOTOR_UNITS_PER_SECOND
    );

    bytes.set([alias]);
    bytes.set([motor_command], 1);
    bytes.set([motor_command_length], 2);
    bytes.set(move_displacement_motor_units, 3);
    bytes.set(move_time_motor_units, 7);

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