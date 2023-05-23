import GoalCard from "@/components/layouts/user/finance-goals/goals-card";
import UserBaseLayout from "@/components/layouts/user/layouts";
import ReportCard from "@/components/layouts/user/report/report-card";
import { UserPath } from "@/utils/global/route-path";
import { CustomAlert } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import {
  AnnualChartDatasets,
  AnnualTransaction,
  FinanceGoal,
  TransactionsMonthRecap,
} from "@/utils/interfaces/server-props";
import moment from "moment";
import { useEffect, useState } from "react";
import { MdAllInbox, MdChevronLeft, MdTrendingDown, MdTrendingUp } from "react-icons/md";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import Alert from "@/components/tools/alerts/alert";
import Link from "next/link";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartOption = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Pemasukan & Pengeluaran Tahun " + moment(new Date()).format("YYYY"),
    },
  },
};
const chartLabels = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function MyDashboard() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [goals, setGoals] = useState<FinanceGoal[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [transactionRecap, setTransactionRecap] = useState<TransactionsMonthRecap>({
    totalExpenses: 0,
    totalIncomes: 0,
    totalBudget: 0,
    amountDiff: 0,
  });
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartDatasets, setChartDatasets] = useState<AnnualChartDatasets[]>([]);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const [user, transRecap, goals, annualTrans] = await Promise.all([
        requestAxios({ url: "/user/me", method: "GET" }),
        requestAxios({
          url: "/transactions/me/month-recap?month=" + moment(currentMonth).format("YYYY-MM-DD"),
        }),
        requestAxios({ url: "/finance-goal/all?take=3&achieved=false", method: "GET" }),
        requestAxios({
          url: "/transactions/me/annual-recap?date=" + moment(currentMonth).format("YYYY-MM-DD"),
        }),
      ]);
      setFirstname(user.data.firstname);
      setLastname(user.data.lastname);
      setTransactionRecap(transRecap.data);
      setGoals(goals.data);

      const annualExp: AnnualTransaction[] = annualTrans.data.expenses;
      const annualInc: AnnualTransaction[] = annualTrans.data.incomes;
      let labelsExp: string[] = annualExp.map((data) => data.month);
      let labelsInc: string[] = annualInc.map((data) => data.month);
      const uniqueMonths = Array.from(new Set(labelsExp.concat(labelsInc)));
      setChartLabels(uniqueMonths);
      let annualExpData: AnnualChartDatasets = {
        label: "Pengeluaran",
        data: annualExp.map((data) => data.total_amount),
        backgroundColor: "#c74238",
      };
      let annualIncData: AnnualChartDatasets = {
        data: annualInc.map((data) => data.total_amount),
        backgroundColor: "#1ac1c7",
        label: "Pemasukan",
      };
      setChartDatasets([annualExpData, annualIncData]);
    } catch (error) {
      return CustomAlert({
        linkToConfirm: UserPath.HOME,
        confirmReload: true,
        text: String(error),
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Overview = () => {
    return (
      <section className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between">
          <h5 className="text-base font-semibold my-auto capitalize">
            Ringkasan akun Bulan {moment(new Date()).format("MMMM YYYY")}
          </h5>
          <a
            href={UserPath.MONTHLY_REPORT}
            className="text-sm my-auto text-blue hover:text-hovblue hover:underline">
            Lihat laporan
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 select-none">
          <ReportCard
            icon={MdTrendingUp}
            iconBgColor="bg-[#bcf4f6]"
            iconColor="text-moneySafe"
            title="Pemasukan"
            amount={transactionRecap.totalIncomes}
            linkButton={UserPath.TRANSACTION_INCOME_ADD}
          />
          <ReportCard
            icon={MdTrendingDown}
            iconBgColor="bg-[#f4d9d7]"
            iconColor="text-moneyDanger"
            title="Pengeluaran"
            amount={transactionRecap.totalExpenses}
            linkButton={UserPath.TRANSACTION_EXPENSE_ADD}
          />
          <ReportCard
            icon={MdAllInbox}
            iconBgColor="bg-[#c3d4ef]"
            iconColor="text-infoBlue"
            title="Total Anggaran"
            amount={transactionRecap.totalBudget ? transactionRecap.totalBudget : 0}
            linkButton={UserPath.BUDGET_ADD}
          />
        </div>
      </section>
    );
  };

  const UserGoals = () => {
    return (
      <section className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row justify-between">
          <h5 className="text-base font-semibold capitalize my-auto">
            Jangan lupa rencana keuanganmu
          </h5>
          <Link
            href={UserPath.FINANCE_GOAL}
            className="text-sm my-auto text-blue hover:text-hovblue hover:underline">
            Lihat lebih banyak
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {goals.map((goal, index) => (
            <GoalCard
              key={index}
              dataId={goal.id}
              title={goal.title}
              timebound={goal.timebound}
              severity={goal.priority}
              amountTarget={goal.amount_target}
              amountReached={goal.amount_reached}
              percentage={goal.percentage}
              isAchieved={goal.isAchieved}
            />
          ))}
        </div>
      </section>
    );
  };

  const AnnualChart = () => {
    return (
      <section className="flex flex-col gap-3 h-96 md:h-80">
        <Bar
          options={chartOption}
          data={{
            labels: chartLabels,
            datasets: chartDatasets,
          }}
        />
      </section>
    );
  };

  return (
    <UserBaseLayout classname="gap-7 text-gray-700">
      <section className="flex flex-col gap-5">
        <h1 className="text-2xl mt-8 text-gray-700 font-semibold select-none">
          Selamat datang kembali,{"  "}
          <span className="capitalize no-select">{firstname}</span>!
        </h1>
        {isFetching ? (
          <Alert text={"Loading data.."} className="w-full lg:w-fit" type={"info"} />
        ) : (
          ""
        )}
      </section>

      <Overview />
      {goals.length > 0 ? <UserGoals /> : ""}
      <AnnualChart />
    </UserBaseLayout>
  );
}

// <UserLayout>
//   <div className="flex flex-col m-auto">
//     <div id="dev-header">
//       <h2 className="text-center text-xl">Dashboard User</h2>
//     </div>
//     <div className="flex md:flex-row flex-col md:space-x-4 md:space-y-0 space-y-3 mt-4 text-center m-auto">
//       <a href="#">Transaksi</a>

//       <a href="me/budget">Penganggaran</a>

//       <a href="me/settings/wallets">Dompet Saya</a>
//     </div>
//   </div>
// </UserLayout>
