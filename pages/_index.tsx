import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/layout'
import { ReactElement, useEffect, useState } from 'react'
import type { NextPageWithLayout } from './_app'
import 'animate.css'
import { useRouter } from 'next/router'

const Home: NextPageWithLayout = () => {
  const [MainPicHeight, setMainPicHeight] = useState(50)
  const MainPicAspectRation = 1.37
  const router = useRouter()
  useEffect(() => {
    setMainPicHeight(window.innerWidth/5)
  }, [])

  useEffect(()=>{
    router.push('/tutorial/100')

  },[router])

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="text-center animate__animated animate__fadeIn h-[85vh]">
        <div className=" flex flex-col h-full">
          <h1 className="text-6xl xl:text-4xl my-10">Welcome Scholar!</h1>
          <p className="text-2xl xl:text-lg mb-5">
            We are happy to see you, this tutorial will teach you how to use a
            servo motor.
          </p>
          <div className="">
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
      </div>
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Home
