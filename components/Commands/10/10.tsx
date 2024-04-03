import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../../../pages/_app";
import { ResetCommandType } from "../8/8";
import { Uint8ArrayToString } from "../../../servo-engine/utils";
import { Command10CodeExample } from "./code-samples/code-sample";

export const Command10 = (props: ResetCommandType) => {
    const globalContext = useContext(GlobalContext);
    const command10CodeExample = useRef(new Command10CodeExample());

    const [elapsedTime_us, setElapsedTime_us] = useState<BigInt>(BigInt(0));

    function updateCodeExamples() {
        globalContext.codeExample.setPythonCode(
            command10CodeExample.current.getNewCommand10PythonCode(
                globalContext.currentAxisCode.axisCode,
                props.currentCommandDictionary.CommandEnum,
                elapsedTime_us
            )
        );

        globalContext.codeExample.setWebCode(
            command10CodeExample.current.getNewCommand10WebCode(
                globalContext.currentAxisCode.axisCode,
                props.currentCommandDictionary.CommandEnum,
                elapsedTime_us
            )
        );

        globalContext.codeExample.setClangCode(
            command10CodeExample.current.getNewCommand10CCode(
                globalContext.currentAxisCode.axisCode,
                props.currentCommandDictionary.CommandEnum,
                elapsedTime_us
            )
        );
    }

    useEffect(() => {
        //on mount, run this effect
        updateCodeExamples();

        const intervalHandle = setInterval(() => {
            //run this every 1s to update the code examples with the elapsed time from reset
            const elapsedTimeFromReset_ms =
                Date.now() - props.master_time_start;
            const elapsedTimeFromReset_us = BigInt(
                elapsedTimeFromReset_ms * 1000
            );
            setElapsedTime_us(elapsedTimeFromReset_us);
        }, 1000);

        return () => {
            clearInterval(intervalHandle);
        };
    }, []);

    useEffect(() => {
        //when user changes the alias, run this effect
        updateCodeExamples();
    }, [globalContext.currentAxisCode.axisCode]);

    useEffect(() => {
        //this effect will run when elapsed time changes, default change is every 1s
        updateCodeExamples();
    }, [elapsedTime_us]);

    const sync_time = () => {
        const selectedAxis = props.getAxisSelection();
        if (selectedAxis == "") return;

        const elapsedTimeFromReset_ms = Date.now() - props.master_time_start;
        const elapsedTimeFromReset_us = BigInt(elapsedTimeFromReset_ms * 1000);

        let rawPayload_ArrayBuffer = new ArrayBuffer(8);
        const view = new DataView(rawPayload_ArrayBuffer);
        view.setBigUint64(0, elapsedTimeFromReset_us, true);

        let rawPayload = new Uint8Array(6);
        rawPayload.set([view.getUint8(0)], 0);
        rawPayload.set([view.getUint8(1)], 1);
        rawPayload.set([view.getUint8(2)], 2);
        rawPayload.set([view.getUint8(3)], 3);
        rawPayload.set([view.getUint8(4)], 4);
        rawPayload.set([view.getUint8(5)], 5);

        let textPayload = Uint8ArrayToString(rawPayload);

        const rawData = props.constructCommand(textPayload);
        props.sendDataToSerialPort(rawData);
    };

    return (
        <>
            <div className="w-full text-center mb-5">
                <div className="flex justify-center">
                    <div className="mr-4">{props.children}</div>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={sync_time}
                    >
                        Sync time
                    </button>
                </div>
            </div>
        </>
    );
};
