import { ref, uploadBytes } from "firebase/storage";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { firebaseFileStorage } from "../../../../Firebase/initialize";
import formidable from 'formidable';
import JSZip from "jszip";

export const config = {
  api: {
    bodyParser: false
  }
}

const env = process.env.NODE_ENV


//production
let receivedFiles = process.env.RECEIVED_FILES_FOLDER_PATH
let folderSeparator = '/'

if (env == 'development') {
  console.log('running in dev mode')
  receivedFiles = path.join(process.cwd(), "receivedFiles");
  folderSeparator = '\\'
}


async function uploadAttachment(file: Buffer, filename: string) {
  const storageRef = ref(firebaseFileStorage, filename)
  await uploadBytes(storageRef, file)
}

const form = formidable({
  uploadDir: receivedFiles, keepExtensions: true, multiples: true, //filename: (name, ext, part, form) => name + ext
});

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
  console.log("path to received files:", receivedFiles)
  try {
    const { fields, files } = await parseRequest(req)

    const zip = new JSZip();//create new zip object

    for (let _file_ in files) {
      const file = files[_file_]

      //read attachment bytes
      //@ts-ignore
      const fileBuffer = fs.readFileSync(file.filepath, {
        flag: "r",
      });

      //add each attachment bytes to a zip 
      //@ts-ignore
      zip.file(file.filepath.slice(file.filepath.lastIndexOf(folderSeparator)), fileBuffer)

      //delete all received attachments files
      //@ts-ignore
      fs.unlink(file.filepath, (err) => {
        if (err) {
          console.log(err)
        }
      })
    }

    //create the zip name and path
    const zipPath = receivedFiles + folderSeparator + fields.attachmentID + '.zip'

    //generate zip using the attachments added above
    zip.generateNodeStream({ type: "nodebuffer", streamFiles: true })
      .pipe(fs.createWriteStream(zipPath))//writes the actual zip bytes on disk
      .on('finish', async () => {//when the zip finished being written on disk 

        //read zip bytes
        //@ts-ignore
        const fileBuffer = fs.readFileSync(zipPath, {
          flag: "r",
        });

        //upload zip bytes to firebase storage cloud with the name as unique id generated by firestore 
        await uploadAttachment(fileBuffer, zipPath.slice(zipPath.lastIndexOf(folderSeparator)))

        //delete zip from server
        //@ts-ignore
        fs.unlink(zipPath, (err) => {
          if (err) {
            console.log(err)
          }
        })
      })
  }

  catch (err) {
    res.status(500).send(String(err))
    return
  }
  res.status(200).send("Feedback attachment sent.")
  return

}