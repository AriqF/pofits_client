import { UserPath } from "@/utils/global/route-path";
import { MouseEventHandler } from "react";
import { MdArrowCircleDown, MdArrowCircleUp, MdClose } from "react-icons/md";

interface Props {
  show: boolean;
  onClose: MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function AddTransactionSelectModal(props: Props) {
  return (
    <div
      id="modal"
      drawer-backdrop=""
      className={
        (props.show ? "flex bg-gray-900 bg-opacity-50 fixed inset-0 overflow-y-hidden" : "hidden") +
        "  z-50 pt-10 md:pt-0  w-full items-center justify-center "
      }>
      <div className="relative flex flex-col gap-y-5 bg-white overflow-y-auto rounded-lg p-6 pb-8 shadow w-full max-w-md min-h-max">
        <div id="header-interact" className="flex justify-between flex-row">
          <h4 className="text-lg my-auto font-semibold">Tambah Transaksi?</h4>
          <button
            type="button"
            onClick={props.onClose}
            className=" text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
            <MdClose className="text-xl" />
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="flex flex-col gap-y-2 text-center select-none">
          <a
            href={UserPath.TRANSACTION_INCOME_ADD}
            className={
              "hover:bg-moneySafe hover:text-white text-moneySafe border text-center focus:bg-moneySafe focus:text-white " +
              "inline-flex gap-1 place-content-center border-moneySafe rounded-md shadow-md py-4 px-2 cursor-pointer font-semibold transition-all duration-200"
            }>
            <MdArrowCircleDown className="my-auto text-xl" />
            <span className="my-auto">Pemasukan</span>
          </a>
          <a
            href={UserPath.TRANSACTION_EXPENSE_ADD}
            className={
              "hover:bg-moneyDanger hover:text-white text-moneyDanger border text-center focus:bg-moneyDanger focus:text-white " +
              "inline-flex gap-1 place-content-center border-moneyDanger rounded-md shadow-md py-4 px-2 cursor-pointer font-semibold transition-all duration-200"
            }>
            <MdArrowCircleUp className="my-auto text-xl" />
            <span className="my-auto">Pengeluaran</span>
          </a>
        </div>
      </div>
    </div>
  );
}
