import { GenericCodeExample } from "../../../../servo-engine/code-example-utils/code-utils"
import { changeLowerRotationLimitPythonCode, changeUpperRotationUpperLimitPythonCode } from "../../../../servo-engine/code-example-utils/python-code-utils";
import { changeLowerRotationLimitWebCode, changeUpperRotationUpperLimitWebCode } from "../../../../servo-engine/code-example-utils/web-code-utils";
import { pythonCode } from "./python-code-sample";
import { webCode } from "./web-code-sample";
import { cCode } from "./c-code-sample";
import { changeLowerRotationLimitClangCode, changeUpperRotationUpperLimitClangCode } from "../../../../servo-engine/code-example-utils/c-code-utils";

export class Command30CodeExample extends GenericCodeExample {
    getNewCommand30PythonCode(alias: number, command: number, lowerValue: number, upperValue: number): string {
        let alteredPyCode = this._getNewPythonCode(alias, command, pythonCode)

        alteredPyCode = changeUpperRotationUpperLimitPythonCode(
            upperValue,
            alteredPyCode
        );

        alteredPyCode = changeLowerRotationLimitPythonCode(
            lowerValue,
            alteredPyCode
        );

        return alteredPyCode
    }

    getNewCommand30WebCode(alias: number, command: number, lowerValue: number, upperValue: number): string {
        let alteredWebCode = this._getNewWebCode(alias, command, webCode)

        alteredWebCode = changeUpperRotationUpperLimitWebCode(
            upperValue,
            alteredWebCode
        );

        alteredWebCode = changeLowerRotationLimitWebCode(
            lowerValue,
            alteredWebCode
        );

        return alteredWebCode
    }

    getNewCommand30CCode(alias: number, command: number, lowerValue: number, upperValue: number): string {
        let alteredCCode = this._getNewCCode(alias, command, cCode)

        alteredCCode = changeUpperRotationUpperLimitClangCode(
            upperValue,
            alteredCCode
        );

        alteredCCode = changeLowerRotationLimitClangCode(
            lowerValue,
            alteredCCode
        );

        return alteredCCode
    }
}


