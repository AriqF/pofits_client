import BudgetCard from "@/components/tools/card/budget-card";
import Container from "@/components/tools/container";
import MenuOptionItem from "@/components/tools/menu/menu-box/menu-option";
import { UserPath } from "@/utils/global/route-path";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { BudgetMonthRecap, ProBudgetData } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useState, useEffect, ChangeEvent } from "react";
import { Doughnut } from "react-chartjs-2";
import { MdExpandMore, MdHistory, MdLibraryAdd, MdRequestPage, MdSearch } from "react-icons/md";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import BudgetPageLayout from "@/components/layouts/user/budget/budget-layout";
import { CustomAlert, numFormatter } from "@/utils/helper";
import moment from "moment";

interface FilterProps {
  search?: string;
  date?: Date;
}

export default function BudgetPage() {
  // const [monthRecap, setMonthRecap] = useState({
  //   totalUsed: 0,
  //   totalRemaining: 0,
  //   percentageUsed: 0,
  //   totalBudget: 0,
  //   borderBudget: 0,
  // });
  const [budgets, setBudget] = useState<ProBudgetData[]>([]);
  const [monthRecap, setMonthRecap] = useState<BudgetMonthRecap>({
    borderBudget: 0,
    percentageUsed: 0,
    totalBudget: 0,
    totalRemaining: 0,
    totalUsed: 0,
  });
  const [monthFilter, setMonthFilter] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const router = useRouter();

  const getFiltered = async (e: any) => {
    e.preventDefault();
    setSelectedMonth(monthFilter);
  };

  const getMonthRecapBudget = async (month: Date) => {
    await requestAxios({
      url: baseUrl + "/budget/me/month-recap" + `?month=${month}`,
      method: "GET",
    })
      .then((res) => {
        setMonthRecap(res.data);
      })
      .catch((error) => {
        return CustomAlert({ linkToConfirm: "/me/settings/expense-category" });
      });
  };

  const getBudgets = async (month: Date) => {
    await requestAxios({
      url: baseUrl + "/budget/me" + `?month=${month}`,
      method: "GET",
    })
      .then((res) => {
        setBudget(res.data);
      })
      .catch((error) => {});
  };

  ChartJS.register(ArcElement, Tooltip, Legend);
  const chartOptions = {
    responsive: true,
    cutout: "70%",
    // plugins: {
    //   title: {
    //     display: true,
    //     text: "Anggaran Pengeluaran Bulan Ini",
    //   },
    // },
  };

  useEffect(() => {
    setMonthFilter(new Date());
    getBudgets(monthFilter);
    getMonthRecapBudget(monthFilter);
  }, []);

  useEffect(() => {
    getBudgets(selectedMonth);
    getMonthRecapBudget(selectedMonth);
  }, [selectedMonth]);

  return (
    <BudgetPageLayout backTo={UserPath.HOME}>
      <section className="md:col-span-1 md:order-last ">
        <Container
          id="budget-menu"
          className="p-3 flex lg:flex-col gap-y-2 md:bg-white md:border-2">
          <div className="space-y-4">
            <div className="max-h-[300px] lg:max-h-[240px] max-w-fit flex m-auto">
              <Doughnut
                data={{
                  labels: ["Terpakai", "Belum Terpakai"],
                  datasets: [
                    {
                      label: "Rp",
                      data: [monthRecap.totalUsed, monthRecap.totalRemaining],
                      backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(75, 192, 192, 0.2)"],
                      borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-base">
                Anggaran Pengeluaran {moment(selectedMonth).format("MMMM YYYY")}
              </h3>
              <p className="text-sm text-mute">
                <span
                  className={
                    (monthRecap.totalRemaining <= monthRecap.borderBudget
                      ? "text-moneyDanger "
                      : "text-moneySafe ") + ` font-bold`
                  }>
                  Rp {numFormatter(monthRecap.totalRemaining)}
                </span>{" "}
                Tersisa dari{" "}
                <span className="font-bold">Rp {numFormatter(monthRecap.totalBudget)}</span>
              </p>
            </div>
            <div className="w-full grid grid-cols-1 gap-y-2">
              <MenuOptionItem
                linkTo={UserPath.BUDGET_ADD}
                className={
                  "bg-palepurple hover:bg-hovpalepurple text-white rounded-md text-center place-content-center md:place-content-center  "
                }>
                <MdLibraryAdd className="flex-inline my-auto text-xl mr-2" />
                <h4>Tambah Anggaran</h4>
              </MenuOptionItem>
              {/* <MenuOptionItem
                linkTo={UserPath.BUDGET_HISTORY}
                className={
                  "text-blue hover:text-white border border-blue hover:bg-blue font-medium rounded-md  text-center place-content-center md:place-content-center transition-colors duration-150 ease-in "
                }>
                <MdHistory className="flex-inline my-auto text-xl mr-2" />
                <h4>Lihat Riwayat</h4>
              </MenuOptionItem> */}
            </div>
          </div>
        </Container>
      </section>
      <section id="budget-content" className={"md:col-span-2 w-full space-y-4 "}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
          <h3 className="text-2xl text-gray-600">
            Anggaran Bulan {moment(selectedMonth).format("MMMM YYYY")}
          </h3>
        </div>
        <form className="inline-flex w-full" onSubmit={getFiltered}>
          <input
            onChange={(e) => setMonthFilter(new Date(e.target.value))}
            className="cursor-pointer z-10 inline-flex items-center py-2.5 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-md hover:bg-gray-200"
            type="month"
          />
          <button
            type="submit"
            className="p-2.5 text-sm font-medium text-white bg-blue rounded-r-md border border-blue hover:bg-hovblue">
            <MdSearch className="text-xl" />
            <span className="sr-only">Search</span>
          </button>
        </form>
        {/* <hr className="border-b border-2 w-[50%] border-gray-500 hidden md:flex" /> */}
        {budgets.map((budget, index) => (
          //value used budget diganti dengan sisa budget (budget - jml transaksi)
          <BudgetCard
            usedBudget={budget.amountUsed}
            budget={budget.amount}
            title={budget.category.title}
            icon={budget.category.icon}
            id={budget.id}
            key={index}
            date={budget.start_date}
            percentage={budget.percentageUsed}
            remaining={budget.amountRemaining}
          />
        ))}
      </section>
    </BudgetPageLayout>
  );
}
