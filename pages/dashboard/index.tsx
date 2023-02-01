import Layout from '../../components/layout'
import { ReactElement } from 'react'
import { NextPageWithLayout } from '../_app'

const Dashboard: NextPageWithLayout = () => {
  return <></>
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Dashboard
