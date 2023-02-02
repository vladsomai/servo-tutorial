import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseStore } from "../../../../Firebase/initialize";
import { FeedbackType } from "../../../../Firebase/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    const querySnapshot = await getDocs(collection(firebaseStore, "feedbacks"));
    let data: FeedbackType[] = []
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as FeedbackType)
    });
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
