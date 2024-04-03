import { GenericCodeExample } from "../../../../servo-engine/code-example-utils/code-utils"
import { changeUniqueIdPythonCode } from "../../../../servo-engine/code-example-utils/python-code-utils";
import { pythonCode } from "./python-code-sample";
import { webCode } from "./web-code-sample";
import { cCode } from "./c-code-sample";
import { changeUniqueIdClangCode } from "../../../../servo-engine/code-example-utils/c-code-utils";
import { changeUniqueIdWebCode } from "../../../../servo-engine/code-example-utils/web-code-utils";

export class Command41CodeExample extends GenericCodeExample {
    getNewCommand41PythonCode(alias: number, command: number, unique_id: string): string {
        let alteredPyCode = this._getNewPythonCode(alias, command, pythonCode)

        alteredPyCode = changeUniqueIdPythonCode(
            unique_id,
            alteredPyCode
        );

        return alteredPyCode
    }

    getNewCommand41WebCode(alias: number, command: number, unique_id: string): string {
        let alteredWebCode = this._getNewWebCode(alias, command, webCode)

        alteredWebCode = changeUniqueIdWebCode(
            unique_id,
            alteredWebCode
        );

        return alteredWebCode
    }

    getNewCommand41CCode(alias: number, command: number, unique_id: string): string {
        let alteredCCode = this._getNewCCode(alias, command, cCode)

        alteredCCode = changeUniqueIdClangCode(
            unique_id,
            alteredCCode
        );

        return alteredCCode
    }
}


