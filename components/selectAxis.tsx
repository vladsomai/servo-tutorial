import { useRef } from "react";
import { MotorAxes, MotorAxisType } from "../servo-engine/motor-axes";
import { ErrorTypes } from "../servo-engine/utils";

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

            const selectedAxis = parseInt(selectionRef.current.value);

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
            max={255}
            min={0}
            className="input input-bordered input-sm max-w-xs"
            value={props.axisSelectionValue}
            onChange={onSelectionChange}
            type="number"
        />
    );
};

SelectAxis.displayName = "SelectAxis";
export default SelectAxis;
