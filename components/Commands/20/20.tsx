import { useCallback, useContext, useEffect, useRef } from "react";
import { ChaptersPropsType } from "../0_1/0_1";
import { GlobalContext } from "../../../pages/_app";
import { GenericCodeExample } from "../../../servo-engine/code-example-utils/code-utils";

export interface Command20PropsType extends ChaptersPropsType {
    MountedByQuickStart?: boolean;
}

export const Command20 = (props: Command20PropsType) => {
    const globalContext = useContext(GlobalContext);
    const genericCodeExample = useRef(new GenericCodeExample());

    const updateCodeExamples = useCallback(
        (axisCode: number, commandNo: number) => {
            globalContext.codeExample.setPythonCode(
                genericCodeExample.current.getGenericPythonCode(
                    axisCode,
                    commandNo
                )
            );

            globalContext.codeExample.setWebCode(
                genericCodeExample.current.getGenericWebCode(
                    axisCode,
                    commandNo
                )
            );

            globalContext.codeExample.setClangCode(
                genericCodeExample.current.getGenericCCode(axisCode, commandNo)
            );
        },
        [globalContext.codeExample]
    );

    useEffect(() => {
        updateCodeExamples(
            globalContext.currentAxisCode.axisCode,
            props.currentCommandDictionary.CommandEnum
        );
    }, [
        globalContext.currentAxisCode.axisCode,
        props.currentCommandDictionary.CommandEnum,
        updateCodeExamples,
    ]);

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
