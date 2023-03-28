import { useState } from 'react'

const useModal = <T,>(defaultTitle?: string, data?: T) => {
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [title, setTitle] = useState(defaultTitle)
  const [modalData, setModalData] = useState<T | undefined>(data)

  const showModal = () => setOpen(true)
  const hideModal = () => setOpen(false)

  return {
    modalProps: {
      open,
      title,
      confirmLoading,
      onCancel: hideModal,
      maskClosable: false,
      destroyOnClose: true,
    },
    setConfirmLoading,
    setTitle,
    showModal,
    hideModal,
    modalData,
    setModalData,
  }
}

export default useModal
