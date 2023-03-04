import Head from 'next/head'
import Layout from '../../components/layout'
import { ReactElement, useEffect, useRef, useState } from 'react'
import type { NextPageWithLayout } from '../_app'
import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'

class Playground {
  public static CreateScene(
    canvas: HTMLCanvasElement,
  ): { scene: BABYLON.Scene; engine: BABYLON.Engine } {
    const engine = new BABYLON.Engine(canvas, true)

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

    BABYLON.SceneLoader.Append('/', 'motor_with_textures.glb', scene, function (scene) {
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
        <canvas ref={canvasRef} className="w-full h-full focus:outline-none rounded-2xl"></canvas>
      </div>
    </>
  )
}

Motor.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Motor
