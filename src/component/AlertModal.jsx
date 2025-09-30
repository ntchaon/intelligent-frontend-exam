import Modal from "./Modal";

export default function AlertModal({
  open,
  title = "Alert",
  message = "",
  mode = "info",
  confirmText = mode === "confirm" ? "Delete" : "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="max-w-md"
      footer={
        <div className="flex justify-end gap-3">
          {mode === "confirm" && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-white ${
              mode === "confirm"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-primary-600 hover:bg-primary-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <p className="text-gray-600 whitespace-pre-line">{message}</p>
    </Modal>
  );
}
