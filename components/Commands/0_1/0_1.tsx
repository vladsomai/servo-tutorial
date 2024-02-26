import { ErrorTypes } from "../../../servo-engine/utils";
import { MainWindowProps } from "../../main-window";
import { ReactElement, useContext, useEffect } from "react";
import { GlobalContext } from "../../../pages/_app";
import { cCode } from "./code-samples/c-code-sample";
import { pythonCode } from "./code-samples/python-code-sample";
import { webCode } from "./code-samples/web-code-sample";
import {
    changeAliasPythonCode,
    changeCommandPythonCode,
} from "../../../servo-engine/code-example-utils/python-code-utils";

export interface ChaptersPropsType extends MainWindowProps {
    sendDataToSerialPort: (
        dataToSend: string | Uint8Array,
        enableSentLogging?: boolean,
        enableTimoutLogging?: boolean
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

    function getNewPythonCode(): string {
        const alteredAliasPythonCode = changeAliasPythonCode(
            globalContext.currentAxisCode.axisCode,
            pythonCode
        );

        const alteredAliasAndCommandPythonCode = changeCommandPythonCode(
            props.currentCommandDictionary.CommandEnum,
            alteredAliasPythonCode
        );

        return alteredAliasAndCommandPythonCode;
    }

    function updateCodeExamples() {
        globalContext.codeExample.setPythonCode(getNewPythonCode());

        //alter the other languages here
        globalContext.codeExample.setClangCode(cCode);
        globalContext.codeExample.setWebCode(webCode);
    }

    useEffect(() => {
        //when user changes between command 0 and 1, run this effect
        updateCodeExamples();
    }, [props.currentCommandDictionary.CommandEnum]);

    useEffect(() => {
        //when user changes the alias, run this effect
        updateCodeExamples();
    }, [globalContext.currentAxisCode.axisCode]);

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
