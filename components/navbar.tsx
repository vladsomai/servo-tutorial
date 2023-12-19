import Link from "next/link";
import Image from "next/image";
import { animated, useSpring } from "react-spring";

const Navbar = () => {
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
            <animated.nav
                className="flex justify-between items-center h-[15%] w-full"
                style={styleSpring}
            >
                <Link href="/">
                    <Image
                        className="w-[165px] h-auto"
                        loading="eager"
                        src={"/Logo.png"}
                        sizes="100vw"
                        width={0}
                        height={0}
                        alt="logo"
                    ></Image>
                </Link>
                <div>
                    <Link
                        href="/docs/1002"
                        className="text-xl btn btn-primary rounded-full"
                    >
                        Quick start
                    </Link>
                    <Link
                        href="/docs/1001"
                        className="text-xl btn btn-primary rounded-full ml-10"
                    >
                        Docs
                    </Link>
                </div>
            </animated.nav>
        </>
    );
};
export default Navbar;
