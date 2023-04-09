import UserBaseLayout from "@/components/layouts/user/layouts";
import TransactionLayout from "@/components/layouts/user/transaction/transaction-layout";
import TransactionListItem from "@/components/tools/list/page/transaction-list";
import { UserPath } from "@/utils/global/route-path";
import { numFormatter } from "@/utils/helper";
import { addDays } from "date-fns";
import { ReactNode, useState } from "react";
import {
  MdArrowCircleDown,
  MdArrowCircleUp,
  MdChevronLeft,
  MdClose,
  MdCalendarToday,
  MdCalendarViewMonth,
  MdSearch,
  MdFilterListAlt,
  MdExpandMore,
  MdAdd,
} from "react-icons/md";
import { DateRange, DateRangePicker } from "react-date-range";
import { Range } from "react-date-range";
import LinkButton from "@/components/tools/button/link-button";
import AddTransactionSelectModal from "@/components/tools/modal/trans-select-modal";

interface Props {
  children: ReactNode;
  backTo: UserPath;
}

export default function TransactionIndex(props: Props) {
  const [toggleFilterInc, setToggleFilterInc] = useState(true);
  const [toggleFilterExp, setToggleFilterExp] = useState(true);
  const [showFilter, setShowFilter] = useState(false); // show filter modal
  const [showSelectMenu, setShowSelectMenu] = useState(false); // show add transaction selection modal (income/expense)
  const [filterStr, setFilterStr] = useState("");
  const [dateRangeState, setDateRangeState] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const clearFilters = () => {
    setToggleFilterExp(true);
    setToggleFilterInc(true);
    setDateRangeState([{ startDate: new Date(0), endDate: new Date() }]);
    //change filter string here
  };

  const exp = 4073000;
  const inc = 5361000;
  const div = inc - exp;
  return (
    <TransactionLayout>
      <section className="col-span-4 gap-10 flex flex-col h-max-fit">
        <div id="transactions-recap" className="flex flex-col gap-5">
          <div className="flex flex-row justify-between">
            <h2 className="text-2xl text-gray-800 font-semibold col-span-4">Transaksi</h2>
          </div>
          <div
            className="flex flex-col md:flex-row md:justify-between text-center md:text-left gap-4 col-span-4"
            id="ie-info">
            <div className="gap-1 flex flex-col my-auto">
              <p className="text-sm capitalize">Sisa uang kamu</p>
              <h4
                className={
                  `text-2xl font-semibold ` + (div >= 0 ? "text-moneySafe" : "text-moneyDanger")
                }>
                Rp {numFormatter(div)}
              </h4>
            </div>
            <div
              id="ie-info-box"
              className="border shadow-md rounded-md grid grid-cols-2 py-2.5 w-full md:w-4/12 ">
              <div className="flex flex-col gap-1 text-center">
                <div className="inline-flex m-auto gap-1">
                  <MdArrowCircleDown className="my-auto text-moneySafe" />
                  <h5 className="text-sm">Pemasukan</h5>
                </div>
                <p className="text-base text-moneySafe font-semibold">Rp {numFormatter(inc)}</p>
              </div>
              <div className="flex flex-col gap-1 text-center">
                <div className="inline-flex m-auto gap-1">
                  <MdArrowCircleUp className="my-auto text-moneyDanger" />
                  <h5 className="text-sm">Pengeluaran</h5>
                </div>
                <p className="text-base text-moneyDanger font-semibold">Rp {numFormatter(exp)}</p>
              </div>
            </div>
          </div>
        </div>
        <div id="transactions-history" className="flex flex-col gap-5">
          <div className="flex flex-col justify-between md:flex-row gap-y-5">
            <h2 className="text-2xl text-gray-800 font-semibold col-span-4 ">Riwayat Transaksi</h2>
            <a
              onClick={() => setShowSelectMenu(true)}
              className="place-content-center text-center cursor-pointer p-3 text-sm font-medium text-white bg-palepurple rounded-md border border-palepurple hover:bg-hovpalepurple focus:ring-1 focus:outline-none">
              Tambah Transaksi
            </a>
            <AddTransactionSelectModal
              show={showSelectMenu}
              onClose={() => setShowSelectMenu(!showSelectMenu)}
            />
          </div>
          <div className="col-span-4 flex flex-col gap-7" id="transactions-list">
            <div id="search-filter" className="flex flex-col gap-4">
              <form className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilter(!showFilter)}
                  className="inline-flex p-2.5 text-sm font-medium text-white bg-blue rounded-lg border border-blue hover:bg-hovblue focus:ring-1 focus:outline-none">
                  Filter
                  <MdExpandMore className="my-auto text-xl" />
                </button>
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MdSearch className="text-xl" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue block w-full pl-10 p-2.5 "
                    placeholder="Cari transaksi"
                    required
                  />
                </div>
                <div
                  id="modal"
                  className={
                    (showFilter ? "flex" : "hidden") +
                    " fixed bg-gray-400/[.50] top-0 bottom-0 left-0 right-0 z-50 pt-10 md:pt-0  w-full items-center justify-center h-[calc(100%-1rem)] md:h-full"
                  }>
                  <div className="relative flex flex-col gap-y-5 bg-white overflow-y-auto rounded-lg p-6 pb-8 shadow w-full max-w-md min-h-max">
                    <div id="header-interact" className="flex justify-between flex-row">
                      <h4 className="text-base  my-auto font-semibold">Atur Filter</h4>
                      <button
                        type="button"
                        onClick={() => setShowFilter(false)}
                        className=" text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <MdClose className="text-xl" />
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>
                    <div id="trans-type-filter" className="flex flex-col gap-y-3">
                      <h4 className="text-base font-semibold">Jenis Transaksi</h4>
                      <div className="flex flex-row gap-4">
                        <button
                          type="button"
                          onClick={() => setToggleFilterExp(!toggleFilterExp)}
                          className={
                            (toggleFilterExp
                              ? "text-white bg-palepurple hover:bg-hovpalepurple"
                              : "text-palepurple bg-transparent hover:text-palepurple hover:bg-gray-100") +
                            " p-2.5 text-sm font-medium border border-palepurple rounded-md transition-all duration-150"
                          }>
                          Pengeluaran
                        </button>
                        <button
                          type="button"
                          onClick={() => setToggleFilterInc(!toggleFilterInc)}
                          className={
                            (toggleFilterInc
                              ? "text-white bg-palepurple"
                              : "text-palepurple bg-transparent hover:text-palepurple hover:bg-gray-100") +
                            " p-2.5 text-sm font-medium border hover:bg-hovpalepurple border-palepurple rounded-md transition-all duration-150"
                          }>
                          Pemasukan
                        </button>
                      </div>
                    </div>
                    <div id="trans-date-filter" className="flex flex-col gap-y-3">
                      <h4 className="text-base font-semibold">Tanggal Transaksi</h4>
                      <div className="flex m-auto place-content-center w-full">
                        <DateRange
                          editableDateInputs={true}
                          onChange={(item) => setDateRangeState([item.selection])}
                          moveRangeOnFirstSelection={false}
                          ranges={dateRangeState}
                        />
                      </div>
                    </div>
                    <div
                      id="filter-submit-btn"
                      className="grid grid-cols-1 md:grid-cols-2 gap-3 place-content-center">
                      <button
                        type="submit"
                        className={
                          "text-white bg-palepurple hover:bg-hovpalepurple" +
                          " w-full p-2.5 text-sm font-medium border border-palepurple rounded-md transition-all duration-150"
                        }>
                        Terapkan
                      </button>
                      <button
                        type="reset"
                        onClick={() => clearFilters}
                        className={
                          "text-palepurple bg-transparent hover:bg-hovoutpurple" +
                          " w-full p-2.5 text-sm font-medium border border-palepurple rounded-md transition-all duration-200"
                        }>
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div id="history-transactions-list" className="flex flex-col gap-3">
              <div>
                <TransactionListItem
                  title={"Warteg"}
                  wallet={"Kas"}
                  icon={"food"}
                  date={new Date()}
                  amount={27000}
                  dataId={"1"}
                  type={"expense"}
                />
                <TransactionListItem
                  title={"Seirockya"}
                  wallet={"BCA"}
                  icon={"food"}
                  date={new Date()}
                  amount={135750}
                  dataId={"2"}
                  type={"expense"}
                />
                <TransactionListItem
                  title={"Bulanan"}
                  wallet={"BCA"}
                  icon={"loan"}
                  date={new Date()}
                  amount={4500000}
                  dataId={"3"}
                  type={"income"}
                />
                <TransactionListItem
                  title={"Top up steam wallet"}
                  wallet={"BCA"}
                  icon={"game"}
                  date={new Date()}
                  amount={230000}
                  dataId={"2"}
                  type={"expense"}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </TransactionLayout>
  );
}
