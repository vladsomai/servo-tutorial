import Head from "next/head";
import { ReactElement, useEffect, useRef, useState } from "react";
import Layout from "../../components/layout";
import Chapters from "../../components/chapter-window";
import Main, { MainWindowProps } from "../../components/main-window";
import Drawer from "../../components/drawer";
import {
    MotorCommandsDictionary,
    CommandsProtocolChapter,
    Tutorial,
    NonCommands,
} from "../../servo-engine/motor-commands";
import RawMotorCommands from "../../public/motor_commands.json" assert { type: "json" };
import { useRouter } from "next/router";
import { useContext } from "react";
import { GlobalContext } from "../_app";
import { animated, useSpring } from "react-spring";

const Docs = () => {
    const router = useRouter();
    const value = useContext(GlobalContext);
    const codeAlertWasShown = useRef(false);
    const alertTimoutHandle = useRef<NodeJS.Timeout>();
    const MotorCommands = useRef<MotorCommandsDictionary[]>([]);
    const [currentCommandDictionary, setCurrentCommandDictionary] =
        useState<MotorCommandsDictionary | null>(null);

    useEffect(() => {
        MotorCommands.current = [
            Tutorial,
            CommandsProtocolChapter,
            ...RawMotorCommands,
        ] as MotorCommandsDictionary[];
    }, []);

    useEffect(() => {
        if (router.isReady) {
            const commandIdStr = router.query.chapterID;

            const CommandID = parseInt(commandIdStr as string);

            let commandFound = false;

            for (const command of MotorCommands.current) {
                if (CommandID == command.CommandEnum) {
                    setCurrentCommandDictionary(command);
                    commandFound = true;
                }
            }

            if (!commandFound) {
                router.push("/404");
            }

            const NonCommandsIDS = [...NonCommands].map(
                ([key, value]) => value
            );

            if (
                !codeAlertWasShown.current &&
                !NonCommandsIDS.includes(CommandID)
            ) {
                codeAlertWasShown.current = true;
                value.alert.setTitle("Check out the 'Code examples' section!");
                value.alert.setDescription(
                    <>
                        <p>
                            The code automatically changes when you select a
                            different axis/alias, change the parameters or
                            navigate through the commands.
                        </p>
                    </>
                );
                alertTimoutHandle.current = setTimeout(() => {
                    value.alert.setShow(true);
                }, 2000);
                setTimeout(() => {
                    value.alert.setShow(false);
                }, 17200);
            }
        }

        return () => {
            clearTimeout(alertTimoutHandle.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    const [styleSpring] = useSpring(
        () => ({
            from: { opacity: 0 },
            to: { opacity: 1 },
            //config: { duration: 1000 },
        }),
        []
    );

    return (
        <>
            <Head>
                <title>
                    {`Command ${currentCommandDictionary?.CommandEnum} | Gearotons`}
                </title>
            </Head>
            {currentCommandDictionary != null ? (
                <>
                    <animated.div
                        className="hidden lg:flex w-full h-full px-3"
                        style={styleSpring}
                    >
                        <Chapters
                            {...{
                                MotorCommands,
                                currentCommandDictionary,
                                setCurrentCommandDictionary,
                            }}
                        />
                        <Main
                            {...({
                                currentCommandDictionary,
                                MotorCommands,
                            } as MainWindowProps)}
                        />
                        {/* <Drawer
                        {...{
                            MotorCommands,
                            currentCommandDictionary,
                            setCurrentCommandDictionary,
                        }}
                    ></Drawer> */}
                    </animated.div>
                    <main className="lg:hidden fixed h-screen w-screen flex justify-center items-center text-center">
                        <h1 className="text-3xl">
                            You cannot view this website on small screens!
                        </h1>
                    </main>
                </>
            ) : null}
        </>
    );
};

Docs.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default Docs;
