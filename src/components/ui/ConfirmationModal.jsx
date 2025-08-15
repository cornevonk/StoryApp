import { X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning', // 'warning', 'error', 'success', 'info'
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = true
}) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-600" />
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600" />
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case 'info':
        return <Info className="w-6 h-6 text-blue-600" />
      default:
        return <AlertTriangle className="w-6 h-6 text-amber-600" />
    }
  }

  const getButtonColors = () => {
    switch (type) {
      case 'error':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
      case 'warning':
      default:
        return 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          {showCancel && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColors()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}