import Layout from '../components/layout'
import { ReactElement, useEffect, useState } from 'react'
import type { NextPageWithLayout } from './_app'
import { getCurrentBrowser } from '../servo-engine/utils'

const Test: NextPageWithLayout = () => {
  useEffect(() => {
    console.log(getCurrentBrowser())
  }, [])
  return (
    <>
      <div className="flex justify-center items-center h-full"></div>
    </>
  )
}

Test.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Test
