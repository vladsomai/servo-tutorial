import {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  InternalVelocityToCommVelocity,
  SecondToTimesteps,
  maximumNegativeVelocity,
  maximumPositiveVelocity,
  minimumNegativeVelocity,
  minimumPositiveVelocity,
  RPM_ToInternalVelocity,
  Uint8ArrayToString,
  maximumPositiveTime,
  minimumPositiveTime,
  minimumNegativeAcceleration,
  maximumNegativeAcceleration,
  minimumPositiveAcceleration,
  maximumPositiveAcceleration,
  RPMSquared_ToInternalAcceleration,
  InternalAccelerationToCommAcceleration,
} from '../../servo-engine/utils'
import { ChaptersPropsType } from './0_1'
import Image from 'next/image'

export interface MultiMoveChapterProps extends ChaptersPropsType {
  MoveCommands: MoveCommand[]
  setMoveCommands: Dispatch<SetStateAction<MoveCommand[]>>
}
export interface MovementType {
  Name: string
}
export const movementTypes: MovementType[] = [
  { Name: 'Acceleration' },
  { Name: 'Velocity' },
]

export interface MoveCommand {
  MovementType: MovementType
  MoveValue: string
  TimeValue: string
}

export const Command29 = (props: MultiMoveChapterProps) => {
  const [movementType, setMovementType] = useState('Velocity')
  const commandsDivElement = useRef<HTMLDivElement[] | null[]>([]) //will be used to add transitions
  const movementTypeSelectionBox = useRef<HTMLSelectElement[] | null[]>([])
  const acceleretionOrVelocityInputBox = useRef<HTMLInputElement[] | null[]>([])
  const timeInputBox = useRef<HTMLInputElement[] | null[]>([])

  const resetAllCommands = () => {
    props.setMoveCommands([])
  }

  const deleteMoveCommand = (command: number) => {
    let arr1 = props.MoveCommands.slice(0, command)
    let arr3 = props.MoveCommands.slice(command + 1, props.MoveCommands.length)

    let arr = [...arr1, ...arr3]
    props.setMoveCommands(arr)
  }

  const addMoveCommand = () => {
    if (props.MoveCommands.length > 31) {
      props.LogAction('Maximum number of commands reached: 32.')
      return
    }

    let emptyMoveCmd = {
      MovementType: { Name: movementType },
      MoveValue: '',
      TimeValue: '',
    }
    props.setMoveCommands([...props.MoveCommands, emptyMoveCmd])
  }

  const onSelectionChange = (e: SyntheticEvent, command: number) => {
    const selectElement = e.target as HTMLSelectElement
    const value = selectElement.options[selectElement.selectedIndex].text
    setMovementType(value)

    let arr1 = props.MoveCommands.slice(0, command)
    let arr2 = props.MoveCommands.at(command) as MoveCommand
    let arr3 = props.MoveCommands.slice(command + 1, props.MoveCommands.length)

    arr2.MovementType.Name = value
    arr2.MoveValue = ''

    let arr = [...arr1, arr2, ...arr3]

    props.setMoveCommands(arr)
  }

  //#region TIME_CONVERSION
  const convertTime = (timeInSeconds: number): string => {
    const timesteps = SecondToTimesteps(timeInSeconds)

    if (timesteps == 0) {
      return '00000000'
    } else {
      let rawPayload_ArrayBufferForTime = new ArrayBuffer(4)
      const viewTime = new DataView(rawPayload_ArrayBufferForTime)

      viewTime.setUint32(0, timesteps, true)

      let rawTimePayload = new Uint8Array(4)
      rawTimePayload.set([viewTime.getUint8(0)], 0)
      rawTimePayload.set([viewTime.getUint8(1)], 1)
      rawTimePayload.set([viewTime.getUint8(2)], 2)
      rawTimePayload.set([viewTime.getUint8(3)], 3)

      return Uint8ArrayToString(rawTimePayload)
    }
  }
  const onTimeInputBoxChange = (e: SyntheticEvent, command: number) => {
    const currentInputBox = e.target as HTMLInputElement

    if (currentInputBox) {
      const inputBoxValue = parseFloat(currentInputBox.value)

      if (isNaN(inputBoxValue) || inputBoxValue < 0) {
      } else if (inputBoxValue > maximumPositiveTime) {
        //max reached
        props.LogAction(
          `WARNING: Maximum value for time is ${maximumPositiveTime}, consider using a smaller value!`,
        )
        currentInputBox.value = maximumPositiveTime.toString()
      }
    }

    let arr1 = props.MoveCommands.slice(0, command)
    let arr2 = props.MoveCommands.at(command) as MoveCommand
    let arr3 = props.MoveCommands.slice(command + 1, props.MoveCommands.length)

    arr2.TimeValue = currentInputBox.value

    let arr = [...arr1, arr2, ...arr3]
    props.setMoveCommands(arr)
  }
  //#endregion TIME_CONVERSION

  //#region Acceleration_CONVERSION
  const onAccOrVelInputBoxChange = (e: SyntheticEvent, command: number) => {
    const currentInputBox = e.target as HTMLInputElement
    const inputBoxValue = parseFloat(currentInputBox.value)
    const inputBoxMovementType = props.MoveCommands.at(command)!.MovementType
      .Name

    if (inputBoxMovementType === 'Velocity') {
      if (inputBoxValue < 0) {
        //negative Velocity
        if (inputBoxValue < maximumNegativeVelocity) {
          //max negative reached
          props.LogAction(
            `WARNING: Maximum value for negative velocity is ${maximumNegativeVelocity}, consider using a larger value!`,
          )
          currentInputBox.value = Number(maximumNegativeVelocity).toString()
        }
      }
      //positive Velocity
      else if (inputBoxValue >= maximumPositiveVelocity) {
        //max positive reached
        props.LogAction(
          `WARNING: Maximum value for positive velocity is ${maximumPositiveVelocity}, consider using a smaller value!`,
        )
        currentInputBox.value = Number(maximumPositiveVelocity).toString()
      }
    } else if (inputBoxMovementType === 'Acceleration') {
      if (inputBoxValue < 0) {
        //negative Acceleration
        if (inputBoxValue < maximumNegativeAcceleration) {
          //max negative reached
          props.LogAction(
            `WARNING: Maximum value for negative acceleration is ${maximumNegativeAcceleration}, consider using a larger value!`,
          )
          currentInputBox.value = Number(maximumNegativeAcceleration).toString()
        }
      }
      //positive Acceleration
      else if (inputBoxValue >= maximumPositiveAcceleration) {
        //max positive reached
        props.LogAction(
          `WARNING: Maximum value for positive acceleration is ${maximumPositiveAcceleration}, consider using a smaller value!`,
        )
        currentInputBox.value = Number(maximumPositiveAcceleration).toString()
      }
    }
    let arr1 = props.MoveCommands.slice(0, command)
    let arr2 = props.MoveCommands.at(command) as MoveCommand
    let arr3 = props.MoveCommands.slice(command + 1, props.MoveCommands.length)

    arr2.MoveValue = currentInputBox.value.toString()

    let arr = [...arr1, arr2, ...arr3]
    props.setMoveCommands(arr)
  }
  //#endregion Acceleration_CONVERSION

  const execute_command = () => {
    const selectedAxis = props.getAxisSelection()
    if (selectedAxis == '') return

    let u32BitMovementTypes = 0
    let timestepsHexa: string[] = []
    let movementComm: string[] = []
    for (let i = 0; i < props.MoveCommands.length; i++) {
      //#region TIME
      if (
        acceleretionOrVelocityInputBox.current[i]?.value == '' ||
        timeInputBox.current[i]?.value == ''
      ) {
        props.LogAction(`Please enter both inputs on command ${i + 1}.`)
        return
      }
      const timeValue = parseFloat(timeInputBox.current[i]?.value as string)
      if (timeValue < 0) {
        props.LogAction(`Time cannot be negative on command ${i + 1}!`)
        return
      }

      if (timeValue < minimumPositiveTime) {
        props.LogAction(
          `WARNING: Time value is considered 0 when it is below ${minimumPositiveTime}, consider using a larger value.`,
        )
      }
      timestepsHexa.push(convertTime(timeValue))
      //#endregion TIME

      if (props.MoveCommands.at(i)?.MovementType.Name == 'Acceleration') {
        const internalAcceleration = RPMSquared_ToInternalAcceleration(
          parseFloat(props.MoveCommands.at(i)!.MoveValue as string),
        )

        const commAcceleration = InternalAccelerationToCommAcceleration(
          internalAcceleration,
        )

        if (commAcceleration == 0) {
          movementComm.push('00000000')
        } else {
          let rawPayload_ArrayBufferForAcceleration = new ArrayBuffer(4)
          const viewAcceleration = new DataView(
            rawPayload_ArrayBufferForAcceleration,
          )
          viewAcceleration.setUint32(0, commAcceleration, true)

          let rawAccelerationPayload = new Uint8Array(4)
          rawAccelerationPayload.set([viewAcceleration.getUint8(0)], 0)
          rawAccelerationPayload.set([viewAcceleration.getUint8(1)], 1)
          rawAccelerationPayload.set([viewAcceleration.getUint8(2)], 2)
          rawAccelerationPayload.set([viewAcceleration.getUint8(3)], 3)

          movementComm.push(Uint8ArrayToString(rawAccelerationPayload))
        }
      } else if (props.MoveCommands.at(i)?.MovementType.Name == 'Velocity') {

        //set ith bit when using velocity movement
        const mask = 1 << i
        u32BitMovementTypes |= mask

        const internalVelocity = RPM_ToInternalVelocity(
          parseFloat(props.MoveCommands.at(i)!.MoveValue as string),
        )
        const commVelocity = InternalVelocityToCommVelocity(internalVelocity)

        if (commVelocity == 0) {
          movementComm.push('00000000')
        } else {
          let rawPayload_ArrayBufferForVelocity = new ArrayBuffer(4)
          const viewVelocity = new DataView(rawPayload_ArrayBufferForVelocity)
          viewVelocity.setUint32(0, commVelocity, true)

          let rawVelocityPayload = new Uint8Array(4)
          rawVelocityPayload.set([viewVelocity.getUint8(0)], 0)
          rawVelocityPayload.set([viewVelocity.getUint8(1)], 1)
          rawVelocityPayload.set([viewVelocity.getUint8(2)], 2)
          rawVelocityPayload.set([viewVelocity.getUint8(3)], 3)

          movementComm.push(Uint8ArrayToString(rawVelocityPayload))
        }
      }
    }

    //#region number of commands byte
    /* Convert the u32 that holds all the movement bits*/
    let rawNoCommands = new ArrayBuffer(4)
    const viewRawNoCommands = new DataView(rawNoCommands)
    viewRawNoCommands.setUint32(0, props.MoveCommands.length, true)

    let rawNoCommandsPayload = new Uint8Array(4)
    rawNoCommandsPayload.set([viewRawNoCommands.getUint8(0)], 0)
    const rawNoCommandsByte = Uint8ArrayToString(rawNoCommandsPayload)
    //#endregion number of commands byte

    //#region Movement bits
    /* Convert the u32 that holds all the movement bits*/
    let rawMovementBitsU32 = new ArrayBuffer(4)
    const viewVelocity = new DataView(rawMovementBitsU32)
    viewVelocity.setUint32(0, u32BitMovementTypes, true)

    let rawMovementBitsPayload = new Uint8Array(4)
    rawMovementBitsPayload.set([viewVelocity.getUint8(0)], 0)
    rawMovementBitsPayload.set([viewVelocity.getUint8(1)], 1)
    rawMovementBitsPayload.set([viewVelocity.getUint8(2)], 2)
    rawMovementBitsPayload.set([viewVelocity.getUint8(3)], 3)
    const rawMovementBits = Uint8ArrayToString(rawMovementBitsPayload)
    //#endregion Movement bits

    let payload = ''
    payload += rawNoCommandsByte.slice(0, 2)
    payload += rawMovementBits
    for (let i = 0; i < props.MoveCommands.length; i++) {
      payload += movementComm[i]
      payload += timestepsHexa[i]
    }
    const rawData = props.constructCommand(selectedAxis, payload)
    props.sendDataToSerialPort(rawData)
  }
  return (
    <>
      <div className="w-full text-center mb-10">
        <div className="mb-5">
          <div className=" flex justify-evenly ">
            <div
              className="tooltip tooltip-success mb-5 "
              data-tip="Add new command"
            >
              <button
                className="btn btn-success btn-sm btn-circle"
                onClick={addMoveCommand}
              >
                <Image
                  alt="Add command"
                  src="/add.svg"
                  width={100}
                  height={100}
                  priority
                />
              </button>
            </div>
            <div
              className="tooltip tooltip-error"
              data-tip="Delete all commands"
            >
              <button
                className="btn btn-error btn-sm btn-circle"
                onClick={resetAllCommands}
              >
                <Image
                  alt="Reset commands"
                  src="/reset.svg"
                  width={100}
                  height={100}
                  priority
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            {props.MoveCommands.map((MoveCommand) => (
              <div
                ref={(el) =>
                  (commandsDivElement.current[
                    props.MoveCommands.indexOf(MoveCommand)
                  ] = el)
                }
                className="flex flex-col xl:flex-row justify-center items-center animate__animated animate__fadeIn"
                key={props.MoveCommands.indexOf(MoveCommand)}
              >
                <p className="m-2 self-center xl:self-end ">
                  {props.MoveCommands.indexOf(MoveCommand) + 1}.
                </p>
                <select
                  ref={(el) =>
                    (movementTypeSelectionBox.current[
                      props.MoveCommands.indexOf(MoveCommand)
                    ] = el)
                  }
                  className="select select-bordered select-sm max-w-xs m-2"
                  value={MoveCommand.MovementType.Name}
                  onChange={(e) =>
                    onSelectionChange(
                      e,
                      props.MoveCommands.indexOf(MoveCommand),
                    )
                  }
                >
                  {movementTypes.map((type: MovementType) => (
                    <option key={movementTypes.indexOf(type)}>
                      {type.Name}
                    </option>
                  ))}
                </select>
                <input
                  ref={(el) =>
                    (acceleretionOrVelocityInputBox.current[
                      props.MoveCommands.indexOf(MoveCommand)
                    ] = el)
                  }
                  onChange={(e) =>
                    onAccOrVelInputBoxChange(
                      e,
                      props.MoveCommands.indexOf(MoveCommand),
                    )
                  }
                  type="number"
                  value={MoveCommand.MoveValue}
                  placeholder="Velocity / Acceleration"
                  className="input input-bordered max-w-xs input-sm m-2"
                />

                <input
                  ref={(el) =>
                    (timeInputBox.current![
                      props.MoveCommands.indexOf(MoveCommand)
                    ] = el)
                  }
                  onChange={(e) =>
                    onTimeInputBoxChange(
                      e,
                      props.MoveCommands.indexOf(MoveCommand),
                    )
                  }
                  value={MoveCommand.TimeValue}
                  type="number"
                  placeholder="Time limit (s)"
                  className="input input-bordered  max-w-xs input-sm m-2"
                />

                <div
                  className="tooltip tooltip-error"
                  data-tip={
                    'Delete command ' +
                    `${props.MoveCommands.indexOf(MoveCommand) + 1}`
                  }
                >
                  <button
                    className="btn btn-error btn-sm btn-circle m-2"
                    onClick={() =>
                      deleteMoveCommand(props.MoveCommands.indexOf(MoveCommand))
                    }
                  >
                    <Image
                      alt="Add command"
                      src="/delete.svg"
                      width={20}
                      height={20}
                      priority
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="mr-4">{props.children}</div>
          <button className="btn btn-primary btn-sm" onClick={execute_command}>
            execute
          </button>
        </div>
      </div>
    </>
  )
}
