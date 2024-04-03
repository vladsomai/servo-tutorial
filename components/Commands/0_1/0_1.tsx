import { ErrorTypes } from "../../../servo-engine/utils";
import { MainWindowProps } from "../../main-window";
import {
    ReactElement,
    useCallback,
    useContext,
    useEffect,
    useRef,
} from "react";
import { GlobalContext } from "../../../pages/_app";
import { GenericCodeExample } from "../../../servo-engine/code-example-utils/code-utils";

export interface ChaptersPropsType extends MainWindowProps {
    sendDataToSerialPort: (
        dataToSend: string | Uint8Array,
        enableSentLogging?: boolean,
        enableTimoutLogging?: boolean,
        isFirwareShot?: boolean
    ) => void;
    LogAction: (errorType: string, log: string) => void;
    constructCommand: (
        _payload: string,
        _currentCommand?: number,
        _axis?: string
    ) => Uint8Array;
    getAxisSelection: () => string;
    children: ReactElement;
}

export const Command1 = (props: ChaptersPropsType) => {
    const globalContext = useContext(GlobalContext);
    const genericCodeExample = useRef(new GenericCodeExample());

    useEffect(() => {
        function updateCodeExamples(axisCode: number, commandNo: number) {
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
        }

        //when user changes between command 0 and 1, run this effect
        //when user changes the alias, run this effect
        updateCodeExamples(
            globalContext.currentAxisCode.axisCode,
            props.currentCommandDictionary.CommandEnum
        );
    }, [
        props.currentCommandDictionary.CommandEnum,
        globalContext.currentAxisCode.axisCode,
        globalContext.codeExample
    ]);

    const disable_enable_MOSFETS = () => {
        const selectedAxis = props.getAxisSelection();
        if (selectedAxis == "") {
            props.LogAction(ErrorTypes.NO_ERR, "You must set a valid alias.");
            return;
        }

        const rawData = props.constructCommand("");

        props.sendDataToSerialPort(rawData);
    };

    return (
        <>
            <div className="w-full mb-5">
                <div className="flex justify-center">
                    <div className="mr-4">{props.children}</div>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={disable_enable_MOSFETS}
                    >
                        {props.currentCommandDictionary.CommandEnum == 0
                            ? "DISABLE MOSFETS"
                            : "ENABLE MOSFETS"}
                    </button>
                </div>
            </div>
        </>
    );
};
