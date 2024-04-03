import {
    useEffect,
    useState,
    useRef,
    useCallback,
    ReactElement,
    MutableRefObject,
    useContext,
} from "react";
import React from "react";
import Log from "./log-window";
import Command from "./command-window";
import {
    Uint8ArrayToString,
    stringToUint8Array,
    ErrorTypes,
    getCurrentBrowser,
    Char,
} from "../servo-engine/utils";
import {
    InputOutputObjects,
    MotorCommandsDictionary,
    NonCommands,
} from "../servo-engine/motor-commands";
import { LogType } from "../components/log-window";
import SelectAxis from "./select-axis";
import { Command1 } from "./Commands/0_1/0_1";
import { Command2 } from "./Commands/2/2";
import { Command3 } from "./Commands/3/3";
import { Command4 } from "./Commands/4/4";
import { Command5 } from "./Commands/5/5";
import { Command6 } from "./Commands/6/6";
import { Command7 } from "./Commands/7/7";
import { Command8 } from "./Commands/8/8";
import { Command9 } from "./Commands/9/9";
import { Command10 } from "./Commands/10/10";
import { Command11 } from "./Commands/11/11";
import { Command12 } from "./Commands/12/12";
import { Command13 } from "./Commands/13/13";
import { Command14 } from "./Commands/14/14";
import { Command15 } from "./Commands/15/15";
import { Command16 } from "./Commands/16/16";
import { Command17 } from "./Commands/17/17";
import { Command18 } from "./Commands/18/18";
import { Command19 } from "./Commands/19/19";
import { Command20 } from "./Commands/20/20";
import { Command21 } from "./Commands/21/21";
import { Command22 } from "./Commands/22/22";
import { Command23 } from "./Commands/23/23";
import { Command24 } from "./Commands/24/24";
import { Command25 } from "./Commands/25/25";
import { Command26 } from "./Commands/26/26";
import { Command27 } from "./Commands/27/27";
import { Command28 } from "./Commands/28/28";
import { Command29, MoveCommand } from "./Commands/29/29";
import { Command30 } from "./Commands/30/30";
import { Command31 } from "./Commands/31/31";
import { Command32 } from "./Commands/32/32";
import { Command33 } from "./Commands/33/33";
import { Command41 } from "./Commands/41/41";
import { Command254 } from "./Commands/254/254";
import { useRouter } from "next/router";
import { GlobalContext } from "../pages/_app";

export type MainWindowProps = {
    currentChapter: number;
    currentCommandDictionary: MotorCommandsDictionary;
    MotorCommands: MutableRefObject<MotorCommandsDictionary[]>;
};

const Main = (props: MainWindowProps) => {
    const globalContext = useContext(GlobalContext);
    const disconnectTimeout = useRef<NodeJS.Timeout>();
    const portSer = useRef<SerialPort | null>(null);
    const reader = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
    const [logs, setLogs] = useState<LogType[]>([]);
    const logsRef = useRef<LogType[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [axisSelectionValue, setAxisSelectionValue] = useState<string>("255");
    const axisCodeRef = useRef<number>(255);

    const timerHandle = useRef<NodeJS.Timeout>();
    const partialData = useRef<string>("");

    //State is lifted up from command 29 to save the state between chapter change
    const [MoveCommands, setMoveCommands] = useState<MoveCommand[]>([]);

    const master_time_start = useRef<number>(0);
    const lineNumber = useRef<number>(0);

    const LogAction = (errorType: string, log: string): void => {
        lineNumber.current++;

        logsRef.current = [
            ...logsRef.current,
            {
                lineNumber: lineNumber.current,
                date: new Date(),
                log: log,
                logError: errorType,
            },
        ];
        setLogs(logsRef.current);
    };

    const clearLogWindow = () => {
        partialData.current = "";
        lineNumber.current = 0;
        logsRef.current = [];
        setLogs([]);
    };

    const connectToSerialPort = async (BaudRate: number = 230400) => {
        const currentBrowser = getCurrentBrowser();
        if (currentBrowser != "Chrome" && currentBrowser != "Edge") {
            LogAction(
                ErrorTypes.NO_ERR,
                "Only Chrome and Edge browsers are supported!"
            );
            return;
        }

        try {
            if (portSer.current) {
                LogAction(
                    ErrorTypes.NO_ERR,
                    "You are trying to open a new serial port, we will close the current one for you."
                );
                disconnectFromSerialPort();
                portSer.current = null;
            }
            portSer.current = await navigator.serial.requestPort();
            await portSer.current.open({ baudRate: BaudRate });
            readDataFromSerialPortUntilClosed();
            setIsConnected(true);

            LogAction(
                ErrorTypes.NO_ERR,
                "Connected with baudrate " + BaudRate.toString() + "!"
            );
        } catch (err) {
            portSer.current = null;
            if (err instanceof Error) {
                try {
                    const indexOfColon = err.message.indexOf(":") + 2;
                    LogAction(
                        ErrorTypes.ERR1999,
                        err.message.slice(indexOfColon)
                    );
                } catch (err) {
                    LogAction(ErrorTypes.ERR1999, "An unknown error occured.");
                }
                return;
            } else {
                console.log(err);
                return;
            }
        }
    };

    const router = useRouter();
    const disconnectFromSerialPort = useCallback(async () => {
        if (portSer && portSer.current) {
            try {
                disconnectTimeout.current = setTimeout(() => {
                    router.reload();
                }, 2000);
                reader.current?.cancel();
            } catch (err) {
                if (err instanceof Error) {
                    LogAction(ErrorTypes.ERR1999, err!.message);
                    return;
                } else {
                    console.log(err);
                    return;
                }
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (axisSelectionValue == "") {
            globalContext.currentAxisCode.setAxisCode(0);
            axisCodeRef.current = 0;
        } else {
            let axis = parseInt(axisSelectionValue);

            if (axisSelectionValue.length == 1) {
                //when only one char was introduced in the alias box, get the ascii code of that char
                axis = new Char(axisSelectionValue).getDecimalASCII_Code();
            }

            axisCodeRef.current = axis;
            globalContext.currentAxisCode.setAxisCode(axis);
        }
    }, [axisSelectionValue, globalContext.currentAxisCode]);

    useEffect(() => {
        return () => {
            if (isConnected) {
                disconnectFromSerialPort();
            }
        };
    }, [disconnectFromSerialPort, isConnected]);

    /*This function will take an input like string that represents hexadecimal bytes
    e.g. "410000" , it will send on the serial port the raw binary repr. of that string e.g. [0x41,0,0]
    when sending succeds, the function will output the send bytes on the log windows as a hexa decima string
 */
    const sendDataToSerialPort = useCallback(
        async (
            dataToSend: string | Uint8Array,
            enableSentLogging = true,
            enableTimoutLogging = true,
            isFirwareShot = false
        ) => {
            if (dataToSend.length === 0) {
                LogAction(
                    ErrorTypes.NO_ERR,
                    "We know you are impatient dear scholar, but you must enter at least one byte!"
                );
                return;
            }
            if (portSer && portSer.current && portSer.current.writable) {
                const writer = portSer.current.writable.getWriter();

                let data: Uint8Array = new Uint8Array([]);
                if (typeof dataToSend == "string") {
                    data = stringToUint8Array(dataToSend.toUpperCase());
                    if (data.length == 0) {
                        LogAction(
                            ErrorTypes.ERR1005,
                            "Your message has an invalid length!"
                        );
                        return;
                    }
                } else {
                    data = dataToSend;
                }

                await writer.write(data);

                if (!isFirwareShot) {
                    let hexString = Uint8ArrayToString(data);
                    if (enableSentLogging) {
                        LogAction(
                            ErrorTypes.NO_ERR,
                            "Sent: 0x" + hexString.toUpperCase()
                        );
                    }
                    const cmdStr = hexString.slice(2, 4);

                    if (hexString.slice(0, 2) == "FF" || cmdStr == "23") {
                        //do not log time out when sending a command to alias 0xFF / 255
                        enableTimoutLogging = false;
                    }

                    if (cmdStr == "14" || cmdStr == "29" || cmdStr == "15") {
                        //command 0x14 / 20 responds randomly,
                        //command 0x29 / 41 responds always, this command is based on UniqueId
                        //command 0x15 / 21 responds always, this command is based on UniqueId
                        //enable timeout logging if this is the case no metter the selected axes
                        enableTimoutLogging = true;
                    }

                    if (enableTimoutLogging) {
                        timerHandle.current = setTimeout(() => {
                            if (partialData.current.length == 0) {
                                console.log("time out while command ", cmdStr);
                                LogAction(
                                    ErrorTypes.ERR1003,
                                    "The command timed out."
                                );
                            } else {
                                //the command responded but it was incomplete
                                LogAction(
                                    ErrorTypes.ERR1004,
                                    "The message received is incomplete."
                                );
                                LogAction(
                                    ErrorTypes.ERR1004,
                                    "Received incomplete message: 0x" +
                                        partialData.current
                                );
                                partialData.current = "";
                            }
                        }, 1000);
                    }

                    if (enableSentLogging && !enableTimoutLogging) {
                        LogAction(
                            ErrorTypes.NO_ERR,
                            "No response is expected!"
                        );
                    }
                }

                writer.releaseLock();
            } else {
                LogAction(
                    ErrorTypes.NO_ERR,
                    "Sending data is not possible, you must connect first!"
                );
            }
        },
        []
    );

    const readDataFromSerialPortUntilClosed = async () => {
        let receiveLength = 0;
        if (portSer && portSer.current) {
            if (portSer.current.readable) {
                reader.current = await portSer.current.readable.getReader();

                if (reader && reader.current) {
                    try {
                        while (true) {
                            if (
                                portSer.current != null &&
                                portSer.current.readable
                            ) {
                                const { value, done } =
                                    await reader.current.read();
                                if (done) {
                                    LogAction(
                                        ErrorTypes.NO_ERR,
                                        "Reader is now closed!"
                                    );
                                    reader.current.releaseLock();
                                    reader.current = null;
                                    break;
                                } else {
                                    const receivedBytes =
                                        Uint8ArrayToString(value);
                                    partialData.current += receivedBytes;

                                    if (partialData.current.length >= 6) {
                                        //we received more than 3 bytes so we know the length

                                        receiveLength = stringToUint8Array(
                                            partialData.current.slice(4, 6)
                                        )[0];

                                        if (receiveLength == 0) {
                                            LogAction(
                                                ErrorTypes.NO_ERR,
                                                "Received: 0x" +
                                                    partialData.current
                                            );
                                            clearTimeout(timerHandle.current);
                                            partialData.current = "";
                                        } else if (
                                            partialData.current.length / 2 ==
                                            receiveLength + 3
                                        ) {
                                            LogAction(
                                                ErrorTypes.NO_ERR,
                                                "Received: 0x" +
                                                    partialData.current
                                            );
                                            partialData.current = "";
                                            clearTimeout(timerHandle.current);
                                        }
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        if (err instanceof Error) {
                            LogAction(ErrorTypes.ERR1999, err!.message);
                        }
                        reader.current?.releaseLock();
                        reader.current = null;
                    } finally {
                        LogAction(
                            ErrorTypes.NO_ERR,
                            "Waiting for the serial port to disconnect.."
                        );
                        await portSer.current.close();
                        clearTimeout(disconnectTimeout.current);
                        portSer.current = null;
                        setIsConnected(false);
                        LogAction(ErrorTypes.NO_ERR, "Disconnected!");
                    }
                }
            }
        }
    };

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            /**System Reset shortcut */
            if (e.key == "r" && e.ctrlKey) {
                e.preventDefault();
                const initialRawBytes = new Uint8Array(3);

                initialRawBytes.set([axisCodeRef.current, 27, 0]);

                sendDataToSerialPort(initialRawBytes, true, false);
            } else if (e.key == "R" && e.ctrlKey) {
                e.preventDefault();
                sendDataToSerialPort("FF1B00", true, false);
            } else if (e.key == "e" && e.ctrlKey) {
                e.preventDefault();
                /**Enable MOSFETS sortcut */
                const initialRawBytes = new Uint8Array(3);

                initialRawBytes.set([axisCodeRef.current, 1, 0]);

                sendDataToSerialPort(initialRawBytes, true, true);
            } else if (e.key == "E" && e.ctrlKey) {
                e.preventDefault();
                sendDataToSerialPort("FF0100", true, true);
            } else if (e.key == "d" && e.ctrlKey) {
                e.preventDefault();
                /**Disable MOSFETS shortcut */
                const initialRawBytes = new Uint8Array(3);

                initialRawBytes.set([axisCodeRef.current, 0, 0]);

                sendDataToSerialPort(initialRawBytes, true, true);
            } else if (e.key == "D" && e.ctrlKey) {
                e.preventDefault();
                sendDataToSerialPort("FF0000", true, true);
            }
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [sendDataToSerialPort]);

    /*
  This function will create a raw command containg an array of unsigned integers that represent the data.
  Parameters to the function are only the axis and the payload, the rest of the bytes will be automatically deduced from the given arguments.

  ############### How the command is constructed ###############
  Second byte: Command for the axis (what action should the axis do?)
  Third byte: Length of the payload
  Payload bytes: arguments that will be applied to the command. Each command has different arguments, in case no arguments are needed you must specify the Third byte as 0x00
  First byte, optional, hex string of the axis 
  */
    const constructCommand = (
        _payload: string,
        _currentCommand?: number,
        _axis?: string //hex string
    ): Uint8Array => {
        //allocate the raw array
        const axisSize = 1;
        const commandSize = 1;
        const lengthByteSize = 1;
        const initialRawBytes = new Uint8Array(
            axisSize + commandSize + lengthByteSize
        );

        let axisCodeLocal = globalContext.currentAxisCode.axisCode;
        if (_axis != null) {
            axisCodeLocal = parseInt(_axis);
        }
        initialRawBytes.set([axisCodeLocal]);

        if (_currentCommand != undefined) {
            initialRawBytes.set([_currentCommand], 1);
        } else {
            //get value of command_id
            initialRawBytes.set(
                [props.currentCommandDictionary.CommandEnum],
                1
            );
        }

        //get hex value of payload

        let payload = stringToUint8Array(_payload);

        initialRawBytes.set([payload.length], 2);

        const finalRawBytes = new Uint8Array(
            initialRawBytes.length + payload.length
        );

        //introduce the initial bytes(axis,command,length)
        finalRawBytes.set(initialRawBytes);

        //introduce the final bytes(payload)
        finalRawBytes.set(payload, initialRawBytes.length);

        return finalRawBytes;
    };

    function getAxisSelection(): string {
        return axisSelectionValue;
    }

    let currentCommandLayout: ReactElement = <></>;
    if (
        props.currentCommandDictionary.CommandEnum == 0 ||
        props.currentCommandDictionary.CommandEnum == 1
    )
        currentCommandLayout = (
            <>
                <Command1
                    {...props}
                    getAxisSelection={getAxisSelection}
                    sendDataToSerialPort={sendDataToSerialPort}
                    LogAction={LogAction}
                    constructCommand={constructCommand}
                >
                    <SelectAxis
                        LogAction={LogAction}
                        axisSelectionValue={axisSelectionValue}
                        setAxisSelectionValue={setAxisSelectionValue}
                    />
                </Command1>
            </>
        );
    else if (props.currentCommandDictionary.CommandEnum == 2) {
        const currentInputObj = props.currentCommandDictionary
            .Input as InputOutputObjects[];
        currentCommandLayout = (
            <>
                <Command2
                    {...props}
                    getAxisSelection={getAxisSelection}
                    sendDataToSerialPort={sendDataToSerialPort}
                    LogAction={LogAction}
                    constructCommand={constructCommand}
                >
                    <SelectAxis
                        LogAction={LogAction}
                        axisSelectionValue={axisSelectionValue}
                        setAxisSelectionValue={setAxisSelectionValue}
                    />
                </Command2>
            </>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 3) {
        currentCommandLayout = (
            <>
                <Command3
                    {...props}
                    getAxisSelection={getAxisSelection}
                    sendDataToSerialPort={sendDataToSerialPort}
                    LogAction={LogAction}
                    constructCommand={constructCommand}
                >
                    <SelectAxis
                        LogAction={LogAction}
                        axisSelectionValue={axisSelectionValue}
                        setAxisSelectionValue={setAxisSelectionValue}
                    />
                </Command3>
            </>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 4) {
        currentCommandLayout = (
            <>
                <Command4
                    {...props}
                    getAxisSelection={getAxisSelection}
                    sendDataToSerialPort={sendDataToSerialPort}
                    LogAction={LogAction}
                    constructCommand={constructCommand}
                >
                    <SelectAxis
                        LogAction={LogAction}
                        axisSelectionValue={axisSelectionValue}
                        setAxisSelectionValue={setAxisSelectionValue}
                    />
                </Command4>
            </>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 5) {
        currentCommandLayout = (
            <>
                <Command5
                    {...props}
                    getAxisSelection={getAxisSelection}
                    sendDataToSerialPort={sendDataToSerialPort}
                    LogAction={LogAction}
                    constructCommand={constructCommand}
                >
                    <SelectAxis
                        LogAction={LogAction}
                        axisSelectionValue={axisSelectionValue}
                        setAxisSelectionValue={setAxisSelectionValue}
                    />
                </Command5>
            </>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 6)
        currentCommandLayout = (
            <Command6
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command6>
        );
    else if (props.currentCommandDictionary.CommandEnum == 7) {
        currentCommandLayout = (
            <Command7
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command7>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 8)
        currentCommandLayout = (
            <>
                <Command8
                    {...props}
                    getAxisSelection={getAxisSelection}
                    sendDataToSerialPort={sendDataToSerialPort}
                    LogAction={LogAction}
                    constructCommand={constructCommand}
                    master_time_start={master_time_start}
                >
                    <SelectAxis
                        LogAction={LogAction}
                        axisSelectionValue={axisSelectionValue}
                        setAxisSelectionValue={setAxisSelectionValue}
                    />
                </Command8>
            </>
        );
    else if (props.currentCommandDictionary.CommandEnum == 9) {
        currentCommandLayout = (
            <Command9
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command9>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 10) {
        currentCommandLayout = (
            <>
                <Command10
                    {...props}
                    getAxisSelection={getAxisSelection}
                    sendDataToSerialPort={sendDataToSerialPort}
                    LogAction={LogAction}
                    constructCommand={constructCommand}
                    master_time_start={master_time_start}
                >
                    <SelectAxis
                        LogAction={LogAction}
                        axisSelectionValue={axisSelectionValue}
                        setAxisSelectionValue={setAxisSelectionValue}
                    />
                </Command10>
            </>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 11) {
        currentCommandLayout = (
            <Command11
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command11>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 12)
        currentCommandLayout = (
            <Command12
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command12>
        );
    else if (props.currentCommandDictionary.CommandEnum == 13)
        currentCommandLayout = (
            <Command13
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command13>
        );
    else if (props.currentCommandDictionary.CommandEnum == 14) {
        currentCommandLayout = (
            <Command14
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command14>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 15) {
        currentCommandLayout = (
            <Command15
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command15>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 16) {
        currentCommandLayout = (
            <Command16
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command16>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 17)
        currentCommandLayout = (
            <Command17
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command17>
        );
    else if (props.currentCommandDictionary.CommandEnum == 18) {
        currentCommandLayout = (
            <Command18
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command18>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 19) {
        currentCommandLayout = (
            <Command19
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command19>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 20) {
        currentCommandLayout = (
            <Command20
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command20>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 21) {
        currentCommandLayout = (
            <Command21
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command21>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 22) {
        currentCommandLayout = (
            <Command22
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command22>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 23)
        currentCommandLayout = (
            <Command23
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                isConnected={isConnected}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command23>
        );
    else if (props.currentCommandDictionary.CommandEnum == 24) {
        currentCommandLayout = (
            <Command24
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command24>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 25) {
        currentCommandLayout = (
            <Command25
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command25>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 26) {
        currentCommandLayout = (
            <Command26
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command26>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 27)
        currentCommandLayout = (
            <Command27
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command27>
        );
    else if (props.currentCommandDictionary.CommandEnum == 28)
        currentCommandLayout = (
            <Command28
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command28>
        );
    else if (props.currentCommandDictionary.CommandEnum == 29) {
        currentCommandLayout = (
            <Command29
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
                MoveCommands={MoveCommands}
                setMoveCommands={setMoveCommands}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command29>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 30) {
        currentCommandLayout = (
            <Command30
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command30>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 31)
        currentCommandLayout = (
            <Command31
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command31>
        );
    else if (props.currentCommandDictionary.CommandEnum == 32) {
        currentCommandLayout = (
            <Command32
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command32>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 33) {
        currentCommandLayout = (
            <Command33
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command33>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 41) {
        currentCommandLayout = (
            <Command41
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command41>
        );
    } else if (props.currentCommandDictionary.CommandEnum == 254)
        currentCommandLayout = (
            <Command254
                {...props}
                getAxisSelection={getAxisSelection}
                sendDataToSerialPort={sendDataToSerialPort}
                LogAction={LogAction}
                constructCommand={constructCommand}
            >
                <SelectAxis
                    LogAction={LogAction}
                    axisSelectionValue={axisSelectionValue}
                    setAxisSelectionValue={setAxisSelectionValue}
                />
            </Command254>
        );

    return (
        <>
            <div className="flex w-full h-full bg-base-300 rounded-box overflow-auto">
                <Command
                    {...props}
                    setAxisSelectionValue={setAxisSelectionValue}
                    getAxisSelection={getAxisSelection}
                    LogAction={LogAction}
                    constructCommand={constructCommand}
                    sendDataToSerialPort={sendDataToSerialPort}
                    connectToSerialPort={connectToSerialPort}
                    disconnectFromSerialPort={disconnectFromSerialPort}
                    isConnected={isConnected}
                    axisSelectionValue={axisSelectionValue}
                >
                    {currentCommandLayout}
                </Command>
                {props.currentCommandDictionary.CommandEnum ===
                NonCommands.get("Commands protocol") ? null : (
                    <Log
                        logs={logs}
                        mainWindow={props}
                        clearLogWindow={clearLogWindow}
                        sendDataToSerialPort={sendDataToSerialPort}
                        connectToSerialPort={connectToSerialPort}
                        disconnectFromSerialPort={disconnectFromSerialPort}
                        isConnected={isConnected}
                        constructCommand={constructCommand}
                        LogAction={LogAction}
                    />
                )}
            </div>
        </>
    );
};

export default Main;
