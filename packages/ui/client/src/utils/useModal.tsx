import { useState } from 'react'

const useModal = <T,>(defaultTitle?: string, data?: T) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(defaultTitle)
  const [modalData, setModalData] = useState<T | undefined>(data)
  const [key, setKey] = useState<number>()

  const showModal = () => {
    setKey(Date.now())
    setOpen(true)
  }
  const hideModal = () => setOpen(false)

  return {
    hideModal,
    modalData,
    modalProps: {
      closeOnMaskClick: false,
      destroyOnClose: true,
      key,
      onCancel: hideModal,
      open,
      title,
    },
    setModalData,
    setTitle,
    showModal,
  }
}

export default useModal
