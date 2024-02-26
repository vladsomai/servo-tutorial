import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../../../pages/_app";
import { ChaptersPropsType } from "../0_1/0_1";
import { ErrorTypes, Uint8ArrayToString } from "../../../servo-engine/utils";
import { cCode } from "./code-samples/c-code-sample";
import { pythonCode } from "./code-samples/python-code-sample";
import { webCode } from "./code-samples/web-code-sample";
import {
    changeAliasPythonCode,
    changeHallSensorDataTypePythonCode,
} from "../../../servo-engine/code-example-utils/python-code-utils";

export type DataToCapture = 0 | 1 | 2 | 3 | 4;

export const Command7 = (props: ChaptersPropsType) => {
    const globalContext = useContext(GlobalContext);

    const selectPayloadInputBox = useRef<HTMLSelectElement | null>(null);
    const availableDataToCapture = useRef<number[]>([0, 1, 2, 3, 4]);
    const [dataToCapture, setDataToCapture] = useState<DataToCapture>(0);

    function getNewPythonCode(): string {
        let alteredPyCode = changeAliasPythonCode(
            globalContext.currentAxisCode.axisCode,
            pythonCode
        );

        alteredPyCode = changeHallSensorDataTypePythonCode(
            dataToCapture,
            alteredPyCode
        );

        return alteredPyCode;
    }

    function updateCodeExamples() {
        globalContext.codeExample.setPythonCode(getNewPythonCode());

        //alter the other languages here
        globalContext.codeExample.setClangCode(cCode);
        globalContext.codeExample.setWebCode(webCode);
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
        //on dataToCapture change, update the code example
        updateCodeExamples();
    }, [dataToCapture]);

    const handleChange = () => {
        if (!selectPayloadInputBox.current) return;

        const inputSelection = parseInt(
            selectPayloadInputBox.current.options[
                selectPayloadInputBox.current.selectedIndex
            ].text
        );

        if (!availableDataToCapture.current.includes(inputSelection)) {
            props.LogAction(
                ErrorTypes.NO_ERR,
                "Please select one of the available data to be captured."
            );
            return;
        }
        setDataToCapture(inputSelection as DataToCapture);
    };

    const capture_hall_sensor = () => {
        if (selectPayloadInputBox && selectPayloadInputBox.current) {
            const selectedAxis = props.getAxisSelection();
            if (selectedAxis == "") return;

            const inputSelection = parseInt(
                selectPayloadInputBox.current.options[
                    selectPayloadInputBox.current.selectedIndex
                ].text
            );

            if (!availableDataToCapture.current.includes(inputSelection)) {
                props.LogAction(
                    ErrorTypes.NO_ERR,
                    "Please select one of the available data to be captured."
                );
                return;
            }

            let rawPayload = new Uint8Array(1);
            rawPayload.set([inputSelection]);
            let textRawPayload = Uint8ArrayToString(rawPayload);

            const rawData = props.constructCommand(
                textRawPayload.toUpperCase()
            );
            props.sendDataToSerialPort(rawData);
        }
    };

    return (
        <>
            <div className="w-full text-center mb-5">
                <div className="flex justify-center">
                    <div className="m-2">{props.children}</div>
                    <select
                        ref={selectPayloadInputBox}
                        className="select select-bordered select-sm max-w-xs m-2"
                        defaultValue="Select data to capture"
                        onChange={handleChange}
                    >
                        <option disabled>Select data to capture</option>
                        {availableDataToCapture.current.map(
                            (option: number) => (
                                <option key={option}>{option}</option>
                            )
                        )}
                    </select>
                </div>
                <button
                    className="btn btn-primary btn-sm mt-4"
                    onClick={capture_hall_sensor}
                >
                    execute
                </button>
            </div>
        </>
    );
};
