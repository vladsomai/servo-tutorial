import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/layout'
import type { ReactElement, ReactNode } from 'react'
import type { NextPageWithLayout } from './_app'
import Link from 'next/link'

const Home: NextPageWithLayout = () => {
  const MainPicHeight = 350
  const MainPicAspectRation = 1.37

  return (
    <>
      <Head>
        <title>Page not found</title>
      </Head>
      <div className="overflow-auto h-[84vh] flex flex-col justify-center items-center">
        <Image
          src={'/404_page_not_found.svg'}
          width={MainPicHeight * MainPicAspectRation}
          height={MainPicHeight}
          alt="page not found"
          priority
        ></Image>
        <h1 className="text-6xl text-center m-12 "> Page not found!</h1>
        <Link
          href={`/tutorial/100`}
          className="btn btn-primary btn-xl w-56 mx-auto"
        >
          Get back on track
        </Link>
      </div>
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Home
