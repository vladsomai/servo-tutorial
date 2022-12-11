import Layout from '../components/layout'
import { ReactElement, useEffect, useState } from 'react'
import type { NextPageWithLayout } from './_app'

const Test: NextPageWithLayout = () => {
  const [popovers, setPopovers] = useState<number[]>([1, 2, 3])

  return (
    <>
      <div className="flex justify-center items-center h-full">

      </div>
    </>
  )
}

Test.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Test
