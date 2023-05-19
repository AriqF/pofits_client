import TransactionLayout from "@/components/layouts/user/transaction/transaction-layout";
import TransactionListItem from "@/components/tools/list/page/transaction-list";
import { UserPath } from "@/utils/global/route-path";
import { CustomAlert, getDateEndMonth, getDateStartMonth, numFormatter } from "@/utils/helper";
import { ReactNode, useEffect, useState } from "react";
import {
  MdArrowCircleDown,
  MdArrowCircleUp,
  MdClose,
  MdSearch,
  MdExpandMore,
} from "react-icons/md";
import AddTransactionSelectModal from "@/components/tools/modal/trans-select-modal";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { AllTransactions, TransactionsMonthRecap } from "@/utils/interfaces/server-props";
import { baseFormStyle, checkBoxStyle } from "@/utils/global/style";
import InputForm from "@/components/tools/form/input-form";
import moment from "moment";
import NotFoundImage from "@/components/tools/alerts/notfound-image";
import { AxiosError } from "axios";
import Alert from "@/components/tools/alerts/alert";

interface Props {
  children: ReactNode;
  backTo: UserPath;
}

export default function TransactionIndex(props: Props) {
  const [transactions, setTransactions] = useState<AllTransactions[]>([]);
  const [toggleFilterInc, setToggleFilterInc] = useState(true);
  const [toggleFilterExp, setToggleFilterExp] = useState(true);
  const [showFilter, setShowFilter] = useState(false); // show filter modal
  const [showSelectMenu, setShowSelectMenu] = useState(false); // show add transaction selection modal (income/expense)
  const [isRangeDate, setIsRangeDate] = useState(false);
  const [monthRecap, setMonthRecap] = useState<TransactionsMonthRecap>({
    amountDiff: 0,
    totalExpenses: 0,
    totalIncomes: 0,
  });

  //filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [monthFilter, setMonthFilter] = useState(new Date());
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [formDate, setFormDate] = useState("");
  const [hasFilter, setHasFilter] = useState(false);

  // const [dateRangeState, setDateRangeState] = useState<Range[]>([
  //   {
  //     startDate: new Date(),
  //     endDate: new Date(),
  //     key: "selection",
  //   },
  // ]);

  const clearFilters = () => {
    setHasFilter(false);
    setToggleFilterExp(true);
    setToggleFilterInc(true);
    setStartDateFilter("");
    setEndDateFilter("");
    setMonthFilter(new Date());
    setSearchQuery("");
    // setDateRangeState([{ startDate: new Date(0), endDate: new Date() }]);
    //change filter string here
  };

  const fetchRecapData = async () => {
    await requestAxios({
      url: baseUrl + `/transactions/me/month-recap?month=${monthFilter}`,
      method: "GET",
    })
      .then((res) => setMonthRecap(res.data))
      .catch((error) => CustomAlert({ linkToConfirm: UserPath.TRANSACTION, text: error }));
  };

  const fetchTransactionsWithFilters = async () => {
    let filterArr: string[] = [];
    filterArr.push(`includeExp=${toggleFilterExp}`);
    filterArr.push(`includeInc=${toggleFilterInc}`);
    // if (searchQuery) filterArr.push(`search=${searchQuery}`);

    if (isRangeDate) {
      setMonthFilter(new Date(startDateFilter));
      filterArr.push(`start_date=${new Date(startDateFilter)}`);
      filterArr.push(`end_date=${new Date(endDateFilter)}`);
      console.log(filterArr);
    } else {
      if (startDateFilter) {
        setMonthFilter(new Date(startDateFilter));
        filterArr.push(`start_date=${new Date(startDateFilter)}`);
        filterArr.push(`end_date=${new Date(startDateFilter)}`);
        // console.log(filterArr);
      }
    }
    let filterString: string = "?" + filterArr.join("&");
    fetchTransactions(filterString, searchQuery);
  };

  const fetchTransactions = async (filterString?: string, search?: string) => {
    requestAxios({
      url: baseUrl + "/transactions/me" + filterString,
      method: "GET",
    })
      .then((res) => {
        if (search) {
          setHasFilter(true);
          let filteredSearch: AllTransactions[] = [];
          transactions.map((data) => {
            if (data.title.toLowerCase().includes(search.toLowerCase())) {
              filteredSearch.push(data);
            }
          });
          return setTransactions(filteredSearch);
        }
        return setTransactions(res.data);
      })
      .catch((error: AxiosError) => {
        return CustomAlert({ linkToConfirm: UserPath.TRANSACTION, text: error.message });
      });
  };

  useEffect(() => {
    fetchTransactions(`?includeExp=true&includeInc=true`);
    fetchRecapData();
  }, []);

  useEffect(() => {
    setHasFilter(true);
    fetchTransactionsWithFilters();
  }, [searchQuery, startDateFilter, endDateFilter, toggleFilterExp, toggleFilterInc, hasFilter]);

  useEffect(() => {
    fetchRecapData();
  }, [monthFilter]);

  const IncExpBox = () => {
    return (
      <div
        id="ie-info-box"
        className="border shadow-md rounded-md grid grid-cols-2 px-3 py-2.5 gap-5 w-full lg:w-fit">
        <div className="flex flex-col gap-1 text-center">
          <div className="inline-flex m-auto gap-1">
            <MdArrowCircleDown className="my-auto text-moneySafe" />
            <h5 className="text-sm">Pemasukan</h5>
          </div>
          <p className="text-base text-moneySafe font-semibold">
            Rp {numFormatter(monthRecap.totalIncomes)}
          </p>
        </div>
        <div className="flex flex-col gap-1 text-center">
          <div className="inline-flex m-auto gap-1">
            <MdArrowCircleUp className="my-auto text-moneyDanger" />
            <h5 className="text-sm">Pengeluaran</h5>
          </div>
          <p className="text-base text-moneyDanger font-semibold">
            Rp {numFormatter(monthRecap.totalExpenses)}
          </p>
        </div>
      </div>
    );
  };

  const MoneyLeft = () => {
    return (
      <div className="gap-1 flex flex-col my-auto">
        <p className="text-sm capitalize">
          Sisa uang kamu bulan {moment(monthFilter).format("MMMM")}
        </p>
        <h4
          className={
            `text-2xl font-semibold ` +
            (monthRecap.amountDiff >= 0 ? "text-moneySafe" : "text-moneyDanger")
          }>
          Rp {(monthRecap.amountDiff >= 0 ? "" : "-") + numFormatter(monthRecap.amountDiff)}
        </h4>
      </div>
    );
  };

  return (
    <TransactionLayout backTo={UserPath.HOME}>
      <section className="col-span-4 gap-10 flex flex-col h-max-fit">
        <div id="transactions-recap" className="flex flex-col gap-5">
          <div className="flex flex-row justify-between">
            <h2 className="text-2xl text-gray-800 font-semibold col-span-4">Transaksi</h2>
          </div>
          <div
            className="flex flex-col lg:flex-row lg:justify-between text-center md:text-left gap-4 col-span-4"
            id="ie-info">
            <MoneyLeft />
            <IncExpBox />
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    id="search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue block w-full pl-10 p-2.5 "
                    placeholder="Cari transaksi"
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
                      <h4 className="text-base font-semibold">Tampilkan Transaksi</h4>

                      <div className="flex flex-row gap-4" id="toggle-show-type">
                        <div className="flex items-center" id="input-show-exp">
                          <input
                            id="showExpense"
                            type="checkbox"
                            checked={toggleFilterExp}
                            onChange={() => setToggleFilterExp(!toggleFilterExp)}
                            className={checkBoxStyle}
                          />
                          <label
                            htmlFor="showamount"
                            className="ml-2 text-sm font-medium text-gray-900">
                            Pengeluaran
                          </label>
                        </div>
                        <div className="flex items-center" id="input-show-inc">
                          <input
                            id="showIncome"
                            type="checkbox"
                            checked={toggleFilterInc}
                            onChange={() => setToggleFilterInc(!toggleFilterInc)}
                            className={checkBoxStyle}
                          />
                          <label
                            htmlFor="showamount"
                            className="ml-2 text-sm font-medium text-gray-900">
                            Pemasukan
                          </label>
                        </div>
                      </div>
                    </div>

                    <div id="trans-date-filter" className="flex flex-col gap-y-3">
                      <h4 className="text-base font-semibold">Tanggal Transaksi</h4>
                      <InputForm
                        label={isRangeDate ? "Dari Tanggal" : ""}
                        id={"start_date"}
                        className="text-sm">
                        <input
                          type="date"
                          className={baseFormStyle}
                          onChange={(e) => setStartDateFilter(e.target.value)}
                        />
                      </InputForm>
                      {isRangeDate ? (
                        <InputForm label={"Sampai Tanggal"} id={"end_date"} className="text-sm">
                          <input
                            type="date"
                            className={baseFormStyle}
                            onChange={(e) => setEndDateFilter(e.target.value)}
                          />
                        </InputForm>
                      ) : (
                        ""
                      )}

                      <div className="flex items-center">
                        <input
                          id="showamount"
                          type="checkbox"
                          checked={isRangeDate}
                          onChange={() => setIsRangeDate(!isRangeDate)}
                          className="w-4 h-4 text-blue bg-gray-100 border-gray-300 rounded cursor-pointer"
                        />
                        <label
                          htmlFor="showamount"
                          className="ml-2 text-sm font-medium text-gray-900">
                          Rentang Periode
                        </label>
                      </div>
                    </div>
                    <div
                      id="filter-submit-btn"
                      className="grid grid-cols-1 md:grid-cols-2 gap-3 place-content-center">
                      <button
                        type="button"
                        onClick={() => setShowFilter(false)}
                        className={
                          "text-white bg-palepurple hover:bg-hovpalepurple" +
                          " w-full p-2.5 text-sm font-medium border border-palepurple rounded-md transition-all duration-150"
                        }>
                        Selesai
                      </button>
                      <button
                        type="reset"
                        onClick={() => clearFilters()}
                        className={
                          "text-palepurple bg-transparent hover:bg-hovoutpurple " +
                          " order-last w-full p-2.5 text-sm font-medium border border-palepurple rounded-md transition-all duration-200"
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
                {transactions.length > 0 ? (
                  transactions.map((item, index) => (
                    <TransactionListItem
                      title={item.title}
                      wallet={item.wallet?.name}
                      icon={item.category.icon}
                      date={item.date}
                      amount={item.amount}
                      dataId={item.id}
                      type={item.type}
                      key={index}
                    />
                  ))
                ) : transactions.length == 0 &&
                  monthRecap.totalExpenses == 0 &&
                  monthRecap.totalIncomes == 0 ? (
                  <Alert
                    text="Belum ada transaksi dibuat"
                    type={"info"}
                    className="md:w-[50%] m-auto"
                  />
                ) : (
                  <NotFoundImage text="Pencarian tidak ditemukan" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </TransactionLayout>
  );
}
