import { GenericCodeExample } from "../../../../servo-engine/code-example-utils/code-utils"
import { changeTurnOnOffGatheringPythonCode } from "../../../../servo-engine/code-example-utils/python-code-utils";
import { pythonCode } from "./python-code-sample";
import { webCode } from "./web-code-sample";
import { cCode } from "./c-code-sample";
import { changeTurnOnOffGatheringClangCode } from "../../../../servo-engine/code-example-utils/c-code-utils";
import { changeTurnOnOffGatheringWebCode } from "../../../../servo-engine/code-example-utils/web-code-utils";

export class Command32CodeExample extends GenericCodeExample {
    getNewCommand32PythonCode(alias: number, command: number, turn_on_off_gathering: string): string {
        let alteredPyCode = this._getNewPythonCode(alias, command, pythonCode)

        alteredPyCode = changeTurnOnOffGatheringPythonCode(
            turn_on_off_gathering,
            alteredPyCode
        );

        return alteredPyCode
    }

    getNewCommand32WebCode(alias: number, command: number, turn_on_off_gathering: string): string {
        let alteredWebCode = this._getNewWebCode(alias, command, webCode)

        alteredWebCode = changeTurnOnOffGatheringWebCode(
            turn_on_off_gathering,
            alteredWebCode
        );

        return alteredWebCode
    }

    getNewCommand32CCode(alias: number, command: number, turn_on_off_gathering: string): string {
        let alteredCCode = this._getNewCCode(alias, command, cCode)

        alteredCCode = changeTurnOnOffGatheringClangCode(
            turn_on_off_gathering,
            alteredCCode
        );

        return alteredCCode
    }
}


