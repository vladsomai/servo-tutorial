import { addDoc, collection } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseStore } from "../../../../Firebase/initialize";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method?.toUpperCase() != 'POST' &&
    req.headers['content-type'] == 'application/json') {
    res.status(500).send('Only POST method is supported.')
    return;
  }

  try {
    const docRef = await addDoc(collection(firebaseStore, "feedbacks"), {
      email: req.body.email,
      message: req.body.message,

    });
    console.log("Feedback written with ID: ", docRef.id);
    res.status(200).send(JSON.stringify({ result: "Feedback message sent.", attachmentID: docRef.id }))
    return

  } catch (e) {
    console.error("Error adding feedback: ", e);
    res
      .status(500)
      .send(
        "We could not send your feedback, you must contact the vendor directly."
      );
    return
  }
}
