import Container from "@/components/tools/container";
import MenuOptionItem from "@/components/tools/menu/menu-box/menu-option";
import { UserPath } from "@/utils/global/route-path";
import { ReactNode } from "react";
import { Doughnut } from "react-chartjs-2";
import { MdLibraryAdd, MdRequestPage } from "react-icons/md";

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

export default function BudgetChartSection(children: ReactNode) {
  return (
    <section className="md:col-span-1">
      <Container id="budget-menu" className="flex lg:flex-col gap-y-2 drop-shadow-md ">
        <div className="space-y-3">
          <div className="max-h-[300px] lg:max-h-[240px] max-w-fit flex m-auto">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-base">Anggaran Pengeluaran Bulan Maret 2023</h3>
            <p className="text-sm text-mute">
              <span className="text-moneySafe">Rp200.000</span> Terpakai dari Rp500.000
            </p>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 space-y-2">
          <MenuOptionItem
            linkTo={UserPath.ESTIMATION}
            className={
              "hover:bg-hovpalepurple hover:text-white rounded-md text-center place-content-center md:place-content-start "
            }>
            <MdLibraryAdd className="flex-inline my-auto text-xl mr-2" />
            <h4>Tambah Anggaran Pengeluaran</h4>
          </MenuOptionItem>
          {/* <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-400" /> */}
          <MenuOptionItem
            linkTo={UserPath.ESTIMATION}
            className={
              "hover:bg-hovpalepurple hover:text-white rounded-md text-center place-content-center md:place-content-start "
            }>
            <MdRequestPage className="flex-inline my-auto text-xl mr-2" />
            <h4>Estimasi Pemasukan</h4>
          </MenuOptionItem>
        </div>
      </Container>
    </section>
  );
}
