import BudgetPageLayout from "@/components/layouts/user/budget/budget-layout";
import BudgetCard from "@/components/tools/card/budget-card";
import Container from "@/components/tools/container";
import MenuOptionItem from "@/components/tools/menu/menu-box/menu-option";
import { UserPath } from "@/utils/global/route-path";
import { CustomAlert, numFormatter } from "@/utils/helper";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { MdHistory, MdLibraryAdd, MdSearch } from "react-icons/md";
import budget from "../budget";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { IncomeEstimationData, IncomeEstimationRecap } from "@/utils/interfaces/server-props";
import IncomeTargetList from "@/components/tools/list/income-target-list";
import Alert from "@/components/tools/alerts/alert";

ChartJS.register(ArcElement, Tooltip, Legend);
const chartOptions = {
  responsive: true,
  cutout: "70%",
};
export default function IncomeTargetIndex() {
  // const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [monthFilter, setMonthFilter] = useState(moment(new Date()).format("YYYY-MM"));
  const [incomeTarget, setIncomeTarget] = useState<IncomeEstimationData[]>([]);
  const [monthRecap, setMonthRecap] = useState<IncomeEstimationRecap>({
    totalAchieved: 0,
    totalUnachieved: 0,
    totalTarget: 0,
    percentageAchieved: 0,
  });
  const router = useRouter();

  const getIncomeTargets = async (month: string) => {
    await requestAxios({
      url: baseUrl + "/income-estimation/me" + `?month=${month}`,
      method: "GET",
    })
      .then((res) => {
        setIncomeTarget(res.data);
      })
      .catch((error) => {
        console.log("GET ALL ERR");
        console.log(error);
        CustomAlert({ linkToConfirm: UserPath.HOME, text: error });
      });
  };

  const getMonthRecap = async (month: string) => {
    await requestAxios({
      url: baseUrl + "/income-estimation/me/month-recap" + `?month=${month}`,
    })
      .then((res) => {
        setMonthRecap(res.data);
      })
      .catch((error) => {
        console.log("GET RECAP ERR");
        console.log(error);
        CustomAlert({ linkToConfirm: UserPath.HOME });
      });
  };

  useEffect(() => {
    getMonthRecap(monthFilter);
    getIncomeTargets(monthFilter);
  }, [monthFilter]);

  return (
    <BudgetPageLayout backTo={UserPath.HOME}>
      <section className="md:col-span-1 md:order-last ">
        <Container
          id="income-chart"
          className="p-3 flex lg:flex-col gap-y-2 md:bg-white md:border-2">
          <div className="space-y-4">
            <div className="max-h-[300px] lg:max-h-[240px] max-w-fit flex m-auto">
              <Doughnut
                data={{
                  labels: ["Tercapai", "Belum Tercapai"],
                  datasets: [
                    {
                      label: "Rp",
                      data: [monthRecap.totalAchieved, monthRecap.totalUnachieved],
                      backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
                      borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-base">
                Target Pemasukan {moment(new Date()).format("MMMM YYYY")}
              </h3>
              <p className="text-sm">
                <span className="text-moneySafe font-bold">
                  Rp {numFormatter(monthRecap.totalAchieved)}
                </span>{" "}
                Tercapai dari{" "}
                <span className="font-bold text-blue">
                  Rp {numFormatter(monthRecap.totalTarget)}
                </span>
              </p>
            </div>
            <div className="w-full grid grid-cols-1 gap-y-2">
              <MenuOptionItem
                linkTo={UserPath.ESTIMATION_ADD}
                className={
                  "bg-palepurple hover:bg-hovpalepurple text-white rounded-md text-center place-content-center md:place-content-center  "
                }>
                <MdLibraryAdd className="flex-inline my-auto text-xl mr-2" />
                <h4>Tambah Target</h4>
              </MenuOptionItem>
              {/* <MenuOptionItem
                linkTo={UserPath.BUDGET_HISTORY}
                className={
                  "text-blue hover:text-white border border-blue hover:bg-blue font-medium rounded-md text-center place-content-center md:place-content-center transition-colors duration-150 ease-in "
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
            Target Pemasukan {moment(monthFilter).format("MMMM YYYY")}
          </h3>
        </div>
        <form className="inline-flex w-full">
          <input
            onChange={(e) => setMonthFilter(e.target.value)}
            defaultValue={monthFilter}
            className="cursor-pointer z-10 inline-flex items-center py-2.5 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            type="month"
          />
        </form>
        {incomeTarget.length > 0 ? (
          incomeTarget.map((data, index) => (
            <IncomeTargetList
              key={index}
              title={data.category.title}
              icon={data.category.icon}
              targetAmount={data.amount}
              achievedAmount={data.amountAchieved}
              id={data.id}
              date={data.start_date}
              isAchieved={data.isAchieved}
            />
          ))
        ) : (
          <Alert
            text={"Target pemasukan belum diatur"}
            type={"warning"}
            className="py-3.5 text-sm"
          />
        )}
      </section>
    </BudgetPageLayout>
  );
}
