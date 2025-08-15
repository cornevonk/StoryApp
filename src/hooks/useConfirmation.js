import { useState } from 'react'

export function useConfirmation() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    confirmText: 'OK',
    cancelText: 'Cancel', 
    showCancel: true,
    onConfirm: null
  })

  const showConfirmation = ({
    title,
    message,
    type = 'warning',
    confirmText = 'OK',
    cancelText = 'Cancel',
    showCancel = true
  }) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        title,
        message,
        type,
        confirmText,
        cancelText,
        showCancel,
        onConfirm: () => resolve(true)
      })
    })
  }

  const showAlert = ({
    title,
    message,
    type = 'info',
    confirmText = 'OK'
  }) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        title,
        message,
        type,
        confirmText,
        showCancel: false,
        onConfirm: () => resolve(true)
      })
    })
  }

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }))
  }

  return {
    modalProps: {
      ...modalState,
      onClose: closeModal
    },
    showConfirmation,
    showAlert
  }
}