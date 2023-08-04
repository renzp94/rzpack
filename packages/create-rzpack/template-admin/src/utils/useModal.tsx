import { useState } from 'react'

const useModal = <T,>(defaultTitle?: string, data?: T) => {
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [title, setTitle] = useState(defaultTitle)
  const [modalData, setModalData] = useState<T | undefined>(data)

  const showModal = () => setOpen(true)
  const hideModal = () => setOpen(false)

  return {
    hideModal,
    modalData,
    modalProps: {
      confirmLoading,
      destroyOnClose: true,
      maskClosable: false,
      onCancel: hideModal,
      open,
      title,
    },
    setConfirmLoading,
    setModalData,
    setTitle,
    showModal,
  }
}

export default useModal
