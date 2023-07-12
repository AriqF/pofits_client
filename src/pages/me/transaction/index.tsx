import TransactionLayout from "@/components/layouts/user/transaction/transaction-layout";
import Alert from "@/components/tools/alerts/alert";
import NotFoundImage from "@/components/tools/alerts/notfound-image";
import DefaultButton from "@/components/tools/button";
import LinkButton from "@/components/tools/button/link-button";
import TransactionListItem from "@/components/tools/list/page/transaction-list";
import { UserPath } from "@/utils/global/route-path";
import { baseFormStyle } from "@/utils/global/style";
import { CustomAlert, currencyFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { AllTransactions, TransactionsMonthRecap } from "@/utils/interfaces/server-props";
import { AxiosError } from "axios";
import { error } from "console";
import moment from "moment";
import Link from "next/link";
import { string } from "prop-types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdAdd, MdArrowCircleDown, MdArrowCircleUp, MdSearch } from "react-icons/md";

interface SearchProps {
  setFunction: Dispatch<SetStateAction<string>>;
  searchText: string;
}

export default function NewTransactionsIndex() {
  const [expenses, setExpenses] = useState<AllTransactions[]>([]);
  const [incomes, setIncomes] = useState<AllTransactions[]>([]);
  const [monthFilter, setMonthFilter] = useState(new Date());
  const [expSearch, setExpSearch] = useState("");
  const [incSearch, setIncSearch] = useState("");
  const [monthRecap, setMonthRecap] = useState<TransactionsMonthRecap>({
    amountDiff: 0,
    totalExpenses: 0,
    totalIncomes: 0,
  });

  const fetchExpenses = async (search?: string) => {
    requestAxios({
      url:
        baseUrl +
        "/transactions/me?expenses=true&incomes=false" +
        `&start_date=${new Date(moment(monthFilter).startOf("month").format("YYYY-MM-DD"))}` +
        `&end_date=${new Date(moment(monthFilter).endOf("month").format("YYYY-MM-DD"))}` +
        (search ? `&search=${search}` : ""),
      method: "GET",
    })
      .then((res) => {
        setExpenses(res.data);
      })
      .catch((error: AxiosError<AllTransactions[]>) => {
        alert(error.cause?.message);
      });
  };

  const fetchIncome = async (search?: string) => {
    requestAxios({
      url:
        baseUrl +
        "/transactions/me?expenses=false&incomes=true" +
        `&start_date=${new Date(moment(monthFilter).startOf("month").format("YYYY-MM-DD"))}` +
        `&end_date=${new Date(moment(monthFilter).endOf("month").format("YYYY-MM-DD"))}` +
        (search ? `&search=${search}` : ""),
      method: "GET",
    })
      .then((res) => {
        setIncomes(res.data);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const fetchTransactions = async () => {
    try {
      const [expenseRes, incomeRes, recapRes] = await Promise.all([
        requestAxios({
          url:
            baseUrl +
            "/transactions/me?expenses=true&incomes=false" +
            `&start_date=${new Date(moment(monthFilter).startOf("month").format("YYYY-MM-DD"))}` +
            `&end_date=${new Date(moment(monthFilter).endOf("month").format("YYYY-MM-DD"))}`,
          method: "GET",
        }),
        requestAxios({
          url:
            baseUrl +
            "/transactions/me?expenses=false&incomes=true" +
            `&start_date=${new Date(moment(monthFilter).startOf("month").format("YYYY-MM-DD"))}` +
            `&end_date=${new Date(moment(monthFilter).endOf("month").format("YYYY-MM-DD"))}`,
          method: "GET",
        }),
        requestAxios({
          url:
            baseUrl +
            `/transactions/me/month-recap?month=${moment(monthFilter)
              .startOf("month")
              .format("YYYY-MM-DD")}`,
          method: "GET",
        }),
      ]);
      setExpenses(expenseRes.data);
      setIncomes(incomeRes.data);
      setMonthRecap(recapRes.data);
    } catch (error) {
      return CustomAlert({
        linkToConfirm: UserPath.HOME,
        confirmReload: true,
        text: String(error),
      });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [monthFilter]);

  useEffect(() => {
    fetchExpenses(expSearch);
  }, [expSearch, monthFilter]);

  useEffect(() => {
    fetchIncome(incSearch);
  }, [incSearch, monthFilter]);

  const MoneyLeft = () => {
    return (
      <div className="gap-1 flex flex-col my-auto">
        <p className="text-sm capitalize">Saldo Bulan {moment(monthFilter).format("MMMM")}</p>
        <h4
          className={
            `text-2xl font-semibold ` +
            (monthRecap.amountDiff >= 0 ? "text-moneySafe" : "text-moneyDanger")
          }>
          {currencyFormatter(monthRecap.amountDiff)}
        </h4>
      </div>
    );
  };

  const MonthFilterInput = () => {
    return (
      <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-fit">
        <input
          type="month"
          id="month"
          className={baseFormStyle}
          onChange={(e) => setMonthFilter(new Date(e.target.value))}
          defaultValue={moment(monthFilter).format("YYYY-MM")}
          lang="id"
        />
      </div>
    );
  };

  return (
    <TransactionLayout backTo={UserPath.HOME}>
      <section className="col-span-4 gap-10 flex flex-col h-max-fit">
        <div id="transactions-recap" className="flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row justify-between gap-5">
            <h2 className="text-2xl text-gray-800 font-semibold">Transaksi Saya</h2>
            <MonthFilterInput />
            {/* <h2 className="text-2xl text-gray-800 font-semibold">Transaksi Saya</h2> */}
          </div>
          <div
            className="flex flex-col lg:flex-row lg:justify-between text-left md:text-left gap-4 col-span-4"
            id="ie-info">
            <MoneyLeft />
          </div>
        </div>
        <div id="transactions-history" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div id="incomes" className="flex flex-col gap-y-3">
            <div className="flex flex-col lg:flex-row justify-between gap-2">
              <div className="flex flex-col gap-y-1">
                <h5 className="text-lg font-semibold">Pemasukan</h5>
                <p className="text-base">
                  Total Pemasukan:{" "}
                  <span className="text-moneySafe font-semibold">
                    {currencyFormatter(monthRecap.totalIncomes)}
                  </span>
                </p>
              </div>
              <div className="flex my-auto">
                <LinkButton
                  // title="Tambah pemasukan"
                  text="Tambah Pemasukan"
                  className="flex text-sm bg-palepurple  hover:bg-moneySafe hover:text-white text-white border text-center focus:bg-moneySafe focus:text-white"
                  linkTo={UserPath.TRANSACTION_INCOME_ADD}
                  icon={MdArrowCircleDown}
                  type={"button"}
                  color={"custom"}
                />
              </div>
              {/* <MdAdd className="text-base" /> */}
            </div>

            <div id="search-filter" className="flex flex-col gap-4">
              <form className="flex items-center gap-2">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MdSearch className="text-xl" />
                  </div>
                  <input
                    onChange={(e) => setIncSearch(e.target.value)}
                    type="text"
                    id="search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 "
                    placeholder={"Cari pemasukan"}
                  />
                </div>
              </form>
            </div>
            <div className="overflow-auto max-h-96">
              {/* <p>{expenses[0].title}</p> */}
              {incomes.length > 0 ? (
                incomes.map((item, index) => (
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
              ) : incomes.length == 0 ? (
                <Alert text="Belum ada pemasukan" type={"info"} className="md:w-[50%] m-auto" />
              ) : (
                <NotFoundImage text="Pencarian tidak ditemukan" />
              )}
            </div>
          </div>
          <div id="expenses" className="flex flex-col gap-y-3">
            <div className="flex lg:flex-row flex-col justify-between gap-2">
              <div className="flex flex-col gap-y-1">
                <h5 className="text-lg font-semibold">Pengeluaran</h5>
                <p className="text-base">
                  Total Pengeluaran:{" "}
                  <span className="text-moneyDanger font-semibold">
                    {currencyFormatter(monthRecap.totalExpenses)}
                  </span>
                </p>
              </div>
              <div className="flex my-auto">
                <LinkButton
                  // title="Tambah pemasukan"
                  text="Tambah Pengeluaran"
                  className="flex text-sm bg-palepurple  hover:bg-moneyDanger hover:text-white text-white border text-center focus:bg-moneyDanger focus:text-white"
                  linkTo={UserPath.TRANSACTION_EXPENSE_ADD}
                  icon={MdArrowCircleUp}
                  type={"button"}
                  color={"custom"}
                />
              </div>
            </div>
            <div id="search-filter" className="flex flex-col gap-4">
              <form className="flex items-center gap-2">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MdSearch className="text-xl" />
                  </div>
                  <input
                    onChange={(e) => setExpSearch(e.target.value)}
                    type="text"
                    id="search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 "
                    placeholder={"Cari pengeluaran"}
                  />
                </div>
              </form>
            </div>
            <div className="overflow-auto max-h-96">
              {/* <p>{expenses[0].title}</p> */}
              {expenses.length > 0 ? (
                expenses.map((item, index) => (
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
              ) : expenses.length == 0 ? (
                <Alert text="Belum ada pengeluaran" type={"info"} className="md:w-[50%] m-auto" />
              ) : (
                <NotFoundImage text="Pencarian tidak ditemukan" />
              )}
            </div>
          </div>
        </div>
      </section>
    </TransactionLayout>
  );
}
