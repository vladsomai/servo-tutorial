import Layout from '../components/layout'
import { ReactElement } from 'react'

export default function Signin() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl mt-10">Dashboard</h1>
      </div>
    </>
  )
}

Signin.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
