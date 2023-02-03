import Layout from '../../components/layout'
import {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { FeedbackType } from '../../Firebase/types'
import { useRouter } from 'next/router'
import { Tooltip } from 'flowbite-react'

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState<FeedbackType[] | null>(null)
  const allFeedbacks = useRef<FeedbackType[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeout, setTimedOut] = useState(false)

  const timeOutHandler = useRef<NodeJS.Timeout>()

  async function readFeedbacks() {
    const res = await fetch(
      '/api/firebase/feedback/readFeedbacks',
    ).then((res) => res.json())

    clearTimeout(timeOutHandler.current)
    allFeedbacks.current = [...res]
    setFeedbacks(res)
    setLoading(false)
  }

  useEffect(() => {
    timeOutHandler.current = setTimeout(() => {
      console.log('Request timed out')
      setTimedOut(true)
    }, 10000)
    readFeedbacks()
  }, [])

  const router = useRouter()
  function handleDownlaod(downloadURL: string) {
    router.push(downloadURL)
  }

  function handleSearchChanged(e: SyntheticEvent) {
    const inputElem = e.target as HTMLInputElement
    if (inputElem.value === '') {
      setFeedbacks(allFeedbacks.current)
      return
    }

    const filteredFeedbacks = allFeedbacks.current?.filter((value) =>
      value.email.includes(inputElem.value),
    )

    setFeedbacks(filteredFeedbacks as FeedbackType[])
  }

  if (timeout) {
    return (
      <>
        <div className="flex flex-col justify-center h-full w-full items-center">
          <h1 className="text-6xl mt-16 w-[60%]">
            We could not fetch feedback data from database, please contact your
            developer.
          </h1>
        </div>
      </>
    )
  }

  if (loading) {
    return (
      <>
        <div className="flex flex-col justify-center h-full w-full items-center">
          <div className="w-[50px] h-[50px] bg-slate-50 border-4 rounded-full animate-ping"></div>
          <h1 className="text-6xl mt-16">Loading...</h1>
        </div>
      </>
    )
  }

  return (
    <>
      {feedbacks && (
        <div className="flex justify-center h-full">
          <div className="flex flex-col items-center justify-center h-full rounded-lg w-[80%] bg-slate-600">
            <div className="flex justify-between w-full pt-3 px-10 mx-2">
              <div className="rounded-full border-2 border-slate-400 flex align-middle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-search mt-[10px] ml-3"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
                <input
                  className="input rounded-full focus:outline-none bg-slate-600"
                  type="text"
                  placeholder="Search by email"
                  onChange={handleSearchChanged}
                />
              </div>
              <p className="text-5xl">Feedbacks</p>
            </div>
            <div className="w-full flex flex-row text-center mt-3 border-t-2 border-slate-900 ">
              <p className="text-lg font-extrabold bg-slate-600 w-1/12  border-slate-900 ">
                #
              </p>
              <p className="text-lg font-extrabold bg-slate-600 w-2/12  border-slate-900">
                Email
              </p>
              <p className="text-lg font-extrabold bg-slate-600 w-7/12  border-slate-900">
                Message
              </p>
              <p className="text-lg font-extrabold bg-slate-600 w-2/12   border-slate-900">
                Attachments
              </p>
            </div>

            <div className=" w-full h-full overflow-auto bg-slate-900">
              <table className="table w-full ">
                <tbody className="">
                  {feedbacks &&
                    feedbacks.map((feedback, index) => (
                      <tr
                        key={index}
                        className="hover text-center bg-black border-2 border-slate-900"
                      >
                        <td className="bg-slate-800 w-1/12 border-2 border-slate-900">
                          {index + 1}
                        </td>
                        <td className="bg-slate-800 w-2/12 border-2 border-slate-900">
                          {feedback.email}
                        </td>
                        <td className="bg-slate-800 text-left border-2 border-slate-900 whitespace-normal w-7/12">
                          {feedback.message}
                        </td>
                        <td className="bg-slate-800 w-2/12 border--2 border-slate-900">
                          {typeof feedback.downloadURL == 'string' ? (
                            <button
                              className="btn"
                              onClick={() => {
                                handleDownlaod(feedback.downloadURL)
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="currentColor"
                                className="bi bi-download "
                                viewBox="0 0 16 16"
                              >
                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                              </svg>
                            </button>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}