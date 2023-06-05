import BudgetPageLayout from "@/components/layouts/user/budget/budget-layout";
import DefaultButton from "@/components/tools/button";
import Container from "@/components/tools/container";
import InputForm from "@/components/tools/form/input-form";
import { UserPath } from "@/utils/global/route-path";
import { baseAlertStyle, selectFormStyle, formStyle, baseFormStyle } from "@/utils/global/style";
import { CustomAlert, currencyFormatter, numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import {
  ExpenseCategory,
  AddBudgetData,
  AllocationChart,
  TransactionAllocation,
  BudgetAllocation,
} from "@/utils/interfaces/server-props";
import { AxiosError } from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import Alert from "@/components/tools/alerts/alert";

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

export default function AddBudgetPage() {
  const [errMessage, setErrMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [categoriesOption, setCategoriesOption] = useState([]);
  const [expChartData, setExpChartData] = useState<AllocationChart>({
    labels: [],
    data: [],
  });
  const [totalAllocated, setTotalAllocated] = useState(0);
  const [showAllocation, setShowAllocation] = useState(false);
  const [month, setMonth] = useState(moment(new Date()).format("YYYY-MM"));
  const [isRepeat, setIsRepeat] = useState(false);
  const router = useRouter();
  const swal = withReactContent(Swal);

  const getUserCategory = async () => {
    await requestAxios({
      url: baseUrl + "/expense-category/me",
      method: "GET",
    })
      .then((res) => {
        let data: ExpenseCategory[] = res.data;
        const cat: any = data.map((item) => {
          return { value: item.id, label: item.title, icon: item.icon };
        });
        setCategoriesOption(cat);
      })
      .catch((error: AxiosError<any>) => {
        return CustomAlert({ linkToConfirm: UserPath.BUDGET, text: error.response?.data.message });
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
        return CustomAlert({ linkToConfirm: UserPath.BUDGET, text: error.response?.data.message });
      });
  };

  const onSubmit: SubmitHandler<AddBudgetData> = async (data: AddBudgetData) => {
    setErrMessage("");
    let endDate: Date = new Date();
    if (isRepeat) {
      endDate = new Date(data.end_date + "-01");
    }
    await requestAxios({
      url: baseUrl + "/budget/add",
      method: "POST",
      data: {
        category: data.category.value,
        amount: parseInt(data.amount.replace(/\./g, "")),
        start_date: new Date(data.start_date + "-01"),
        isRepeat: isRepeat,
        end_date: endDate,
      },
    })
      .then((res) => {
        setIsSuccess(true);
        swal
          .fire({
            title: "Anggaran berhasil ditambahkan!",
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

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddBudgetData>({
    defaultValues: {
      start_date: moment(new Date()).format("YYYY-MM"),
    },
  });

  useEffect(() => {
    getUserCategory();
    getCurrentBudgets();
  }, []);

  const AddBudgetForm = () => {
    return (
      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div id="add-budget-form" className="flex flex-col gap-y-5 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <InputForm label="Kategori" id="category-select" errors={errors.category?.message}>
                <Controller
                  {...register("category", { required: "Kategori perlu diisi" })}
                  control={control}
                  render={({ field }) => {
                    return (
                      <ReactSelect
                        styles={{
                          control: (baseStyles, state) => ({
                            // ...baseStyles,
                            borderColor: errors.category
                              ? "border-errorRed"
                              : "focus:border-errorRed",
                          }),
                        }}
                        classNames={{
                          control: (state) =>
                            selectFormStyle +
                            (errors.category ? " border-errorRed focus:border-errorRed" : ""),
                        }}
                        placeholder="Pilih kategori"
                        className={errors.category ? "border-errorRed focus:border-errorRed" : ""}
                        value={field.value}
                        options={categoriesOption}
                        onChange={field.onChange}
                        formatOptionLabel={(item) => (
                          <div className="inline-flex space-x-3 my-auto">
                            <Image
                              src={`/assets/icons/svg/${item.icon}.svg`}
                              alt="category-icon"
                              width={25}
                              height={25}
                              className="my-auto"
                            />
                            <p className="my-auto">{item.label}</p>
                          </div>
                        )}
                      />
                    );
                  }}
                />
              </InputForm>
              <InputForm
                label={"Berapa anggaran kamu"}
                id={"amount"}
                errors={errors.amount?.message}>
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
            </div>

            <div className={"grid grid-cols-1 lg:grid-cols-2 gap-5"} id="start-date-input">
              <InputForm
                label={isRepeat ? "Dari bulan" : "Pilih bulan"}
                id="start_date"
                errors={errors.start_date?.message}>
                <input
                  {...register("start_date", { required: "Bulan anggaran perlu diisi" })}
                  type="month"
                  id="start_date"
                  className={
                    baseFormStyle +
                    (errors.start_date ? "border-errorRed focus:border-errorRed" : "")
                  }
                />
              </InputForm>
              {isRepeat && (
                <InputForm label={"Sampai bulan"} id="end_date">
                  <input
                    {...register("end_date", {
                      required: { value: isRepeat, message: "Bulan akhir anggaran perlu diisi" },
                    })}
                    type="month"
                    id="end_date"
                    className={
                      baseFormStyle +
                      (errors.start_date ? "border-errorRed focus:border-errorRed" : "")
                    }
                  />
                </InputForm>
              )}
            </div>
            <div>
              <input
                id="isRepeat"
                type="checkbox"
                onChange={() => setIsRepeat(!isRepeat)}
                checked={isRepeat}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="keepSigned" className="ml-2 text-sm font-medium text-gray-900">
                Anggaran Berulang
              </label>
            </div>
            <DefaultButton
              isSubmitting={isSubmitting}
              type={"submit"}
              color={"default"}
              className="text-center flex place-content-center lg:w-[30%]">
              Tambah
            </DefaultButton>
          </div>
        </form>
      </div>
    );
  };

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
            (showAllocation ? "transform-none" : " hidden translate-y-full ")
          }>
          {totalAllocated == 0 ? (
            <Alert text={"Belum ada anggaran"} type={"warning"} />
          ) : (
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
          )}
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
      <section className="mt-3 col-span-3">
        <h3 className="lg:text-xl text-2xl font-semibold mb-3">Tambah Anggaran</h3>
        <div className="w-full col-span-3 flex flex-col lg:flex-row gap-8 ">
          <div className="col-span-1 flex flex-col lg:w-2/5">
            <ChartBox />
          </div>
          <div className="col-span-2 lg:order-first lg:w-3/5">
            <AddBudgetForm />
          </div>
        </div>
      </section>
    </BudgetPageLayout>
  );
}
