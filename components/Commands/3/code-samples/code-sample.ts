import { changeVelocityClangCode } from "../../../../servo-engine/code-example-utils/c-code-utils";
import { GenericCodeExample } from "../../../../servo-engine/code-example-utils/code-utils"
import { changeVelocityPythonCode } from "../../../../servo-engine/code-example-utils/python-code-utils";
import { changeVelocityWebCode } from "../../../../servo-engine/code-example-utils/web-code-utils";
import { cCode } from "./c-code-sample";
import { pythonCode } from "./python-code-sample";
import { webCode } from "./web-code-sample";

export class Command3CodeExample extends GenericCodeExample {
    
    getNewCommand3PythonCode(alias: number, command: number, velocity: number): string {
        let alteredPyCode = this._getNewPythonCode(alias, command, pythonCode)

        alteredPyCode = changeVelocityPythonCode(
            velocity,
            alteredPyCode
        );

        return alteredPyCode
    }

    getNewCommand3WebCode(alias: number, command: number, velocity: number): string {
        let alteredWebCode = this._getNewWebCode(alias, command, webCode)

        alteredWebCode = changeVelocityWebCode(
            velocity,
            alteredWebCode
        );

        return alteredWebCode
    }

    getNewCommand3CCode(alias: number, command: number, velocity: number): string {
        let alteredCCode = this._getNewCCode(alias, command, cCode)

        alteredCCode = changeVelocityClangCode(
            velocity,
            alteredCCode
        );


        return alteredCCode
    }
}


