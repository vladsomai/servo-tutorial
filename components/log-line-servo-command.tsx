import { useEffect, useRef, useState, MutableRefObject } from "react";
import {
    ErrorTypes,
    getDisplayFormat,
    getNoOfBytesFromDescription,
    stringToUint8Array,
} from "../servo-engine/utils";
import { LogType } from "./log-window";
import { MainWindowProps } from "./main-window";
import { useContext } from "react";
import { GlobalContext } from "../pages/_app";
import {
    troubleshootConnection,
    troubleshootIncompleteResponse,
} from "./modalComponents";
import errorCodes from "../public/status_error_codes.json" assert { type: "json" };
import { Tooltip } from "flowbite-react";
import TooltipDescription from "./tooltipDescription";

export interface LogLineServoCommandType extends LogType, MainWindowProps {
    currentCommand: MutableRefObject<number>;
}

export interface CommandBytesType {
    Value: string;
    Color: string;
    Description: JSX.Element;
}

export interface CommandParameter {
    Description: JSX.Element;
    NoOfBytes: number;
}

enum TroubleshootType {
    connection,
    incompleteMessage,
}

const LogLineServoCommand = (props: LogLineServoCommandType) => {
    const globalContext = useContext(GlobalContext);

    const troubleshootType = useRef<TroubleshootType>(
        TroubleshootType.connection
    );

    const troubleshoot = () => {
        switch (troubleshootType.current) {
            case TroubleshootType.connection:
                globalContext.modal.setTitle("Troubleshooting guide");
                globalContext.modal.setDescription(troubleshootConnection);
                break;
            case TroubleshootType.incompleteMessage:
                globalContext.modal.setTitle("Troubleshooting guide");
                globalContext.modal.setDescription(
                    troubleshootIncompleteResponse
                );
                break;
            default:
                break;
        }
    };
    const byteColor = [
        " text-violet-400",
        " text-violet-500",
        " text-violet-400",
        " text-blue-400",
        " text-blue-500",
    ];
    const byteDescriptionSend = [
        "Targeted axis byte",
        "Command byte",
        "Length byte",
        "Payload bytes!",
    ];

    const byteDescriptionReceived = [
        "Sender ID (R)",
        "Response status",
        "Length byte",
        "Payload bytes!",
    ];

    const [componentIsACommand, setComponentIsACommand] =
        useState<boolean>(false);
    const [componentIsATroubleshoot, setComponentIsATroubleshoot] =
        useState<boolean>(false);
    const [maxOrMinReached, setMaxOrMinReached] = useState<boolean>(false);

    const commandBytes = useRef<CommandBytesType[]>([]);
    const stringTo0x = useRef("");
    const getStatusAtFatalErrorCode = useRef(false);

    useEffect(() => {
        setComponentIsACommand(false);
        setComponentIsATroubleshoot(false);
        setMaxOrMinReached(false);
        const isSendCommand = props.log.includes("Sent") ? true : false;
        const isReceiveCommand = props.log.includes("Received") ? true : false;
        let sendingPayload: CommandParameter[] = [];
        let receivingPayload: CommandParameter[] = [];

        if (isSendCommand || isReceiveCommand) {
            setComponentIsACommand(true);
            const indexOf0x = props.log.indexOf("0x");
            stringTo0x.current = props.log.slice(0, indexOf0x);

            const rawCommand = props.log.slice(indexOf0x + 2, props.log.length);

            let receiveLength = stringToUint8Array(rawCommand.slice(4, 6))[0];

            if (isSendCommand) {
                props.currentCommand.current = stringToUint8Array(
                    rawCommand.slice(2, 4)
                )[0];
            }

            let NoOfBytes = 0;
            let currentParameterStart = 6;
            let currentParameterEnd = 0;
            for (const command of props.MotorCommands.current) {
                if (command.CommandEnum == props.currentCommand.current) {
                    if (isSendCommand && typeof command.Input != "string") {
                        for (const input of command.Input) {
                            let currentPayloadDescription = [input.Description];

                            NoOfBytes = getNoOfBytesFromDescription(
                                input.Description
                            );
                            if (NoOfBytes == 0) {
                                //try getting the no of bytes from the receive length
                                NoOfBytes = receiveLength;
                            }

                            currentParameterEnd =
                                currentParameterStart + NoOfBytes * 2;
                            const currentParameter = rawCommand.slice(
                                currentParameterStart,
                                currentParameterEnd
                            );
                            currentParameterStart = currentParameterEnd;

                            const formats = getDisplayFormat(
                                input.TooltipDisplayFormat as string,
                                currentParameter
                            );
                            for (const format of formats) {
                                currentPayloadDescription.push(format);
                            }

                            const tooltipDescription = (
                                <TooltipDescription
                                    Description={currentPayloadDescription}
                                />
                            );

                            sendingPayload.push({
                                Description: tooltipDescription,
                                NoOfBytes: NoOfBytes,
                            });
                        }
                    } else if (
                        isReceiveCommand &&
                        typeof command.Output != "string"
                    ) {
                        for (const output of command.Output) {
                            //for command 16
                            if (output.Description.includes("Bit")) continue;

                            let currentPayloadDescription = [
                                output.Description,
                            ];

                            NoOfBytes = getNoOfBytesFromDescription(
                                output.Description
                            );
                            if (NoOfBytes == 0) {
                                //try getting the no of bytes from the receive length if the number is not specified in the JSON
                                NoOfBytes = receiveLength;
                            }

                            currentParameterEnd =
                                currentParameterStart + NoOfBytes * 2;
                            const currentParameter = rawCommand.slice(
                                currentParameterStart,
                                currentParameterEnd
                            );
                            currentParameterStart = currentParameterEnd;

                            if (
                                props.currentCommand.current == 22 ||
                                props.currentCommand.current == 25
                            ) {
                                //this is used to separate the version number bytes by a dot
                                const formats = getDisplayFormat(
                                    output.TooltipDisplayFormat as string,
                                    currentParameter,
                                    output.Description
                                );
                                for (const format of formats) {
                                    currentPayloadDescription.push(format);
                                }
                                currentPayloadDescription.push();
                            } else {
                                const formats = getDisplayFormat(
                                    output.TooltipDisplayFormat as string,
                                    currentParameter
                                );
                                for (const format of formats) {
                                    currentPayloadDescription.push(format);
                                }
                            }

                            if (props.currentCommand.current == 16) {
                                if (getStatusAtFatalErrorCode.current) {
                                    //for cmd 16 we must take the second parameter and check the fatal error code that needs to be displayed
                                    const currentErrorCode = parseInt(
                                        currentParameter,
                                        16
                                    );
                                    for (let errorCode of errorCodes) {
                                        if (
                                            currentErrorCode ==
                                            errorCode.ErrorCode
                                        ) {
                                            currentPayloadDescription.push(
                                                " Error code description: " +
                                                    errorCode.Description
                                            );
                                        }
                                    }
                                }

                                getStatusAtFatalErrorCode.current = true;
                            }

                            const tooltipDescription = (
                                <TooltipDescription
                                    Description={currentPayloadDescription}
                                />
                            );

                            receivingPayload.push({
                                Description: tooltipDescription,
                                NoOfBytes: NoOfBytes,
                            });
                        }
                    }
                }
            }

            for (let i = 0; i < rawCommand.length; i += 2) {
                if (i == 0) {
                    commandBytes.current.push({
                        Value: rawCommand.slice(0, 2),
                        Description: isSendCommand ? (
                            <TooltipDescription
                                Description={[byteDescriptionSend[0]]}
                            />
                        ) : (
                            <TooltipDescription
                                Description={[byteDescriptionReceived[0]]}
                            />
                        ),
                        Color: byteColor[0],
                    });
                } else if (i == 2) {
                    commandBytes.current.push({
                        Value: rawCommand.slice(2, 4),
                        Description: isSendCommand ? (
                            <TooltipDescription
                                Description={[byteDescriptionSend[1]]}
                            />
                        ) : (
                            <TooltipDescription
                                Description={[byteDescriptionReceived[1]]}
                            />
                        ),
                        Color: byteColor[1],
                    });
                } else if (i == 4) {
                    commandBytes.current.push({
                        Value: rawCommand.slice(4, 6),
                        Description: isSendCommand ? (
                            <TooltipDescription
                                Description={[byteDescriptionSend[2]]}
                            />
                        ) : (
                            <TooltipDescription
                                Description={[byteDescriptionReceived[2]]}
                            />
                        ),
                        Color: byteColor[2],
                    });
                } else {
                    if (isSendCommand) {
                        if (sendingPayload.length == 0) {
                            //in case we do not define sending payload in the main-window just print the payload
                            commandBytes.current.push({
                                Value: rawCommand.slice(6, rawCommand.length),
                                Description: (
                                    <TooltipDescription
                                        Description={[byteDescriptionSend[3]]}
                                    />
                                ), //inline "if" is not needed here
                                Color: byteColor[3],
                            });
                        } else {
                            let currentStart = 6;
                            let NoOfChars = 0;
                            for (let i = 0; i < sendingPayload.length; i++) {
                                NoOfChars = sendingPayload.at(i)!.NoOfBytes * 2;
                                commandBytes.current.push({
                                    Value: rawCommand.slice(
                                        currentStart,
                                        currentStart + NoOfChars
                                    ),
                                    Description:
                                        sendingPayload.at(i)!.Description,
                                    Color: byteColor[i % 2 == 0 ? 3 : 4],
                                });
                                currentStart += NoOfChars;
                            }
                        }
                    } else if (isReceiveCommand) {
                        let currentStart = 6; //start from the 6th char in the response
                        let NoOfChars = 0;
                        for (let i = 0; i < receivingPayload.length; i++) {
                            const payloadAtI = receivingPayload.at(
                                i
                            ) as CommandParameter;
                            NoOfChars = payloadAtI.NoOfBytes * 2;

                            commandBytes.current.push({
                                Value: rawCommand.slice(
                                    currentStart,
                                    currentStart + NoOfChars
                                ),
                                Description: payloadAtI.Description,
                                Color: byteColor[i % 2 == 0 ? 3 : 4],
                            });
                            currentStart += NoOfChars;
                        }
                    }
                    break;
                }
            }
        } else if (props.logError == ErrorTypes.ERR1003) {
            setComponentIsATroubleshoot(true);
            troubleshootType.current = TroubleshootType.connection;
        } else if (props.logError == ErrorTypes.ERR1004) {
            setComponentIsATroubleshoot(true);
            troubleshootType.current = TroubleshootType.incompleteMessage;
        } else if (
            props.logError == ErrorTypes.ERR1001 ||
            props.logError == ErrorTypes.ERR1002
        ) {
            setMaxOrMinReached(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.log]);

    return (
        <>
            <div className="inline-block w-[94%]">
                <p className="inline-block mr-1">
                    {("0" + props.date.getDate().toString()).slice(-2) +
                        "/" +
                        ("0" + (props.date.getMonth() + 1).toString()).slice(
                            -2
                        ) +
                        "/" +
                        props.date.getFullYear() +
                        "|" +
                        ("0" + props.date.getHours().toString()).slice(-2) +
                        ":" +
                        ("0" + props.date.getMinutes().toString()).slice(-2) +
                        ":" +
                        ("0" + props.date.getSeconds().toString()).slice(-2) +
                        ": "}
                </p>

                {componentIsACommand ? (
                    <div className="inline">
                        <p className="inline-block">
                            {stringTo0x.current + "0x"}
                        </p>
                        {commandBytes.current.map((byte) => {
                            return (
                                <div
                                    className="inline-block ml-1 break-words "
                                    key={commandBytes.current.indexOf(byte)}
                                >
                                    <Tooltip
                                        content={byte.Description}
                                        placement="top"
                                        className=" w-auto max-w-md text-slate-200 bg-gray-600 font-extrabold border-opacity-0 "
                                        animation="duration-150"
                                        role="tooltip"
                                        style="light"
                                    >
                                        <p
                                            className={`inline break-all cursor-text ${byte.Color}`}
                                        >
                                            {byte.Value}
                                        </p>
                                    </Tooltip>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <>
                        {maxOrMinReached && (
                            <>
                                <label className="inline-block text-yellow-300 mr-2">
                                    Warning:
                                </label>
                            </>
                        )}
                        <p className="inline">{props.log}</p>
                        {componentIsATroubleshoot && (
                            <>
                                <label
                                    className="inline-block link text-yellow-300"
                                    onClick={troubleshoot}
                                    htmlFor="my-modal-4"
                                >
                                    Troubleshoot
                                </label>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
};
export default LogLineServoCommand;
