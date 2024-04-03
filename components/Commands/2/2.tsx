import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { GlobalContext } from "../../../pages/_app";
import Image from "next/image";
import {
    RotationsToMicrosteps,
    SecondToTimesteps,
    Uint8ArrayToString,
    maximumNegativePosition,
    maximumPositivePosition,
    minimumNegativePosition,
    minimumPositivePosition,
    minimumPositiveTime,
    maximumPositiveTime,
    ErrorTypes,
    littleEndianToBigEndian,
    MotorType,
} from "../../../servo-engine/utils";
import { ChaptersPropsType } from "../0_1/0_1";
import { Command2CodeExample } from "./code-samples/code-sample";
import MotorSelection from "../../motor-selection";

export const Command2 = (props: ChaptersPropsType) => {
    const globalContext = useContext(GlobalContext);
    const command2CodeExample = useRef(new Command2CodeExample());

    const positionInputBox = useRef<HTMLInputElement | null>(null);
    const timeInputBox = useRef<HTMLInputElement | null>(null);

    const [timeValue, setTimeValue] = useState<number>(0);
    const [timesteps, setTimestepsValue] = useState<number>(0);
    const [timestepsHexa, setTimestepsHexaValue] = useState<string>("00000000");

    const [positionValue, setPositionValue] = useState<number>(0);
    const [microsteps, setMicrostepsValue] = useState<number>(0);
    const [microstepsHexa, setMicrostepsHexaValue] =
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

    const updateCodeExamples = useCallback(
        (
            axisCode: number,
            commandNo: number,
            position: number,
            time: number
        ) => {
            globalContext.codeExample.setPythonCode(
                command2CodeExample.current.getNewCommand2PythonCode(
                    axisCode,
                    commandNo,
                    position,
                    time
                )
            );

            globalContext.codeExample.setWebCode(
                command2CodeExample.current.getNewCommand2WebCode(
                    axisCode,
                    commandNo,
                    position,
                    time
                )
            );

            globalContext.codeExample.setClangCode(
                command2CodeExample.current.getNewCommand2CCode(
                    axisCode,
                    commandNo,
                    position,
                    time
                )
            );
        },
        [globalContext.codeExample]
    );

    useEffect(() => {
        updateCodeExamples(
            globalContext.currentAxisCode.axisCode,
            props.currentCommandDictionary.CommandEnum,
            positionValue,
            timeValue
        );
    }, [
        globalContext.currentAxisCode.axisCode,
        props.currentCommandDictionary.CommandEnum,
        updateCodeExamples,
        positionValue,
        timeValue,
    ]);

    useEffect(() => {
        setMicrostepsValue(
            RotationsToMicrosteps(
                positionValue,
                globalContext.motorType.currentMotorType.StepsPerRevolution
            )
        );
    }, [
        positionValue,
        globalContext.motorType.currentMotorType.StepsPerRevolution,
    ]);

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
    }, [timesteps, microstepsHexa]);

    const onPositionInputBoxChange = () => {
        if (positionInputBox && positionInputBox.current) {
            const inputBoxValue = parseFloat(positionInputBox.current.value);

            if (isNaN(inputBoxValue)) {
                setPositionValue(0);
            } else {
                if (inputBoxValue < 0) {
                    //negative position
                    if (inputBoxValue > minimumNegativePosition) {
                        setPositionValue(inputBoxValue);
                    } else if (inputBoxValue < maximumNegativePosition) {
                        //max negative reached
                        props.LogAction(
                            ErrorTypes.ERR1001,
                            `Maximum rotation value for negative position is ${maximumNegativePosition}, consider using a larger value!`
                        );
                        setPositionValue(maximumNegativePosition);
                        positionInputBox.current.value =
                            maximumNegativePosition.toString();
                    } else {
                        setPositionValue(inputBoxValue);
                    }
                }
                //positive position
                else if (inputBoxValue < minimumPositivePosition) {
                    setPositionValue(inputBoxValue);
                } else if (inputBoxValue > maximumPositivePosition) {
                    //max positive reached
                    props.LogAction(
                        ErrorTypes.ERR1001,
                        `Maximum rotation value for positive position is ${maximumPositivePosition}, consider using a smaller value!`
                    );
                    setPositionValue(maximumPositivePosition);
                    positionInputBox.current.value =
                        maximumPositivePosition.toString();
                } else {
                    setPositionValue(inputBoxValue);
                }
            }
        }
    };

    useEffect(() => {
        if (microsteps == 0) {
            setMicrostepsHexaValue("00000000");
        } else {
            let rawPayload_ArrayBufferForPosition = new ArrayBuffer(4);
            const viewPosition = new DataView(
                rawPayload_ArrayBufferForPosition
            );
            viewPosition.setUint32(0, microsteps, true);

            let rawPositionPayload = new Uint8Array(4);
            rawPositionPayload.set([viewPosition.getUint8(0)], 0);
            rawPositionPayload.set([viewPosition.getUint8(1)], 1);
            rawPositionPayload.set([viewPosition.getUint8(2)], 2);
            rawPositionPayload.set([viewPosition.getUint8(3)], 3);

            const strMicrosteps = Uint8ArrayToString(rawPositionPayload);
            setMicrostepsHexaValue(strMicrosteps);
        }
    }, [microsteps, timestepsHexa]);

    const trapezoid_move = () => {
        if (
            positionInputBox &&
            positionInputBox.current &&
            timeInputBox &&
            timeInputBox.current
        ) {
            const selectedAxis = props.getAxisSelection();
            if (selectedAxis == "") return;

            if (
                positionInputBox.current.value == "" ||
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

            if (positionValue < 0) {
                if (positionValue > minimumNegativePosition) {
                    props.LogAction(
                        ErrorTypes.ERR1002,
                        `Minimum value for negative position is ${minimumNegativePosition} (one microstep), consider using a smaller value.`
                    );
                }
            } else if (positionValue < minimumPositivePosition) {
                props.LogAction(
                    ErrorTypes.ERR1002,
                    `Minimum value for positive position is ${minimumPositivePosition} (one microstep), consider using a larger value.`
                );
            }

            const rawData = props.constructCommand(
                microstepsHexa + timestepsHexa,
                2
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
                            ref={positionInputBox}
                            onChange={onPositionInputBoxChange}
                            type="number"
                            placeholder="Position (rotations)"
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
                <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={trapezoid_move}
                >
                    execute
                </button>
            </div>
            <article className="mb-10 prose prose-slate max-w-full">
                <ol className="flex">
                    <div className="px-5">
                        <h4>Position conversion</h4>
                        <li>
                            Transforming position to Microsteps, the formula
                            used is:
                            <br></br>
                            <i>
                                Microsteps = rotations *{" "}
                                {
                                    globalContext.motorType.currentMotorType
                                        .StepsPerRevolution
                                }
                            </i>
                            <br></br>
                            {`Input: ${positionValue.toString()} rotations`}
                            <br></br>
                            {`Output: ${microsteps.toString()} Microsteps`}
                        </li>
                        <li>
                            Taking the output from step 1 and transforming it to
                            32-bit signed integer with little-endian format
                            <br></br>
                            {`Input: ${microsteps.toString()} Microsteps`}
                            <br></br>
                            Output:
                            <ul>
                                <li>
                                    <p className=" my-0">
                                        Transmit order: {`0x${microstepsHexa}`}
                                    </p>
                                </li>

                                <li>
                                    <p className="my-0">
                                        Hexadecimal:{" "}
                                        {`0x${littleEndianToBigEndian(
                                            microstepsHexa
                                        )}`}
                                    </p>
                                </li>
                            </ul>
                        </li>{" "}
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
                            Taking the output from step 3 and transforming it to
                            32-bit unsigned integer with little-endian format
                            <br></br>
                            {`Input: ${timesteps.toString()} Timesteps`}
                            <br></br>
                            Output:
                            <ul>
                                <li>
                                    <p className=" my-0">
                                        Transmit order: {`0x${timestepsHexa}`}
                                    </p>
                                </li>

                                <li>
                                    <p className="my-0">
                                        Hexadecimal:{" "}
                                        {`0x${littleEndianToBigEndian(
                                            timestepsHexa
                                        )}`}
                                    </p>
                                </li>
                            </ul>
                        </li>
                    </div>
                </ol>
            </article>
        </>
    );
};
