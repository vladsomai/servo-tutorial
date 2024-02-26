import Image from "next/image";
import CopyClipboardImg from "../public/copy-clipboard.svg";
import CopyClipboardSuccessImg from "../public/copy-clipboard-success.svg";
import { useRef } from "react";
import { tooltipDescriptionType } from "./tooltip-description";
export interface tooltipDescriptionDetDevType extends tooltipDescriptionType {
    UniqueID: string;
}

const TooltipDescriptionDetectDevices = (
    props: tooltipDescriptionDetDevType
) => {
    const iconSize = 25;
    const copyBtnRef = useRef<HTMLButtonElement | null>(null);
    const copyBtnSpanRef = useRef<HTMLSpanElement | null>(null);
    const copyImgRef = useRef<HTMLImageElement | null>(null);
    const isInTimeout = useRef<boolean>(false);

    function handleCopy(e: React.MouseEvent<HTMLButtonElement>) {
        //make sure the user does not span the btn
        if (isInTimeout.current) return;

        isInTimeout.current = true;
        navigator.clipboard.writeText(props.UniqueID);

        if (copyBtnSpanRef.current) {
            //change btn text
            copyBtnSpanRef.current.innerText = "Copied!";
        }

        // if (copyBtnRef.current) {
        //     //change btn color
        //     copyBtnRef.current.classList.remove("btn-ghost");
        //     copyBtnRef.current.classList.add("btn-success");
        // }

        if (copyImgRef.current) {
            //change btn img
            copyImgRef.current.src = "/copy-clipboard-success.svg";
        }

        const timerRollbackCopy = setTimeout(() => {
            if (copyBtnSpanRef.current) {
                copyBtnSpanRef.current.innerText = "Copy";
            }

            // if (copyBtnRef.current) {
            //     //change btn color
            //     copyBtnRef.current.classList.add("btn-ghost");
            //     copyBtnRef.current.classList.remove("btn-success");
            // }

            if (copyImgRef.current)
                copyImgRef.current.src = "/copy-clipboard.svg";

            isInTimeout.current = false;
        }, 2000);
    }

    return (
        <>
            <div className="">
                {props.Description.map((item, index) => (
                    <p key={index}>{item}</p>
                ))}
                <div className="w-full flex justify-center items-center">
                    <button
                        ref={copyBtnRef}
                        className="btn btn-ghost text-center"
                        onClick={handleCopy}
                    >
                        <Image
                            ref={copyImgRef}
                            src={CopyClipboardImg}
                            width={iconSize}
                            height={iconSize}
                            alt="copy to clipboard"
                            priority
                        ></Image>
                        <span className="ml-2" ref={copyBtnSpanRef}>
                            Copy
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
};
export default TooltipDescriptionDetectDevices;
