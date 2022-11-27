export type MotorCommandsDictionary = {
    CommandString: string, //Command name
    CommandEnum: number, //Command id
    Description: string,
    Input: InputOutputObjects[] | string, //Text for the input to be shown in each command window
    Output: InputOutputObjects[] | string, //Text for the output of each command
}

export interface InputOutputObjects {
    Description: string
    TooltipDisplayFormat?: string
}

export const CommandsProtocoolChapter = {
    "CommandString": "Commands protocol",
    "CommandEnum": 100,
    "Description": "Here you will learn how a raw command that is being sent to the servo motor is built.",
    "Input": "",
    "Output": ""
}