import Head from 'next/head'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import type { NextPageWithLayout } from './_app'
import Layout from '../components/layout'
import 'animate.css'

const Tutorial: NextPageWithLayout = () => {
  const [chapters, setChapters] = useState<number[]>([])
  useEffect(() => {
    let arr = []
    for (let i = 0; i < 16; i++) {
      arr.push(i)
    }
    console.log(arr)
    setChapters(arr)
  }, [])

  return (
    <>
      <Head>
        <title>Tutorial</title>
      </Head>
      <div className="flex animate__animated animate__fadeIn ">
        <div className="grid card w-1/6 bg-base-300 rounded-box place-items-center h-screen-80 overflow-show-scroll">
          <div className="flex flex-col w-full border-opacity-50">
            <h2 className=" mt-5 text-center text-secondary font-bold tracking-wide">
              CHAPTERS
            </h2>
            <div className="divider"></div>

            {chapters.map((i) => {
              return (
                <button key={i} className="btn btn-link">
                  CHAPTER {i + 1}
                </button>
              )
            })}
          </div>
        </div>
        <div className="divider divider-horizontal"></div>
        <div className="grid w-full card bg-base-300 rounded-box place-items-center  h-screen-80 overflow-show-scroll">
          <div className="h-2/4 flex w-1/3 flex-col justify-center align-middle">
            <input
              type="text"
              placeholder="Set torque"
              className="input input-bordered w-full max-w-xs mb-5"
            />{' '}
            <input
              type="text"
              placeholder="Set speed"
              className="input input-bordered w-full max-w-xs mb-5"
            />
            <input
              type="text"
              placeholder="Maximum drown current"
              className="input input-bordered w-full max-w-xs mb-5"
            />
            <button className="btn btn-success w-full max-w-xs">
              Execute command!
            </button>
          </div>
          <div className="mockup-window border bg-base-300 w-full">
            <div className="flex justify-center px-4 py-16 bg-base-200">
              Hello dear Scholar, this is the place you will see the sent and
              received bytes from the servo motor!
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Tutorial.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Tutorial
