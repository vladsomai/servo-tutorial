import Layout from '../components/layout'
import { ReactElement, useEffect, useState } from 'react'
import { FeedbackType } from '../Firebase/types'
import Image from 'next/image'
import DownloadImg from '../public/download.svg'

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState<FeedbackType[] | null>(null)

  async function readFeedbacks() {
    const res = await fetch('/api/firebase/feedback/readFeedbacks', {
      method: 'post',
      headers: {
        'content-type': 'application/text',
      },
      body: '',
    }).then((res) => res.json())
    setFeedbacks(res)
  }

  useEffect(() => {
    readFeedbacks()
  }, [])

  return (
    <>
      <div className="flex flex-col items-center justify-center h-full rounded-lg ">
        <h1 className="text-5xl mt-10">Feedbacks</h1>
        {feedbacks && (
          <div className=" w-[80%] h-full mt-10 overflow-auto  bg-slate-900 ">
            <table className="table w-full table-normal">
              <thead>
                <tr>
                  <th className="text-lg font-extrabold bg-slate-600">#</th>
                  <th className="text-lg font-extrabold bg-slate-600">Email</th>
                  <th className="text-lg font-extrabold bg-slate-600 ">
                    Message
                  </th>
                  <th className="text-lg font-extrabold bg-slate-600">
                    Attachments
                  </th>
                </tr>
              </thead>
              <tbody className=''>
                {feedbacks &&
                  feedbacks.map((feedback, index) => (
                    <tr key={index} className="hover ">
                      <td className="bg-slate-800">{index + 1}</td>
                      <td className="bg-slate-800">{feedback.email}</td>
                      <td className="bg-slate-800 max-w-md break-all whitespace-normal">{feedback.message}</td>
                      <td className="bg-slate-800">
                        <button className="btn ml-6">
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
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
