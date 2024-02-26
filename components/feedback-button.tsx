import Image from 'next/image'
import EnvelopeImg from '../public/envelope-paper.svg'

const FeedbackButton = () => {
  return (
    <>
      <div className="bg-primary rounded-full absolute top-4 right-4 pt-2 px-2 m-0">
        <button
          title="Feedback"
          onClick={() => {
            window.open('/feedback', '_blank', 'noopener,noreferrer')
          }}
        >
          <Image
            src={EnvelopeImg}
            width={25}
            height={25}
            alt="feedback"
            priority
          ></Image>
        </button>
      </div>
    </>
  )
}
export default FeedbackButton
