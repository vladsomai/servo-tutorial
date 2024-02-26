import "../styles/output.css";
import "../styles/prism-vsc-dark.css";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import type { NextPage } from "next";
import { createContext } from "react";
import { firebaseAuth } from "../Firebase/initialize";
import { onAuthStateChanged, User } from "firebase/auth";
import { Device } from "../servo-engine/utils";

export type GlobalStateType = {
    theme: {
        getTheme: string;
        setTheme: Function;
    };

    modal: {
        Title: string;
        setTitle: Function;
        Description: ReactNode;
        setDescription: Function;
    };

    alert: {
        Title: string;
        setTitle: Function;
        Description: ReactNode;
        setDescription: Function;
        Show: boolean;
        setShow: Function;
    };

    codeExample: {
        cCode: string;
        setClangCode: Function;
        webCode: string;
        setWebCode: Function;
        pythonCode: string;
        setPythonCode: Function;
    };

    currentAxisCode: {
        axisCode: number;
        setAxisCode: Function;
    };

    detectedDevices: {
        Devices: Device[];
        setDevices: Function;
    };
};

const DefaultGlobalState: GlobalStateType = {
    theme: {
        getTheme: "",
        setTheme: () => {},
    },

    modal: {
        Title: "",
        setTitle: () => {},
        Description: <></>,
        setDescription: () => {},
    },

    alert: {
        Title: "",
        setTitle: () => {},
        Description: <></>,
        setDescription: () => {},
        Show: false,
        setShow: () => {},
    },

    codeExample: {
        cCode: "",
        setClangCode: () => {},
        webCode: "",
        setWebCode: () => {},
        pythonCode: "",
        setPythonCode: () => {},
    },

    currentAxisCode: {
        axisCode: 255,
        setAxisCode: () => {},
    },

    detectedDevices: {
        Devices: [],
        setDevices: () => {},
    },
};

export const UserContext = createContext<User | null>(null);
export const GlobalContext = createContext(DefaultGlobalState);

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const [useUser, setUser] = useState<User | null>(null);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
    }, []);

    const [_theme, _setTheme] = useState("");
    const [_modalShow, _setModalShow] = useState<"modal-open" | "modal-close">(
        "modal-close"
    );
    const [_modalTitle, _setModalTitle] = useState("");
    const [_modalDescription, _setModalDescription] = useState(<></>);
    const [_alertTitle, _setAlertTitle] = useState("");
    const [_alertDescription, _setAlertDescription] = useState(<></>);
    const [_alertShow, _setAlertShow] = useState(false);
    const [_devices, _setDevices] = useState([]);
    const [_cCode, _setClangCode] = useState("");
    const [_webCode, _setWebCode] = useState("");
    const [_pythonCode, _setPythonCode] = useState("");
    const [_axisCode, _setAxisCode] = useState(255);

    const GlobalState: GlobalStateType = {
        theme: {
            getTheme: _theme,
            setTheme: _setTheme,
        },

        modal: {
            Title: _modalTitle,
            setTitle: _setModalTitle,
            Description: _modalDescription,
            setDescription: _setModalDescription,
        },

        alert: {
            Title: _alertTitle,
            setTitle: _setAlertTitle,
            Description: _alertDescription,
            setDescription: _setAlertDescription,
            Show: _alertShow,
            setShow: _setAlertShow,
        },

        codeExample: {
            cCode: _cCode,
            setClangCode: _setClangCode,
            webCode: _webCode,
            setWebCode: _setWebCode,
            pythonCode: _pythonCode,
            setPythonCode: _setPythonCode,
        },

        currentAxisCode: {
            axisCode: _axisCode,
            setAxisCode: _setAxisCode,
        },

        detectedDevices: {
            Devices: _devices,
            setDevices: _setDevices,
        },
    };

    const getLayout = Component.getLayout ?? ((page) => page);
    const layout = getLayout(<Component {...pageProps} />);
    return (
        <GlobalContext.Provider value={GlobalState}>
            <UserContext.Provider value={useUser}>
                <>{layout}</>
            </UserContext.Provider>
        </GlobalContext.Provider>
    );
}
