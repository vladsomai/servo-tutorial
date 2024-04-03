import { changeAliasPythonCode, changeCommandPythonCode } from "./python-code-utils";
import { changeAliasWebCode, changeCommandWebCode } from "./web-code-utils";
import { genericPythonCode } from "./generic-code-examples/python-code-sample"
import { genericWebCode } from "./generic-code-examples/web-code-sample"
import { genericCCode } from "./generic-code-examples/c-code-sample"
import { changeAliasClangCode, changeCommandClangCode } from "./c-code-utils";

export class GenericCodeExample {
    // The geneirc Code Example only changes the Alias and the Command number of each command,

    getGenericPythonCode(alias: number, command: number) {
        return this._getNewPythonCode(alias, command, genericPythonCode)
    }

    getGenericWebCode(alias: number, command: number) {
        return this._getNewWebCode(alias, command, genericWebCode)
    }

    getGenericCCode(alias: number, command: number) {
        return this._getNewCCode(alias, command, genericCCode)
    }

    _getNewPythonCode(alias: number, command: number, pythonCode: string): string {
        let alteredPyCode = changeAliasPythonCode(
            alias,
            pythonCode
        );

        alteredPyCode = changeCommandPythonCode(command, alteredPyCode)

        return alteredPyCode;

    }

    _getNewWebCode(alias: number, command: number, webCode: string): string {
        let alteredWebCode = changeAliasWebCode(
            alias,
            webCode
        );

        alteredWebCode = changeCommandWebCode(command, alteredWebCode)

        return alteredWebCode;
    }

    _getNewCCode(alias: number, command: number, cCode: string): string {
        let alteredClangCode = changeAliasClangCode(
            alias,
            cCode
        );

        alteredClangCode = changeCommandClangCode(command, alteredClangCode)

        return alteredClangCode;
    }

}
