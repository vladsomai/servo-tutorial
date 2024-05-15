import { useRef, useContext, useState, useEffect, useCallback } from "react";
import {
    ErrorTypes,
    Uint8ArrayToString,
    convertAxisSelectionValue,
    hexStringToASCII,
    hexStringToInt32,
    transfNumberToUint8Arr,
} from "../../../servo-engine/utils";
import { ChaptersPropsType } from "../0_1/0_1";
import { GlobalContext } from "../../../pages/_app";
import { Command21CodeExample } from "./code-samples/code-sample";

export interface Command21PropsType extends ChaptersPropsType {
    UniqueID?: string;
    Alias?: string;
    MountedByQuickStart?: boolean;
    setAxisSelectionValue: Function;
}

export const Command21 = (props: Command21PropsType) => {
    const globalContext = useContext(GlobalContext);
    const command21CodeExample = useRef(new Command21CodeExample());

    const [uniqueId, setUniqueId] = useState("0000000000000000");
    const [aliasCode, setAliasCode] = useState<number>(0);

    const uniqueIdInputBox = useRef<HTMLInputElement | null>(null);
    const aliasInputBox = useRef<HTMLInputElement | null>(null);
    const AllowedChars = "0123456789ABCDEF";

    const updateCodeExamples = useCallback(
        (
            axisCode: number,
            commandNo: number,
            unique_id: string,
            alias_code: number
        ) => {
            globalContext.codeExample.setPythonCode(
                command21CodeExample.current.getNewCommand21PythonCode(
                    axisCode,
                    commandNo,
                    unique_id,
                    alias_code
                )
            );

            globalContext.codeExample.setWebCode(
                command21CodeExample.current.getNewCommand21WebCode(
                    axisCode,
                    commandNo,
                    unique_id,
                    alias_code
                )
            );

            globalContext.codeExample.setClangCode(
                command21CodeExample.current.getNewCommand21CCode(
                    axisCode,
                    commandNo,
                    unique_id,
                    alias_code
                )
            );
        },
        [globalContext.codeExample]
    );

    useEffect(() => {
        updateCodeExamples(
            globalContext.currentAxisCode.axisCode,
            props.currentCommandDictionary.CommandEnum,
            uniqueId,
            aliasCode
        );
    }, [
        globalContext.currentAxisCode.axisCode,
        props.currentCommandDictionary.CommandEnum,
        updateCodeExamples,
        uniqueId,
        aliasCode,
    ]);

    useEffect(() => {
        if (uniqueIdInputBox.current && props.UniqueID) {
            uniqueIdInputBox.current.value = props.UniqueID;
        }

        if (aliasInputBox.current && props.Alias != null) {
            let aliasStr = props.Alias;

            const aliasNumber = hexStringToInt32(aliasStr, true);

            if (aliasNumber < 10) {
                //decimal value of alias raning 0 to 9
                aliasStr = "0" + aliasNumber.toString();
            } else if (
                (aliasNumber >= 48 && aliasNumber <= 57) ||
                (aliasNumber >= 65 && aliasNumber <= 90) ||
                (aliasNumber >= 97 && aliasNumber <= 122)
            ) {
                //ascii characters starting from 48 to 57 are ascii numbers
                //65 to 90 capital letters
                //97 to 122 small letters

                //print them as ascii
                aliasStr = hexStringToASCII(aliasStr);
            } else {
                //when thats not the case, show the decimal value of that char
                //this should cover all non-printable ascii chars
                aliasStr = aliasNumber.toString();
            }
            aliasInputBox.current.value = aliasStr;
        }
    }, [props.Alias, props.UniqueID]);

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
        }

        if (currentVal.length % 2 != 0) return;

        let completedVal = currentVal;
        while (completedVal.length < 16) {
            completedVal += "0";
        }
        setUniqueId(completedVal);
    };

    function isAliasValid(newAlias: number): boolean {
        if (!aliasInputBox.current) return false;

        if (aliasInputBox.current.value == "") {
            aliasInputBox.current.value = "";
            return false;
        }

        if (isNaN(newAlias)) {
            aliasInputBox.current.value = "0";
            props.LogAction(
                ErrorTypes.ERR1001,
                "Alias must either be a valid ASCII character or a number ranging from 0 to 253!"
            );
            return false;
        }

        if (newAlias < 0) {
            //do not allow negative numbers
            props.LogAction(
                ErrorTypes.ERR1001,
                "Supported aliases range from 0 to 253!"
            );
            return false;
        }

        if (
            aliasInputBox.current.value == "255" ||
            aliasInputBox.current.value == "254" ||
            aliasInputBox.current.value == "82" ||
            aliasInputBox.current.value == "R"
        ) {
            props.LogAction(
                ErrorTypes.ERR1001,
                `You cannot set the alias to ${aliasInputBox.current.value} because it is reserved.`
            );
            return false;
        }

        return true;
    }

    const handleAlias = () => {
        if (!aliasInputBox.current) return false;

        const newAlias = convertAxisSelectionValue(aliasInputBox.current.value);

        if (!isAliasValid(newAlias)) {
            return;
        }

        setAliasCode(newAlias);
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

        if (
            aliasInputBox.current &&
            aliasInputBox &&
            uniqueIdInputBox.current &&
            uniqueIdInputBox
        ) {
            const newAlias = convertAxisSelectionValue(
                aliasInputBox.current.value
            );

            if (!isAliasValid(newAlias)) {
                return;
            }

            if (uniqueIdInputBox.current.value.length != 16) {
                props.LogAction(
                    ErrorTypes.NO_ERR,
                    "The unique id must be exactly 8 bytes! e.g. '7C661210B2026558'"
                );
                return;
            }

            let rawData: Uint8Array;

            const tempHexaAlias = Uint8ArrayToString(
                transfNumberToUint8Arr(newAlias, 1)
            );

            if (props.MountedByQuickStart) {
                rawData = props.constructCommand(
                    uniqueIdInputBox.current.value + tempHexaAlias,
                    21,
                    "255"
                );
            } else {
                rawData = props.constructCommand(
                    uniqueIdInputBox.current.value + tempHexaAlias,
                    21
                );
            }

            props.sendDataToSerialPort(rawData, true, false);
            props.setAxisSelectionValue(aliasInputBox.current.value);
        }
    };

    return (
        <>
            <div
                className={`w-full text-center mb-5 items-center ${
                    !props.MountedByQuickStart ? "flex flex-col " : "flex"
                }`}
            >
                <div
                    className={`flex flex-col xl:flex-row ${
                        props.MountedByQuickStart
                            ? "justify-end"
                            : "justify-center mb-2"
                    } items-center w-[80%]`}
                >
                    <div
                        className={`m-2 ${
                            props.MountedByQuickStart ? "hidden" : ""
                        }`}
                    >
                        {props.children}
                    </div>

                    <input
                        ref={uniqueIdInputBox}
                        type="text"
                        placeholder="Unique ID in hexadecimal"
                        className="input input-bordered w-full max-w-[50%] 2xl:max-w-[35%] input-sm m-2 grow"
                        onChange={handleUniqueID}
                    />
                    <input
                        ref={aliasInputBox}
                        type="text"
                        placeholder="New alias"
                        className="input input-bordered w-[25%] 2xl:max-w-[17%] input-sm m-2 grow-0"
                        onChange={handleAlias}
                    />
                </div>
                <button
                    className="btn btn-primary btn-sm max-w-[6rem] mx-2"
                    onClick={execute_command}
                >
                    set alias
                </button>
            </div>
        </>
    );
};
