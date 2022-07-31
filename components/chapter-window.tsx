import { useEffect, useState } from 'react'
import { MotorCommands } from '../servo-engine/motor-commands'
import Link from 'next/link'
import 'animate.css'

export type ChaptersProps = {
  currentChapter: number
  setCurrentChapter: Function
}

const Chapters = (props: ChaptersProps) => {
  const [chapters, setChapters] = useState<number[]>([])

  useEffect(() => {
    let arr = []
    for (let i = 1; i <= MotorCommands.length; i++) {
      arr.push(i)
    }
    setChapters(arr)
  }, [])

  return (
    <>
      <div className="grid card w-1/6 bg-base-300 rounded-box place-items-center h-screen-80 overflow-show-scroll mr-2">
        <div className="flex flex-col w-full border-opacity-50">
          <h2 className=" mt-5 text-center text-secondary font-bold tracking-wide">
            CHAPTERS
          </h2>
          <div className="divider"></div>
          <div className="flex flex-col items-center">
            {chapters.map((i) => {
              return (
                // <Link  href={`/tutorial/${i}`}>
                <a
                  key={i}
                  className={`btn animate__animated animate__fadeIn ${
                    props.currentChapter === i
                      ? ' btn-active btn-info '
                      : ' btn-link '
                  } `}
                  onClick={() => {
                    props.setCurrentChapter(i)
                  }}
                >
                  CHAPTER {i}
                </a>
                // </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
export default Chapters
