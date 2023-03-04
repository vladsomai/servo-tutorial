export type MotorCommandsDictionary = {
    CommandString: string, //Command name
    CommandEnum: number, //Command id
    Description: string,
    Input: InputOutputObjects[] | string, //Text for the input to be shown in each command window
    Output: InputOutputObjects[] | string, //Text for the output of each command
}

export type ErrorCodes = {
    ErrorCode: number,
    Description: string
}

export interface InputOutputObjects {
    Description: string
    TooltipDisplayFormat?: string
}

export const NonCommands = new Map(
    [["Commands protocol", 1001], ["Tutorial", 1002]]);

export const CommandsProtocolChapter = {
    "CommandString": "Commands protocol",
    "CommandEnum": NonCommands.get("Commands protocol"),
    "Description": "",
    "Input": "",
    "Output": ""
}

export const Tutorial = {
    "CommandString": "Tutorial",
    "CommandEnum": NonCommands.get("Tutorial"),
    "Description": "",
    "Input": "",
    "Output": ""
}