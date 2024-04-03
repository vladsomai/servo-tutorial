import { useContext, useEffect, useRef } from 'react';
import { GlobalContext } from '../../../pages/_app';
import { ChaptersPropsType } from '../0_1/0_1'
import { GenericCodeExample } from '../../../servo-engine/code-example-utils/code-utils';

export interface ResetCommandType extends ChaptersPropsType {
  master_time_start: number
  setMaster_time_start: Function
}

export const Command8 = (props: ResetCommandType) => {
    const globalContext = useContext(GlobalContext);
    const genericCodeExample = useRef(new GenericCodeExample());

    function updateCodeExamples() {
        globalContext.codeExample.setPythonCode(
            genericCodeExample.current.getGenericPythonCode(
                globalContext.currentAxisCode.axisCode,
                props.currentCommandDictionary.CommandEnum
            )
        );

        globalContext.codeExample.setWebCode(
            genericCodeExample.current.getGenericWebCode(
                globalContext.currentAxisCode.axisCode,
                props.currentCommandDictionary.CommandEnum
            )
        );

        globalContext.codeExample.setClangCode(
            genericCodeExample.current.getGenericCCode(
                globalContext.currentAxisCode.axisCode,
                props.currentCommandDictionary.CommandEnum
            )
        );
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
