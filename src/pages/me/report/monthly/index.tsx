import ReportCard from "@/components/layouts/user/report/report-card";
import ReportLayout from "@/components/layouts/user/report/report-layout";
import { UserPath } from "@/utils/global/route-path";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";
import {
  MdAllInbox,
  MdAttachMoney,
  MdExpandLess,
  MdExpandMore,
  MdTrendingDown,
  MdTrendingUp,
} from "react-icons/md";
import ReportTransactionItem from "@/components/layouts/user/report/report-transaction-item";
import { useEffect, useState } from "react";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import moment from "moment";
import { AllocationChart, TransactionAllocation } from "@/utils/interfaces/server-props";
import { baseFormStyle } from "@/utils/global/style";
import Alert from "@/components/tools/alerts/alert";

const bgColors: string[] = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
];

const borderColors: string[] = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
];

export default function MonthlyReportIndex() {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const chartOptions = {
    cutout: "70%",
    showAllTooltips: true,
    responsive: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
    title: {
      display: false,
      text: "Chart.js Doughnut Chart",
    },
    // plugins: {
    //   tooltip: {
    //     callbacks: {
    //       label: function (context) {
    //         let label = context.dataset.label || "";
    //         if (label) {
    //           label += ": ";
    //         }
    //         if (context.parsed.y !== null) {
    //           console.log(context);
    //           label += "Rp " + numFormatter(context.parsed);
    //         }
    //         return label;
    //       },
    //     },
    //   },
    // },
  };
  const [showExpDetail, setShowExpDetail] = useState(false);
  const [showIncDetail, setShowIncDetail] = useState(false);
  const [monthInput, setMonthInput] = useState(moment(new Date()).format("YYYY-MM"));
  const [transactionInfo, setTransactionInfo] = useState({
    totalExpense: 0,
    totalIncome: 0,
    amountDiff: 0,
    totalBudget: 0,
  });
  const [expensesAllocation, setExpensesAllocation] = useState<TransactionAllocation[]>([]);
  const [incomesAllocation, setIncomesAllocation] = useState<TransactionAllocation[]>([]);
  const [expChartData, setExpChartData] = useState<AllocationChart>({
    labels: [],
    data: [],
  });
  const [incChartData, setIncChartData] = useState<AllocationChart>({
    labels: [],
    data: [],
  });

  const fetchMonthlyReport = async () => {
    await requestAxios({
      url: baseUrl + `/transactions/me/month-recap?month=${monthInput}`,
      method: "GET",
    })
      .then((res) => {
        const expData: TransactionAllocation[] = res.data.expensesAllocation;
        const incData: TransactionAllocation[] = res.data.incomesAllocation;

        setTransactionInfo({
          totalExpense: res.data.totalExpenses,
          totalIncome: res.data.totalIncomes,
          amountDiff: res.data.amountDiff,
          totalBudget: res.data.totalBudget,
        });
        setExpensesAllocation(expData);
        setIncomesAllocation(incData);

        let expLabels: string[] = expData.map((data) => data.cat_title);
        let expSpentData: number[] = expData.map((data) => data.total_spent);
        let incLabels: string[] = incData.map((data) => data.cat_title);
        let incSpentData: number[] = incData.map((data) => data.total_spent);
        setExpChartData({ labels: expLabels, data: expSpentData });
        setIncChartData({ labels: incLabels, data: incSpentData });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // //?fetch every 500ms?
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     fetchMonthlyReport();
  //   }, 500);

  //   return () => clearTimeout(timer);
  // });
  useEffect(() => {
    fetchMonthlyReport();
  }, [monthInput]);

  return (
    <ReportLayout backTo={UserPath.HOME}>
      <section id="header" className="grid grid-cols-1 gap-y-3 mb-2">
        <h2 className="text-2xl text-gray-600">
          Laporan Keuangan {moment(monthInput).format("MMMM YYYY")}
        </h2>
        <div className="flex flex-col lg:flex-row gap-3 mr-auto w-full lg:w-fit">
          <input
            type="month"
            id="month"
            className={baseFormStyle}
            onChange={(e) => setMonthInput(e.target.value)}
            defaultValue={monthInput}
            lang="id"
          />
          {/* <DefaultButton type={"submit"} color={"info"}>
            Atur
          </DefaultButton> */}
        </div>
        {/* <h4 className="text-lg text-gray-500 ">
          Saved: <span className="text-moneySafe font-bold">Rp 2.549.500</span>
        </h4> */}
      </section>
      <section
        id="recap-info"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <ReportCard
          icon={MdTrendingUp}
          iconBgColor="bg-[#bcf4f6]"
          iconColor="text-moneySafe"
          title="Pemasukan"
          amount={transactionInfo.totalIncome}
        />
        <ReportCard
          icon={MdTrendingDown}
          iconBgColor="bg-[#f4d9d7]"
          iconColor="text-moneyDanger"
          title="Pengeluaran"
          amount={transactionInfo.totalExpense}
        />
        <ReportCard
          icon={MdAttachMoney}
          iconBgColor="bg-[#e0c4ee]"
          iconColor="text-palepurple"
          title="Neraca"
          amount={transactionInfo.amountDiff}
        />
        <ReportCard
          icon={MdAllInbox}
          iconBgColor="bg-[#c3d4ef]"
          iconColor="text-infoBlue"
          title="Total Anggaran"
          amount={transactionInfo.totalBudget}
        />
      </section>
      <section
        id="recap-categories-chart"
        className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-7 select-none">
        <div className="flex flex-col gap-y-4" id="inc-cat-chart">
          <h4 className="text-base font-semibold mx-auto flex text-gray-600">
            Alokasi Pemasukan Per Kategori
          </h4>
          <ChartBox
            labels={incChartData.labels}
            data={incChartData.data}
            chartOptions={chartOptions}
          />
          <div className="border rounded-md shadow-sm p-2" id="exp-list-details">
            <a
              className="justify-between flex p-3 cursor-pointer"
              onClick={() => setShowIncDetail(!showIncDetail)}>
              <h5 className="text-base font-semibold text-gray-700 capitalize">Detail Alokasi</h5>
              {showIncDetail ? (
                <MdExpandLess className="text-2xl" />
              ) : (
                <MdExpandMore className="text-2xl" />
              )}
            </a>
            <div className={`${showIncDetail ? "" : "hidden"}`}>
              {incomesAllocation.length == 0 ? (
                <Alert text={"Belum ada pemasukan"} type={"info"} />
              ) : (
                incomesAllocation.map((data, index) => (
                  <ReportTransactionItem
                    key={index}
                    category={data.cat_title}
                    amount={data.total_spent}
                    percentage={data.percentage}
                    icon={data.cat_icon}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-4" id="exp-cat-chart">
          <h4 className="text-base font-semibold mx-auto flex text-gray-600">
            Alokasi Pengeluaran Per Kategori
          </h4>
          <ChartBox
            labels={expChartData.labels}
            data={expChartData.data}
            chartOptions={chartOptions}
          />
          <div className="border rounded-md shadow-sm p-2" id="exp-list-details">
            <a
              className="justify-between flex p-3 cursor-pointer"
              onClick={() => setShowExpDetail(!showExpDetail)}>
              <h5 className="text-base font-semibold text-gray-700 capitalize">Detail Alokasi</h5>
              {showExpDetail ? (
                <MdExpandLess className="text-2xl" />
              ) : (
                <MdExpandMore className="text-2xl" />
              )}
            </a>
            <div className={`${showExpDetail ? "" : "hidden"}`}>
              {expensesAllocation.length == 0 ? (
                <Alert text={"Belum ada pengeluaran"} type={"info"} />
              ) : (
                expensesAllocation.map((data, index) => (
                  <ReportTransactionItem
                    key={index}
                    category={data.cat_title}
                    amount={data.total_spent}
                    percentage={data.percentage}
                    icon={data.cat_icon}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      {/* <section className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div id="exp">
          <h4 className="text-lg font-semibold">Pengeluaran Per Kategori</h4>
          <ReportTransactionItem />
        </div>
        <div id="inc">
          <h4 className="text-lg font-semibold">Pemasukan Per Kategori</h4>
          <ReportTransactionItem />
        </div>
      </section> */}
    </ReportLayout>
  );
}

interface CBProps {
  labels: string[];
  data: number[];
  chartOptions: any;
}

const ChartBox = (props: CBProps) => {
  return (
    <div className="w-fit mx-auto">
      {props.data.length == 0 ? (
        <Alert text={"Belum ada grafik data"} type={"info"} />
      ) : (
        <Doughnut
          data={{
            labels: props.labels,
            datasets: [
              {
                label: "Rp",
                data: props.data,
                backgroundColor: bgColors,
                borderColor: borderColors,
                borderWidth: 1,
              },
            ],
          }}
          options={props.chartOptions}
        />
      )}
    </div>
  );
};
