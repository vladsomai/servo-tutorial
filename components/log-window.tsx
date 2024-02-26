import { useContext, useEffect, useRef } from "react";
import { animated, useSpring } from "react-spring";
import LogLineServoCommand from "./log-line-servo-command";
import { MainWindowProps } from "./main-window";
import { GlobalContext } from "../pages/_app";

export type LogType = {
    lineNumber: number;
    date: Date;
    log: string;
    logError: string;
};

const Log = (props: {
    logs: LogType[];
    mainWindow: MainWindowProps;
    clearLogWindow: Function;
    sendDataToSerialPort: Function;
    connectToSerialPort: Function;
    disconnectFromSerialPort: Function;
    isConnected: boolean;
    constructCommand: (
        _payload: string,
        _currentCommand?: number,
        _axis?: string
    ) => Uint8Array;
    LogAction: (errorType: string, log: string) => void;
}) => {
    const globalContext = useContext(GlobalContext);
    const logWindow = useRef<HTMLDivElement | null>(null);
    const currentCommand = useRef<number>(0);

    const disable_enable_MOSFETS = (enable: boolean) => {
        const selectedAxis = globalContext.currentAxisCode.axisCode;

        const command = new Uint8Array([selectedAxis, enable ? 1 : 0, 0]);

        props.sendDataToSerialPort(command);
    };
    const getStatus = () => {
        const selectedAxis = globalContext.currentAxisCode.axisCode;

        const command = new Uint8Array([selectedAxis, 16, 0]);

        props.sendDataToSerialPort(command);
    };
    const reset = () => {
        const selectedAxis = globalContext.currentAxisCode.axisCode;

        const command = new Uint8Array([selectedAxis, 27, 0]);

        props.sendDataToSerialPort(command, true, false);
    };
    useEffect(() => {
        if (logWindow && logWindow.current) {
            logWindow.current.scrollTop =
                logWindow.current.scrollHeight - logWindow.current.clientHeight;
        }
    }, [props.logs]);

    useEffect(() => {
        globalContext.detectedDevices.setDevices([]);
    }, []);

    const [styleSpring] = useSpring(
        () => ({
            from: { opacity: 0 },
            to: { opacity: 1 },
            config: { duration: 1000 },
        }),
        []
    );
    return (
        <>
            <animated.div
                className="rounded-box px-2 py-2 h-full w-6/12 flex flex-col justify-center content-center overflow-auto "
                style={styleSpring}
            >
                <div className=" relative h-16 w-full rounded-t-box rounded-b-none py-5 bg-slate-700 ">
                    <div className="w-full flex items-end justify-center absolute bottom-0">
                        <div className="w-full flex items-end justify-around">
                            {props.isConnected ? (
                                <button
                                    className="z-10 btn btn-success rounded-b-none btn-sm h-[2.3rem] text-md btn-primary hover:opacity-90 border-0 flex flex-col normal-case"
                                    onClick={() => {
                                        props.disconnectFromSerialPort();
                                    }}
                                >
                                    Connected
                                    <span className="text-[10px] normal-case">
                                        Press to disconnect
                                    </span>
                                </button>
                            ) : (
                                <button
                                    className="z-10 btn btn-error btn-sm h-[2.3rem] rounded-b-none text-md hover:opacity-90 flex flex-col normal-case"
                                    onClick={() => {
                                        props.connectToSerialPort();
                                    }}
                                >
                                    Disconnected
                                    <span className="text-[10px] normal-case">
                                        Press to connect
                                    </span>
                                </button>
                            )}
                            <button
                                className="btn btn-xs rounded-b-none border-0 bg-slate-800 tracking-widest z-10 hidden xl:block"
                                onClick={() => disable_enable_MOSFETS(false)}
                            >
                                {"Disable FETS"}
                            </button>

                            <button
                                className="btn btn-xs rounded-b-none border-0 bg-slate-800 tracking-widest z-10 hidden xl:block"
                                onClick={() => disable_enable_MOSFETS(true)}
                            >
                                {"Enable FETS"}
                            </button>
                            <button
                                className="btn btn-xs rounded-b-none border-0 bg-slate-800 tracking-widest z-10 hidden xl:block"
                                onClick={() => getStatus()}
                            >
                                {"Get status"}
                            </button>
                            <button
                                className="btn btn-xs rounded-b-none border-0 bg-slate-800 tracking-widest z-10 hidden xl:block"
                                onClick={() => reset()}
                            >
                                {"Reset"}
                            </button>
                            <button
                                className="btn btn-xs rounded-b-none border-0 bg-slate-800 tracking-widest z-10"
                                onClick={() => props.clearLogWindow()}
                            >
                                {"Clear"}
                            </button>
                        </div>
                    </div>

                    <p className="flex justify-center absolute inset-0 top-2">
                        <b>Log Window</b>
                    </p>
                </div>
                <div
                    ref={logWindow}
                    className=" bg-slate-800 rounded-b-box h-full px-6 py-3 overflow-auto"
                >
                    <div className="flex flex-col justify-center text-justify font-mono w-full">
                        {props.logs.map((log: LogType) => {
                            return (
                                <div
                                    className="flex w-full"
                                    key={log.lineNumber}
                                >
                                    <p
                                        className="mr-2 text-gray-500 text-right w-[6%]"
                                        style={{
                                            borderRight: "1px solid #6B7280",
                                            userSelect: "none",
                                        }}
                                    >
                                        {log.lineNumber.toString()}&nbsp;
                                    </p>
                                    <LogLineServoCommand
                                        {...props.mainWindow}
                                        {...log}
                                        currentCommand={currentCommand}
                                        LogAction={props.LogAction}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </animated.div>
        </>
    );
};
export default Log;
