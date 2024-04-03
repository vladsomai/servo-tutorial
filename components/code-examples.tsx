import React, { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../pages/_app";
import Prism from "prismjs";
import "prismjs/plugins/toolbar/prism-toolbar.min.js";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.js";
import "prismjs/components/prism-c.min.js";
import "prismjs/components/prism-python.min.js";
import "prismjs/components/prism-javascript.min.js";

import { languages, SupportedCodeExamples } from "../servo-engine/utils";

interface CodeProps {
    currentCommand: number;
}

export default function Code({ currentCommand }: CodeProps) {
    const globalContext = useContext(GlobalContext);

    const [language, setLanguage] = useState<languages>(
        SupportedCodeExamples.Python.prismLanguage as languages
    );
    const [code, setCode] = useState(SupportedCodeExamples.Python.code);

    useEffect(() => {
        Prism.highlightAll();
    }, []);

    useEffect(() => {
        Prism.highlightAll();
    }, [language, code]);

    function setRenderedCode(languageParam: languages) {
        switch (languageParam) {
            case SupportedCodeExamples.C.prismLanguage:
                setCode(globalContext.codeExample.cCode);
                break;
            case SupportedCodeExamples.Python.prismLanguage:
                setCode(globalContext.codeExample.pythonCode);
                break;
            case SupportedCodeExamples.JavaScript.prismLanguage:
                setCode(globalContext.codeExample.webCode);
                break;
            default:
                setCode("");
                break;
        }
    }

    useEffect(() => {
        setRenderedCode(language);
    }, [
        currentCommand,
        language, //when the language changes we should re-render the new code
        globalContext.codeExample.pythonCode, //when the current python code sample changes, all other code samples should change
    ]);

    const showC = () => {
        setLanguage(SupportedCodeExamples.C.prismLanguage as languages);
    };

    const showPython = () => {
        setLanguage(SupportedCodeExamples.Python.prismLanguage as languages);
    };

    const showJavascript = () => {
        setLanguage(
            SupportedCodeExamples.JavaScript.prismLanguage as languages
        );
    };

    return (
        <div>
            <div className="bg-base-300 mt-10">
                <div className=" relative h-16 w-full rounded-t-box rounded-b-none py-5 bg-slate-700 ">
                    <div className="w-full flex items-end justify-center absolute bottom-0">
                        <div className="w-full flex items-end justify-between">
                            <div className="w-30 flex">
                                <button
                                    className={`ml-5 btn self-end rounded-b-none border-0  tracking-widest z-10 ${
                                        language ===
                                        SupportedCodeExamples.Python
                                            .prismLanguage
                                            ? "bg-[#1e293b] btn-sm"
                                            : "bg-slate-600 btn-xs"
                                    }`}
                                    onClick={showPython}
                                >
                                    Python
                                </button>

                                <button
                                    className={`ml-5 btn self-end rounded-b-none border-0 tracking-widest z-10 ${
                                        language ===
                                        SupportedCodeExamples.C.prismLanguage
                                            ? "bg-[#1e293b] btn-sm"
                                            : "bg-slate-600 btn-xs"
                                    }`}
                                    onClick={showC}
                                >
                                    C
                                </button>
                                <button
                                    className={`ml-5 btn self-end rounded-b-none border-0 tracking-widest z-10 ${
                                        language ===
                                        SupportedCodeExamples.JavaScript
                                            .prismLanguage
                                            ? "bg-[#1e293b] btn-sm"
                                            : "bg-slate-600 btn-xs"
                                    }`}
                                    onClick={showJavascript}
                                >
                                    Web
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="flex justify-center absolute inset-0 top-2">
                        <b>Code examples</b>
                    </p>
                </div>
            </div>
            <div>
                <pre
                    className="h-[72vh] rounded-b-2xl line-numbers"
                    style={{ marginTop: "0", marginBottom: "10px" }}
                >
                    <code
                        className={`language-${language} m-0 p-0`}
                        data-prismjs-copy="Copy"
                        data-prismjs-copy-error="Copy failed, try using CTRL+C."
                        data-prismjs-copy-success="Copied!"
                    >
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
}
