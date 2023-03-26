import UserBaseLayout from "@/components/layouts/user/layouts";
import BudgetCard from "@/components/tools/card/budget-card";
import Container from "@/components/tools/container";
import MenuOptionItem from "@/components/tools/menu/menu-box/menu-option";
import { UserPath } from "@/utils/global/route-path";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { BudgetData } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { MdChevronLeft, MdExpandMore, MdLibraryAdd, MdRequestPage } from "react-icons/md";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import BudgetPageLayout from "@/components/layouts/user/budget/budget-layout";

export default function BudgetPage() {
  const [budgets, setBudget] = useState<BudgetData[]>([]);
  const router = useRouter();

  const getBudgets = async () => {
    await requestAxios({
      url: baseUrl + "/budget/me",
      method: "GET",
    })
      .then((res) => {
        setBudget(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  ChartJS.register(ArcElement, Tooltip, Legend);
  const chartOptions = {
    responsive: true,
    cutout: "70%",
    plugins: {
      title: {
        display: true,
        text: "Anggaran Pengeluaran Bulan Maret 2023",
      },
    },
  };

  const chartData = {
    labels: ["Terpakai", "Belum Terpakai"],
    datasets: [
      {
        label: "Rp",
        data: [200000, 500000],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    getBudgets();
  }, []);

  return (
    <BudgetPageLayout backTo={UserPath.HOME}>
      <section className="md:col-span-1 md:order-last ">
        <Container
          id="budget-menu"
          className="flex lg:flex-col gap-y-2 place-content-center md:bg-white md:border-2">
          <div className="space-y-4">
            <div className="max-h-[300px] lg:max-h-[240px] max-w-fit flex m-auto">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-base">Anggaran Pengeluaran Bulan Maret 2023</h3>
              <p className="text-sm text-mute">
                <span className="text-moneySafe">Rp200.000</span> Terpakai dari Rp500.000
              </p>
            </div>
            <div className="w-full grid grid-cols-1">
              <MenuOptionItem
                linkTo={UserPath.BUDGET_ADD}
                className={
                  "bg-palepurple hover:bg-hovpalepurple text-white rounded-md text-center place-content-center md:place-content-center "
                }>
                <MdLibraryAdd className="flex-inline my-auto text-xl mr-2" />
                <h4>Tambah Anggaran</h4>
              </MenuOptionItem>
            </div>
          </div>
        </Container>
      </section>
      <section id="budget-content" className={"md:col-span-2 w-full space-y-4 "}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
          <h3 className="text-2xl text-gray-600">Atur Anggaran</h3>
          <button
            id="dropdown"
            data-dropdown-toggle="dropdowfilter"
            className="md:ml-auto text-center place-content-center w-5/12 text-white bg-blue hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-blue font-medium rounded-md text-md px-2 py-2.5 inline-flex items-center"
            type="button">
            Bulan ini <MdExpandMore className="text-2xl my-auto" />
          </button>
          <div
            id="dropdowfilter"
            className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 ">
            <ul className="py-2 text-sm text-gray-700 " aria-labelledby="dropdown">
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                  Semua
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                  Bulan ini
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                  Bulan lalu
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                  Bulan depan
                </a>
              </li>
            </ul>
            <div className="py-2">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ">
                Bulan lainnya
              </a>
            </div>
          </div>
        </div>
        {/* <hr className="border-b border-2 w-[50%] border-gray-500 hidden md:flex" /> */}
        {budgets.map((budget, index) => (
          //value used budget diganti dengan sisa budget (budget - jml transaksi)
          <BudgetCard
            usedBudget={100000}
            budget={budget.amount}
            title={budget.category.title}
            icon={budget.category.icon}
            id={budget.id}
            key={index}
            date={budget.start_date}
          />
        ))}
      </section>
    </BudgetPageLayout>
  );
}
