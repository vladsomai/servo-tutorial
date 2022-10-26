import Layout from '../components/layout'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import type { NextPageWithLayout } from './_app'
import { useContext } from 'react'
import { GlobalContext } from '../pages/_app'

const Test: NextPageWithLayout = () => {
  const value = useContext(GlobalContext)
  const [val, setVal] = useState(0)

  return (
    <>
      <button
        className="btn btn-error"
        onClick={() => {
          setVal((prev) => (prev += 1))
          value.modal.setTitle(val.toString())
        }}
      >
        SetTitle
      </button>
      {/* The button to open modal */}
      <label htmlFor="my-modal-4" className="btn modal-button">
        open modal
      </label>
    </>
  )
}

Test.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Test
