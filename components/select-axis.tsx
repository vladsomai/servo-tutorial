import { useRef } from "react";
import { MotorAxes, MotorAxisType } from "../servo-engine/motor-axes";
import {
    Char,
    ErrorTypes,
    convertAxisSelectionValue,
} from "../servo-engine/utils";

export type SelectAxisPropsType = {
    LogAction: (errorType: string, log: string) => void;
    axisSelectionValue: string;
    setAxisSelectionValue: (val: string) => void;
};

const SelectAxis = (props: SelectAxisPropsType) => {
    const selectionRef = useRef<HTMLInputElement | null>(null);

    const onSelectionChange = () => {
        if (selectionRef && selectionRef.current) {
            const selectedAxisStr = selectionRef.current.value;
            if (selectedAxisStr == "") {
                props.setAxisSelectionValue("");
                return;
            }
            const inputBoxText = selectionRef.current.value;

            const selectedAxis = convertAxisSelectionValue(inputBoxText);
            if (isNaN(selectedAxis)) {
                props.setAxisSelectionValue("0");
                props.LogAction(
                    ErrorTypes.ERR1001,
                    "Alias must either be a valid ASCII character or a number ranging from 0 to 253!"
                );
                return;
            }

            if (selectedAxis === 254) {
                props.setAxisSelectionValue("0");
                props.LogAction(
                    ErrorTypes.ERR1001,
                    "Alias 254 is reserved for response messages!"
                );
                return;
            }

            if (selectedAxis < 0) {
                props.setAxisSelectionValue("0");
                props.LogAction(
                    ErrorTypes.ERR1001,
                    "Supported axes range from 0 to 255, where 254 is reserved for response messages!"
                );
            } else if (selectedAxis > 255) {
                props.setAxisSelectionValue("255");
                props.LogAction(
                    ErrorTypes.ERR1001,
                    "Supported axes range from 0 to 255, where 254 is reserved for response messages!"
                );
            } else {
                props.setAxisSelectionValue(selectedAxisStr);
            }
        }
    };

    return (
        <input
            ref={selectionRef}
            placeholder="Alias"
            className="input input-bordered input-sm max-w-xs w-20"
            value={props.axisSelectionValue}
            onChange={onSelectionChange}
            type="text"
            accept=""
        />
    );
};

SelectAxis.displayName = "SelectAxis";
export default SelectAxis;
