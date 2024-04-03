import { GenericCodeExample } from "../../../../servo-engine/code-example-utils/code-utils"
import { changeAccelerationPythonCode, changeTimePythonCode } from "../../../../servo-engine/code-example-utils/python-code-utils";
import { changeAccelerationWebCode, changeTimeWebCode } from "../../../../servo-engine/code-example-utils/web-code-utils";
import { pythonCode } from "./python-code-sample";
import { webCode } from "./web-code-sample";
import { cCode } from "./c-code-sample";
import { changeAccelerationClangCode, changeTimeClangCode } from "../../../../servo-engine/code-example-utils/c-code-utils";

export class Command19CodeExample extends GenericCodeExample {

    getNewCommand19PythonCode(alias: number, command: number, acceleration: number, timeValue: number): string {
        let alteredPyCode = this._getNewPythonCode(alias, command, pythonCode)

        alteredPyCode = changeAccelerationPythonCode(
            acceleration,
            alteredPyCode
        );

        alteredPyCode = changeTimePythonCode(timeValue, alteredPyCode);

        return alteredPyCode
    }

    getNewCommand19WebCode(alias: number, command: number, acceleration: number, timeValue: number): string {
        let alteredWebCode = this._getNewWebCode(alias, command, webCode)

        alteredWebCode = changeAccelerationWebCode(
            acceleration,
            alteredWebCode
        );

        alteredWebCode = changeTimeWebCode(timeValue, alteredWebCode);

        return alteredWebCode
    }

    getNewCommand19CCode(alias: number, command: number, acceleration: number, timeValue: number): string {
        let alteredCCode = this._getNewCCode(alias, command, cCode)

        alteredCCode = changeAccelerationClangCode(
            acceleration,
            alteredCCode
        );

        alteredCCode = changeTimeClangCode(timeValue, alteredCCode);

        return alteredCCode
    }
}


