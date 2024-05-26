import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../pages/_app'
import Image from 'next/image'
import {
  useTransition,
  animated,
  useSpringRef,
  config,
} from '@react-spring/web'
import styled from 'styled-components'

export const Life = styled(animated.div)`
  position: absolute;
  bottom: 0;
  left: 0px;
  width: auto;
  background-image: linear-gradient(130deg, #c3c3c3, #74bF44);
  height: 5px;
`

const Alert = ({}) => {
  const value = useContext(GlobalContext)
  const iconSize = 100

  const [mounted, setMounted] = useState<boolean[]>([])
  useEffect(() => {
    value.alert.Show ? setMounted([true]) : setMounted([])
  }, [value.alert.Show])

  const transition = useTransition(mounted, {
    from: { scale: 0, life: '100%' },
    enter: (item) => async (next, cancel) => {
      cancel
      await next([{ scale: 1 }])
      await next([{ scale: 1, life: '0%' }])
    },
    leave: { scale: 0, opacity: 0.5 },
    config: (item, index, phase) => (key) =>
      phase === 'enter' && key === 'life'
        ? { duration: 15000 }
        : { tension: 125, friction: 20, precision: 0.1 },
  })

  return transition(({ life, ...style }, item) => (
    <animated.div
      style={style}
      className="fixed bottom-[6%] right-[2%] w-auto lg:max-w-[30%] alert shadow-lg z-10"
    >
      <Life style={{ right: life }} />
      <>
        <div className="">
          <span className="bg-primary rounded-full py-2 px-2 mr-3">
            <Image
              className="mask mask-squircle p-0 m-0 rounded-full"
              src={'/info-circle-fill.svg'}
              width={iconSize}
              height={iconSize}
              alt="info about code examples"
              priority
            ></Image>
          </span>
          <div>
            <h3 className="font-bold text-lg">{value.alert.Title}</h3>
            <div className="text-lg">{value.alert.Description}</div>
          </div>
        </div>
        <div className="flex-none">
          <label
            className="btn btn-sm btn-circle"
            onClick={() => {
              value.alert.setShow(false)
            }}
          >
            ✕
          </label>
        </div>
      </>
    </animated.div>
  ))
}
export default Alert
