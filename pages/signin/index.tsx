import Layout from '../../components/layout'
import { ReactElement } from 'react'
import { NextPageWithLayout } from '../_app'

const Signin: NextPageWithLayout = () => {
  return <></>
}

Signin.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Signin
