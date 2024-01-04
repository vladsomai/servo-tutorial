import { ReactElement, useEffect, useRef, useState } from "react";
import { MainWindowProps } from "./main-window";
import CommandsProtocol from "./ImplementedCommands/commands-protocol";
import Image from "next/image";
import { useContext } from "react";
import { GlobalContext } from "../pages/_app";
import { animated, useSpring, config } from "@react-spring/web";
import { ResetCmd, DisableCmd, EnableCmd } from "./modalComponents";
import InfoImg from "../public/info-circle-fill.svg";

import {
    InputOutputObjects,
    NonCommands,
} from "../servo-engine/motor-commands";
import Code from "./CodeHighlight";
import Tutorial, { TutorialProps } from "./ImplementedCommands/tutorial";
import FeedbackButton from "./feedbackButton";

export interface CommandWindowProps extends MainWindowProps {
    sendDataToSerialPort: (
        dataToSend: string | Uint8Array,
        enableSentLogging?: boolean,
        enableTimoutLogging?: boolean
    ) => void;
    connectToSerialPort: Function;
    disconnectFromSerialPort: Function;
    children: ReactElement;
    isConnected: boolean;
    axisSelectionValue: string;
}

const Command = (props: TutorialProps, children: ReactElement) => {
    const commandsWithShortcuts = [0, 1, 27];
    const globalContext = useContext(GlobalContext);
    const iconSize = 25;
    const commandWindowDiv = useRef<HTMLDivElement | null>(null);
    const [scrollPosition, setScrollPosition] = useState(new Map());

    useEffect(() => {
        if (!commandWindowDiv || !commandWindowDiv.current) return () => {};

        commandWindowDiv.current.onscroll = () => {
            //copy the existing map
            const currentPositionMapping = new Map(scrollPosition);

            //upload the new value
            currentPositionMapping.set(
                props.currentCommandDictionary.CommandEnum,
                commandWindowDiv.current?.scrollTop
            );

            setScrollPosition(currentPositionMapping);
        };

        const copyReactNode = commandWindowDiv.current;
        return () => {
            copyReactNode.onscroll = null;
        };
    }, [props.currentCommandDictionary.CommandEnum]);

    useEffect(() => {
        let scrollPositionForCurrentChapter = scrollPosition.get(
            props.currentCommandDictionary.CommandEnum
        );

        if (scrollPositionForCurrentChapter == undefined) {
            scrollPositionForCurrentChapter = 0;
        }

        commandWindowDiv.current?.scrollTo({
            top: scrollPositionForCurrentChapter,
            left: 0,
            behavior: "smooth",
        });

    }, [props.currentCommandDictionary.CommandEnum]);

    const shortcuts = (currentCommand: number) => {
        let title = "This command supports shortcuts";
        let descriptionObj = <></>;

        switch (currentCommand) {
            case 27:
                descriptionObj = ResetCmd;
                break;
            case 0:
                descriptionObj = DisableCmd;
                break;
            case 1:
                descriptionObj = EnableCmd;
                break;
            default:
                title =
                    "You should not see this text, please contact your administrator.";
                break;
        }
        globalContext.modal.setTitle(title);
        globalContext.modal.setDescription(descriptionObj);
    };

    const [styleSpring, api] = useSpring(
        () => ({
            from: { opacity: 0 },
            to: { opacity: 1 },
            config: { duration: 1000 },
        }),
        [props.currentCommandDictionary.CommandEnum]
    );

    useEffect(() => {
        api.start({
            from: { opacity: 0 },
            to: { opacity: 1 },
            config: { ...config.gentle, duration: 1000 },
        });
        return () => {
            api.stop();
        };
    }, [props.currentCommandDictionary.CommandEnum, api]);

    if (
        props.currentCommandDictionary.CommandEnum ===
        NonCommands.get("Tutorial")
    )
        return (
            <animated.div
                ref={commandWindowDiv}
                style={styleSpring}
                className={`overflow-auto relative px-5 w-6/12`}
            >
                <FeedbackButton />
                <Tutorial {...props} />
            </animated.div>
        );
    else if (
        props.currentCommandDictionary.CommandEnum ===
        NonCommands.get("Commands protocol")
    )
        return (
            <div className={`overflow-auto relative`} ref={commandWindowDiv}>
                <CommandsProtocol
                    MotorCommands={props.MotorCommands}
                    currentCommandDictionary={props.currentCommandDictionary}
                    currentChapter={props.currentChapter}
                />
            </div>
        );
    else
        return (
            <animated.div
                style={styleSpring}
                ref={commandWindowDiv}
                className={`overflow-auto relative px-5 w-6/12`}
            >
                {commandsWithShortcuts.includes(
                    props.currentCommandDictionary.CommandEnum
                ) ? (
                    <div className="bg-primary rounded-full absolute top-4 left-4 py-2 px-2 m-0">
                        <label
                            title="Info"
                            className="inline link"
                            onClick={() => {
                                shortcuts(
                                    props.currentCommandDictionary.CommandEnum
                                );
                            }}
                            htmlFor="my-modal-4"
                        >
                            <Image
                                src={InfoImg}
                                width={iconSize}
                                height={iconSize}
                                alt="info about command shortcuts"
                                priority
                            ></Image>
                        </label>
                    </div>
                ) : null}
                <FeedbackButton />
                <div>
                    <div className="mb-5 mt-16">
                        <p className="text-center mb-5 text-2xl">
                            <strong>
                                {props.currentCommandDictionary.CommandString}
                            </strong>
                        </p>{" "}
                        <p className="mb-2">
                            <b>Description:&nbsp;</b>{" "}
                            {props.currentCommandDictionary.Description}
                        </p>
                        <article className="prose w-full max-w-full">
                            <h4>Inputs:&nbsp;</h4>
                            <ol className="m-0">
                                {typeof props.currentCommandDictionary.Input ==
                                "string" ? (
                                    <li>
                                        <p>
                                            {
                                                props.currentCommandDictionary
                                                    .Input
                                            }
                                        </p>
                                    </li>
                                ) : (
                                    props.currentCommandDictionary.Input.map(
                                        (item: InputOutputObjects, index) => {
                                            return (
                                                <li key={index}>
                                                    <p>{item.Description}</p>
                                                </li>
                                            );
                                        }
                                    )
                                )}
                            </ol>
                        </article>
                        <article className="prose w-full max-w-full">
                            <h4>Outputs:&nbsp;</h4>
                            <ol className="m-0">
                                {typeof props.currentCommandDictionary.Output ==
                                "string" ? (
                                    <li>
                                        <p>
                                            {
                                                props.currentCommandDictionary
                                                    .Output
                                            }
                                        </p>
                                    </li>
                                ) : (
                                    props.currentCommandDictionary.Output.map(
                                        (item: InputOutputObjects, index) => {
                                            if (
                                                props.currentCommandDictionary
                                                    .CommandEnum === 16
                                            ) {
                                                if (
                                                    item.Description.includes(
                                                        "Bit"
                                                    )
                                                ) {
                                                    return (
                                                        <p
                                                            key={index}
                                                            className="ml-10"
                                                        >
                                                            {item.Description}
                                                        </p>
                                                    );
                                                } else
                                                    return (
                                                        <li key={index}>
                                                            <p>
                                                                {
                                                                    item.Description
                                                                }
                                                            </p>
                                                        </li>
                                                    );
                                            } else
                                                return (
                                                    <li key={index}>
                                                        <p>
                                                            {item.Description}
                                                        </p>
                                                    </li>
                                                );
                                        }
                                    )
                                )}
                            </ol>
                        </article>
                    </div>
                    {props.children}
                </div>
                <Code
                    currentCommand={props.currentCommandDictionary.CommandEnum}
                    currentAxis={props.axisSelectionValue}
                />
            </animated.div>
        );
};
export default Command;
