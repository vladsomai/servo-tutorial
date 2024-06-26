import {
    MutableRefObject,
    ReactElement,
    useEffect,
    useRef,
    useState,
} from "react";
import Link from "next/link";
import { MotorCommandsDictionary } from "../servo-engine/motor-commands";
import Image from "next/image";
import { animated, useSpring } from "react-spring";

export type ChaptersProps = {
    MotorCommands: MutableRefObject<MotorCommandsDictionary[]>;
    currentCommandDictionary: MotorCommandsDictionary;
    setCurrentCommandDictionary: Function;
    children?: ReactElement;
};

const Chapters = (props: ChaptersProps) => {
    const [displayedCommands, setDisplayedCommands] = useState<
        MotorCommandsDictionary[]
    >(props.MotorCommands.current);
    const searchInputBox = useRef<HTMLInputElement | null>(null);

    const handleSearch = () => {
        const searchInput = searchInputBox.current?.value as string;

        let arr: MotorCommandsDictionary[] = [];
        for (const cmd of props.MotorCommands.current) {
            if (
                cmd.CommandString.toLowerCase().includes(
                    searchInput.toLowerCase()
                )
            ) {
                arr.push(cmd);
            }
        }
        setDisplayedCommands(arr);
    };

    useEffect(() => {
        setDisplayedCommands(props.MotorCommands.current);
    }, [props.MotorCommands]);

    const [styleSpring] = useSpring(
        () => ({
            from: { opacity: 0 },
            to: { opacity: 1 },
            config: { duration: 1000 },
        }),
        []
    );

    return (
        <>
            <label
                htmlFor="my-drawer-2"
                aria-label="close sidebar"
                className="drawer-overlay"
            ></label>
            <animated.div
                className="h-full bg-base-300 rounded-box mr-2 px-1 flex-col items-center flex"
                style={styleSpring}
            >
                <Link href="/">
                    <Image
                        className="w-[165px] h-auto mt-4"
                        loading="eager"
                        src={"/Logo.png"}
                        sizes="100vw"
                        width={0}
                        height={0}
                        alt="logo"
                    ></Image>
                </Link>
                <input
                    ref={searchInputBox}
                    type="text"
                    placeholder="Search"
                    className="input input-bordered input-sm my-3 mx-auto"
                    onChange={handleSearch}
                />
                <div className="flex flex-col w-full border-opacity-50 overflow-auto">
                    <div className="flex flex-col items-center">
                        {displayedCommands.map((cmd) => {
                            return (
                                <Link
                                    key={cmd.CommandEnum}
                                    href={`/docs/${cmd.CommandEnum}`}
                                    className={`btn btn-xs mb-2 w-full rounded-sm ${
                                        props.currentCommandDictionary
                                            .CommandEnum === cmd.CommandEnum
                                            ? " btn-outline btn-primary border-0 bg-slate-700"
                                            : " btn-ghost "
                                    } `}
                                    onClick={() => {
                                        props.setCurrentCommandDictionary(cmd);
                                    }}
                                >
                                    {cmd.CommandString}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </animated.div>
        </>
    );
};
export default Chapters;
