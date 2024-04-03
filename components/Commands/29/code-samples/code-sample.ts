import { GenericCodeExample } from "../../../../servo-engine/code-example-utils/code-utils"
import { changeCommandLengthPythonCode, changeMovesTypesPythonCode, changeMultiMovesPythonCode } from "../../../../servo-engine/code-example-utils/python-code-utils";
import { changeCommandLengthWebCode, changeMovesTypesWebCode, changeMultiMovesWebCode } from "../../../../servo-engine/code-example-utils/web-code-utils";
import { pythonCode } from "./python-code-sample";
import { webCode } from "./web-code-sample";
import { changeCommandLengthClangCode, changeMovesTypesClangCode, changeMultiMovesClangCode } from "../../../../servo-engine/code-example-utils/c-code-utils";
import { MoveCommand } from "../29";
import { cCode } from "./c-code-sample";

export class Command29CodeExample extends GenericCodeExample {

    getNewCommand29PythonCode(alias: number, command: number, u32BitMovesTypes: number, moveCommands: MoveCommand[]): string {
        let alteredPyCode = this._getNewPythonCode(alias, command, pythonCode)

        //add the length in bytes for the payload,
        alteredPyCode = changeCommandLengthPythonCode(
            5 + moveCommands.length * 8,
            alteredPyCode
        );

        const movesTypes =
            u32BitMovesTypes == 0
                ? ""
                : u32BitMovesTypes.toString(2);

        alteredPyCode = changeMovesTypesPythonCode(movesTypes, alteredPyCode);

        const moveCmds: string[] = moveCommands.map((item) => {
            let moveValue = Number(0).toString(); //use 0 by default when input box is empty

            if (item.MoveValue) {
                //in case MoveValue is defined by the user use that value
                moveValue = item.MoveValue.toString();
            }

            let timeValue = Number(0).toString(); //use 0 by default when input box is empty

            if (item.TimeValue) {
                //in case MoveValue is defined by the user use that value
                timeValue = item.TimeValue.toString();
            }

            return " [" + moveValue + ", " + timeValue + "]";
        });

        const moveCmdsJoined = moveCmds.join(",");
        alteredPyCode = changeMultiMovesPythonCode(
            moveCmdsJoined,
            alteredPyCode
        );

        return alteredPyCode;
    }


    getNewCommand29WebCode(alias: number, command: number, u32BitMovesTypes: number, moveCommands: MoveCommand[]): string {
        let alteredWebCode = this._getNewWebCode(alias, command, webCode)

        //add the length in bytes for the payload,
        alteredWebCode = changeCommandLengthWebCode(
            5 + moveCommands.length * 8,
            alteredWebCode
        );

        const movesTypes =
            u32BitMovesTypes == 0
                ? ""
                : u32BitMovesTypes.toString(2);

        alteredWebCode = changeMovesTypesWebCode(movesTypes, alteredWebCode);

        const moveCmds: string[] = moveCommands.map((item) => {
            let moveValue = Number(0).toString(); //use 0 by default when input box is empty

            if (item.MoveValue) {
                //in case MoveValue is defined by the user use that value
                moveValue = item.MoveValue.toString();
            }

            let timeValue = Number(0).toString(); //use 0 by default when input box is empty

            if (item.TimeValue) {
                //in case MoveValue is defined by the user use that value
                timeValue = item.TimeValue.toString();
            }

            return " [" + moveValue + ", " + timeValue + "]";
        });

        const moveCmdsJoined = moveCmds.join(",");
        alteredWebCode = changeMultiMovesWebCode(
            moveCmdsJoined,
            alteredWebCode
        );

        return alteredWebCode;
    }

    getNewCommand29CCode(alias: number, command: number, u32BitMovesTypes: number, moveCommands: MoveCommand[]): string {
        let alteredClangCode = this._getNewCCode(alias, command, cCode)

        //add the length in bytes for the payload,
        alteredClangCode = changeCommandLengthClangCode(
            5 + moveCommands.length * 8,
            alteredClangCode
        );

        const movesTypes =
            u32BitMovesTypes == 0
                ? ""
                : u32BitMovesTypes.toString(2);

        alteredClangCode = changeMovesTypesClangCode(movesTypes, alteredClangCode);
        const moveCmds: string[] = moveCommands.map((item) => {
            let moveValue = Number(0).toString(); //use 0 by default when input box is empty

            if (item.MoveValue) {
                //in case MoveValue is defined by the user use that value
                moveValue = item.MoveValue.toString();
            }

            let timeValue = Number(0).toString(); //use 0 by default when input box is empty

            if (item.TimeValue) {
                //in case MoveValue is defined by the user use that value
                timeValue = item.TimeValue.toString();
            }

            return " {" + moveValue + ", " + timeValue + "}";
        });

        let moveCmdsJoined = moveCmds.join(",");
        if (moveCmds.length == 0) {
            moveCmdsJoined = "0"
        }
        alteredClangCode = changeMultiMovesClangCode(
            moveCmdsJoined,
            alteredClangCode
        );
        return alteredClangCode;
    }
}


