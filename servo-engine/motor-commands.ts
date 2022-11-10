export type MotorCommandsDictionary = {
    CommandString: string, //Command name
    CommandEnum: number, //Command id
    Description: string,
    Input: string[] | string, //Text for the input to be shown in each command window
    Output: string[] | string, //Text for the output of each command
}
export const CommandsProtocoolChapter = {
    "ReceiveLength": 0,
    "CommandString": "Commands protocol",
    "CommandEnum": 100,
    "Description": "Here you will learn how a raw command that is being sent to the servo motor is built.",
    "Input": "",
    "Output": ""
}