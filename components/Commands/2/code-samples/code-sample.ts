import { GenericCodeExample } from "../../../../servo-engine/code-example-utils/code-utils"
import { changeDisplacementPythonCode, changeTimePythonCode } from "../../../../servo-engine/code-example-utils/python-code-utils";
import { changeDisplacementWebCode, changeTimeWebCode } from "../../../../servo-engine/code-example-utils/web-code-utils";
import { pythonCode } from "./python-code-sample";
import { webCode } from "./web-code-sample";
import { cCode } from "./c-code-sample";
import { changeDisplacementClangCode, changeTimeClangCode } from "../../../../servo-engine/code-example-utils/c-code-utils";

export class Command2CodeExample extends GenericCodeExample {
    getNewCommand2PythonCode(alias: number, command: number, positionValue: number, timeValue: number): string {
        let alteredPyCode = this._getNewPythonCode(alias, command, pythonCode)

        alteredPyCode = changeDisplacementPythonCode(
            positionValue,
            alteredPyCode
        );

        alteredPyCode = changeTimePythonCode(timeValue, alteredPyCode);

        return alteredPyCode
    }

    getNewCommand2WebCode(alias: number, command: number, positionValue: number, timeValue: number): string {
        let alteredWebCode = this._getNewWebCode(alias, command, webCode)

        alteredWebCode = changeDisplacementWebCode(
            positionValue,
            alteredWebCode
        );

        alteredWebCode = changeTimeWebCode(timeValue, alteredWebCode);

        return alteredWebCode
    }

    getNewCommand2CCode(alias: number, command: number, positionValue: number, timeValue: number): string {
        let alteredCCode = this._getNewCCode(alias, command, cCode)

        alteredCCode = changeDisplacementClangCode(
            positionValue,
            alteredCCode
        );

        alteredCCode = changeTimeClangCode(timeValue, alteredCCode);

        return alteredCCode
    }
}


