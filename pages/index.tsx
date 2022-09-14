import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/layout'
import type { ReactElement, ReactNode } from 'react'
import type { NextPageWithLayout } from './_app'
import 'animate.css'

const Home: NextPageWithLayout = () => {
  const MainPicHeight = 350
  const MainPicAspectRation = 1.37

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="text-center animate__animated animate__fadeIn overflow-show-scroll h-[84vh] flex flex-col justify-center">
        <h1 className="text-6xl text-center m-12 ">Welcome Scholar!</h1>
        <p className="text-center text-2xl m-6">
          We are happy to see you, this tutorial will teach you how to use a
          servo motor.
        </p>
        <div>
          <Image
            className="mask mask-squircle"
            src={'/main_pic.jpg'}
            width={MainPicHeight * MainPicAspectRation}
            height={MainPicHeight}
            alt="main picture"
            priority
          ></Image>
        </div>
      </div>
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Home
