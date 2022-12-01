import { MutableRefObject, useEffect, useState } from 'react'
import 'animate.css'
import Link from 'next/link'
import { MotorCommandsDictionary } from '../servo-engine/motor-commands'

export type ChaptersProps = {
  currentChapter: number
  setCurrentChapter: Function
  MotorCommands: MutableRefObject<MotorCommandsDictionary[]>
}

const Chapters = (props: ChaptersProps) => {
  const [chapters, setChapters] = useState<number[]>([])

  useEffect(() => {
    let arr = []
    for (let i = 1; i <= props.MotorCommands.current.length; i++) {
      arr.push(i)
    }
    setChapters(arr)
  }, [props.MotorCommands])

  return (
    <>
      <div className="grid w-[20%] xl:w-[15%] 2xl:w-[12%] h-full card bg-base-300 rounded-box place-items-center overflow-auto mr-2">
        <div className="flex flex-col w-full border-opacity-50 my-5">
          <div className="flex flex-col items-center">
            {chapters.map((i) => {
              return (
                <Link key={i} href={`/tutorial/${i}`}>
                  <a
                    className={`btn btn-xs sm:btn-sm mb-3 animate__animated animate__fadeIn w-full ${
                      props.currentChapter === i
                        ? ' btn-primary '
                        : ' btn-ghost '
                    } `}
                    onClick={() => {
                      props.setCurrentChapter(i)
                    }}
                  >
                    {props.MotorCommands.current[i-1]?.CommandString}
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
