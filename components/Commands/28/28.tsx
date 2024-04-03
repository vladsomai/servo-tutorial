import { useRef, useContext, useState, useEffect, useCallback } from "react";
import { GlobalContext } from "../../../pages/_app";
import { ChaptersPropsType } from "../0_1/0_1";
import {
    ErrorTypes,
    Uint8ArrayToString,
    transfNumberToUint8Arr,
} from "../../../servo-engine/utils";
import { Command28CodeExample } from "./code-samples/code-sample";

export const Command28 = (props: ChaptersPropsType) => {
    const globalContext = useContext(GlobalContext);
    const command28CodeExample = useRef(new Command28CodeExample());

    const updateCodeExamples = useCallback(
        (
            axisCode: number,
            commandNo: number,
            max_current: number,
            regen_current: number
        ) => {
            globalContext.codeExample.setPythonCode(
                command28CodeExample.current.getNewCommand28PythonCode(
                    axisCode,
                    commandNo,
                    max_current,
                    regen_current
                )
            );

            globalContext.codeExample.setWebCode(
                command28CodeExample.current.getNewCommand28WebCode(
                    axisCode,
                    commandNo,
                    max_current,
                    regen_current
                )
            );

            globalContext.codeExample.setClangCode(
                command28CodeExample.current.getNewCommand28CCode(
                    axisCode,
                    commandNo,
                    max_current,
                    regen_current
                )
            );
        },
        [globalContext.codeExample]
    );

    const maxCurrentInputBox = useRef<HTMLInputElement | null>(null);
    const regenerationInputBox = useRef<HTMLInputElement | null>(null);

    const defaultCurrent = 200;

    const [maxCurrent, setMaxCurrent] = useState<number>(defaultCurrent);
    const [regenCurrent, setRegenCurrent] = useState<number>(defaultCurrent);

    const [maxCurrentUint8Arr, setMaxCurrentUint8Arr] = useState<Uint8Array>();
    const [regenCurrentuInt8Arr, setRegenCurrentuInt8Arr] =
        useState<Uint8Array>();

    useEffect(() => {
        updateCodeExamples(
            globalContext.currentAxisCode.axisCode,
            props.currentCommandDictionary.CommandEnum,
            maxCurrent,
            regenCurrent
        );
    }, [
        globalContext.currentAxisCode.axisCode,
        props.currentCommandDictionary.CommandEnum,
        updateCodeExamples,
        maxCurrent,
        regenCurrent,
    ]);

    useEffect(() => {
        setMaxCurrentUint8Arr(transfNumberToUint8Arr(defaultCurrent, 2));
        setRegenCurrentuInt8Arr(transfNumberToUint8Arr(defaultCurrent, 2));
    }, []);

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
        console.log(rawData);
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
                        defaultValue={defaultCurrent}
                        className="input input-bordered  max-w-xs input-sm m-2"
                    />{" "}
                    <input
                        ref={regenerationInputBox}
                        onChange={handleRegen}
                        type="text"
                        placeholder="Regeneration current"
                        defaultValue={defaultCurrent}
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
