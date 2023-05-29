import BudgetPageLayout from "@/components/layouts/user/budget/budget-layout";
import Container from "@/components/tools/container";
import InputForm from "@/components/tools/form/input-form";
import { UserPath } from "@/utils/global/route-path";
import { baseAlertStyle, formStyle, selectFormStyle } from "@/utils/global/style";
import { CustomAlert, currencyFormatter, numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import {
  AddBudgetData,
  AllocationChart,
  BudgetAllocation,
  BudgetData,
} from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import DefaultButton from "@/components/tools/button";
import moment from "moment";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
const chartOptions = {
  responsive: true,
  cutout: "70%",
};

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

export default function EditBudgetAllocation() {
  const [budgetDate, setBudgetDate] = useState(new Date());
  const [category, setCategory] = useState("");
  const [icon, setIcon] = useState("");
  const [totalAllocated, setTotalAllocated] = useState(0);
  const [showAllocation, setShowAllocation] = useState(false);
  const [month, setMonth] = useState(moment(new Date()).format("YYYY-MM"));
  const [expChartData, setExpChartData] = useState<AllocationChart>({
    labels: [],
    data: [],
  });
  const router = useRouter();
  const dataId = router.query.id;
  const ref = useRef<any>();
  const swal = withReactContent(Swal);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddBudgetData>();

  const onSubmit: SubmitHandler<AddBudgetData> = async (data: AddBudgetData) => {
    await requestAxios({
      url: baseUrl + "/budget/edit/" + dataId,
      method: "PATCH",
      data: {
        amount: parseInt(data.amount.replace(/\./g, "")),
      },
    })
      .then((res) => {
        swal
          .fire({
            title: `Anggaran ${category} berhasil dirubah`,
            icon: "success",
            ...baseAlertStyle,
          })
          .then((res) => {
            if (res.isConfirmed) router.push(UserPath.BUDGET);
          });
      })
      .catch((error: AxiosError<any>) => {
        return CustomAlert({
          text: error.response?.data?.message,
        });
      });
  };

  const getData = async () => {
    await requestAxios({
      url: baseUrl + "/budget/" + dataId,
      method: "GET",
    })
      .then((res) => {
        setValue("amount", res.data.amount);
        setBudgetDate(res.data.start_date);
        setCategory(res.data.category.title);
        setIcon(res.data.category.icon);
        setMonth(moment(res.data.start_date).format("YYYY-MM"));
      })
      .catch((err) => {
        return CustomAlert({ linkToConfirm: UserPath.BUDGET });
      });
  };

  const getCurrentBudgets = async () => {
    await requestAxios({
      url: baseUrl + "/budget/me/month-allocation?month=" + `${month}`,
    })
      .then((res) => {
        let totalAllocated = 0;
        let expLabels: string[] = res.data.map((data: BudgetAllocation) => data.category);
        let expSpentAmount: number[] = res.data.map((data: BudgetAllocation) => {
          totalAllocated += Number(data.amount);
          return data.amount;
        });
        setTotalAllocated(totalAllocated);
        setExpChartData({ labels: expLabels, data: expSpentAmount });
      })
      .catch((error: AxiosError<any>) => {
        return CustomAlert({
          linkToConfirm: UserPath.BUDGET + dataId,
          text: error.response?.data.message,
        });
      });
  };

  useEffect(() => {
    if (router.isReady) {
      getData();
      getCurrentBudgets();
    }
  }, [router.isReady]);

  const ChartBox = () => {
    return (
      <div className="w-full mx-auto flex flex-col gap-3 rounded-md border p-2 select-none ">
        <a
          className="justify-between flex p-3 cursor-pointer"
          onClick={() => setShowAllocation(!showAllocation)}>
          <h5 className="text-base font-semibold text-gray-700 capitalize">Detail Alokasi</h5>
          {showAllocation ? (
            <MdExpandLess className="text-2xl" />
          ) : (
            <MdExpandMore className="text-2xl" />
          )}
        </a>
        <div
          className={
            "w-56 m-auto flex flex-col gap-3 transition-transform " +
            (showAllocation ? "hidden translate-y-full " : "transform-none")
          }>
          <Doughnut
            data={{
              labels: expChartData.labels,
              datasets: [
                {
                  label: "Rp",
                  data: expChartData.data,
                  backgroundColor: bgColors,
                  borderColor: borderColors,
                  borderWidth: 1,
                },
              ],
            }}
            options={chartOptions}
          />
          <div className="flex flex-col mx-auto text-center gap-1">
            <h3 className="text-base font-semibold">
              Anggaran {moment(month).format("MMMM YYYY")}
            </h3>
            <p className="text-base">
              Total alokasi:{" "}
              <span className="text-blue font-semibold">{currencyFormatter(totalAllocated)}</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BudgetPageLayout backTo={UserPath.BUDGET}>
      <section className="flex flex-col col-span-2">
        <Container className="w-full p-1 md:p-6">
          <div className="mb-3 space-y-4">
            <div className="inline-flex gap-4">
              <div className="rounded-full p-2 bg-gray-300 my-auto">
                <Image
                  src={`/assets/icons/svg/${icon}.svg`}
                  alt="category-icon"
                  width={50}
                  height={50}
                  className="my-auto"
                />
              </div>
              <div className="my-auto">
                <h3 className="text-xl font-semibold">Edit Alokasi Anggaran {category}</h3>
                <h5 className="text-base text-mute capitalize">
                  {moment(budgetDate).format("MMMM YYYY")}
                </h5>
              </div>
            </div>
          </div>
          <form id="edit-budget-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-5 w-full lg:w-[75%]">
              <InputForm label="Berapa anggaran kamu" id="amount" errors={errors.amount?.message}>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                    Rp
                  </span>
                  <input
                    onFocus={(e) => e.target.select()}
                    type="text"
                    id="amount"
                    className={
                      "rounded-r-md " +
                      formStyle +
                      (errors.amount ? "border-errorRed focus:border-errorRed" : "")
                    }
                    placeholder="Nominal anggaran"
                    {...register("amount", {
                      required: "Nilai anggaran perlu diisi",
                      pattern: {
                        value: /^\d+(\.\d+)*$/,
                        message: "Input hanya diperbolehkan angka",
                      },
                      onChange: (e) => {
                        e.target.value = e.target.value.replace(/\./g, "");
                        setValue("amount", numFormatter(e.target.value));
                      },
                    })}
                  />
                </div>
              </InputForm>
              <DefaultButton
                isSubmitting={isSubmitting}
                type={"submit"}
                color={"default"}
                className="text-center flex place-content-center lg:w-[30%]">
                Simpan
              </DefaultButton>
            </div>
          </form>
        </Container>
      </section>
      <section className="col-span-1">
        <ChartBox />
      </section>
    </BudgetPageLayout>
  );
}
