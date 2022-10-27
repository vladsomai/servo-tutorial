import { SyntheticEvent, useRef } from 'react'
import { crc32, sleep } from '../../servo-engine/utils'
import { ChaptersPropsType } from './0_1'
import Image from 'next/image'

interface FirmwareCmdProps extends ChaptersPropsType {
  isConnected: boolean
}

export const Command23 = (props: FirmwareCmdProps) => {
  /*
  ********* Memory map *********
  0............10240 : bootloader (10kb || 5 pages)
  10240........61440 : firmware / application (51200kb || 25 pages) 
  61440........63488 : flash settings (2kb || 1 page)
  */
  const FLASH_PAGE_SIZE = 2048
  const BOOTLOADER_PAGE_MAX_SIZE = 5 //10kB bootloader
  const FIRST_FIRMWARE_PAGE_NUMBER = BOOTLOADER_PAGE_MAX_SIZE
  const LAST_FIRMWARE_PAGE_NUMBER = 30
  const FIRMWARE_PAGE_MAX_SIZE =
    LAST_FIRMWARE_PAGE_NUMBER - FIRST_FIRMWARE_PAGE_NUMBER
  const FIRMWARE_BYTES_MAX_SIZE = FIRMWARE_PAGE_MAX_SIZE * FLASH_PAGE_SIZE
  const FLASH_SETTINGS_PAGE_NUMBER = 31

  const firmwareCode = useRef<Uint8Array | null>(null)
  const modelCode = useRef<Uint8Array | null>(null)
  const firmwareCompatibilityCode = useRef<Uint8Array | null>(null)

  const firmwareFileChanged = (e: SyntheticEvent) => {
    firmwareCode.current = null
    modelCode.current = null
    firmwareCompatibilityCode.current = null

    const inp = e.target as HTMLInputElement

    if (inp.files!.length < 1) return

    const file = new FileReader()

    file.onload = (evt) => {
      const arrBuf = evt.target!.result as ArrayBuffer
      const initialArr = new Uint8Array(arrBuf)
      //rawData will include the whole file(data+zeros)
      const rawDataWithHeader = new Uint8Array(initialArr.length)

      rawDataWithHeader.set(initialArr)

      modelCode.current = rawDataWithHeader.slice(0, 8) //first 8 bytes
      firmwareCompatibilityCode.current = rawDataWithHeader.slice(8, 9) // 9th byte

      //the bytes from 10 to 13 are not used
      const dataWithoutHeader = new Uint8Array(rawDataWithHeader.slice(13))

      //Do not exceed max firmware size
      if (dataWithoutHeader.length > FIRMWARE_BYTES_MAX_SIZE) {
        props.LogAction(
          `Firmware file exceeds maximum firmware size! Max firmware size: ${FIRMWARE_BYTES_MAX_SIZE}`,
        )
        return
      }

      //#region FW_SIZE
      const firmwareSize = dataWithoutHeader.length >>> 2 //divide by 4

      /* Convert the firmware size to u32*/
      const rawFirmwareSizeArr = new ArrayBuffer(4)
      const viewFwSize = new DataView(rawFirmwareSizeArr)
      viewFwSize.setUint32(0, firmwareSize, true)

      const FwSizeArrUint8Arr = new Uint8Array(4)
      FwSizeArrUint8Arr.set([viewFwSize.getUint8(0)], 0)
      FwSizeArrUint8Arr.set([viewFwSize.getUint8(1)], 1)
      FwSizeArrUint8Arr.set([viewFwSize.getUint8(2)], 2)
      FwSizeArrUint8Arr.set([viewFwSize.getUint8(3)], 3)
      //#endregion FW_SIZE

      //#region CRC
      const crc = crc32(dataWithoutHeader)
      /* Convert the crc to u32*/
      const rawCrcArr = new ArrayBuffer(4)
      const viewCrc = new DataView(rawCrcArr)
      viewCrc.setUint32(0, crc, true)

      const crcArrUint8Arr = new Uint8Array(4)
      crcArrUint8Arr.set([viewCrc.getUint8(0)], 0)
      crcArrUint8Arr.set([viewCrc.getUint8(1)], 1)
      crcArrUint8Arr.set([viewCrc.getUint8(2)], 2)
      crcArrUint8Arr.set([viewCrc.getUint8(3)], 3)
      //#endregion CRC

      //#region FINAL_FIRMWARE_CODE

      const firmwareSizeWithoutZeros =
        FwSizeArrUint8Arr.length +
        dataWithoutHeader.length +
        crcArrUint8Arr.length

      let firmwareSizeWithZeros = firmwareSizeWithoutZeros
      while (firmwareSizeWithZeros % FLASH_PAGE_SIZE) {
        firmwareSizeWithZeros++
      }

      firmwareCode.current = new Uint8Array(firmwareSizeWithZeros)

      firmwareCode.current.set(FwSizeArrUint8Arr as Uint8Array)
      firmwareCode.current.set(dataWithoutHeader, 4)
      firmwareCode.current.set(
        crcArrUint8Arr as Uint8Array,
        dataWithoutHeader.length + 4,
      )
      //#endregion FINAL_FIRMWARE_CODE

      props.LogAction('Firmware successfully loaded!')
    }

    file.readAsArrayBuffer(inp.files![0])
  }

  const execute_command = async () => {
    const selectedAxis = props.getAxisSelection()
    if (selectedAxis == '') return

    if (firmwareCode == null || firmwareCode.current == null) {
      props.LogAction('Please upload a firmware file!')
      return
    }

    if (!props.isConnected) {
      props.LogAction('Sending data is not possible, you must connect first!')
      return
    }

    //#region constructOneTelegram
    const constructOneTelegram = (pageNum: number, data: Uint8Array) => {
      //#region FLASH_PAGE_SIZE

      //model code, fw compatibility code, page number
      const fps = 8 + 1 + 1 + FLASH_PAGE_SIZE
      /* Convert the fps to u16*/
      const rawFpsArr = new ArrayBuffer(2)
      const viewFps = new DataView(rawFpsArr)
      viewFps.setUint16(0, fps, true)

      const fpsArrUint8Arr = new Uint8Array(2)
      fpsArrUint8Arr.set([viewFps.getUint8(0)], 0)
      fpsArrUint8Arr.set([viewFps.getUint8(1)], 1)
      //#endregion FLASH_PAGE_SIZE

      const initialCommandData = new Uint8Array(15)
      initialCommandData.set(
        [255, props.currentCommandDictionary.CommandEnum, 255],
        0,
      )
      initialCommandData.set(fpsArrUint8Arr, 3)
      initialCommandData.set(modelCode.current as Uint8Array, 5)
      initialCommandData.set(
        firmwareCompatibilityCode.current as Uint8Array,
        13,
      )
      initialCommandData.set([pageNum], 14)

      const finalByteArr = new Uint8Array(
        initialCommandData.length + data.length,
      )
      finalByteArr.set(initialCommandData, 0)
      finalByteArr.set(data, 15)

      return finalByteArr
    }
    //#endregion constructOnePageTelegram

    //#region execute_programming
    const execute_programming = async () => {
      if (firmwareCode == null || firmwareCode.current == null) {
        props.LogAction(
          'The firmware file is not available, please try refreshing the page and upload the firmware again.',
        )
        return
      }

      let remainingBytesToFlash = firmwareCode.current.slice()
      const totalPagesToFlash = remainingBytesToFlash.length / FLASH_PAGE_SIZE

      /**Program all pages*/
      for (
        let currentPage = FIRST_FIRMWARE_PAGE_NUMBER;
        currentPage < totalPagesToFlash + FIRST_FIRMWARE_PAGE_NUMBER;
        currentPage++
      ) {
        var byteArray = constructOneTelegram(
          currentPage,
          remainingBytesToFlash.slice(0, FLASH_PAGE_SIZE),
        )

        await props.sendDataToSerialPort(byteArray.slice(0, 1000), false, false)
        await sleep(50)
        await props.sendDataToSerialPort(
          byteArray.slice(1000, 2000),
          false,
          false,
        )
        await sleep(50)
        await props.sendDataToSerialPort(byteArray.slice(2000), false, false)
        await sleep(50)

        remainingBytesToFlash = remainingBytesToFlash.slice(FLASH_PAGE_SIZE)
      }
    }
    //#endregion execute_programming

    props.LogAction('Firmware upgrade in progress...')

    //System reset
    await props.sendDataToSerialPort('FF1B00', false, false)

    await sleep(100)
    await execute_programming()
    await sleep(100)

    //System reset
    await props.sendDataToSerialPort('FF1B00', false, false)

    props.LogAction('Firmware upgrade finished succesfully!')
  }

  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="m-5 w-full flex justify-center">
          <input
            // ref={upperLimitInputBox}
            // onChange={onUpperLimitInputBoxChange}
            className="block w-4/6 text-sm rounded-lg border border-neutral cursor-pointer file:btn file:btn-sm file:rounded-none file:mr-5 file:border-0"
            type="file"
            accept=".firmware"
            name="firmware"
            id="inputFirmware"
            onChange={firmwareFileChanged}
          />
        </div>
        <div className="flex justify-center">
          <button className="btn btn-primary btn-sm" onClick={execute_command}>
            execute
          </button>
        </div>
      </div>
      <article className="mb-5 prose prose-slate max-w-full">
        <div className="flex justify-center">
          <h2>
            Let&apos;s learn how to implement the firmware upgrade command
          </h2>
        </div>
        <h3>Preparing the firmware</h3>
        <p>
          Firstly, we must understand how the firmware file is structured, here
          is a sample:{' '}
        </p>
        <Image
          className="mask rounded-box"
          width={793}
          height={964}
          src="/FirmwareFile.png"
          alt="main picture"
          priority
        ></Image>
        <p></p>
        <ul>
          <li>
            First 8 bytes represent the model code. In the following guide, we
            will refer to those 8 bytes as <b>model code</b>.
          </li>
          <li>
            9th byte represent the firmware compatibility code. In the following
            guide, we will refer to this byte as <b>fw compatibility code</b>.
          </li>
          <li>Bytes 10 to 13 are currently not used.</li>
          <li>
            The rest of the bytes from the firmware file represent the
            application code. All the following operations will involve
            manipulating this byte array(from 14th byte to the end of the
            firmware file). In the following guide, we will refer to those bytes
            as <b>fw app code</b>.
          </li>
        </ul>
        <h4>Flash memory mapping</h4>
        <p>
          {' '}
          The flash memory is organized in <b>pages</b> each containing{' '}
          <b>2048 bytes.</b>
        </p>
        <p>
          The microcontroller has 31 flash pages available for the user in the
          following form:
        </p>
        <ol>
          <li>Pages 1 to 5 are reserved for bootloader code.</li>
          <li>Pages 6 to 30 are reserved for application code.</li>
          <li>Page 31 is reserved for flash settings.</li>
        </ol>
        <p>
          Pages 1 to 5 and 31 will be set by the manufacturer of the motor, you
          must not write at those memory addreses yourself. To summerize, the
          memory map looks like this:
        </p>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Start address</th>
                <th>End address</th>
                <th>Size (bytes)</th>
                <th>Pages</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>1</th>
                <td>0</td>
                <td>0x3FF</td>
                <td>10240</td>
                <td>5</td>
                <td>Bootloader area</td>
              </tr>
              <tr>
                <th>2</th>
                <td>0x400</td>
                <td>0xEFF</td>
                <td>51200</td>
                <td>25</td>
                <td>Application area</td>
              </tr>
              <tr>
                <th>1</th>
                <td>0xF000</td>
                <td>0xF7FF</td>
                <td>2048</td>
                <td>1</td>
                <td>Flash settings area</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4>Steps to follow in preparing the firmware flashing process</h4>
        <ol>
          <li>Load the firmware file.</li>
          <li>
            Split the firmware file into 4 uint8_t arrays containing all the
            bullets described above in the structure of the file.
          </li>
          <li>
            Verify the application code is not larger than the maximum flash
            size reserved for application area.
          </li>
          <li>
            Compute the firmware size in machine <b>words</b>. This is achieved
            by getting the length of the <b>fw app code</b> and dividing it by
            4. The firmware size than needs to be stored into a uint32_t with
            little endian format.
          </li>
          <li>
            Compute the CRC32 using the <b>fw app code</b>. You can find
            exapmples on the web on how to implement a CRC32 function. The CRC32
            value needs to be stored into an uint32_t with little endian format.
          </li>
          <li>
            Compute the final firmware that you will use to send over the serial
            port. The final firmware must have the first 4 bytes the ones
            computed at step 4(the ones stored in little endian format), the{' '}
            <b>fw app code</b> and the CRC32 bytes computed at step 5. Keep in
            mind the following rules:
          </li>
          <ul>
            <li>
              Calculate the current size of the final firmware by adding up the
              firmware size bytes(4bytes / 32bits), fw app code size(variable in
              length), CRC32 bytes(4bytes / 32bits). We will call this size{' '}
              <b>fw size without padding</b>
            </li>
            <li>
              You will need to concatenate &apos;0&apos; bytes at the end, until
              a full flash page is completed. Generate a new uint8_t array full
              of &apos;0&apos; with the size equal to{' '}
              <i> ceil(currentFwSize / 2048)</i>
            </li>
          </ul>
          <li>
            At this point you shall have the following uint8_t array: fw_size +
            fw_app_code + CRC32 + zeros until the end of a page. We will call
            this the <b>final fw app code</b>
          </li>
        </ol>
        <h2>Executing the flashing process</h2>
        <p>
          Using the final array constructed above, we will need to break it up
          into chunks of 2048 bytes where you will also append the axis, command
          and length bytes. We will call this array the <b>telegram</b>.
        </p>
        <h4>Constructing the telegram</h4>
        <ol>
          <li>Byte 0: Axis - set to 255 / 0xFF.</li>
          <li>Byte 1: Command no. (23)</li>
          <li>Byte 2: Length byte - set to 255 / 0xFF.</li>
          <li>
            Bytes 3,4: Flash page size(8+1+1+2048), where 8 is size of model
            code, 1 is size of fw compatibility code, 1 is page number that is
            currently beeing written to, 2048 is the flash page size.
          </li>
          <li>Bytes 5 to 12: Model code.</li>
          <li>Byte 13: Fw compatibility code.</li>
          <li>
            Byte 14: The current page number that is being written to (this is a
            uint8_t and range from 5 to 29).
          </li>
          <li>
            Bytes 15 to 2062: The 2048 bytes chunk from the final fw app code
          </li>
        </ol>
        <h4>Execution</h4>
        <ol>
          <li>Do a firmware reset (command 27).</li>
          <li>
            Construct telegram until all 2048 chunks are sent over the serial
            port to the motor, using a delay of 50ms between all the telegrams.
          </li>
          <li>Do a firmware reset (command 27).</li>
        </ol>
      </article>
    </>
  )
}
