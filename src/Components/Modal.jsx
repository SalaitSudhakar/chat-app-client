import { X } from "lucide-react";
import React, { useEffect } from "react";

const Modal = ({ title, closeModal, isModalOpen, children }) => {
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => (document.body.style.overflow = "auto");
  }, [isModalOpen]);

  if (!isModalOpen) return null;
  return (
    <div
      className="fixed inset-0 flex items-center text-base-content justify-center backdrop-blur-xs z-50"
      onClick={closeModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-base-300 border border-base-content/40 mx-1.5 px-2.5 sm:px-4 py-4 rounded-lg shadow-lg shadow-base-100  w-full max-w-md"
      >
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={closeModal}
            title="Close"
            className="flex items-center justify-center text-error hover:bg-error/10  rounded-full"
          >
            <X className="font-medium size-8 p-1 " />
          </button>
        </div> 

        {/* Modal Content */}
        <div className="mb-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
