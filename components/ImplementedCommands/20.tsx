import { ChaptersPropsType } from "./0_1";

export interface Command20PropsType extends ChaptersPropsType {
    MountedByQuickStart?: boolean;
}

export const Command20 = (props: Command20PropsType) => {
    const execute_command = () => {
        const selectedAxis = props.getAxisSelection();
        if (selectedAxis == "") return;

        let rawData: Uint8Array;
        if (props.MountedByQuickStart) {
            rawData = props.constructCommand("", 20, "255");
        } else {
            rawData = props.constructCommand("", 20);
        }

        props.sendDataToSerialPort(rawData);
    };
    return (
        <>
            <div className="w-full text-center mb-5">
                <div className="flex justify-center">
                    {!props.MountedByQuickStart && (
                        <div className="mr-4">{props.children}</div>
                    )}
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={execute_command}
                    >
                        detect devices
                    </button>
                </div>
            </div>
        </>
    );
};
