import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { GlobalContext } from "../../../pages/_app";
import {
    InternalVelocityToCommVelocity,
    SecondToTimesteps,
    maximumNegativeVelocity,
    maximumPositiveVelocity,
    minimumNegativeVelocity,
    minimumPositiveVelocity,
    RPM_ToInternalVelocity,
    Uint8ArrayToString,
    maximumPositiveTime,
    minimumPositiveTime,
    ErrorTypes,
} from "../../../servo-engine/utils";
import { ChaptersPropsType } from "../0_1/0_1";
import { Command26CodeExample } from "./code-samples/code-sample";
import { Command22 } from "../22/22";
import MotorSelection from "../../motor-selection";

export const Command26 = (props: ChaptersPropsType) => {
    const globalContext = useContext(GlobalContext);
    const command26CodeExample = useRef(new Command26CodeExample());

    const velocityInputBox = useRef<HTMLInputElement | null>(null);
    const timeInputBox = useRef<HTMLInputElement | null>(null);

    const updateCodeExamples = useCallback(
        (
            axisCode: number,
            commandNo: number,
            velocity: number,
            time: number
        ) => {
            globalContext.codeExample.setPythonCode(
                command26CodeExample.current.getNewCommand26PythonCode(
                    axisCode,
                    commandNo,
                    velocity,
                    time
                )
            );

            globalContext.codeExample.setWebCode(
                command26CodeExample.current.getNewCommand26WebCode(
                    axisCode,
                    commandNo,
                    velocity,
                    time
                )
            );

            globalContext.codeExample.setClangCode(
                command26CodeExample.current.getNewCommand26CCode(
                    axisCode,
                    commandNo,
                    velocity,
                    time
                )
            );
        },
        [globalContext.codeExample]
    );

    //#region TIME_CONVERSION
    const [timeValue, setTimeValue] = useState<number>(0);
    const [timesteps, setTimestepsValue] = useState<number>(0);
    const [timestepsHexa, setTimestepsHexaValue] = useState<string>("00000000");

    const [velocityRPM, setVelocityRPM] = useState<number>(0);
    const [internalVelocity, setInternalVelocity] = useState<number>(0);
    const [commVelocity, setCommVelocity] = useState<number>(0);
    const [commVelocityHexa, setCommVelocityHexa] =
        useState<string>("00000000");

    const onTimeInputBoxChange = () => {
        if (timeInputBox && timeInputBox.current) {
            const inputBoxValue = parseFloat(timeInputBox.current.value);

            if (isNaN(inputBoxValue) || inputBoxValue < 0) {
                setTimeValue(0);
            } else if (inputBoxValue > maximumPositiveTime) {
                //max reached
                props.LogAction(
                    ErrorTypes.ERR1001,
                    `Maximum value for time is ${maximumPositiveTime}, consider using a smaller value!`
                );
                setTimeValue(maximumPositiveTime);
                timeInputBox.current.value = maximumPositiveTime.toString();
            } else {
                setTimeValue(inputBoxValue);
            }
        }
    };

    useEffect(() => {
        setTimestepsValue(SecondToTimesteps(timeValue));
    }, [timeValue]);

    useEffect(() => {
        if (timesteps == 0) {
            setTimestepsHexaValue("00000000");
        } else {
            let rawPayload_ArrayBufferForTime = new ArrayBuffer(4);
            const viewTime = new DataView(rawPayload_ArrayBufferForTime);

            viewTime.setUint32(0, timesteps, true);

            let rawTimePayload = new Uint8Array(4);
            rawTimePayload.set([viewTime.getUint8(0)], 0);
            rawTimePayload.set([viewTime.getUint8(1)], 1);
            rawTimePayload.set([viewTime.getUint8(2)], 2);
            rawTimePayload.set([viewTime.getUint8(3)], 3);

            const strTimesteps = Uint8ArrayToString(rawTimePayload);
            setTimestepsHexaValue(strTimesteps);
        }
    }, [timesteps, commVelocityHexa]);
    //#endregion TIME_CONVERSION

    //#region VELOCITY_CONVERSION

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

    useEffect(() => {
        setInternalVelocity(
            RPM_ToInternalVelocity(
                velocityRPM,
                globalContext.motorType.currentMotorType.StepsPerRevolution
            )
        );
    }, [
        velocityRPM,
        globalContext.motorType.currentMotorType,
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

            const strIntVelocity = Uint8ArrayToString(rawVelocityPayload);
            setCommVelocityHexa(strIntVelocity);
        }
    }, [commVelocity, timestepsHexa]);
    //#endregion VELOCITY_CONVERSION

    useEffect(() => {
        updateCodeExamples(
            globalContext.currentAxisCode.axisCode,
            props.currentCommandDictionary.CommandEnum,
            velocityRPM,
            timeValue
        );
    }, [
        globalContext.currentAxisCode.axisCode,
        props.currentCommandDictionary.CommandEnum,
        updateCodeExamples,
        velocityRPM,
        timeValue,
    ]);

    const execute_command = () => {
        if (
            velocityInputBox &&
            velocityInputBox.current &&
            timeInputBox &&
            timeInputBox.current
        ) {
            const selectedAxis = props.getAxisSelection();
            if (selectedAxis == "") return;

            if (
                velocityInputBox.current.value == "" ||
                timeInputBox.current.value == ""
            ) {
                props.LogAction(ErrorTypes.NO_ERR, "Please enter both inputs.");
                return;
            }

            if (parseFloat(timeInputBox.current.value) < 0) {
                props.LogAction(ErrorTypes.NO_ERR, "Time cannot be negative!");
                return;
            }

            if (timeValue < minimumPositiveTime) {
                props.LogAction(
                    ErrorTypes.ERR1002,
                    `Time value is considered 0 when it is below ${minimumPositiveTime}, consider using a larger value.`
                );
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

            const rawData = props.constructCommand(
                commVelocityHexa + timestepsHexa
            );
            props.sendDataToSerialPort(rawData);
        }
    };
    return (
        <>
            <div className="w-full text-center mb-5">
                <MotorSelection />
                <div className="flex flex-col xl:flex-row justify-center items-center">
                    <div className="m-2">{props.children}</div>
                    <div
                        className="tooltip tooltip-ghost"
                        data-tip="Check out below the conversion in real-time!"
                    >
                        <input
                            ref={velocityInputBox}
                            onChange={onVelocityInputBoxChange}
                            type="number"
                            placeholder="Velocity (RPM)"
                            className="input input-bordered basis-1/2  max-w-xs input-sm m-2"
                        />
                    </div>
                    <div
                        className="tooltip tooltip-ghost"
                        data-tip="Check out below the conversion in real-time!"
                    >
                        <input
                            ref={timeInputBox}
                            onChange={onTimeInputBoxChange}
                            type="number"
                            placeholder="Time limit (s)"
                            className="input input-bordered basis-1/2  max-w-xs input-sm m-2"
                        />
                    </div>
                </div>
                {globalContext.motorType.currentMotorType.TypeName == "" ? (
                    <div className="mt-4">
                        <Command22 MountedByOtherCommand={true} {...props} />
                    </div>
                ) : (
                    <>
                        <button
                            className="btn btn-primary btn-sm mt-2"
                            onClick={execute_command}
                        >
                            execute
                        </button>
                    </>
                )}
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
                    <div className="px-5">
                        <h4>Time conversion</h4>
                        <li>
                            Transforming time to Timesteps, the formula used is:
                            <br></br>
                            <i>Timesteps = timeInSeconds * 1000000 / 32</i>
                            <br></br>
                            {`Input: ${timeValue.toString()}s`}
                            <br></br>
                            {`Output: ${timesteps.toString()} Timesteps`}
                        </li>
                        <li>
                            Taking the output from step 4 and transforming it to
                            32-bit unsigned integer with little-endian format
                            <br></br>
                            {`Input: ${timesteps.toString()} Timesteps`}
                            <br></br>
                            {`Output: 0x${timestepsHexa}`}
                        </li>
                    </div>
                </ol>
            </article>
        </>
    );
};
