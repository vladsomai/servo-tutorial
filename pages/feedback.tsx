import Layout from "../components/layout";
import {
    ReactElement,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { GlobalContext, NextPageWithLayout } from "./_app";
import Image from "next/image";
import BoyImg from "../public/feedback_left_boy.png";
import GirlImg from "../public/feedback_right_girl.png";
import FeedbackSent from "../public/feedback_sent.svg";
import FeedbackError from "../public/feedback_error.svg";
import JSZip from "jszip";
import { firebaseFileStorage, firebaseStore } from "../Firebase/initialize";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import Head from "next/head";
import { a, animated, useSpring, useTrail } from "@react-spring/web";
import React from "react";
import LoadingScreen from "../components/loading";

export const feedbackSuccess = (
    <>
        <div className="w-full h-full flex flex-col items-center max-w-lg">
            <p>
                We constantly work on improving our service. In case your
                feedback refers to an issue, we will do our best to solve it as
                soon as possible.{" "}
            </p>
            <Image
                quality={100}
                className="mt-10"
                width={200}
                height={200}
                src={FeedbackSent}
                alt="Feedback sent"
                priority
            ></Image>
        </div>
    </>
);

export const feedbackError = (
    <>
        <div className="w-full h-full flex flex-col items-center max-w-lg">
            <p>
                We are sorry but it seems our servers are currently down. We
                work on solving it.
            </p>
            <Image
                quality={100}
                className=" mt-10"
                width={200}
                height={200}
                src={FeedbackError}
                alt="Feedback error"
                priority
            ></Image>
        </div>
    </>
);

const Trail: React.FC<{ open: boolean; children: ReactElement[] }> = ({
    open,
    children,
}) => {
    const items = React.Children.toArray(children);
    const trail = useTrail(items.length, {
        config: { mass: 5, tension: 2000, friction: 200, duration: 700 },
        opacity: open ? 1 : 0,
        x: open ? 0 : 20,
        height: open ? 70 : 0,
        from: { opacity: 0, x: 20, height: 0 },
    });
    return (
        <div className="text-center 2xl:mt-[1%]">
            {trail.map(({ height, ...style }, index) => (
                <a.div key={index} style={style}>
                    <a.div style={{ height }}>{items[index]}</a.div>
                </a.div>
            ))}
        </div>
    );
};

const Feedback: NextPageWithLayout = () => {
    const attachmentRef = useRef<HTMLInputElement | null>(null);
    const ratio = 1.382;

    const value = useContext(GlobalContext);
    const modalElem = useRef<HTMLElement | null>(null);

    useEffect(() => {
        modalElem.current = document.getElementById("my-modal-4");
    }, []);

    const [waitingFeedbackReply, setWaitingFbReply] = useState(false);
    const [imgHeight, setImgHeight] = useState(712);
    const [imgWidth, setImgWidth] = useState(712 * ratio);
    const [showImage, setShowImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const picturesNumber = useRef(0);

    const maxCharactersFeedbackInput = 10000; //do not allow the feedback to get higher than 10k chars
    const [feebackTextInputLeft, setFeebackTextInputLeft] = useState(
        maxCharactersFeedbackInput
    );
    const [feebackTextInput, setFeebackTextInput] = useState("");

    function handleResize() {
        setImgHeight(window.innerHeight / 2);
        setImgWidth((window.innerHeight * ratio) / 2);
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        setImgHeight(window.innerHeight / 2);
        setImgWidth((window.innerHeight * ratio) / 2);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    async function sendFeedback(e: any) {
        e.preventDefault();
        if (attachmentRef && attachmentRef.current == null) return;

        setWaitingFbReply(true);

        const attachedFiles = attachmentRef.current?.files;

        //#region feedback message
        const email = e.target["email"].value;
        const message = e.target["message"].value;

        const currentDate = new Date();
        try {
            //send email and message
            const docRef = await addDoc(
                collection(firebaseStore, "feedbacks"),
                {
                    email: email,
                    message: message,
                    date: currentDate,
                }
            );

            //send attachments if any
            if (attachedFiles != null && attachedFiles.length != 0) {
                const zip = new JSZip(); //create new zip object

                for (let i = 0; i < attachedFiles.length; i++) {
                    //add each attachment bytes to a zip
                    zip.file(attachedFiles[i].name, attachedFiles[i]);
                }

                const zipBlob = await zip.generateAsync({ type: "blob" });
                const storageRef = ref(firebaseFileStorage, docRef.id + ".zip");
                await uploadBytes(storageRef, zipBlob);
            }

            value.modal.setTitle("Feedback sent successfully!");
            value.modal.setDescription(feedbackSuccess);
            modalElem.current?.click();
        } catch (err) {
            value.modal.setTitle("Feedback could not be sent!");
            value.modal.setDescription(feedbackError);
            modalElem.current?.click();

            console.log(err);
        }

        setFeebackTextInput("");
        e.target.reset();
        setWaitingFbReply(false);
    }

    const [styleSpring] = useSpring(
        () => ({
            from: { opacity: 0 },
            to: { opacity: 1 },
            config: { duration: 1000 },
        }),
        [loading]
    );

    if (loading) {
        return (
            <>
                <Head>
                    <title>Loading...</title>
                    <meta
                        content="Feedback page"
                        name="Gearotons motor documentation"
                    />
                </Head>
                <LoadingScreen />

                {/* trigger the pictures to be downloaded but set them hidden, show loading until pictures are loaded by the browser */}
                <div className="hidden">
                    <Image
                        onLoadingComplete={() => {
                            picturesNumber.current += 1;
                            if (picturesNumber.current == 2) {
                                setLoading(false);
                                setShowImage(true);
                            }
                        }}
                        quality={100}
                        className=""
                        width={imgWidth}
                        height={imgHeight}
                        src={BoyImg}
                        alt="boy illustration"
                        priority
                    ></Image>
                    <Image
                        onLoadingComplete={() => {
                            picturesNumber.current += 1;
                            if (picturesNumber.current == 2) {
                                setLoading(false);
                                setShowImage(true);
                            }
                        }}
                        quality={100}
                        className=""
                        width={imgWidth}
                        height={imgHeight}
                        src={GirlImg}
                        alt="girl illustration"
                        priority
                    ></Image>
                    <Image
                        quality={100}
                        className=" mt-10"
                        width={200}
                        height={200}
                        src={FeedbackSent}
                        alt="Feedback sent"
                        priority
                    ></Image>
                    <Image
                        quality={100}
                        className=" mt-10"
                        width={200}
                        height={200}
                        src={FeedbackError}
                        alt="Feedback error"
                        priority
                    ></Image>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Feedback | Gearotons</title>
                <meta content="Feedback page | Gearotons" name="description" />
            </Head>

            <animated.div
                className="flex flex-col items-center justify-start h-screen"
                style={styleSpring}
            >
                {showImage && (
                    <div className="hidden md:flex fixed bottom-[20px] -z-10">
                        <Image
                            className={`w-[50%] max-w-[712px] h-auto`}
                            loading="eager"
                            width={0}
                            height={0}
                            sizes="100vw"
                            src={BoyImg}
                            alt="boy illustration"
                            priority
                        ></Image>
                        <Image
                            className="w-[50%] max-w-[712px] h-auto"
                            loading="eager"
                            width={0}
                            height={0}
                            sizes="100vw"
                            src={GirlImg}
                            alt="girl illustration"
                            priority
                        ></Image>
                    </div>
                )}

                <div className=" mt-10 w-full text-center">
                    <p className="feedbackTextColor text-center text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl">
                        We care.
                    </p>
                    <p className="feedbackTextColor text-center text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl">
                        That&apos;s why we need your feedback.
                    </p>
                </div>

                <form
                    onSubmit={sendFeedback}
                    className="flex flex-col mx-10 mt-10"
                >
                    <input
                        required
                        name="email"
                        className="input input-sm 2xl:input-lg input-bordered w-full max-w-sm mt-5"
                        placeholder="Your email"
                        type="email"
                        autoComplete="email"
                    ></input>
                    <textarea
                        required
                        name="message"
                        placeholder="What should we change?"
                        className="textarea textarea-bordered w-full max-w-sm textarea-xs 2xl:textarea-lg mt-5 h-[80px] md:h-[120px] resize-none"
                        value={feebackTextInput}
                        maxLength={maxCharactersFeedbackInput}
                        onChange={(event) => {
                            //assure the length cannot get larger than max
                            const inputWritten = event.target.value.slice(
                                0,
                                maxCharactersFeedbackInput
                            );

                            setFeebackTextInput(inputWritten);
                            setFeebackTextInputLeft(
                                maxCharactersFeedbackInput - inputWritten.length
                            );
                        }}
                    ></textarea>
                    <span className="text-xs text-right mt-1">
                        Characters left {feebackTextInputLeft}/
                        {maxCharactersFeedbackInput}
                    </span>
                    <label className="w-full max-w-sm cursor-pointer text-xs 2xl:text-lg mt-3 text-justify">
                        Images or documents help us diagnose issues faster,
                        attach anything that can give us more insight.
                        <input
                            ref={attachmentRef}
                            multiple
                            className="block w-full text-sm rounded-lg border border-neutral cursor-pointer file:btn file:btn-sm file:rounded-none file:mr-5 file:border-0 max-w-sm"
                            type="file"
                            accept=".doc,.docx,.zip,.7z,.pdf,image/*"
                            name="attachment"
                            id="attachment"
                        />
                    </label>
                    <button
                        type="submit"
                        className={`btn btn-primary btn-md max-w-[220px] mt-5 mx-auto ${
                            waitingFeedbackReply ? "loading" : ""
                        }`}
                        disabled={waitingFeedbackReply ? true : false}
                    >
                        {waitingFeedbackReply ? (
                            <span>Sending feedback</span>
                        ) : (
                            <span>Send feedback</span>
                        )}
                    </button>
                </form>
            </animated.div>
        </>
    );
};

Feedback.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default Feedback;
