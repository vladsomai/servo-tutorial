import { useContext, useRef, useEffect, useState, useCallback } from "react";
import { ChaptersPropsType } from "../0_1/0_1";
import { ErrorTypes } from "../../../servo-engine/utils";
import { GlobalContext } from "../../../pages/_app";
import { Command31CodeExample } from "./code-samples/code-sample";

export const Command31 = (props: ChaptersPropsType) => {
    const initialText = "0123456789";
    const [textPayload, setTextpayload] = useState<string>(initialText);
    const textPayloadInputBox = useRef<HTMLInputElement | null>(null);
    const globalContext = useContext(GlobalContext);
    const command31CodeExample = useRef(new Command31CodeExample());

    function updateCodeExamples() {
        globalContext.codeExample.setPythonCode(
            command31CodeExample.current.getNewCommand31PythonCode(
                globalContext.currentAxisCode.axisCode,
                props.currentCommandDictionary.CommandEnum,
                textPayload,
            )
        );

        globalContext.codeExample.setWebCode(
            command31CodeExample.current.getNewCommand31WebCode(
                globalContext.currentAxisCode.axisCode,
                props.currentCommandDictionary.CommandEnum,
                textPayload
            )
        );

        globalContext.codeExample.setClangCode(
            command31CodeExample.current.getNewCommand31CCode(
                globalContext.currentAxisCode.axisCode,
                props.currentCommandDictionary.CommandEnum,
                textPayload,
            )
        );
    }

    useEffect(() => {
        //on mount, update the code example
        updateCodeExamples();
    }, []);

    useEffect(() => {
        //on axis code change, update the code example
        updateCodeExamples();
    }, [globalContext.currentAxisCode.axisCode]);

    const convertTextToASCII = (textPayload: string) => {
        let payload = "";
        for (let i = 0; i < textPayload.length; i++) {
            payload += textPayload[i].charCodeAt(0).toString(16).toUpperCase();
        }
        return payload;
    };

    useEffect(() => {
        //when the ping input box changes, run this effect
        updateCodeExamples();
    }, [textPayload]);

    const ping_command = () => {
        if (textPayloadInputBox && textPayloadInputBox.current) {
            const selectedAxis = props.getAxisSelection();
            if (selectedAxis == "") return;
            const textPayload = textPayloadInputBox.current.value;
            if (textPayload.length != 10) {
                props.LogAction(
                    ErrorTypes.ERR1001,
                    "You must input exactly 10 characters."
                );
                return;
            }

            const rawData = props.constructCommand(
                convertTextToASCII(textPayload),
                31
            );
            props.sendDataToSerialPort(rawData, true, true);
        }
    };

    return (
        <>
            <div className="w-full text-center mb-5">
                <div className="flex flex-col xl:flex-row justify-center items-center">
                    <div className="m-2">{props.children}</div>
                    <input
                        ref={textPayloadInputBox}
                        type="text"
                        placeholder="Enter text e.g. 0123456789"
                        className="input input-bordered max-w-xs input-sm m-2"
                        defaultValue={initialText}
                        onChange={(e) => {
                            const value = e.target.value;

                            if (value.length > 10) {
                                props.LogAction(
                                    ErrorTypes.ERR1001,
                                    "Cannot send more than 10 characters!"
                                );
                                e.target.value = textPayload;
                                return;
                            }

                            setTextpayload(e.target.value);
                        }}
                    />
                </div>
                <div
                    className="tooltip tooltip-primary"
                    data-tip="Test your connection to the motor using this command."
                >
                    <button
                        className="btn btn-primary btn-sm mt-2"
                        onClick={ping_command}
                    >
                        PING
                    </button>
                </div>
            </div>
        </>
    );
};
