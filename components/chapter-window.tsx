import { MutableRefObject, useEffect, useRef, useState } from 'react'
import 'animate.css'
import Link from 'next/link'
import { MotorCommandsDictionary } from '../servo-engine/motor-commands'

export type ChaptersProps = {
  MotorCommands: MutableRefObject<MotorCommandsDictionary[]>
  currentCommandDictionary: MotorCommandsDictionary
  setCurrentCommandDictionary: Function
}

const Chapters = (props: ChaptersProps) => {
  const [displaiedCommands, setDisplaiedCommands] = useState<
    MotorCommandsDictionary[]
  >(props.MotorCommands.current)
  const searchInputBox = useRef<HTMLInputElement | null>(null)

  const handleSearch = () => {
    const searchInput = searchInputBox.current?.value as string

    let arr: MotorCommandsDictionary[] = []
    for (const cmd of props.MotorCommands.current) {
      if (cmd.CommandString.toLowerCase().includes(searchInput.toLowerCase())) {
        arr.push(cmd)
      }
    }
    setDisplaiedCommands(arr)
  }

  useEffect(() => {
    setDisplaiedCommands(props.MotorCommands.current)
  }, [props.MotorCommands])

  return (
    <>
      <div className="w-[20%] xl:w-[17%] 2xl:w-[15%] h-full bg-base-300 rounded-box overflow-auto mr-2 px-1 flex flex-col">
        <input
          ref={searchInputBox}
          type="text"
          placeholder="Search for a command"
          className="input input-bordered max-w-xs input-sm my-3 mx-auto"
          onChange={handleSearch}
        />
        <div className="flex flex-col w-full border-opacity-50">
          <div className="flex flex-col items-center">
            {displaiedCommands.map((cmd) => {
              return (
                <Link
                  key={cmd.CommandEnum}
                  href={`/tutorial/${cmd.CommandEnum}`}
                >
                  <a
                    className={`btn btn-xs mb-2 animate__animated animate__fadeIn w-full ${
                      props.currentCommandDictionary.CommandEnum ===
                      cmd.CommandEnum
                        ? ' btn-primary '
                        : ' btn-ghost '
                    } `}
                    onClick={() => {
                      props.setCurrentCommandDictionary(cmd)
                    }}
                  >
                    {cmd.CommandString}
                  </a>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
export default Chapters
