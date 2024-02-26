import { ChaptersPropsType } from '../0_1/0_1'

import { cCode } from "./code-samples/c-code-sample";
import { pythonCode } from "./code-samples/python-code-sample";
import { webCode } from "./code-samples/web-code-sample";
import { GlobalContext } from "../../../pages/_app";
import { useContext, useEffect } from 'react';
import { changeAliasPythonCode } from '../../../servo-engine/code-example-utils/python-code-utils';

export const Command6 = (props: ChaptersPropsType) => {
    const globalContext = useContext(GlobalContext);

    function getNewPythonCode(): string {
        const alteredPyCode = changeAliasPythonCode(
            globalContext.currentAxisCode.axisCode,
            pythonCode
        );

        return alteredPyCode;
    }

    function updateCodeExamples() {
        globalContext.codeExample.setPythonCode(getNewPythonCode());

        //alter the other languages here
        globalContext.codeExample.setClangCode(cCode);
        globalContext.codeExample.setWebCode(webCode);
    }
    
    useEffect(() => {
        //on mount, run this effect
        updateCodeExamples();
    }, []);

    useEffect(() => {
        //when user changes the alias, run this effect
        updateCodeExamples();
    }, [globalContext.currentAxisCode.axisCode]);

  const start_calibration = () => {
    const selectedAxis = props.getAxisSelection()
    if (selectedAxis == '') return

    const rawData = props.constructCommand('')
    props.sendDataToSerialPort(rawData,true,false)
  }
  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="flex justify-center">
          <div className="mr-4">{props.children}</div>
          <button
            className="btn btn-primary btn-sm "
            onClick={start_calibration}
          >
            execute
          </button>
        </div>
      </div>
    </>
  )
}
