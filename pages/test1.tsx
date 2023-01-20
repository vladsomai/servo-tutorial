import Layout from '../components/layout'
import { ReactElement, useEffect, useState } from 'react'
import type { NextPageWithLayout } from './_app'
import { useTransition, animated } from '@react-spring/web'

const Test: NextPageWithLayout = () => {
  const [data, setData] = useState<number[]>([])

  const transitions = useTransition(data, {
    from: { y: -100, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: 100, opacity: 0 },
  })

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <>
      <button
        className="btn btn-success"
        onClick={() => {
          setData((prev) => [
            ...prev,
            prev.length == 0 ? 0 : prev[prev.length - 1] + 1,
          ])
        }}
      >
        Add
      </button>
      <button className="btn btn-error" onClick={()=>setData([])}>Remove</button>
      <div className="flex justify-center text-lime-50">
        {transitions((style, data) => (
          <animated.div style={style}>
            <p className="flex justify-center text-2xl text-blue-100">{data}</p>
          </animated.div>
        ))}
      </div>
    </>
  )
}

Test.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Test
