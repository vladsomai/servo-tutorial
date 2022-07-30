import Head from 'next/head'
import Layout from '../components/layout'
import { ReactElement, useEffect, useRef, useState } from 'react'
import type { NextPageWithLayout } from './_app'
import 'animate.css'
import { stringToUint8Array, Uint8ArrayToString } from '../servo-engine/utils'
import TestComponent from '../components/testComponent'

const Test: NextPageWithLayout = () => {
  const portSer = useRef<SerialPort | null>(null)
  const closeSerialPort = useRef<boolean>(false)
  const reader = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)

  const connectToSerialPort = async (BaudRate: number) => {
    try {
      closeSerialPort.current = false
      portSer.current = await navigator.serial.requestPort()
      await portSer.current.open({ baudRate: BaudRate })
      readDataFromSerialPortUntilClosed()
      console.log('Connected!')
    } catch (err) {
      if (err instanceof Error) {
        console.log(err!.message)
        return
      } else {
        console.log(err)
        return
      }
    }
  }

  const disconnectFromSerialPort = async () => {
    if (portSer && portSer.current) {
      try {
        reader.current?.cancel()
      } catch (err) {
        if (err instanceof Error) {
          console.log(err!.message)
          return
        }

        console.log(err)
        return
      }
    } else {
      console.log('Disconnecting not possible, you must connect first!')
    }
  }
  /*This function will take an input like string that represents hexadecimal bytes
    e.g. "410000" , it will send on the serial port the raw binary repr. of that string e.g. [0x41,0,0]
    when sending succeds, the function will output the send bytes on the log windows as a hexa decima string
 */
  const sendDataToSerialPort = async (dataToSend: string) => {
    if (portSer && portSer.current) {
      const writer = portSer.current.writable!.getWriter()

      let data: Uint8Array = new Uint8Array([])
      try {
        data = stringToUint8Array(dataToSend)
      } catch (err) {
        if (err instanceof Error) {
          console.log(err!.message)
          writer.releaseLock()
          return
        }

        writer.releaseLock()
        console.log(err)
        return
      }

      let hexString = Uint8ArrayToString(data)

      await writer.write(data)
      console.log('Sent: 0x' + hexString.toUpperCase())
      writer.releaseLock()
    } else {
      console.log('Sending data not possible, you must connect first!')
    }
  }

  const readDataFromSerialPortUntilClosed = async () => {
    if (portSer && portSer.current) {
      if (portSer.current.readable) {
        reader.current = await portSer.current.readable!.getReader()

        if (reader && reader.current) {
          try {
            while (true) {
              if (portSer.current != null && portSer.current.readable) {
                const { value, done } = await reader.current!.read()
                if (done) {
                  console.log('Reader is now closed!')
                  reader.current!.releaseLock()
                  break
                } else {
                  console.log('Received: 0x' + Uint8ArrayToString(value))
                }
              }
            }
          } catch (err) {
            if (err instanceof Error) {
              console.log(err!.message)
              console.log('Reader is closed')
              reader.current.releaseLock()
              return
            }

            console.log('Reader is closed')
            reader.current.releaseLock()
            console.log(err)
            return
          } finally {
            await portSer.current.close()
            portSer.current = null
            console.log('Disconnected!')
          }
        }
      }
    }
  }
  return (
    <>
      <Head>
        <title>Test</title>
      </Head>
      <div className="flex text-center justify-center">
        <TestComponent>
          <div>
            <p>I am a child 1 p</p> <p>I am a child 2 p</p>
          </div>
        </TestComponent>
      </div>
      <div className="flex justify-around">
        <label htmlFor="my-modal-4" className="btn modal-button">
          open modal
        </label>
        <button
          className="btn btn-success"
          onClick={() => {
            connectToSerialPort(230400)
          }}
        >
          Connect
        </button>{' '}
        <button className="btn btn-error" onClick={disconnectFromSerialPort}>
          {' '}
          Disconnect
        </button>
        <button
          className="btn btn-info"
          onClick={() => {
            sendDataToSerialPort('FFA0AA')
          }}
        >
          {' '}
          Send
        </button>{' '}
      </div>
    </>
  )
}

Test.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Test
