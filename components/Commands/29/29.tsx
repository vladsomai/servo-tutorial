import {
    Dispatch,
    SetStateAction,
    SyntheticEvent,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    InternalVelocityToCommVelocity,
    SecondToTimesteps,
    maximumNegativeVelocity,
    maximumPositiveVelocity,
    RPM_ToInternalVelocity,
    Uint8ArrayToString,
    maximumPositiveTime,
    minimumPositiveTime,
    maximumNegativeAcceleration,
    maximumPositiveAcceleration,
    RPMSquared_ToInternalAcceleration,
    InternalAccelerationToCommAcceleration,
    ErrorTypes,
    transfNumberToUint8Arr,
} from "../../../servo-engine/utils";
import { ChaptersPropsType } from "../0_1/0_1";
import Image from "next/image";
import { animated, useTransition } from "react-spring";
import { GlobalContext } from "../../../pages/_app";
import { Command29CodeExample } from "./code-samples/code-sample";

export interface MultiMoveChapterProps extends ChaptersPropsType {
    MoveCommands: MoveCommand[];
    setMoveCommands: Dispatch<SetStateAction<MoveCommand[]>>;
}
export interface MovementType {
    Name: string;
}
export const movementTypes: MovementType[] = [
    { Name: "Acceleration" },
    { Name: "Velocity" },
];

export interface MoveCommand {
    MovementType: MovementType;
    MoveValue: string;
    TimeValue: string;
}

export const Command29 = (props: MultiMoveChapterProps) => {
    const globalContext = useContext(GlobalContext);
    const command29CodeExample = useRef(new Command29CodeExample());

    const [payload, setPayload] = useState("");
    const [movementType, setMovementType] = useState("Velocity");
    const commandsDivElement = useRef<HTMLDivElement[] | null[]>([]); //will be used to add transitions
    const movementTypeSelectionBox = useRef<HTMLSelectElement[] | null[]>([]);
    const acceleretionOrVelocityInputBox = useRef<HTMLInputElement[] | null[]>(
        []
    );
    const timeInputBox = useRef<HTMLInputElement[] | null[]>([]);

    const u32BitMovementTypes = useRef(0);
    const timestepsHexa = useRef<string[]>([]);
    const movementComm = useRef<string[]>([]);

    const updateCodeExamples = useCallback(
        (
            axisCode: number,
            commandNo: number,
            movement_types: number,
            moveCommands: MoveCommand[]
        ) => {
            globalContext.codeExample.setPythonCode(
                command29CodeExample.current.getNewCommand29PythonCode(
                    axisCode,
                    commandNo,
                    movement_types,
                    moveCommands
                )
            );

            globalContext.codeExample.setWebCode(
                command29CodeExample.current.getNewCommand29WebCode(
                    axisCode,
                    commandNo,
                    movement_types,
                    moveCommands
                )
            );

            globalContext.codeExample.setClangCode(
                command29CodeExample.current.getNewCommand29CCode(
                    axisCode,
                    commandNo,
                    movement_types,
                    moveCommands
                )
            );
        },
        [globalContext.codeExample]
    );

    useEffect(() => {
        updateCodeExamples(
            globalContext.currentAxisCode.axisCode,
            props.currentCommandDictionary.CommandEnum,
            u32BitMovementTypes.current,
            props.MoveCommands
        );
    }, [
        globalContext.currentAxisCode.axisCode,
        props.currentCommandDictionary.CommandEnum,
        updateCodeExamples,
        props.MoveCommands,
    ]);

    useEffect(
        (arr = props.MoveCommands) => {
            let movementTypes = 0;
            arr.map((item) => {
                if (item.MovementType.Name == "Velocity") {
                    //set ith bit when using velocity movement
                    const mask = 1 << arr.indexOf(item);
                    movementTypes |= mask;
                }
            });
            u32BitMovementTypes.current = movementTypes;
            timestepsHexa.current = arr.map((item) =>
                convertTime(item.TimeValue)
            );
            movementComm.current = arr.map((item) => convertAccOrVel(item));
        },
        [props.MoveCommands]
    );

    //#region TRANSITION
    const transitionMulimoves = useTransition(props.MoveCommands, {
        from: { y: -100, opacity: 0 },
        enter: { y: 0, opacity: 1 },
        leave: { y: 100, opacity: 0 },
    });
    //#endregion TRANSITION
    const resetAllCommands = () => {
        u32BitMovementTypes.current = 0;
        timestepsHexa.current = [];
        movementComm.current = [];
        props.setMoveCommands([]);
    };

    const deleteMoveCommand = (command: number) => {
        const arr1 = props.MoveCommands.slice(0, command);
        const arr2 = props.MoveCommands.slice(
            command + 1,
            props.MoveCommands.length
        );

        const arr = [...arr1, ...arr2];

        let movementTypes = 0;
        arr.map((item) => {
            if (item.MovementType.Name == "Velocity") {
                //set ith bit when using velocity movement
                const mask = 1 << arr.indexOf(item);
                movementTypes |= mask;
            }
        });
        u32BitMovementTypes.current = movementTypes;
        timestepsHexa.current = arr.map((item) => convertTime(item.TimeValue));
        movementComm.current = arr.map((item) => convertAccOrVel(item));

        props.setMoveCommands(arr);
    };

    const addMoveCommand = () => {
        if (props.MoveCommands.length > 30) {
            props.LogAction(
                ErrorTypes.NO_ERR,
                "Maximum number of commands reached: 31."
            );
            return;
        }

        let emptyMoveCmd = {
            MovementType: { Name: movementType },
            MoveValue: "",
            TimeValue: "",
        };

        const arr = [...props.MoveCommands, emptyMoveCmd];

        if (emptyMoveCmd.MovementType.Name == "Velocity") {
            //set ith bit when using velocity movement
            const mask = 1 << (arr.length - 1);
            u32BitMovementTypes.current |= mask;
        } else {
            //reset ith bit when using acc movement
            const mask = ~(1 << (arr.length - 1));
            u32BitMovementTypes.current &= mask;
        }

        timestepsHexa.current = arr.map((item) => convertTime(item.TimeValue));
        movementComm.current = arr.map((item) => convertAccOrVel(item));

        props.setMoveCommands(arr);
    };

    const onSelectionChange = (e: SyntheticEvent, command: number) => {
        const selectElement = e.target as HTMLSelectElement;
        const value = selectElement.options[selectElement.selectedIndex].text;
        setMovementType(value);

        const arr1 = props.MoveCommands.slice(0, command);
        let arr2 = props.MoveCommands.at(command) as MoveCommand;
        const arr3 = props.MoveCommands.slice(
            command + 1,
            props.MoveCommands.length
        );

        arr2.MovementType.Name = value;
        arr2.MoveValue = "";

        const arr = [...arr1, arr2, ...arr3];

        let movementTypes = 0;
        arr.map((item) => {
            if (item.MovementType.Name == "Velocity") {
                //set ith bit when using velocity movement
                const mask = 1 << arr.indexOf(item);
                movementTypes |= mask;
            }
        });
        u32BitMovementTypes.current = movementTypes;
        movementComm.current = arr.map((item) => convertAccOrVel(item));

        props.setMoveCommands(arr);
    };

    //#region TIME_CONVERSION
    const convertTime = (_timeInSeconds: number | string): string => {
        let timesteps: number = 0;

        if (typeof _timeInSeconds == "string") {
            timesteps = SecondToTimesteps(
                _timeInSeconds === "" ? 0 : parseFloat(_timeInSeconds)
            );
        } else {
            timesteps = SecondToTimesteps(_timeInSeconds);
        }

        return Uint8ArrayToString(transfNumberToUint8Arr(timesteps, 4));
    };

    const onTimeInputBoxChange = (e: SyntheticEvent, command: number) => {
        const currentInputBox = e.target as HTMLInputElement;

        if (currentInputBox) {
            const inputBoxValue = parseFloat(currentInputBox.value);

            if (isNaN(inputBoxValue) || inputBoxValue < 0) {
            } else if (inputBoxValue > maximumPositiveTime) {
                //max reached
                props.LogAction(
                    ErrorTypes.ERR1001,
                    `Maximum value for time is ${maximumPositiveTime}, consider using a smaller value!`
                );
                currentInputBox.value = maximumPositiveTime.toString();
            }
        }

        const arr1 = props.MoveCommands.slice(0, command);
        let arr2 = props.MoveCommands.at(command) as MoveCommand;
        const arr3 = props.MoveCommands.slice(
            command + 1,
            props.MoveCommands.length
        );

        arr2.TimeValue = currentInputBox.value;

        const arr = [...arr1, arr2, ...arr3];

        timestepsHexa.current = arr.map((item) => convertTime(item.TimeValue));

        props.setMoveCommands(arr);
    };
    //#endregion TIME_CONVERSION

    //#region Acceleration_CONVERSION
    const convertAccOrVel = (cmd: MoveCommand): string => {
        let ret: Uint8Array = new Uint8Array();

        if (cmd.MovementType.Name == "Acceleration") {
            const internalAcceleration = RPMSquared_ToInternalAcceleration(
                cmd.MoveValue === "" ? 0 : parseFloat(cmd.MoveValue)
            );
            const commAcceleration =
                InternalAccelerationToCommAcceleration(internalAcceleration);
            ret = transfNumberToUint8Arr(commAcceleration, 4);
        } else if (cmd.MovementType.Name == "Velocity") {
            const internalVelocity = RPM_ToInternalVelocity(
                cmd.MoveValue === "" ? 0 : parseFloat(cmd.MoveValue)
            );
            const commVelocity =
                InternalVelocityToCommVelocity(internalVelocity);

            ret = transfNumberToUint8Arr(commVelocity, 4);
        }

        return Uint8ArrayToString(ret);
    };

    const onAccOrVelInputBoxChange = (e: SyntheticEvent, command: number) => {
        const currentInputBox = e.target as HTMLInputElement;
        const inputBoxValue = parseFloat(currentInputBox.value);
        const inputBoxMovementType =
            props.MoveCommands.at(command)!.MovementType.Name;

        //#region Validate
        if (inputBoxMovementType === "Velocity") {
            if (inputBoxValue < 0) {
                //negative Velocity
                if (inputBoxValue < maximumNegativeVelocity) {
                    //max negative reached
                    props.LogAction(
                        ErrorTypes.ERR1001,
                        `Maximum value for negative velocity is ${maximumNegativeVelocity}, consider using a larger value!`
                    );
                    currentInputBox.value = Number(
                        maximumNegativeVelocity
                    ).toString();
                }
            }
            //positive Velocity
            else if (inputBoxValue >= maximumPositiveVelocity) {
                //max positive reached
                props.LogAction(
                    ErrorTypes.ERR1001,
                    `Maximum value for positive velocity is ${maximumPositiveVelocity}, consider using a smaller value!`
                );
                currentInputBox.value = Number(
                    maximumPositiveVelocity
                ).toString();
            }
        } else if (inputBoxMovementType === "Acceleration") {
            if (inputBoxValue < 0) {
                //negative Acceleration
                if (inputBoxValue < maximumNegativeAcceleration) {
                    //max negative reached
                    props.LogAction(
                        ErrorTypes.ERR1001,
                        `Maximum value for negative acceleration is ${maximumNegativeAcceleration}, consider using a larger value!`
                    );
                    currentInputBox.value = Number(
                        maximumNegativeAcceleration
                    ).toString();
                }
            }
            //positive Acceleration
            else if (inputBoxValue >= maximumPositiveAcceleration) {
                //max positive reached
                props.LogAction(
                    ErrorTypes.ERR1001,
                    `Maximum value for positive acceleration is ${maximumPositiveAcceleration}, consider using a smaller value!`
                );
                currentInputBox.value = Number(
                    maximumPositiveAcceleration
                ).toString();
            }
        }
        //#endregion Validate

        let arr1 = props.MoveCommands.slice(0, command);
        let arr2 = props.MoveCommands.at(command) as MoveCommand;
        let arr3 = props.MoveCommands.slice(
            command + 1,
            props.MoveCommands.length
        );

        arr2.MoveValue = currentInputBox.value;

        const arr = [...arr1, arr2, ...arr3];

        movementComm.current = arr.map((item) => convertAccOrVel(item));

        props.setMoveCommands(arr);
    };
    //#endregion Acceleration_CONVERSION
    useEffect(() => {
        const updateCommands = () => {
            let list_2d = "";
            for (let i = 0; i < props.MoveCommands.length; i++) {
                list_2d += movementComm.current[i] + timestepsHexa.current[i];
            }

            //#region number of commands byte
            /* Convert the u32 that holds all the movement bits*/
            const rawNoCommandsByte = Uint8ArrayToString(
                transfNumberToUint8Arr(props.MoveCommands.length, 1)
            );
            //#endregion number of commands byte

            //#region Movement bits
            /* Convert the u32 that holds all the movement bits*/
            const rawMovementBits = Uint8ArrayToString(
                transfNumberToUint8Arr(
                    BigInt.asUintN(32, BigInt(u32BitMovementTypes.current)),
                    4
                )
            );
            //#endregion Movement bits

            const payloadStr = rawNoCommandsByte + rawMovementBits + list_2d;
            setPayload(payloadStr);
        };

        updateCommands();
    }, [props.MoveCommands]);

    const execute_command = () => {
        const selectedAxis = props.getAxisSelection();
        if (selectedAxis == "") return;
        if (props.MoveCommands.length == 0) {
            props.LogAction(
                ErrorTypes.NO_ERR,
                "Please add at least one command!"
            );
            return;
        }

        for (let i = 0; i < props.MoveCommands.length; i++) {
            if (
                acceleretionOrVelocityInputBox.current[i]?.value == "" ||
                timeInputBox.current[i]?.value == ""
            ) {
                props.LogAction(
                    ErrorTypes.NO_ERR,
                    `Please enter both inputs on command ${i + 1}.`
                );
                return;
            }

            const timeValue = parseFloat(
                timeInputBox.current[i]?.value as string
            );

            if (Number.isNaN(timeValue)) {
                return;
            }

            if (timeValue < 0) {
                props.LogAction(
                    ErrorTypes.ERR1002,
                    `Time cannot be negative on command ${i + 1}!`
                );
                return;
            }

            if (timeValue < minimumPositiveTime) {
                props.LogAction(
                    ErrorTypes.ERR1002,
                    `Time value is considered 0 when it is below ${minimumPositiveTime}, consider using a larger value.`
                );
            }
        }

        const rawData = props.constructCommand(payload);
        props.sendDataToSerialPort(rawData);
    };
    return (
        <>
            <div className="w-full text-center mb-10">
                <div className="mb-5">
                    <div className=" flex justify-evenly ">
                        <div
                            className="tooltip tooltip-success mb-5 "
                            data-tip="Add new command"
                        >
                            <button
                                className="btn btn-success btn-sm btn-circle"
                                onClick={addMoveCommand}
                            >
                                <Image
                                    alt="Add command"
                                    src="/add.svg"
                                    width={100}
                                    height={100}
                                    priority
                                />
                            </button>
                        </div>
                        <div
                            className="tooltip tooltip-error"
                            data-tip="Delete all commands"
                        >
                            <button
                                className="btn btn-error btn-sm btn-circle"
                                onClick={resetAllCommands}
                            >
                                <Image
                                    alt="Reset commands"
                                    src="/reset.svg"
                                    width={100}
                                    height={100}
                                    priority
                                />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        {transitionMulimoves((style, MoveCommand) => (
                            <animated.div
                                style={style}
                                ref={(el) =>
                                    {commandsDivElement.current[
                                        props.MoveCommands.indexOf(MoveCommand)
                                    ] = el}
                                }
                                className="flex flex-col xl:flex-row justify-center items-center"
                            >
                                <p className="m-2 self-center xl:self-end ">
                                    {props.MoveCommands.indexOf(MoveCommand) +
                                        1}
                                    .
                                </p>
                                <select
                                    ref={(el) => {
                                        movementTypeSelectionBox.current[
                                            props.MoveCommands.indexOf(
                                                MoveCommand
                                            )
                                        ] = el;
                                    }}
                                    className="select select-bordered select-sm max-w-xs m-2"
                                    value={MoveCommand.MovementType.Name}
                                    onChange={(e) =>
                                        onSelectionChange(
                                            e,
                                            props.MoveCommands.indexOf(
                                                MoveCommand
                                            )
                                        )
                                    }
                                >
                                    {movementTypes.map((type: MovementType) => (
                                        <option
                                            key={movementTypes.indexOf(type)}
                                        >
                                            {type.Name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    ref={(el) => {
                                        acceleretionOrVelocityInputBox.current[
                                            props.MoveCommands.indexOf(
                                                MoveCommand
                                            )
                                        ] = el;
                                    }}
                                    onChange={(e) =>
                                        onAccOrVelInputBoxChange(
                                            e,
                                            props.MoveCommands.indexOf(
                                                MoveCommand
                                            )
                                        )
                                    }
                                    type="number"
                                    value={MoveCommand.MoveValue}
                                    placeholder="Velocity / Acceleration"
                                    className="input input-bordered max-w-xs input-sm m-2"
                                />

                                <input
                                    ref={(el) => {
                                        timeInputBox.current![
                                            props.MoveCommands.indexOf(
                                                MoveCommand
                                            )
                                        ] = el;
                                    }}
                                    onChange={(e) =>
                                        onTimeInputBoxChange(
                                            e,
                                            props.MoveCommands.indexOf(
                                                MoveCommand
                                            )
                                        )
                                    }
                                    value={MoveCommand.TimeValue}
                                    type="number"
                                    placeholder="Time limit (s)"
                                    className="input input-bordered  max-w-xs input-sm m-2"
                                />

                                <div
                                    className="tooltip tooltip-error"
                                    data-tip={
                                        "Delete command " +
                                        `${
                                            props.MoveCommands.indexOf(
                                                MoveCommand
                                            ) + 1
                                        }`
                                    }
                                >
                                    <button
                                        className="btn btn-error btn-sm btn-circle m-2"
                                        onClick={() => {
                                            deleteMoveCommand(
                                                props.MoveCommands.indexOf(
                                                    MoveCommand
                                                )
                                            );
                                        }}
                                    >
                                        <Image
                                            alt="Delete command"
                                            src="/delete.svg"
                                            width={20}
                                            height={20}
                                            priority
                                        />
                                    </button>
                                </div>
                            </animated.div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center transition-all">
                    <div className="mr-4 ">{props.children}</div>
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
