import { SyntheticEvent, useRef } from 'react'
import { crc32, sleep } from '../../servo-engine/utils'
import { ChaptersPropsType } from './0_1'

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

        await props.sendDataToSerialPort(byteArray.slice(0, 1000))
        await sleep(50)
        await props.sendDataToSerialPort(byteArray.slice(1000, 2000))
        await sleep(50)
        await props.sendDataToSerialPort(byteArray.slice(2000))
        await sleep(50)

        remainingBytesToFlash = remainingBytesToFlash.slice(FLASH_PAGE_SIZE)
      }
    }
    //#endregion execute_programming

    props.LogAction('Firmware upgrade in progress...')

    //System reset
    await props.sendDataToSerialPort('FF1B00')

    await sleep(100)
    await execute_programming()
    await sleep(100)

    //System reset
    await props.sendDataToSerialPort('FF1B00')

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
          <div className="mr-4">{props.children}</div>
          <button className="btn btn-primary btn-sm" onClick={execute_command}>
            execute
          </button>
        </div>
      </div>
    </>
  )
}
