const Modal = ({ children, isOpen, title, hideHeader, onClose }) => {
  // if (!isOpen) return null;

  return (
    <div
      className={`${isOpen ? "" : "left-[1500px] md:left-[1800px]"} w-screen h-screen fixed inset-0 z-9999 flex justify-center items-center bg-black/40 backdrop-blur-sm duration-300 ease-in-out`}
    >
      {/* Modal Content */}
      <div
        className={`relative flex flex-col bg-white rounded-lg overflow-hidden max-h-[90vh] max-w-[90%]`}
      >
        {/* Modal Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="md:text-lg font-medium text-gray-900">{title}</h3>
          </div>
        )}

        <button
          type="button"
          className="text-red-700 bg-transparent hover:bg-red-700 hover:text-white rounded-lg text-sm w-8 h-8 flex justify-center items-center absolute top-3.5 right-3.5 cursor-pointer z-10 duration-200"
          onClick={onClose}
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http:/www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>

        {/* Modal Body Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
