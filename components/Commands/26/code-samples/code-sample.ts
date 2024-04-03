import { GenericCodeExample } from "../../../../servo-engine/code-example-utils/code-utils"
import { changeTimePythonCode, changeVelocityPythonCode } from "../../../../servo-engine/code-example-utils/python-code-utils";
import { changeTimeWebCode, changeVelocityWebCode } from "../../../../servo-engine/code-example-utils/web-code-utils";
import { changeTimeClangCode, changeVelocityClangCode } from "../../../../servo-engine/code-example-utils/c-code-utils";
import { pythonCode } from "./python-code-sample";
import { webCode } from "./web-code-sample";
import { cCode } from "./c-code-sample";

export class Command26CodeExample extends GenericCodeExample {

    getNewCommand26PythonCode(alias: number, command: number, velocity: number, timeValue: number): string {
        let alteredPyCode = this._getNewPythonCode(alias, command, pythonCode)

        alteredPyCode = changeVelocityPythonCode(
            velocity,
            alteredPyCode
        );

        alteredPyCode = changeTimePythonCode(timeValue, alteredPyCode);

        return alteredPyCode
    }

    getNewCommand26WebCode(alias: number, command: number, velocity: number, timeValue: number): string {
        let alteredWebCode = this._getNewWebCode(alias, command, webCode)

        alteredWebCode = changeVelocityWebCode(
            velocity,
            alteredWebCode
        );

        alteredWebCode = changeTimeWebCode(timeValue, alteredWebCode);

        return alteredWebCode
    }

    getNewCommand26CCode(alias: number, command: number, velocity: number, timeValue: number): string {
        let alteredCCode = this._getNewCCode(alias, command, cCode)

        alteredCCode = changeVelocityClangCode(
            velocity,
            alteredCCode
        );

        alteredCCode = changeTimeClangCode(timeValue, alteredCCode);

        return alteredCCode
    }
}


