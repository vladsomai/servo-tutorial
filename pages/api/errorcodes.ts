// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import errorCodes from '../../public/status_error_codes.json' assert {type: 'json'};
import {
    ErrorCodes,
} from '../../servo-engine/motor-commands'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorCodes[]>
) {
  res.status(200).json(errorCodes)
}
