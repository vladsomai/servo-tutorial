import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { GlobalContext } from '../pages/_app'

export type ModalPropertiesType = {}

const Modal = (props: ModalPropertiesType) => {
  const value = useContext(GlobalContext)


  //When the user has a modal and he resizes the window, the modal element will remain with its original width, causing the scroll bars to appear
  //the above code will solve the issue but its currently disabled to increase performance.
  
  // const [forceRender, setForceRender] = useState(false)
  // const handleResize = () => {
  //   setForceRender(!forceRender)
  //   console.log('resize')
  // }

  // useEffect(() => {
  //   window.addEventListener('resize', handleResize)
  //   return () => {
  //     window.removeEventListener('resize', handleResize)
  //   }
  // }, [])

  return (
    <>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal">
        <label
          className="modal-box w-auto max-w-[100vw] pt-10 relative"
          htmlFor=""
        >
          <label
            htmlFor="my-modal-4"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h1 className="text-2xl tracking-widest font-bold">
            {value.modal.Title}
          </h1>
          <div className="py-4">{value.modal.Description}</div>
        </label>
      </label>
    </>
  )
}
export default Modal
