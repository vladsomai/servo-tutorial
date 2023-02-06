import Head from 'next/head'
import Layout from '../../components/layout'
import { ReactElement, useEffect, useRef, useState } from 'react'
import type { NextPageWithLayout } from '../_app'
import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'

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
  public loadingUIBackgroundColor: string = '#0f172a'
  private classListWhenLoadingStarts = 'flex'
  private classListWhenLoadingEnds = 'hidden'
  private loadingDiv = document.getElementById('loading-motor')

  constructor(public loadingUIText: string) {
    loadingUIText = 'Loading assets...'
  }
  public displayLoadingUI() {
    this.loadingDiv?.classList.replace(
      this.classListWhenLoadingEnds,
      this.classListWhenLoadingStarts,
    )
    console.log(this.loadingDiv?.classList.value)
  }

  public hideLoadingUI() {
    this.loadingDiv?.classList.replace(
      this.classListWhenLoadingStarts,
      this.classListWhenLoadingEnds,
    )
  }
}

class Playground {
  public static CreateScene(
    canvas: HTMLCanvasElement,
  ): { scene: BABYLON.Scene; engine: BABYLON.Engine } {
    const engine = new BABYLON.Engine(canvas, true)
    engine.loadingScreen = new CustomLoadingScreen('Loading...')
    engine.displayLoadingUI()

    const scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)

    const camera = new BABYLON.UniversalCamera(
      'camera1',
      new BABYLON.Vector3(0, 5, -10),
      scene,
    )
    camera.attachControl(canvas, true)

    let light = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(1, 1, 1),
      scene,
    )
    light.intensity = 0.7

    BABYLON.SceneLoader.Append('/', 'servomotor.glb', scene, function (scene) {
      // // Create a default arc rotate camera and light.
      scene.createDefaultCameraOrLight(true, true, true)
      //@ts-ignore
      scene.activeCamera!.alpha += -Math.PI / 1.2

      //@ts-ignore
      scene.activeCamera!.radius += -0.8
    })

    engine.hideLoadingUI()
    engine.runRenderLoop(function () {
      scene?.render()
    })

    return { scene: scene, engine: engine }
  }
}

const Motor: NextPageWithLayout = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
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

  return (
    <>
      <Head>
        <title>3D Servo motor</title>
      </Head>
      <div className="text-center w-full h-full">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </div>
    </>
  )
}

Motor.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Motor
