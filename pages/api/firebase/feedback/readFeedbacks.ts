import { doc, getDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseStore } from "../../../../Firebase/initialize";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    const docRef = doc(firebaseStore, "cities", "SF");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  } catch (e) {
    console.error("Error reading: ", e);
    res
      .status(500)
      .send(
        "We could not read feedbacks, you must contact the vendor directly."
      );
  }
  res.status(200).send("Feedbacks ");
}
