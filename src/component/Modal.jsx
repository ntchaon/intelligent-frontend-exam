import { useEffect, useRef } from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "max-w-lg",
  closeOnBackdrop = true,
}) {
  const panelRef = useRef(null);
  const openedRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      openedRef.current = false;
      return;
    }
    if (openedRef.current) return;
    openedRef.current = true;

    const t = setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;

      if (panel.contains(document.activeElement)) return;

      const target =
        panel.querySelector("[data-autofocus]") ||
        panel.querySelector("[autofocus]") ||
        panel.querySelector("input, select, textarea, button");

      (target || panel).focus?.();
    }, 0);

    return () => clearTimeout(t);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        ref={panelRef}
        className={`relative w-full ${size} rounded-xl bg-white shadow-xl p-6 outline-none`}
      >
        {title && (
          <h3 id="modal-title" className="text-lg font-bold mb-4">
            {title}
          </h3>
        )}

        <div>{children}</div>

        {footer && <div className="mt-6">{footer}</div>}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
