import Layout from "../components/layout";
import { ReactElement, useContext, useEffect, useState } from "react";
import { GlobalContext, NextPageWithLayout } from "./_app";
import { useTransition, animated } from "@react-spring/web";
import { collection, addDoc } from "firebase/firestore";
import { firebaseStore } from "../Firebase/initialize";
import { firebaseApp } from "../Firebase/initialize";

const Test: NextPageWithLayout = () => {
  const [data, setData] = useState<number[]>([]);
  const value = useContext(GlobalContext);

  const transitions = useTransition(data, {
    from: { y: -100, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: 100, opacity: 0 },
  });

  async function addMessage(e: any) {
    e.preventDefault();
    const email = e.target["email"].value;
    const message = e.target["message"].value;

    const response = await fetch("/api/firebase/feedback/send", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, message: message }), // body data type must match "Content-Type" header
    });

    console.log(await response.text());
  }

  useEffect(() => {}, [data]);

  return (
    <>
      <div className="flex justify-center h-[80%]">
        <form
          onSubmit={addMessage}
          className="flex flex-col justify-around w-[30%] h-[40%] items-center "
        >
          <input
            required
            name="email"
            className="input input-bordered"
            placeholder="Email"
            type="email"
          ></input>
          <textarea
            required
            name="message"
            placeholder="Message"
            className="textarea textarea-bordered textarea-md w-full max-w-xs"
          ></textarea>
          <button type="submit" className="btn btn-primary">
            Send feedback
          </button>
        </form>
      </div>
    </>
  );
};

Test.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Test;
