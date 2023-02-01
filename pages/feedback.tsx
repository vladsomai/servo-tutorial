import Layout from '../components/layout'
import { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { GlobalContext, NextPageWithLayout } from './_app'
import Image from 'next/image'
import BoyImg from '../public/feedback_left_boy.png'
import GirlImg from '../public/feedback_right_girl.png'
import UploadImg from '../public/upload.svg'
import { sleep } from '../servo-engine/utils'

const Feedback: NextPageWithLayout = () => {
  const value = useContext(GlobalContext)
  const attachmentRef = useRef<HTMLInputElement | null>(null)
  const ratio = 1.382

  const [waitingFeedbackReply, setWaitingFbReply] = useState(false)
  const [imgHeight, setImgHeight] = useState(712)
  const [imgWidth, setImgWidth] = useState(712 * ratio)
  const [showImage, setShowImage] = useState(false)
  function handleResize() {
    setImgHeight(window.innerHeight / 2)
    setImgWidth((window.innerHeight * ratio) / 2)
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    setImgHeight(window.innerHeight / 2)
    setImgWidth((window.innerHeight * ratio) / 2)
    setShowImage(true)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  async function sendFeedback(e: any) {
    e.preventDefault()
    if (attachmentRef && attachmentRef.current == null) return

    setWaitingFbReply(true)

    const attachedFiles = attachmentRef.current?.files

    //#region feedback message
    const email = e.target['email'].value
    const message = e.target['message'].value
    const responseFeedback = await fetch(
      '/api/firebase/feedback/sendFeedback',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, message: message }),
      },
    )

    const parsedResFb = await responseFeedback.json()
    console.log(parsedResFb)
    //#endregion feedback message

    //#region  feedback attachments
    let formData = new FormData()
    formData.append('attachmentID', parsedResFb.attachmentID)
    if (attachedFiles != null) {
      for (let i = 0; i < attachedFiles.length; i++) {
        formData.append(`file${i}`, attachedFiles[i], attachedFiles[i].name)
      }
    }

    const responseAttachment = await fetch(
      '/api/firebase/feedback/sendAttachment',
      {
        method: 'POST',
        body: formData,
      },
    )

    console.log(await responseAttachment.text())
    //#region  feedback attachments
    setWaitingFbReply(false)
  }

  return (
    <>
      <div className="flex flex-col items-center justify-start h-full relative">
        {showImage && (
          <>
            <div className="absolute bottom-2 left-[20%] z-[-1]">
              <Image
                quality={100}
                className=""
                width={imgWidth}
                height={imgHeight}
                src={BoyImg}
                alt="boy picture"
                priority
              ></Image>
            </div>
            <div className="absolute bottom-0 right-[10%] z-[-1]">
              <Image
                quality={100}
                className=""
                width={imgWidth}
                height={imgHeight}
                src={GirlImg}
                alt="girl picture"
                priority
              ></Image>
            </div>
          </>
        )}

        <h1 className="feedbackTextColor text-center mt-[3%] ">
          We care.<br></br> That&apos;s why we need your feedback.
        </h1>
        <form
          onSubmit={sendFeedback}
          className="flex flex-col justify-around w-[30%] h-[50%] items-center "
        >
          <input
            required
            name="email"
            className="input input-bordered w-full max-w-sm"
            placeholder="Your email"
            type="email"
          ></input>
          <textarea
            required
            name="message"
            placeholder="What should we change?"
            className="textarea textarea-bordered w-full h-[40%] max-w-sm"
          ></textarea>
          <label className="w-full max-w-sm text-left cursor-pointer text-center">
            Images or documents help us diagnose issues faster, attach anything
            that can give us more insight.
            <input
              ref={attachmentRef}
              multiple
              className="block w-full text-sm rounded-lg border border-neutral cursor-pointer file:btn file:btn-sm file:rounded-none file:mr-5 file:border-0 max-w-sm"
              type="file"
              accept=".doc,.docx,.zip,.7z,.pdf,image/*"
              name="attachment"
              id="attachment"
            />
          </label>
          <button
            type="submit"
            className={`btn btn-primary ${
              waitingFeedbackReply ? 'loading' : ''
            }`}
            disabled={waitingFeedbackReply ? true : false}
          >
            Send feedback
          </button>
        </form>
      </div>
    </>
  )
}

Feedback.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Feedback
