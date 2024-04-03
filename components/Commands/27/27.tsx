import { useContext, useEffect, useRef } from "react";
import { ChaptersPropsType } from "../0_1/0_1";
import { GlobalContext } from "../../../pages/_app";
import { GenericCodeExample } from "../../../servo-engine/code-example-utils/code-utils";

export const Command27 = (props: ChaptersPropsType) => {
    const globalContext = useContext(GlobalContext);
    const genericCodeExample = useRef(new GenericCodeExample());

    function updateCodeExamples() {
        globalContext.codeExample.setPythonCode(
            genericCodeExample.current.getGenericPythonCode(
                globalContext.currentAxisCode.axisCode,
                props.currentCommandDictionary.CommandEnum
            )
        );

        globalContext.codeExample.setWebCode(
            genericCodeExample.current.getGenericWebCode(
                globalContext.currentAxisCode.axisCode,
                props.currentCommandDictionary.CommandEnum
            )
        );

        globalContext.codeExample.setClangCode(
            genericCodeExample.current.getGenericCCode(
                globalContext.currentAxisCode.axisCode,
                props.currentCommandDictionary.CommandEnum
            )
        );
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

        const rawData = props.constructCommand("");
        props.sendDataToSerialPort(rawData, true, false);
    };

    return (
        <>
            <div className="w-full text-center mb-5">
                <div className="flex justify-center">
                    <div className="mr-4">{props.children}</div>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={execute_command}
                    >
                        execute
                    </button>
                </div>
            </div>
        </>
    );
};
