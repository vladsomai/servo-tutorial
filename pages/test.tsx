import Layout from '../components/layout'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import type { NextPageWithLayout } from './_app'
import { useContext } from 'react'
import { GlobalContext } from '../pages/_app'
import {Tooltip, Button} from 'flowbite-react'

const Test: NextPageWithLayout = () => {
  return (
    <>
      <Tooltip content="Tooltip content">
        <Button>Default tooltip</Button>
      </Tooltip>
    </>
  )
}

Test.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Test
