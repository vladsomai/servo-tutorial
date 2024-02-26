import { useContext, useEffect } from "react";
import { ChaptersPropsType } from "../0_1/0_1";
import { cCode } from "./code-samples/c-code-sample";
import { pythonCode } from "./code-samples/python-code-sample";
import { webCode } from "./code-samples/web-code-sample";
import { GlobalContext } from "../../../pages/_app";
import { changeAliasPythonCode } from "../../../servo-engine/code-example-utils/python-code-utils";

export interface Command20PropsType extends ChaptersPropsType {
    MountedByQuickStart?: boolean;
}

export const Command20 = (props: Command20PropsType) => {
    const globalContext = useContext(GlobalContext);

    function getNewPythonCode(): string {
        const alteredAliasPythonCode = changeAliasPythonCode(
            globalContext.currentAxisCode.axisCode,
            pythonCode
        );

        return alteredAliasPythonCode;
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

    const execute_command = () => {
        const selectedAxis = props.getAxisSelection();
        if (selectedAxis == "") return;

        let rawData: Uint8Array;
        if (props.MountedByQuickStart) {
            rawData = props.constructCommand("", 20, "255");
        } else {
            rawData = props.constructCommand("", 20);
        }

        props.sendDataToSerialPort(rawData);
    };
    return (
        <>
            <div className="w-full text-center mb-5">
                <div className="flex justify-center">
                    {!props.MountedByQuickStart && (
                        <div className="mr-4">{props.children}</div>
                    )}
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={execute_command}
                    >
                        detect devices
                    </button>
                </div>
            </div>
        </>
    );
};
