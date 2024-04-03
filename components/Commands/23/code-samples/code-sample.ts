import { GenericCodeExample } from "../../../../servo-engine/code-example-utils/code-utils"
import { pythonCode } from "./python-code-sample";
import { webCode } from "./web-code-sample";

export class Command23CodeExample extends GenericCodeExample {

    getNewCommand23PythonCode(): string {
        return pythonCode
    }

    getNewCommand23WebCode(): string {
        return webCode
    }

    getNewCommand23CCode(): string {
        // return this._getNewCCode(255, 23, "")
        return "//Not implemented for command 23"
    }
}


