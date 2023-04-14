import { MouseEventHandler } from "react";
import { MdClose } from "react-icons/md";

interface Props {
  showModal: boolean;
  onClose: MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function BaseModal(props: Props) {
  return (
    <div
      id="modal"
      className={
        (props.showModal ? "flex" : "hidden") +
        " fixed bg-gray-400/[.50] top-0 bottom-0 left-0 right-0 z-50 w-full p-4 items-center justify-center h-[calc(100%-1rem)] md:h-full"
      }>
      <div className="relative bg-white rounded-lg p-6 shadow w-full h-full max-w-md md:h-auto top-0 bottom-0 left-0 right-0">
        <button
          type="button"
          onClick={() => props.showModal}
          className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
          <MdClose className="text-xl" />
          <span className="sr-only">Close modal</span>
        </button>
        <div className="text-center">
          <h4 className="text-xl font-semibold text-gray-900">Filter</h4>
        </div>
      </div>
    </div>
  );
}
