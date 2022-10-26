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
        <div>
          <Image
            className="mask"
            src={'/404_page_not_found.svg'}
            width={MainPicHeight * MainPicAspectRation}
            height={MainPicHeight}
            alt="main picture"
            priority
          ></Image>
        </div>
        <h1 className="text-6xl text-center m-12 "> Page not found!</h1>
      </div>
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Home
