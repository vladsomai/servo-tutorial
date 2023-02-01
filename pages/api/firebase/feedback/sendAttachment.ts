import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import fs from "fs";
import type { NextApiRequest, NextApiResponse, PageConfig } from "next";
import path from "path";
import { firebaseFileStorage, firebaseStore } from "../../../../Firebase/initialize";
import formidable, { errors as formidableErrors } from 'formidable';

export const config = {
  api: {
    bodyParser: false
  }
}
const receivedFiles = path.join(process.cwd(), "receivedFiles");

async function uploadAttachment(file: Buffer, filename: string) {
  const storageRef = ref(firebaseFileStorage, filename)
  await uploadBytes(storageRef, file)
}

let i = 0;
function renameFile(currentName: string, newName: string) {
  const folder = currentName.slice(0, currentName.lastIndexOf('\\'))
  const currentNameWithExtension = currentName.split('.')
  let newFileName = folder + '\\' + newName + '.' + currentNameWithExtension[1]

  if (fs.existsSync(newFileName)) {
    const fileNameAndExtension = newFileName.split('.')
    newFileName = fileNameAndExtension[0] + `_${i}.` + fileNameAndExtension[1];
    i++
  }

  fs.renameSync(currentName, newFileName)
  return newFileName
}

const form = formidable({ uploadDir: receivedFiles, keepExtensions: true });

type ParseRequestType = {
  fields: formidable.Fields,
  files: formidable.Files
}

function parseRequest(req: NextApiRequest): Promise<ParseRequestType> {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(String(err))
      }
      resolve({ fields: fields, files: files })
    });
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != 'POST' &&
    req.headers['content-type'] == 'multipart/form-data') {
    res.status(500).send('Only POST method with content-type: multipart/form-data is supported.')
    return;
  }

  const { fields, files } = await parseRequest(req)

  for (let _file_ in files) {
    const file = files[_file_]

    //@ts-ignore
    const pathToFileToUpload = renameFile(file.filepath, fields.attachmentID)
    const fileBuffer = fs.readFileSync(pathToFileToUpload, {
      flag: "r",
    });
    await uploadAttachment(fileBuffer, pathToFileToUpload.slice(pathToFileToUpload.lastIndexOf('\\')))
    fs.unlink(pathToFileToUpload, (err) => {
      if (err) {
        console.log(err)
      }
    })
  }
  res.status(200).send("Feedback attachment sent.")
  return

}