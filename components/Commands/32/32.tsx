import { useContext, useEffect, useRef, useState } from "react";
import { ChaptersPropsType } from "../0_1/0_1";
import { ErrorTypes, Uint8ArrayToString } from "../../../servo-engine/utils";
import { GlobalContext } from "../../../pages/_app";
import { Command32CodeExample } from "./code-samples/code-sample";

export const Command32 = (props: ChaptersPropsType) => {
    const globalContext = useContext(GlobalContext);
    const availableDataToCapture = useRef<number[]>([0, 1]);
    const [inputPayload, setInputPayload] = useState<string>("0");
    const command32CodeExample = useRef(new Command32CodeExample());

    function updateCodeExamples() {
        globalContext.codeExample.setPythonCode(
            command32CodeExample.current.getNewCommand32PythonCode(
                globalContext.currentAxisCode.axisCode,
                props.currentCommandDictionary.CommandEnum,
                inputPayload
            )
        );

        globalContext.codeExample.setWebCode(
            command32CodeExample.current.getNewCommand32WebCode(
                globalContext.currentAxisCode.axisCode,
                props.currentCommandDictionary.CommandEnum,
                inputPayload
            )
        );

        globalContext.codeExample.setClangCode(
            command32CodeExample.current.getNewCommand32CCode(
                globalContext.currentAxisCode.axisCode,
                props.currentCommandDictionary.CommandEnum,
                inputPayload,
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

    useEffect(() => {
        //on input change, update the code example
        updateCodeExamples();
    }, [inputPayload]);

    const capture_hall_sensor = () => {
        const inputSelection = parseInt(inputPayload);

        if (!availableDataToCapture.current.includes(inputSelection)) {
            props.LogAction(
                ErrorTypes.NO_ERR,
                "Please select one of the available options."
            );
            return;
        }

        let rawPayload = new Uint8Array(1);
        rawPayload.set([inputSelection]);
        let textRawPayload = Uint8ArrayToString(rawPayload);

        const rawData = props.constructCommand(textRawPayload.toUpperCase());
        props.sendDataToSerialPort(rawData);
    };

    return (
        <>
            <div className="w-full text-center mb-5">
                <div className="flex flex-col xl:flex-row justify-center items-center">
                    <div className="m-2">{props.children}</div>
                    <select
                        className="select select-bordered select-sm max-w-xs m-2"
                        defaultValue="Options"
                        onChange={(e) => {
                            const val = e.target.value;
                            setInputPayload(val);
                        }}
                    >
                        <option disabled>Options</option>
                        {availableDataToCapture.current.map(
                            (option: number) => (
                                <option key={option}>{option}</option>
                            )
                        )}
                    </select>
                </div>

                <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={capture_hall_sensor}
                >
                    execute
                </button>
            </div>
        </>
    );
};
