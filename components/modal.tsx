import { useState } from 'react'

export type ModalPropertiesType = {
  Title: ''
  Description: ''
}

const Modal = (props: ModalPropertiesType) => {
  const [modalProperties, setModalProperties] = useState<ModalPropertiesType>({
    Title: '',
    Description: '',
  })

  return (
    <>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">{modalProperties.Title}</h3>
          <p className="py-4">{modalProperties.Description}</p>
        </label>
      </label>
    </>
  )
}
export default Modal
