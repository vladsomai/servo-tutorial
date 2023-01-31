import type { NextApiRequest, NextApiResponse } from "next";
import { readFileSync } from "fs";
import path from "path";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<BinaryData>
) {
  const publicDir = path.join(process.cwd(), "public");

  try {
    const firmwareFile = readFileSync(`${publicDir}/firmware.firmware`, {
      flag: "r",
    });
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="firmware.firmware"'
    );
    res.status(200).send(firmwareFile);
  } catch (err) {
    console.log(err);
  }
}
