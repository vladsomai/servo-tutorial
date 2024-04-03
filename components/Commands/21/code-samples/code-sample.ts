import { GenericCodeExample } from "../../../../servo-engine/code-example-utils/code-utils"
import { changeNewAlisPythonCode, changeUniqueIdPythonCode } from "../../../../servo-engine/code-example-utils/python-code-utils";
import { changeNewAlisWebCode, changeUniqueIdWebCode } from "../../../../servo-engine/code-example-utils/web-code-utils";
import { pythonCode } from "./python-code-sample";
import { webCode } from "./web-code-sample";
import { cCode } from "./c-code-sample";
import { changeNewAlisClangCode, changeUniqueIdClangCode } from "../../../../servo-engine/code-example-utils/c-code-utils";

export class Command21CodeExample extends GenericCodeExample {

    getNewCommand21PythonCode(alias: number, command: number, uniqueId: string, newAlias: number): string {
        let alteredPyCode = this._getNewPythonCode(alias, command, pythonCode)

        alteredPyCode = changeUniqueIdPythonCode(uniqueId, alteredPyCode)
        alteredPyCode = changeNewAlisPythonCode(newAlias, alteredPyCode)

        return alteredPyCode
    }

    getNewCommand21WebCode(alias: number, command: number, uniqueId: string, newAlias: number): string {
        let alteredWebCode = this._getNewWebCode(alias, command, webCode)

        alteredWebCode = changeUniqueIdWebCode(uniqueId, alteredWebCode)
        alteredWebCode = changeNewAlisWebCode(newAlias, alteredWebCode)

        return alteredWebCode
    }

    getNewCommand21CCode(alias: number, command: number, uniqueId: string, newAlias: number): string {
        let alteredCCode = this._getNewCCode(alias, command, cCode)

        alteredCCode = changeUniqueIdClangCode(uniqueId, alteredCCode)
        alteredCCode = changeNewAlisClangCode(newAlias, alteredCCode)

        return alteredCCode
    }
}


