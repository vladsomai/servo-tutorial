import { useEffect, useState } from 'react'

import 'animate.css'

const Chapters = () => {
  const [currentChapter, setCurrentChapter] = useState(1)
  const [chapters, setChapters] = useState<number[]>([])
  useEffect(() => {
    let arr = []
    for (let i = 1; i < 16; i++) {
      arr.push(i)
    }
    console.log(arr)
    setChapters(arr)
    setCurrentChapter(1)
  }, [])

  return (
    <>
      <div className="grid card w-1/6 bg-base-300 rounded-box place-items-center h-screen-80 overflow-show-scroll">
        <div className="flex flex-col w-full border-opacity-50">
          <h2 className=" mt-5 text-center text-secondary font-bold tracking-wide">
            CHAPTERS
          </h2>
          <div className="divider"></div>
          <div className="flex flex-col items-center">
            {chapters.map((i) => {
              return (
                <button
                  key={i}
                  className={`btn animate__animated animate__fadeIn ${
                    currentChapter === i
                      ? ' btn-active btn-accent '
                      : ' btn-link '
                  } `}
                  onClick={() => {
                    setCurrentChapter(i)
                  }}
                >
                  CHAPTER {i}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
export default Chapters
