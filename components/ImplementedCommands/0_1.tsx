import { MainWindowProps } from '../main-window'
import { ReactElement, SyntheticEvent, useEffect, useRef } from 'react'
import Highlight from 'react-highlight'
import 'highlight.js/styles/github-dark-dimmed.css'

export interface ChaptersPropsType extends MainWindowProps {
  sendDataToSerialPort: (
    dataToSend: string | Uint8Array,
    enableSentLogging?: boolean,
    enableTimoutLogging?: boolean,
  ) => void
  LogAction: (errorType: string, log: string) => void
  constructCommand: (_axis: string, _payload: string) => Uint8Array
  getAxisSelection: () => string
  children: ReactElement
}

export const Command1 = (props: ChaptersPropsType) => {
  useEffect(() => {}, [])

  const codeText = useRef<HTMLDivElement | null>(null)
  const disable_enable_MOSFETS = () => {
    const selectedAxis = props.getAxisSelection()
    if (selectedAxis == '') return

    const rawData = props.constructCommand(selectedAxis, '')

    props.sendDataToSerialPort(rawData)
  }
  const copyToClipboard = async (e: SyntheticEvent) => {
    console.log(window.Clipboard)
    if (codeText.current != null) {
    }
  }
  return (
    <>
      <div className="w-full mb-5">
        <div className="flex justify-center">
          <div className="mr-4">{props.children}</div>
          <button
            className="btn btn-primary btn-sm"
            onClick={disable_enable_MOSFETS}
          >
            {props.currentCommandDictionary.CommandEnum == 0
              ? 'DISABLE MOSFETS'
              : 'ENABLE MOSFETS'}
          </button>
        </div>
        <p className=' mt-10 text-3xl text-center'>C code example</p>

        <pre className="rounded-2xl text-xs mt-0">
          {/* <button
            className="absolute right-5 btn btn-xs text normal-case tracking-wider rounded-tl-none rounded-br-none"
            onClick={copyToClipboard}
          >
            Copy
          </button> */}
          <code > 
            <Highlight className="rounded-2xl text-xs">{code}</Highlight>
          </code>
        </pre>
      </div>
    </>
  )
}

const code = `#include <stdio.h>
#include <string.h>
#include <stdint.h>

#ifdef _WIN32
  #include<windows.h>
#else
  //MAC or Linux
  #include<unistd.h>
#endif

FILE* OpenPort(const char* COMPort)
{

#ifdef _WIN32
  char WIN_COM_PATH[50] = "\\\\\\\\.\\\\";
  strcat(WIN_COM_PATH, COMPort);

  FILE* portHandle = fopen(WIN_COM_PATH, "r+");
#else
  //MAC or Linux
  FILE* portHandle = fopen("/dev/ttyACM0", "r+");
#endif

  if (portHandle == NULL)
  {
    printf("Cannot open COM port.\\n");
  }

  return portHandle;
}

int main()
{
  FILE* portHandle = OpenPort("COM8");

  if (!portHandle)
    return -1;

  {
    //System reset(27) for axis 0x58('X')
    uint8_t cmd[] = { 0x58, 0x1B, 0 };
    size_t writtenBytes = fwrite(cmd, sizeof(uint8_t), sizeof(cmd), portHandle);
    fflush(portHandle);

    printf("Wrote %d bytes.\\n", writtenBytes);
  }

  //Wait 1000ms for the MCU to reset
  #ifdef _WIN32
    Sleep(1000);
  #else
    sleep(1000);
  #endif

  uint8_t cmd[] = { 0x58, 0, 0 };
  size_t writtenBytes = fwrite(cmd, sizeof(uint8_t), sizeof(cmd), portHandle);
  fflush(portHandle);
  
  printf("\\nWrote %d bytes.", writtenBytes);

  //default initialize to 0, buffer must have 3 bytes for cmd 0
  uint8_t buffer[] = { 0,0,0 };
  size_t readBytes = fread(buffer, sizeof(uint8_t), sizeof(buffer), portHandle);

  printf("\\nReceived: ");
  for (int i = 0; i < sizeof(buffer); i++)
  {
    printf("0x%x ", buffer[i]);
  }

  fclose(portHandle);

}
`
