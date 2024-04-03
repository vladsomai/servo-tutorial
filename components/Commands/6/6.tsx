import { ChaptersPropsType } from "../0_1/0_1";
import { GlobalContext } from "../../../pages/_app";
import { useCallback, useContext, useEffect, useRef } from "react";
import { GenericCodeExample } from "../../../servo-engine/code-example-utils/code-utils";

export const Command6 = (props: ChaptersPropsType) => {
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

    const start_calibration = () => {
        const selectedAxis = props.getAxisSelection();
        if (selectedAxis == "") return;

        const rawData = props.constructCommand("");
        props.sendDataToSerialPort(rawData, true, false);
    };
    return (
        <>
            <div className="w-full text-center mb-5">
                <div className="flex justify-center">
                    <div className="mr-4">{props.children}</div>
                    <button
                        className="btn btn-primary btn-sm "
                        onClick={start_calibration}
                    >
                        execute
                    </button>
                </div>
            </div>
        </>
    );
};
