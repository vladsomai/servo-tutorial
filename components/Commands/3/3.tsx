import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { GlobalContext } from "../../../pages/_app";

import {
    ErrorTypes,
    InternalVelocityToCommVelocity,
    maximumNegativeVelocity,
    maximumPositiveVelocity,
    minimumNegativeVelocity,
    minimumPositiveVelocity,
    RPM_ToInternalVelocity,
    Uint8ArrayToString,
} from "../../../servo-engine/utils";
import { ChaptersPropsType } from "../0_1/0_1";
import { Command3CodeExample } from "./code-samples/code-sample";
import MotorSelection from "../../motor-selection";

export const Command3 = (props: ChaptersPropsType) => {
    const globalContext = useContext(GlobalContext);
    const command3CodeExample = useRef(new Command3CodeExample());

    const velocityInputBox = useRef<HTMLInputElement | null>(null);

    //#region VELOCITY_CONVERSION
    const [velocityRPM, setVelocityRPM] = useState<number>(0);
    const [internalVelocity, setInternalVelocity] = useState<number>(0);
    const [commVelocity, setCommVelocity] = useState<number>(0);
    const [commVelocityHexa, setCommVelocityHexa] =
        useState<string>("00000000");

    const onVelocityInputBoxChange = () => {
        if (velocityInputBox && velocityInputBox.current) {
            const inputBoxValue = parseFloat(velocityInputBox.current.value);
            if (isNaN(inputBoxValue)) {
                setVelocityRPM(0);
            } else {
                if (inputBoxValue < 0) {
                    //negative Velocity
                    if (inputBoxValue > minimumNegativeVelocity) {
                        setVelocityRPM(inputBoxValue);
                    } else if (inputBoxValue < maximumNegativeVelocity) {
                        //max negative reached
                        props.LogAction(
                            ErrorTypes.ERR1001,
                            `Maximum value for negative velocity is ${maximumNegativeVelocity}, consider using a larger value!`
                        );
                        setVelocityRPM(maximumNegativeVelocity);
                        velocityInputBox.current.value =
                            maximumNegativeVelocity.toString();
                    } else {
                        setVelocityRPM(inputBoxValue);
                    }
                }
                //positive Velocity
                else if (inputBoxValue < minimumPositiveVelocity) {
                    setVelocityRPM(inputBoxValue);
                } else if (inputBoxValue >= maximumPositiveVelocity) {
                    //max positive reached
                    props.LogAction(
                        ErrorTypes.ERR1001,
                        `Maximum value for positive velocity is ${maximumPositiveVelocity}, consider using a smaller value!`
                    );
                    setVelocityRPM(maximumPositiveVelocity);
                    velocityInputBox.current.value =
                        maximumPositiveVelocity.toString();
                } else {
                    setVelocityRPM(inputBoxValue);
                }
            }
        }
    };

    const updateCodeExamples = useCallback(
        (axisCode: number, commandNo: number, velocity: number) => {
            globalContext.codeExample.setPythonCode(
                command3CodeExample.current.getNewCommand3PythonCode(
                    axisCode,
                    commandNo,
                    velocity
                )
            );

            globalContext.codeExample.setWebCode(
                command3CodeExample.current.getNewCommand3WebCode(
                    axisCode,
                    commandNo,
                    velocity
                )
            );

            globalContext.codeExample.setClangCode(
                command3CodeExample.current.getNewCommand3CCode(
                    axisCode,
                    commandNo,
                    velocity
                )
            );
        },
        [globalContext.codeExample]
    );
    useEffect(() => {
        updateCodeExamples(
            globalContext.currentAxisCode.axisCode,
            props.currentCommandDictionary.CommandEnum,
            velocityRPM
        );
    }, [
        globalContext.currentAxisCode.axisCode,
        props.currentCommandDictionary.CommandEnum,
        updateCodeExamples,
        velocityRPM,
    ]);

    useEffect(() => {
        setInternalVelocity(
            RPM_ToInternalVelocity(
                velocityRPM,
                globalContext.motorType.currentMotorType.StepsPerRevolution
            )
        );
    }, [
        velocityRPM,
        globalContext.motorType.currentMotorType.StepsPerRevolution,
    ]);

    useEffect(() => {
        setCommVelocity(InternalVelocityToCommVelocity(internalVelocity));
    }, [internalVelocity]);

    useEffect(() => {
        if (commVelocity == 0) {
            setCommVelocityHexa("00000000");
        } else {
            let rawPayload_ArrayBufferForVelocity = new ArrayBuffer(4);
            const viewVelocity = new DataView(
                rawPayload_ArrayBufferForVelocity
            );
            viewVelocity.setUint32(0, commVelocity, true);

            let rawVelocityPayload = new Uint8Array(4);
            rawVelocityPayload.set([viewVelocity.getUint8(0)], 0);
            rawVelocityPayload.set([viewVelocity.getUint8(1)], 1);
            rawVelocityPayload.set([viewVelocity.getUint8(2)], 2);
            rawVelocityPayload.set([viewVelocity.getUint8(3)], 3);

            const strComVel = Uint8ArrayToString(rawVelocityPayload);
            setCommVelocityHexa(strComVel);
        }
    }, [commVelocity]);
    //#endregion VELOCITY_CONVERSION

    const execute_command = () => {
        if (velocityInputBox && velocityInputBox.current) {
            const selectedAxis = props.getAxisSelection();
            if (selectedAxis == "") return;

            if (velocityInputBox.current.value == "") {
                props.LogAction(ErrorTypes.NO_ERR, "Please enter velocity.");
                return;
            }

            if (velocityRPM < 0) {
                if (velocityRPM > minimumNegativeVelocity) {
                    props.LogAction(
                        ErrorTypes.ERR1002,
                        `Minimum value for negative velocity is ${minimumNegativeVelocity}, consider using a smaller value.`
                    );
                }
            } else if (velocityRPM < minimumPositiveVelocity) {
                props.LogAction(
                    ErrorTypes.ERR1002,
                    `Minimum value for positive velocity is ${minimumPositiveVelocity}, consider using a larger value.`
                );
            }

            const rawData = props.constructCommand(commVelocityHexa);
            props.sendDataToSerialPort(rawData);
        }
    };
    return (
        <>
            <div className="w-full text-center mb-5">
                <MotorSelection />
                <div className="flex justify-center mt-2">
                    <div className="mx-2">{props.children}</div>
                    <div
                        className="tooltip tooltip-ghost"
                        data-tip="Check out below the conversion in real-time!"
                    >
                        <input
                            ref={velocityInputBox}
                            onChange={onVelocityInputBoxChange}
                            type="number"
                            placeholder="Velocity (RPM)"
                            className="input input-bordered max-w-xs input-sm mx-2"
                        />
                    </div>
                </div>
                <button
                    className="btn btn-primary btn-sm mt-4"
                    onClick={execute_command}
                >
                    set max velocity
                </button>
            </div>

            <article className="mb-10 prose prose-slate max-w-full">
                <ol className="flex">
                    <div className="px-5">
                        <h4>Velocity conversion</h4>
                        <li>
                            Transforming velocity to internal velocity, the
                            formula used is:
                            <br></br>
                            <i>
                                Internal_velocity = (RPM / 60) * (
                                {
                                    globalContext.motorType.currentMotorType
                                        .StepsPerRevolution
                                }{" "}
                                / 31250) * (2 ^ 32)
                            </i>
                            <br></br>
                            {`Input: ${velocityRPM.toString()} RPM`}
                            <br></br>
                            {`Output: ${internalVelocity.toString()} Internal velocity`}
                        </li>
                        <li>
                            Taking the output from step 1 and transforming it to
                            communication velocity:
                            <br></br>
                            <i>
                                Communication_velocity = Internal_velocity /
                                (2^12)
                            </i>
                            <br></br>
                            {`Input: ${internalVelocity.toString()} Internal velocity`}
                            <br></br>
                            {`Output: ${commVelocity.toString()} Communication velocity`}
                        </li>{" "}
                        <li>
                            Taking the output from step 2 and transforming it to
                            32-bit signed integer with little-endian format
                            <br></br>
                            {`Input: ${commVelocity.toString()} Communication velocity`}
                            <br></br>
                            {`Output: 0x${commVelocityHexa.toString()}`}
                        </li>
                    </div>
                </ol>
            </article>
        </>
    );
};
