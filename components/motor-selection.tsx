import Image from "next/image";
import { GlobalContext } from "../pages/_app";
import { SyntheticEvent, useContext, useRef } from "react";
import { MotorType } from "../servo-engine/utils";

const MotorSelection = () => {
    const globalContext = useContext(GlobalContext);
    const dropDownRefContent = useRef<HTMLUListElement>(null);

    function handleMotorChange(e: SyntheticEvent, motorIndex: number) {
        globalContext.motorType.setCurrentMotorType(MotorType.get(motorIndex));
        dropDownRefContent.current?.classList.add("hidden");
    }

    return (
        <div className="dropdown dropdown-bottom w-full flex justify-center items-center text-center">
            <div
                tabIndex={0}
                role="button"
                className="m-1 btn h-[60px] relative"
                onClick={() => {
                    dropDownRefContent.current?.classList.remove("hidden");
                }}
            >
                <Image
                    className="rounded-lg mr-3 m-0"
                    src={"/motor-icon.png"}
                    width={40}
                    height={40}
                    alt="select your motor type"
                    priority
                ></Image>
                {globalContext.motorType.currentMotorType.TypeName}
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box  flex justify-center items-center"
                ref={dropDownRefContent}
            >
                {[...MotorType].map((item, index) => (
                    <button
                        className="py-3 btn-ghost flex rounded-lg justify-center items-center btn w-[230px] h-[100px]"
                        key={index}
                        onClick={(e) => {
                            handleMotorChange(e, index);
                        }}
                    >
                        <Image
                            className="rounded-lg mr-3  m-0"
                            src={item[1].ImageSrc}
                            width={70}
                            height={70}
                            alt={item[1].TypeName}
                            priority
                        ></Image>
                        <p>{item[1].TypeName}</p>
                    </button>
                ))}
            </ul>
        </div>
    );
};
export default MotorSelection;
