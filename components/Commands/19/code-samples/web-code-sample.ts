export const webCode = 
`/*
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

async function SendDataToSerialPort() {
  if (!serialPort) {
    alert("Connect to the serial port first!");
    return;
  }
  const writer = serialPort.writable.getWriter();
  await writer.write(new Uint8Array([0x58, 0x02, 0x08, 0x00, 0x88, 0x1D, 0x00, 0x36, 0x6E, 0x01, 0x00]));
  writer.releaseLock();
  console.log('Data sent!')
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