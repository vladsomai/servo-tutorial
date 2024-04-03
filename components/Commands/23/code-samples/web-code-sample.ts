export const webCode = `/*
The web code example is diveded into 2 sections:
1. "send_command.js" -> representing the JavaScript code
2. "send_command.html" -> representing the HTML markup required to run the example. 

Create the 2 files on your local machine in the same directory, 
copy the JavaScript code to "send_command.js" 
and the HTML markup to "send_command.html", 
you can then open "send_command.html" using Chrome / Edge.
*/

/** "send_command.js" */
const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const executeCmd = document.getElementById("executeCmd");

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

async function SendDataToSerialPort(data) {
  if (!serialPort) {
    alert("Connect to the serial port first!");
    return;
  }
  const writer = serialPort.writable.getWriter();
  await writer.write(data);
  writer.releaseLock();
}

/*
  ********* Memory map *********
  0............10240 : bootloader (10kb || 5 pages)
  10240........61440 : firmware / application (50kb || 25 pages) 
  61440........63488 : flash settings (2kb || 1 page)
  */
const FLASH_PAGE_SIZE = 2048;
const BOOTLOADER_PAGE_MAX_SIZE = 5; //10kB bootloader
const FIRST_FIRMWARE_PAGE_NUMBER = BOOTLOADER_PAGE_MAX_SIZE;
const LAST_FIRMWARE_PAGE_NUMBER = 30;
const FIRMWARE_PAGE_MAX_SIZE =
  LAST_FIRMWARE_PAGE_NUMBER - FIRST_FIRMWARE_PAGE_NUMBER;
const FIRMWARE_BYTES_MAX_SIZE = FIRMWARE_PAGE_MAX_SIZE * FLASH_PAGE_SIZE;
const FLASH_SETTINGS_PAGE_NUMBER = 31;

executeCmd.addEventListener("click", executeFirmwareUpgrade);

const makeCRCTable = () => {
  let c;
  let crcTable = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }
  return crcTable;
};

const crcTable = makeCRCTable();
const crc32 = (data) => {
  let crc = 0 ^ -1;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
};

const fileInput = document.getElementById("inputFirmware");
fileInput.addEventListener("change", firmwareFileChanged);

let firmwareCode = null;
let modelCode = null;
let firmwareCompatibilityCode = null;

function firmwareFileChanged(e) {
  firmwareCode = null;
  modelCode = null;
  firmwareCompatibilityCode = null;

  const inp = e.target;

  if (inp.files.length < 1) return;

  const file = new FileReader();

  file.onload = (evt) => {
    const arrBuf = evt.target.result;
    const initialArr = new Uint8Array(arrBuf);

    const rawDataWithHeader = new Uint8Array(initialArr.length);

    rawDataWithHeader.set(initialArr);

    modelCode = rawDataWithHeader.slice(0, 8); //first 8 bytes
    firmwareCompatibilityCode = rawDataWithHeader.slice(8, 9); // 9th byte

    //the bytes from 10 to 13 are not used
    const dataWithoutHeader = new Uint8Array(rawDataWithHeader.slice(13));

    //Do not exceed max firmware size
    if (dataWithoutHeader.length > FIRMWARE_BYTES_MAX_SIZE) {
      console.log(
        \`Firmware file exceeds maximum firmware size! Max firmware size: \${FIRMWARE_BYTES_MAX_SIZE}\`
      );
      return;
    }

    //#region FW_SIZE

    //divide by 4 to get no. of words
    const firmwareSize = dataWithoutHeader.length >>> 2;

    /* Convert the firmware size to u32*/
    const rawFirmwareSizeArr = new ArrayBuffer(4);
    const viewFwSize = new DataView(rawFirmwareSizeArr);
    viewFwSize.setUint32(0, firmwareSize, true);

    const FwSizeArrUint8Arr = new Uint8Array(4);
    FwSizeArrUint8Arr.set([viewFwSize.getUint8(0)], 0);
    FwSizeArrUint8Arr.set([viewFwSize.getUint8(1)], 1);
    FwSizeArrUint8Arr.set([viewFwSize.getUint8(2)], 2);
    FwSizeArrUint8Arr.set([viewFwSize.getUint8(3)], 3);
    //#endregion FW_SIZE

    //#region CRC
    const crc = crc32(dataWithoutHeader);

    /* Convert the crc to u32*/
    const rawCrcArr = new ArrayBuffer(4);
    const viewCrc = new DataView(rawCrcArr);
    viewCrc.setUint32(0, crc, true);

    const crcArrUint8Arr = new Uint8Array(4);
    crcArrUint8Arr.set([viewCrc.getUint8(0)], 0);
    crcArrUint8Arr.set([viewCrc.getUint8(1)], 1);
    crcArrUint8Arr.set([viewCrc.getUint8(2)], 2);
    crcArrUint8Arr.set([viewCrc.getUint8(3)], 3);
    //#endregion CRC

    //#region FINAL_FIRMWARE_CODE

    const firmwareSizeWithoutZeros =
      FwSizeArrUint8Arr.length +
      dataWithoutHeader.length +
      crcArrUint8Arr.length;

    //append 0 until last page is full
    let firmwareSizeWithZeros = firmwareSizeWithoutZeros;
    while (firmwareSizeWithZeros % FLASH_PAGE_SIZE) {
      firmwareSizeWithZeros++;
    }

    firmwareCode = new Uint8Array(firmwareSizeWithZeros);

    firmwareCode.set(FwSizeArrUint8Arr);
    firmwareCode.set(dataWithoutHeader, 4);
    firmwareCode.set(crcArrUint8Arr, dataWithoutHeader.length + 4);
    //#endregion FINAL_FIRMWARE_CODE

    console.log("Firmware successfully loaded!");
  };

  file.readAsArrayBuffer(inp.files[0]);
}

async function executeFirmwareUpgrade(e) {
  if (firmwareCode == null) {
    console.log("Please upload a firmware file!");
    return;
  }

  if (!serialPort) {
    alert("Connect to the serial port first!");
    return;
  }

  //#region constructOneTelegram
  const constructOneTelegram = (pageNum, data) => {
    console.log("Flashing page ", pageNum);
    //#region FLASH_PAGE_SIZE

    //model code, fw compatibility code, page number
    const fps = 8 + 1 + 1 + FLASH_PAGE_SIZE;
    /* Convert the fps to u16*/
    const rawFpsArr = new ArrayBuffer(2);
    const viewFps = new DataView(rawFpsArr);
    viewFps.setUint16(0, fps, true);

    const fpsArrUint8Arr = new Uint8Array(2);
    fpsArrUint8Arr.set([viewFps.getUint8(0)], 0);
    fpsArrUint8Arr.set([viewFps.getUint8(1)], 1);
    //#endregion FLASH_PAGE_SIZE

    const initialCommandData = new Uint8Array(15);
    initialCommandData.set([255, 23, 255], 0);
    initialCommandData.set(fpsArrUint8Arr, 3);
    initialCommandData.set(modelCode, 5);
    initialCommandData.set(firmwareCompatibilityCode, 13);
    initialCommandData.set([pageNum], 14);

    const finalByteArr = new Uint8Array(
      initialCommandData.length + data.length
    );
    finalByteArr.set(initialCommandData, 0);
    finalByteArr.set(data, 15);

    return finalByteArr;
  };
  //#endregion constructOnePageTelegram

  //#region execute_programming
  const execute_programming = async () => {
    if (firmwareCode == null || firmwareCode == null) {
      console.log(
        "The firmware file is not available, please try refreshing the page and upload the firmware again."
      );
      return;
    }

    let remainingBytesToFlash = firmwareCode.slice();
    const totalPagesToFlash = remainingBytesToFlash.length / FLASH_PAGE_SIZE;

    /**Program all pages*/
    for (
      let currentPage = FIRST_FIRMWARE_PAGE_NUMBER;
      currentPage < totalPagesToFlash + FIRST_FIRMWARE_PAGE_NUMBER;
      currentPage++
    ) {
      const byteArray = constructOneTelegram(
        currentPage,
        remainingBytesToFlash.slice(0, FLASH_PAGE_SIZE)
      );

      await SendDataToSerialPort(byteArray.slice(0, 1000));
      await sleep(50);
      await SendDataToSerialPort(byteArray.slice(1000, 2000));
      await sleep(50);
      await SendDataToSerialPort(byteArray.slice(2000));
      await sleep(50);

      remainingBytesToFlash = remainingBytesToFlash.slice(FLASH_PAGE_SIZE);
    }
  };
  //#endregion execute_programming

  console.log("Firmware upgrade in progress...");

  const systemReset = new Uint8Array([0xff, 0x1b, 0x0]);

  await SendDataToSerialPort(systemReset);
  await sleep(100);

  await execute_programming();

  await sleep(100);
  await SendDataToSerialPort(systemReset);

  console.log("Firmware upgrade finished succesfully!");
}

const sleep = (time_ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, time_ms);
  });


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

      <div>
        <input
          class="form-control mt-5"
          type="file"
          accept=".firmware"
          name="firmware"
          id="inputFirmware"
        />
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