import { useRef, useContext, useState, useEffect } from "react";
import { ErrorTypes } from "../../../servo-engine/utils";
import { ChaptersPropsType } from "../0_1/0_1";
import { GlobalContext } from "../../../pages/_app";
import { cCode } from "./code-samples/c-code-sample";
import { pythonCode } from "./code-samples/python-code-sample";
import { webCode } from "./code-samples/web-code-sample";
import {
    changeAliasPythonCode,
    changeUniqueIdPythonCode,
} from "../../../servo-engine/code-example-utils/python-code-utils";

export interface Command41PropsType extends ChaptersPropsType {
    UniqueID?: string;
    Alias?: string;
    MountedByQuickStart?: boolean; //quickstart will not show the input boxes for this command
}

export const Command41 = (props: Command41PropsType) => {
    const globalContext = useContext(GlobalContext);

    const [uniqueId, setUniqueId] = useState("");
    const uniqueIdInputBox = useRef<HTMLInputElement | null>(null);
    const AllowedChars = "0123456789ABCDEF";

    function getNewPythonCode(): string {
        let alteredPyCode = changeAliasPythonCode(
            globalContext.currentAxisCode.axisCode,
            pythonCode
        );

        alteredPyCode = changeUniqueIdPythonCode(uniqueId, alteredPyCode);

        return alteredPyCode;
    }

    function updateCodeExamples() {
        globalContext.codeExample.setPythonCode(getNewPythonCode());

        //alter the other languages here
        globalContext.codeExample.setClangCode(cCode);
        globalContext.codeExample.setWebCode(webCode);
    }

    useEffect(() => {
        console.log("mounted with id",props.UniqueID)
        //on mount, run this effect
        updateCodeExamples();
    }, []);

    useEffect(() => {
        //when user changes the alias, run this effect
        updateCodeExamples();
    }, [globalContext.currentAxisCode.axisCode]);

    useEffect(() => {
        //when user changes the unique id, run this effect
        updateCodeExamples();
    }, [uniqueId]);

    const handleUniqueID = () => {
        if (!uniqueIdInputBox.current) return;

        const currentVal = uniqueIdInputBox.current.value;
        const lastChar = currentVal[currentVal.length - 1];

        if (currentVal == "") {
            setUniqueId("");
            return;
        }

        if (!AllowedChars.includes(lastChar?.toUpperCase())) {
            props.LogAction(
                ErrorTypes.ERR1002,
                "You are not allowed to use non-hexadecimal characters!"
            );
            uniqueIdInputBox.current.value = currentVal.slice(
                0,
                currentVal.length - 1
            );
            return;
        }

        if (currentVal.length > 16) {
            props.LogAction(
                ErrorTypes.ERR1002,
                "Length of Unique ID cannot be larger than 8 bytes."
            );

            uniqueIdInputBox.current.value = currentVal.slice(
                0,
                currentVal.length - 1
            );
            return;
        }
        if (currentVal.length % 2 != 0) return;

        let completedVal = currentVal;
        while (completedVal.length < 16) {
            completedVal += "0";
        }
        setUniqueId(completedVal);
    };

    const execute_command = () => {
        const selectedAxis = props.getAxisSelection();

        if (selectedAxis == "") return;

        if (selectedAxis == "254") {
            props.LogAction(
                ErrorTypes.NO_ERR,
                `Cannot use ${selectedAxis} as the target alias!`
            );
            return;
        }

        if (uniqueIdInputBox.current && uniqueIdInputBox) {
            console.log(uniqueIdInputBox.current.value.length);
            if (uniqueIdInputBox.current.value.length != 16) {
                props.LogAction(
                    ErrorTypes.NO_ERR,
                    "The unique id must be exactly 8 bytes! e.g. '7C661210B2026558'"
                );
                return;
            }

            let rawData: Uint8Array;
            if (props.MountedByQuickStart) {
                if (props.UniqueID) {
                    console.log(props.UniqueID)
                    rawData = props.constructCommand(props.UniqueID, 41, "255");
                } else {
                    props.LogAction(
                        ErrorTypes.ERR1001,
                        "Unique ID not provided, please contact us to solve this issue."
                    );
                    return;
                }
            } else {
                rawData = props.constructCommand(
                    uniqueIdInputBox.current.value,
                    41
                );
            }

            props.sendDataToSerialPort(rawData, true, true);
        }
    };

    return (
        <>
            <div className="w-full text-center mb-5">
                <div
                    className={`flex flex-col xl:flex-row justify-center items-center mb-2 ${
                        props.MountedByQuickStart ? "hidden" : ""
                    }`}
                >
                    <div className="m-2">{props.children}</div>

                    <input
                        ref={uniqueIdInputBox}
                        type="text"
                        placeholder="Unique ID in hexadecimal"
                        className="input input-bordered w-full max-w-[50%] 2xl:max-w-[30%] input-sm m-2"
                        onChange={handleUniqueID}
                    />
                </div>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={execute_command}
                >
                    identify
                </button>
            </div>
        </>
    );
};
