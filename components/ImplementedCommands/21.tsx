import { useRef, useContext, useState, useEffect } from "react";
import {
    Char,
    ErrorTypes,
    Uint8ArrayToString,
    convertAxisSelectionValue,
    transfNumberToUint8Arr,
} from "../../servo-engine/utils";
import { ChaptersPropsType } from "./0_1";
import { GlobalContext } from "../../pages/_app";

export const Command21 = (props: ChaptersPropsType) => {
    const value = useContext(GlobalContext);

    useEffect(
        (setBytes = value.codeExamplePayload.setBytes) => {
            return () => setBytes("");
        },
        [value.codeExamplePayload.setBytes]
    );

    const [uniqueId, setUniqueId] = useState("0000000000000000");
    const [hexAlias, setHexAlias] = useState("00");

    const uniqueIdInputBox = useRef<HTMLInputElement | null>(null);
    const aliasInputBox = useRef<HTMLInputElement | null>(null);
    const AllowedChars = "0123456789ABCDEF";
    const handleUniqueID = () => {
        if (!uniqueIdInputBox.current) return;

        const currentVal = uniqueIdInputBox.current.value;
        const lastChar = currentVal[currentVal.length - 1];

        if (currentVal == "") return;

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

        if (currentVal.length % 2 != 0) return;
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
        let completedVal = currentVal;
        while (completedVal.length < 16) {
            completedVal += "0";
        }
        setUniqueId(completedVal);
        value.codeExamplePayload.setBytes(completedVal + hexAlias);
    };

    const handleAlias = () => {
        if (!aliasInputBox.current) return;

        if (aliasInputBox.current.value == "") {
            aliasInputBox.current.value = "";
            return;
        }

        const newAlias = convertAxisSelectionValue(aliasInputBox.current.value);

        if (isNaN(newAlias)) {
            aliasInputBox.current.value = "0";
            props.LogAction(
                ErrorTypes.ERR1001,
                "Alias must either be a valid ASCII character or a number ranging from 0 to 253!"
            );
            return;
        }

        if (newAlias === 254) {
            aliasInputBox.current.value = "0";
            props.LogAction(
                ErrorTypes.ERR1001,
                "Alias 254 is reserved for response messages!"
            );
            return;
        }

        if (newAlias < 0) {
            aliasInputBox.current.value = "0";
            props.LogAction(
                ErrorTypes.ERR1001,
                "Supported axes range from 0 to 253!"
            );
        } else if (newAlias > 253) {
            aliasInputBox.current.value = "253";

            props.LogAction(
                ErrorTypes.ERR1001,
                "Supported axes range from 0 to 253!"
            );
        }

        const tempHexaAlias = Uint8ArrayToString(
            transfNumberToUint8Arr(newAlias, 1)
        );

        setHexAlias(tempHexaAlias);
        value.codeExamplePayload.setBytes(uniqueId + tempHexaAlias);
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
            if (
                aliasInputBox.current.value == "255" ||
                aliasInputBox.current.value == "254"
            ) {
                props.LogAction(
                    ErrorTypes.ERR1001,
                    `You cannot set the alias to ${aliasInputBox.current.value} because it is reserved.`
                );
                return;
            }

            if (uniqueIdInputBox.current.value.length != 16) {
                props.LogAction(
                    ErrorTypes.NO_ERR,
                    "The unique id must be exactly 8 bytes! e.g. '7C661210B2026558'"
                );
                return;
            }

            const rawData = props.constructCommand(
                selectedAxis,
                uniqueIdInputBox.current.value + hexAlias,
                21
            );

            props.sendDataToSerialPort(rawData, true, false);
        }
    };

    return (
        <>
            <div className="w-full text-center mb-5">
                <div className="flex flex-col xl:flex-row justify-center items-center">
                    <div className="m-2">{props.children}</div>

                    <input
                        ref={uniqueIdInputBox}
                        type="text"
                        placeholder="Unique ID in hexadecimal"
                        className="input input-bordered w-full max-w-[50%] 2xl:max-w-[30%] input-sm m-2"
                        onChange={handleUniqueID}
                    />
                    <input
                        ref={aliasInputBox}
                        type="text"
                        placeholder="New alias"
                        className="input input-bordered w-[25%] 2xl:max-w-[17%] input-sm m-2"
                        onChange={handleAlias}
                    />
                </div>
                <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={execute_command}
                >
                    execute
                </button>
            </div>
        </>
    );
};
