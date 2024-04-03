import { GenericCodeExample } from "../../../../servo-engine/code-example-utils/code-utils"
import { changeMotorCurrentPythonCode, changeRegenCurrentPythonCode, changeTimePythonCode, changeVelocityPythonCode } from "../../../../servo-engine/code-example-utils/python-code-utils";
import { changeMotorCurrentWebCode, changeRegenCurrentWebCode, changeTimeWebCode, changeVelocityWebCode } from "../../../../servo-engine/code-example-utils/web-code-utils";
import { pythonCode } from "./python-code-sample";
import { webCode } from "./web-code-sample";
import { cCode } from "./c-code-sample";
import { changeMotorCurrentClangCode, changeRegenCurrentClangCode } from "../../../../servo-engine/code-example-utils/c-code-utils";

export class Command28CodeExample extends GenericCodeExample {

    getNewCommand28PythonCode(alias: number, command: number, maxCurrent: number, regenCurrent: number): string {
        let alteredPyCode = this._getNewPythonCode(alias, command, pythonCode)

        alteredPyCode = changeMotorCurrentPythonCode(
            maxCurrent,
            alteredPyCode
        );

        alteredPyCode = changeRegenCurrentPythonCode(regenCurrent, alteredPyCode);

        return alteredPyCode
    }

    getNewCommand28WebCode(alias: number, command: number, maxCurrent: number, regenCurrent: number): string {
        let alteredWebCode = this._getNewWebCode(alias, command, webCode)

        alteredWebCode = changeMotorCurrentWebCode(
            maxCurrent,
            alteredWebCode
        );

        alteredWebCode = changeRegenCurrentWebCode(regenCurrent, alteredWebCode);

        return alteredWebCode
    }

    getNewCommand28CCode(alias: number, command: number, maxCurrent: number, regenCurrent: number): string {
        let alteredCCode = this._getNewCCode(alias, command, cCode)

        alteredCCode = changeMotorCurrentClangCode(
            maxCurrent,
            alteredCCode
        );

        alteredCCode = changeRegenCurrentClangCode(regenCurrent, alteredCCode);

        return alteredCCode
    }
}


