import React, { useEffect, useState, useContext } from 'react'
import { GlobalContext } from '../pages/_app'
import Prism from 'prismjs'
import 'prismjs/plugins/toolbar/prism-toolbar.min.js'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min.js'
import 'prismjs/components/prism-c.min.js'
import 'prismjs/components/prism-python.min.js'
import 'prismjs/components/prism-javascript.min.js'
import {
  alterCodeSample,
  languages,
  SupportedCodeExamples,
} from '../servo-engine/utils'
interface CodeProps {
  currentCommand: number
  currentAxis: string
}

export default function Code({ currentCommand, currentAxis }: CodeProps) {
  const value = useContext(GlobalContext)

  const [language, setLanguage] = useState<languages>(
    SupportedCodeExamples.Python.prismLanguage as languages,
  )
  const [code, setCode] = useState(SupportedCodeExamples.Python.code)

  const [current_C_Code, setCurrent_C_Code] = useState(
    SupportedCodeExamples.C.code,
  )
  const [current_Py_Code, setCurrent_Py_Code] = useState(
    SupportedCodeExamples.Python.code,
  )
  const [current_JS_Code, setCurrent_JS_Code] = useState(
    SupportedCodeExamples.JavaScript.code,
  )

  useEffect(() => {
    Prism.highlightAll()
  }, [])

  useEffect(() => {
    Prism.highlightAll()
  }, [language, code])

  useEffect(() => {
    const alteredCode = alterCodeSample(
      currentCommand,
      currentAxis,
      language,
      value.codeExamplePayload.Bytes,
    )
    switch (language) {
      case SupportedCodeExamples.C.prismLanguage:
        setCurrent_C_Code(alteredCode)
        setCode(alteredCode)
        break
      case SupportedCodeExamples.Python.prismLanguage:
        setCurrent_Py_Code(alteredCode)
        setCode(alteredCode)
        break
      case SupportedCodeExamples.JavaScript.prismLanguage:
        setCurrent_JS_Code(alteredCode)
        setCode(alteredCode)
        break
    }
  }, [currentAxis, currentCommand, language, value.codeExamplePayload.Bytes])

  const showC = () => {
    setLanguage(SupportedCodeExamples.C.prismLanguage as languages)
    setCode(current_C_Code)
  }

  const showPython = () => {
    setLanguage(SupportedCodeExamples.Python.prismLanguage as languages)
    setCode(current_Py_Code)
  }

  const showJavascript = () => {
    setLanguage(SupportedCodeExamples.JavaScript.prismLanguage as languages)
    setCode(current_JS_Code)
  }

  if (currentCommand != 23)
    return (
      <div>
        <div className="bg-base-300 mt-10">
          <div className=" relative h-16 w-full rounded-t-box rounded-b-none py-5 bg-slate-700 ">
            <div className="w-full flex items-end justify-center absolute bottom-0">
              <div className="w-full flex items-end justify-between">
                <div className="w-30 flex">
                  <button
                    className={`ml-5 btn self-end rounded-b-none border-0  tracking-widest z-10 ${
                      language === SupportedCodeExamples.Python.prismLanguage
                        ? 'bg-[#1e293b] btn-sm'
                        : 'bg-slate-600 btn-xs'
                    }`}
                    onClick={showPython}
                  >
                    Python
                  </button>
                  <button
                    className={`ml-5 btn self-end rounded-b-none border-0 tracking-widest z-10 ${
                      language === SupportedCodeExamples.C.prismLanguage
                        ? 'bg-[#1e293b] btn-sm'
                        : 'bg-slate-600 btn-xs'
                    }`}
                    onClick={showC}
                  >
                    C
                  </button>
                  <button
                    className={`ml-5 btn self-end rounded-b-none border-0 tracking-widest z-10 ${
                      language ===
                      SupportedCodeExamples.JavaScript.prismLanguage
                        ? 'bg-[#1e293b] btn-sm'
                        : 'bg-slate-600 btn-xs'
                    }`}
                    onClick={showJavascript}
                  >
                    JavaScript
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
            style={{ marginTop: '0', marginBottom: '10px' }}
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
    )
}
