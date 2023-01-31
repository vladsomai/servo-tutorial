import { addDoc, collection } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseStore } from "../../../../Firebase/initialize";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body.email);
  console.log(req.body.message);
  try {
    const docRef = await addDoc(collection(firebaseStore, "feedbacks"), {
      email: req.body.email,
      message: req.body.message,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
    res
      .status(500)
      .send(
        "We could not send your feedback, you must contact the vendor directly."
      );
  }
  res.status(200).send("Thank you for your feedback!");
}
