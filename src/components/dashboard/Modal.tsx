import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnOutsideClick?: boolean;
}

export default function Modal({
  open,
  onClose,
  closeOnOutsideClick = true,
  children,
}: ModalProps) {
  return (
    <div
      className={`fixed z-50 inset-0 flex justify-center items-center transition-colors 
      ${open ? "visible bg-black/30 dark:bg-black/50" : "invisible"}
      `}
      onClick={closeOnOutsideClick ? onClose : () => {}}
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-slate-950/50 p-6 transition-all border border-gray-200 dark:border-slate-700
        ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 dark:text-gray-500 bg-white dark:bg-slate-800 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}
