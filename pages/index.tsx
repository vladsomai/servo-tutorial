import Head from "next/head";
import Layout from "../components/layout";
import { ReactElement, useEffect, useRef } from "react";
import { NextPageWithLayout } from "./_app";

import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { animated, useSpring } from "react-spring";
import Navbar from "../components/navbar";

interface ILoadingScreen {
    //What happens when loading starts
    displayLoadingUI: () => void;
    //What happens when loading stops
    hideLoadingUI: () => void;
    //default loader support. Optional!
    loadingUIBackgroundColor: string;
    loadingUIText: string;
}

class CustomLoadingScreen implements ILoadingScreen {
    //optional, but needed due to interface definitions
    public loadingUIBackgroundColor: string = "#FFF";
    public loadingUIText: string = "";
    private static loadingDiv: HTMLDivElement | null = null;

    public displayLoadingUI() {}

    public hideLoadingUI() {
        CustomLoadingScreen.loadingDiv?.classList.add("hidden");
    }

    public static setLoadingDiv: Function = function (
        input: HTMLDivElement | null
    ): void {
        CustomLoadingScreen.loadingDiv = input;
    };
}

class Playground {
    public static CreateScene(
        canvas: HTMLCanvasElement,
        sceneFileName: string,
        cameraAlpha: number,
        cameraBeta: number,
        cameraRadius: number
    ): {
        scene: BABYLON.Scene;
        engine: BABYLON.Engine;
    } {
        const engine = new BABYLON.Engine(canvas, true);
        engine.loadingScreen = new CustomLoadingScreen();

        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        const camera = new BABYLON.UniversalCamera(
            "camera1",
            new BABYLON.Vector3(0, 0, 0),
            scene
        );
        camera.attachControl(canvas, true);

        BABYLON.SceneLoader.Append("/", sceneFileName, scene, function (scene) {
            scene.createDefaultCamera(true, true, true);
            let helper = scene.createDefaultEnvironment({
                enableGroundMirror: true,
                groundYBias: 0.01,
            });
            helper?.setMainColor(BABYLON.Color3.FromInts(15, 23, 42));

            //@ts-ignore
            scene.activeCamera!.alpha += cameraAlpha;
            //@ts-ignore
            scene.activeCamera!.beta += cameraBeta;
            //@ts-ignore
            scene.activeCamera!.radius += cameraRadius;
        });

        engine.runRenderLoop(function () {
            scene?.render();
        });

        return { scene: scene, engine: engine };
    }
}

const Home: NextPageWithLayout = () => {
    const canvasMotor1Ref = useRef<HTMLCanvasElement | null>(null);
    const canvasMotor3Ref = useRef<HTMLCanvasElement | null>(null);
    const loadingDiv = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        CustomLoadingScreen.setLoadingDiv(loadingDiv.current);
        const { scene, engine } = Playground.CreateScene(
            canvasMotor1Ref.current as HTMLCanvasElement,
            "motor1.glb",
            -Math.PI / 3,
            -Math.PI / 10,
            -0.25
        );

        function handleResize() {
            engine.resize();
        }

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        CustomLoadingScreen.setLoadingDiv(loadingDiv.current);
        const { scene, engine } = Playground.CreateScene(
            canvasMotor3Ref.current as HTMLCanvasElement,
            "motor3.glb",
            -Math.PI / 0.8,
            -Math.PI / 10,
            -0.1
        );

        function handleResize() {
            engine.resize();
        }

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const [styleSpring] = useSpring(
        () => ({
            from: { opacity: 0 },
            to: { opacity: 1 },
            config: { duration: 1000 },
        }),
        []
    );

    return (
        <>
            <Head>
                <title>Home | Gearotons</title>
            </Head>
            <div className="w-[40vw] m-auto mt-10">
                <Navbar />
                <animated.div className="mt-10" style={styleSpring}>
                    <div className="flex justify-center items-center w-full">
                        <div className="flex flex-col items-center">
                            <div className="text-3xl xl:text-6xl mb-10 w-full">
                                <p className="feedbackTextColor mb-5">
                                    Welcome,
                                </p>
                                <p className="text-lg xl:text-xl  text-justify">
                                    We are a start-up, provider of high-quality
                                    servo motors for a variety of applications.
                                    Our servo motors are designed to meet the
                                    needs of today&apos;s advanced robotics, 3D
                                    printing, and CNC machines. With our
                                    advanced technology and commitment to
                                    excellence, we strive to provide our
                                    customers with the best possible solution
                                    for their unique requirements.
                                </p>
                            </div>
                        </div>
                    </div>
                </animated.div>
            </div>
            <div className="relative h-full flex justify-center text-center items-center w-[80vw] m-auto ">
                <div
                    ref={loadingDiv}
                    className="absolute w-full h-full flex flex-col justify-start items-center bg-base-100"
                >
                    <progress className="progress progress-primary w-56"></progress>
                    <h1 className="text-3xl mt-5">Loading 3D assets...</h1>
                </div>
                <div className="w-[40vw] h-[500px] mr-10 mb-[40vh] md:mb-[25vh]">

                    <article className="prose prose-slate">
                        <h3 className="text-3xl text-left mb-5">
                            High precision motor
                        </h3>
                        <ul className="text-left">
                            <li>
                                <p>High precision</p>
                            </li>
                            <li>
                                <p>Lower cost</p>
                            </li>
                            <li>
                                <p>Robust (stronger body)</p>
                            </li>
                        </ul>
                    </article>
                    <canvas
                        ref={canvasMotor3Ref}
                        className={`focus:outline-none rounded-2xl bg-slate-800 w-full h-full `}
                        ></canvas>
                </div>
                <div className="w-[40vw] h-[500px] mb-[40vh] md:mb-[25vh]">
                    <article className="prose prose-slate">
                        <h3 className="text-3xl text-left mb-5">
                            Educational motor
                        </h3>
                        <ul className="text-left">
                            <li>
                                <p>Higher maximum speed</p>
                            </li>
                            <li>
                                <p>Light weight</p>
                            </li>
                            <li>
                                <p>
                                    Visible electronics(for educational
                                    purposes)
                                </p>
                            </li>
                        </ul>
                    </article>
                    <canvas
                        ref={canvasMotor1Ref}
                        className={`focus:outline-none rounded-2xl bg-slate-800 w-full h-full`}
                    ></canvas>
                </div>
            </div>
        </>
    );
};

Home.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default Home;
