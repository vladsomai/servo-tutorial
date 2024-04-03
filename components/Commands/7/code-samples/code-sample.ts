import { GenericCodeExample } from "../../../../servo-engine/code-example-utils/code-utils"
import { changeHallSensorDataTypePythonCode } from "../../../../servo-engine/code-example-utils/python-code-utils";
import { changeHallSensorDataTypeWebCode } from "../../../../servo-engine/code-example-utils/web-code-utils";
import { DataToCapture } from "../7";
import { pythonCode } from "./python-code-sample";
import { webCode } from "./web-code-sample";
import { cCode } from "./c-code-sample";
import { changeHallSensorDataTypeClangCode } from "../../../../servo-engine/code-example-utils/c-code-utils";

export class Command7CodeExample extends GenericCodeExample {

    getNewCommand7PythonCode(alias: number, command: number, dataToCapture: DataToCapture): string {
        let alteredPyCode = this._getNewPythonCode(alias, command, pythonCode)

        alteredPyCode = changeHallSensorDataTypePythonCode(
            dataToCapture,
            alteredPyCode
        );

        return alteredPyCode
    }

    getNewCommand7WebCode(alias: number, command: number, dataToCapture: DataToCapture): string {
        let alteredWebCode = this._getNewWebCode(alias, command, webCode)

        alteredWebCode = changeHallSensorDataTypeWebCode(
            dataToCapture,
            alteredWebCode
        );

        return alteredWebCode
    }

    getNewCommand7CCode(alias: number, command: number, dataToCapture: DataToCapture): string {
        let alteredCCode = this._getNewCCode(alias, command, cCode)

        alteredCCode = changeHallSensorDataTypeClangCode(
            dataToCapture,
            alteredCCode
        );


        return alteredCCode
    }
}


