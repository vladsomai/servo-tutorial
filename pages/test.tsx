import Layout from '../components/layout'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import type { NextPageWithLayout } from './_app'
import { useSpring, animated, config, useTransition } from 'react-spring'

interface lines {
  index: number
  isVisible: boolean
}
const Test: NextPageWithLayout = () => {
  const [arr, setArr] = useState<lines[]>([])

  useEffect(() => {
    let arr1 = []
    for (let i = 0; i < 10; i++) arr1.push({ index: i, isVisible: true })

    setArr(arr1)
  }, [])

  const transition = useTransition(arr, {
    keys: item=>item.index,
    from: { x: -100, y: 100, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
    leave: { x: 100, y: -100, opacity: 0 },
  })

  return (
    <>
      <div className="flex justify-center items-center flex-col h-[84vh] w-100">
        <button className="btn btn-lg w-32 mb-3">Toggle</button>

        <>
          {transition(
            (style, item) =>
             (
                <animated.div
                  style={style}
                  key={item.index}
                  className="flex justify-around w-36 items-end mb-3"
                >
                  {item.index}
                  <button
                    className="btn btn-error"
                    onClick={() => {
                        console.log(`Clicked on ${item.index}`)
                        let arr1 = arr.slice(0, arr.indexOf(item))
                        let arr2 = arr.slice(arr.indexOf(item) + 1, arr.length)
                        setArr([...arr1, ...arr2])
                    }}
                  >
                    Delete
                  </button>
                </animated.div>
              ),
          )}
        </>
      </div>
    </>
  )
}

Test.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Test
