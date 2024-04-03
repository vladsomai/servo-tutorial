import { changeAccelerationClangCode, changeVelocityClangCode } from "../../../../servo-engine/code-example-utils/c-code-utils";
import { GenericCodeExample } from "../../../../servo-engine/code-example-utils/code-utils"
import { changeAccelerationPythonCode } from "../../../../servo-engine/code-example-utils/python-code-utils";
import { changeAccelerationWebCode } from "../../../../servo-engine/code-example-utils/web-code-utils";
import { pythonCode } from "../code-samples/python-code-sample";
import { webCode } from "../code-samples/web-code-sample";
import { cCode } from "./c-code-sample";

export class Command5CodeExample extends GenericCodeExample {

    getNewCommand5PythonCode(alias: number, command: number, acceleration: number): string {
        let alteredPyCode = this._getNewPythonCode(alias, command, pythonCode)

        alteredPyCode = changeAccelerationPythonCode(
            acceleration,
            alteredPyCode
        );

        return alteredPyCode
    }

    getNewCommand5WebCode(alias: number, command: number, acceleration: number): string {
        let alteredWebCode = this._getNewWebCode(alias, command, webCode)

        alteredWebCode = changeAccelerationWebCode(
            acceleration,
            alteredWebCode
        );

        return alteredWebCode
    }

    getNewCommand5CCode(alias: number, command: number, acceleration: number): string {
        let alteredCCode = this._getNewCCode(alias, command, cCode)

        alteredCCode = changeAccelerationClangCode(
            acceleration,
            alteredCCode
        );


        return alteredCCode
    }
}


