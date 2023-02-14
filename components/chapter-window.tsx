import { MutableRefObject, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { MotorCommandsDictionary } from '../servo-engine/motor-commands'
import Image from 'next/image'

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

  const LogoHeight = 50
  const LogoAspectRatio = 2234 / 676
  return (
    <>
      <div className="h-full bg-base-300 rounded-box mr-2 px-1 flex flex-col items-center">
        <Link href="/">
          <Image
            className="mt-4"
            src={'/Logo.png'}
            width={LogoHeight * LogoAspectRatio}
            height={LogoHeight}
            alt="logo"
            priority
          ></Image>
        </Link>
        <input
          ref={searchInputBox}
          type="text"
          placeholder="Search for a command"
          className="input input-bordered input-sm my-3 mx-auto"
          onChange={handleSearch}
        />
        <div className="flex flex-col w-full border-opacity-50 overflow-auto">
          <div className="flex flex-col items-center">
            {displaiedCommands.map((cmd) => {
              return (
                <Link
                  key={cmd.CommandEnum}
                  href={`/tutorial/${cmd.CommandEnum}`}
                  className={`btn btn-xs mb-2 w-full rounded-sm ${
                    props.currentCommandDictionary.CommandEnum ===
                    cmd.CommandEnum
                      ? ' btn-outline btn-primary border-0 bg-slate-700'
                      : ' btn-ghost '
                  } `}
                  onClick={() => {
                    props.setCurrentCommandDictionary(cmd)
                  }}
                >
                  {cmd.CommandString}
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
