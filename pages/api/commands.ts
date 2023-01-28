import type { NextApiRequest, NextApiResponse } from 'next'
import RawMotorCommands from '../../public/motor_commands.json' assert {type: 'json'};
import {
  MotorCommandsDictionary,
} from '../../servo-engine/motor-commands'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<MotorCommandsDictionary[]>
) {
  res.status(200).json(RawMotorCommands)
}
