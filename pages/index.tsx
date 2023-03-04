import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/layout'
import { ReactElement, useEffect, useRef, useState } from 'react'
import type { NextPageWithLayout } from './_app'
import Link from 'next/link'

import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'
import { animated, useSpring } from 'react-spring'
import Navbar from '../components/navbar'
import IndexTutorialLayout from '../components/index-tutorial-layout'

interface ILoadingScreen {
  //What happens when loading starts
  displayLoadingUI: () => void
  //What happens when loading stops
  hideLoadingUI: () => void
  //default loader support. Optional!
  loadingUIBackgroundColor: string
  loadingUIText: string
}

class CustomLoadingScreen implements ILoadingScreen {
  //optional, but needed due to interface definitions
  public loadingUIBackgroundColor: string = '#FFF'
  public loadingUIText: string = ''
  private static loadingDiv: HTMLDivElement | null = null

  public displayLoadingUI() {}

  public hideLoadingUI() {
    CustomLoadingScreen.loadingDiv?.classList.add('hidden')
  }

  public static setLoadingDiv: Function = function (
    input: HTMLDivElement | null,
  ): void {
    CustomLoadingScreen.loadingDiv = input
  }
}

class Playground {
  public static CreateScene(
    canvas: HTMLCanvasElement,
  ): { scene: BABYLON.Scene; engine: BABYLON.Engine } {
    const engine = new BABYLON.Engine(canvas, true)
    engine.loadingScreen = new CustomLoadingScreen()

    const scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)

    const camera = new BABYLON.UniversalCamera(
      'camera1',
      new BABYLON.Vector3(0, 0, 0),
      scene,
    )
    camera.attachControl(canvas, true)

    let light2 = new BABYLON.PointLight(
      'light1',
      new BABYLON.Vector3(100, -100, 100),
      scene,
    )
    light2.intensity = 0.1

    let light = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(1, 1, 1),
      scene,
    )
    light.intensity = 4

    BABYLON.SceneLoader.Append('/', 'motor_with_textures.glb', scene, function (
      scene,
    ) {
      // // Create a default arc rotate camera and light.
      scene.createDefaultCameraOrLight(true, true, true)
      //@ts-ignore
      scene.activeCamera!.alpha += -Math.PI / 3

      //@ts-ignore
      scene.activeCamera!.radius += -7
    })

    engine.runRenderLoop(function () {
      scene?.render()
    })

    return { scene: scene, engine: engine }
  }
}

const Home: NextPageWithLayout = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const loadingDiv = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    CustomLoadingScreen.setLoadingDiv(loadingDiv.current)
    const { scene, engine } = Playground.CreateScene(
      canvasRef.current as HTMLCanvasElement,
    )
    function handleResize() {
      engine.resize()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const [styleSpring] = useSpring(
    () => ({
      from: { opacity: 0 },
      to: { opacity: 1 },
    //   config: { duration: 500 },
    }),
    [],
  )

  return (
    <>
      <Head>
        <title>Home | Robots Mobots</title>
      </Head>
      <animated.div className="" style={styleSpring}>
        <div className="flex justify-center items-center w-full">
          <div className="flex flex-col items-center">
            <div className="text-3xl xl:text-6xl mb-10 w-full">
              <p className="feedbackTextColor mb-5">Welcome,</p>
              <p className="text-lg xl:text-xl  text-justify">
                We are a start-up, provider of high-quality servo motors for a
                variety of applications. Our servo motors are designed to meet
                the needs of today&apos;s advanced robotics, 3D printing, and
                CNC machines. With our advanced technology and commitment to
                excellence, we strive to provide our customers with the best
                possible solution for their unique requirements.
              </p>
            </div>

            <div className="relative w-full h-full flex justify-center text-center items-center mb-[15vh] 2xl:mb-0 ">
              <div
                ref={loadingDiv}
                className="absolute w-full h-full flex flex-col justify-center items-center bg-base-100"
              >
                <progress className="progress progress-primary w-56"></progress>
                <h1 className="text-3xl mt-5">Loading 3D asset...</h1>
              </div>
              <canvas
                ref={canvasRef}
                className={`focus:outline-none rounded-2xl bg-slate-800 w-full h-full`}
              ></canvas>
            </div>
          </div>
        </div>
      </animated.div>
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <IndexTutorialLayout>{page}</IndexTutorialLayout>
    </Layout>
  )
}

export default Home
