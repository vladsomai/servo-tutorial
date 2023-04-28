import { ChaptersPropsType } from "./0_1";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../pages/_app";

export const Command33 = (props: ChaptersPropsType) => {
    const value = useContext(GlobalContext);

    useEffect(
        (setbytes = value.codeExamplePayload.setBytes) => {
            setbytes("");
            return () => setbytes();
        },
        [value.codeExamplePayload.setBytes]
    );

    const execute_command = () => {
        const selectedAxis = props.getAxisSelection();
        if (selectedAxis == "") return;

        const rawData = props.constructCommand(selectedAxis, "");
        props.sendDataToSerialPort(rawData);
    };

    return (
        <>
            <div className="w-full text-center mb-5">
                <div className="flex justify-center">
                    <div className="mr-4">{props.children}</div>
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
