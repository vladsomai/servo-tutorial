import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseFileStorage, firebaseStore } from "../../../../Firebase/initialize";
import { FeedbackType } from "../../../../Firebase/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const querySnapshot = await getDocs(collection(firebaseStore, "feedbacks"));
    let data: FeedbackType[] = []

    let count = 0

    await new Promise((resolve: Function, reject) => {
      querySnapshot.forEach(async (doc) => {
        const pathReference = ref(firebaseFileStorage, '\\' + `${doc.id}.zip`);
        const attachmentURL = await getDownloadURL(pathReference).catch(err => err)

        data.push({ id: doc.id, ...doc.data(), downloadURL: attachmentURL } as FeedbackType)

        count += 1

        if (count == querySnapshot.size)
          resolve()
      });
    })

    res.status(200).json(data);


  } catch (e) {
    console.error("Error reading: ", e);
    res
      .status(500)
      .send(
        "We could not read feedbacks, you must contact the vendor directly."
      );
  }

}
