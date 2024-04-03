import { GenericCodeExample } from "../../../../servo-engine/code-example-utils/code-utils"
import { changeElapsedTimeSinceResetPythonCode } from "../../../../servo-engine/code-example-utils/python-code-utils";
import { changeElapsedTimeSinceResetWebCode } from "../../../../servo-engine/code-example-utils/web-code-utils";
import { pythonCode } from "./python-code-sample";
import { webCode } from "./web-code-sample";
import { cCode } from "./c-code-sample";
import { changeElapsedTimeSinceResetClangCode } from "../../../../servo-engine/code-example-utils/c-code-utils";

export class Command10CodeExample extends GenericCodeExample {

    getNewCommand10PythonCode(alias: number, command: number, elapsedTime: BigInt): string {
        let alteredPyCode = this._getNewPythonCode(alias, command, pythonCode)

        alteredPyCode = changeElapsedTimeSinceResetPythonCode(
            elapsedTime,
            alteredPyCode
        );

        return alteredPyCode
    }

    getNewCommand10WebCode(alias: number, command: number, elapsedTime: BigInt): string {
        let alteredWebCode = this._getNewWebCode(alias, command, webCode)

        alteredWebCode = changeElapsedTimeSinceResetWebCode(
            elapsedTime,
            alteredWebCode
        );

        return alteredWebCode
    }

    getNewCommand10CCode(alias: number, command: number, elapsedTime: BigInt): string {
        let alteredCCode = this._getNewCCode(alias, command, cCode)

        alteredCCode = changeElapsedTimeSinceResetClangCode(
            elapsedTime,
            alteredCCode
        );


        return alteredCCode
    }
}


