import { GenericCodeExample } from "../../../../servo-engine/code-example-utils/code-utils"
import { changePingTextPythonCode } from "../../../../servo-engine/code-example-utils/python-code-utils";
import { changePingTextWebCode } from "../../../../servo-engine/code-example-utils/web-code-utils";
import { pythonCode } from "./python-code-sample";
import { webCode } from "./web-code-sample";
import { cCode } from "./c-code-sample";
import { changePingTextClangCode } from "../../../../servo-engine/code-example-utils/c-code-utils";

export class Command31CodeExample extends GenericCodeExample {
    getNewCommand31PythonCode(alias: number, command: number, ping_text: string): string {
        let alteredPyCode = this._getNewPythonCode(alias, command, pythonCode)

        alteredPyCode = changePingTextPythonCode(
            ping_text,
            alteredPyCode
        );

        return alteredPyCode
    }

    getNewCommand31WebCode(alias: number, command: number, ping_text: string): string {
        let alteredWebCode = this._getNewWebCode(alias, command, webCode)

        alteredWebCode = changePingTextWebCode(
            ping_text,
            alteredWebCode
        );

        return alteredWebCode
    }

    getNewCommand31CCode(alias: number, command: number, ping_text: string): string {
        let alteredCCode = this._getNewCCode(alias, command, cCode)

        alteredCCode = changePingTextClangCode(
            ping_text,
            alteredCCode
        );

        return alteredCCode
    }
}


