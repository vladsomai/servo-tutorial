import { useRef, useContext, useState, useEffect } from "react";
import { GlobalContext } from "../../../pages/_app";
import { ChaptersPropsType } from "../0_1/0_1";
import {
    ErrorTypes,
    Uint8ArrayToString,
    transfNumberToUint8Arr,
} from "../../../servo-engine/utils";
import {
    changeAliasPythonCode,
    changeMotorCurrentPythonCode,
    changeRegenCurrentPythonCode,
} from "../../../servo-engine/code-example-utils/python-code-utils";
import { cCode } from "./code-samples/c-code-sample";
import { pythonCode } from "./code-samples/python-code-sample";
import { webCode } from "./code-samples/web-code-sample";

export const Command28 = (props: ChaptersPropsType) => {
    const globalContext = useContext(GlobalContext);

    function getNewPythonCode(): string {
        let alteredPyCode = changeAliasPythonCode(
            globalContext.currentAxisCode.axisCode,
            pythonCode
        );

        alteredPyCode = changeMotorCurrentPythonCode(maxCurrent, alteredPyCode);

        alteredPyCode = changeRegenCurrentPythonCode(
            regenCurrent,
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
        //on mount, run this effect
        updateCodeExamples();
    }, []);

    useEffect(() => {
        //when user changes the alias, run this effect
        updateCodeExamples();
    }, [globalContext.currentAxisCode.axisCode]);

    const maxCurrentInputBox = useRef<HTMLInputElement | null>(null);
    const regenerationInputBox = useRef<HTMLInputElement | null>(null);

    const [maxCurrent, setMaxCurrent] = useState<number>(150);
    const [regenCurrent, setRegenCurrent] = useState<number>(150);

    const [maxCurrentUint8Arr, setMaxCurrentUint8Arr] = useState<Uint8Array>();
    const [regenCurrentuInt8Arr, setRegenCurrentuInt8Arr] =
        useState<Uint8Array>();

    useEffect(() => {
        //on current change, run this effect
        updateCodeExamples();
    }, [maxCurrent]);

    useEffect(() => {
        //on regen current change, run this effect
        updateCodeExamples();
    }, [regenCurrent]);

    const execute_command = () => {
        const selectedAxis = props.getAxisSelection();
        if (selectedAxis == "") return;

        if (
            maxCurrentInputBox.current?.value == "" ||
            regenerationInputBox.current?.value == ""
        ) {
            props.LogAction(ErrorTypes.NO_ERR, "Please enter both inputs.");
            return;
        }

        let payload: string = Uint8ArrayToString(maxCurrentUint8Arr);
        payload += Uint8ArrayToString(regenCurrentuInt8Arr);

        const rawData = props.constructCommand(payload);
        props.sendDataToSerialPort(rawData);
    };

    const handleCurrent = () => {
        if (maxCurrentInputBox.current == null) return;

        const maxCurrentStr = maxCurrentInputBox.current.value;
        if (maxCurrentStr.trim()[0] == "-") {
            props.LogAction(
                ErrorTypes.ERR1002,
                "You cannot use negative numbers."
            );
            maxCurrentInputBox.current.value = "";
            return;
        }

        const maxCurrentNum: number = parseInt(maxCurrentStr);

        setMaxCurrent(maxCurrentNum);
        setMaxCurrentUint8Arr(transfNumberToUint8Arr(maxCurrentNum, 2));
    };

    const handleRegen = () => {
        if (regenerationInputBox.current == null) return;

        const regenCurrentStr = regenerationInputBox.current.value;
        if (regenCurrentStr.trim()[0] == "-") {
            props.LogAction(
                ErrorTypes.ERR1002,
                "You cannot use negative numbers."
            );
            regenerationInputBox.current.value = "";
            return;
        }
        const regenCurrentNum: number = parseInt(regenCurrentStr);

        setRegenCurrent(regenCurrentNum);
        setRegenCurrentuInt8Arr(transfNumberToUint8Arr(regenCurrentNum, 2));
    };

    return (
        <>
            <div className="w-full text-center mb-5">
                <div className="flex flex-col xl:flex-row justify-center items-center">
                    <div className="m-2">{props.children}</div>
                    <input
                        ref={maxCurrentInputBox}
                        onChange={handleCurrent}
                        type="text"
                        placeholder="Motor current"
                        defaultValue={150}
                        className="input input-bordered  max-w-xs input-sm m-2"
                    />{" "}
                    <input
                        ref={regenerationInputBox}
                        onChange={handleRegen}
                        type="text"
                        placeholder="Regeneration current"
                        defaultValue={150}
                        className="input input-bordered max-w-xs input-sm m-2"
                    />
                </div>
                <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={execute_command}
                >
                    Execute
                </button>
            </div>
        </>
    );
};
