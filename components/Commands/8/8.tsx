import { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../pages/_app';
import { ChaptersPropsType } from '../0_1/0_1'
import { cCode } from "./code-samples/c-code-sample";
import { pythonCode } from "./code-samples/python-code-sample";
import { webCode } from "./code-samples/web-code-sample";
import { changeAliasPythonCode } from '../../../servo-engine/code-example-utils/python-code-utils';

export interface ResetCommandType extends ChaptersPropsType {
  master_time_start: number
  setMaster_time_start: Function
}

export const Command8 = (props: ResetCommandType) => {
    const globalContext = useContext(GlobalContext);
    
    function getNewPythonCode(): string {
        const alteredAliasPythonCode = changeAliasPythonCode(
            globalContext.currentAxisCode.axisCode,
            pythonCode
        );

        return alteredAliasPythonCode;
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

  const reset_time = () => {
    const selectedAxis = props.getAxisSelection()
    if (selectedAxis == '') return

    props.setMaster_time_start(Date.now())
    const rawData = props.constructCommand('')
    props.sendDataToSerialPort(rawData)
  }

  return (
    <>
      <div className="w-full text-center mb-5">
        <div className="flex justify-center">
          <div className="mr-4">{props.children}</div>
          <button className="btn btn-primary btn-sm" onClick={reset_time}>
            Reset
          </button>
        </div>
      </div>
    </>
  )
}
