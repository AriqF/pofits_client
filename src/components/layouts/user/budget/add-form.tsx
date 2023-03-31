import DefaultButton from "@/components/tools/button";
import Container from "@/components/tools/container";
import InputForm from "@/components/tools/form/input-form";
import { baseAlertStyle, baseFormStyle, formStyle, selectFormStyle } from "@/utils/global/style";
import { numFormatter } from "@/utils/helper";
import { AddBudgetData, ExpenseCategory } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { ServerMessage } from "@/utils/interfaces/response-message";
import Image from "next/image";
import ReactSelect from "react-select";

export default function AddBudgetForm() {
  const [errMessage, setErrMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [categoriesOption, setCategoriesOption] = useState([]);
  const [isRepeat, setIsRepeat] = useState(false);
  const router = useRouter();
  const swal = withReactContent(Swal);
  const ref = useRef<any>();

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
      .catch((error) => {
        setIsServerError(true);
        error.response?.data?.message
          ? setErrMessage(error.response.data.message)
          : setErrMessage(ServerMessage.RequestError);
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
        isRepeat: data.isRepeat,
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
            if (res.isConfirmed) router.push("/me/budget");
          });
      })
      .catch((error) => {
        setIsServerError(true);
        error.response?.data?.message
          ? setErrMessage(error.response.data.message)
          : setErrMessage(ServerMessage.RequestError);
      });
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddBudgetData>();

  useEffect(() => {
    getUserCategory();
  }, []);

  return (
    <Container className="w-full p-1 md:p-6">
      <div className="mb-3 space-y-4">
        <h3 className="text-2xl font-semibold">Tambah Anggaran</h3>
        <hr className="border-b border-2 border-gray-300 w-full md:w-6/12" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} ref={ref}>
        <div id="add-budget-form" className="flex flex-col gap-y-5 w-full">
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
                        borderColor: errors.category ? "border-errorRed" : "focus:border-errorRed",
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
                          width={30}
                          height={30}
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
          <InputForm label={"Berapa anggaran kamu"} id={"amount"} errors={errors.amount?.message}>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                Rp
              </span>
              <input
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
          <div className={"grid grid-cols-1 md:grid-cols-2 gap-x-5"} id="start-date-input">
            <InputForm
              label={isRepeat ? "Dari bulan" : "Pilih bulan"}
              id="start_date"
              errors={errors.start_date?.message}>
              <input
                {...register("start_date", { required: "Bulan anggaran perlu diisi" })}
                type="month"
                id="start_date"
                className={
                  baseFormStyle + (errors.start_date ? "border-errorRed focus:border-errorRed" : "")
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
              {...register("isRepeat")}
              onChange={() => setIsRepeat(!isRepeat)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="keepSigned" className="ml-2 text-sm font-medium text-gray-900">
              Anggaran Berulang
            </label>
          </div>
          <DefaultButton
            type={"submit"}
            text={"Tambah"}
            // icon={MdAdd}
            color={"default"}
            className="text-center flex place-content-center md:w-[30%]"
          />
        </div>
      </form>
    </Container>
  );
}

{
  /* <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
<InputForm label="Bulan" id="month_start">
  <select
    id="month_start"
    required
    {...register("start_month", { required: "Pilih bulan anggaran" })}
    className={
      baseFormStyle + (errors.category ? "border-errorRed focus:border-errorRed" : "")
    }>
    <option value="none" selected hidden>
      Pilih bulan
    </option>
    {listOfMonth.map((month, index) => (
      <option value={month.value} key={index}>
        {month.label}
      </option>
    ))}
  </select>
</InputForm>
<InputForm label="Tahun" id="year_start">
  <select
    id="year_start"
    required
    {...register("start_year", { required: "Tahun anggaran perlu diisi" })}
    className={
      baseFormStyle + (errors.category ? "border-errorRed focus:border-errorRed" : "")
    }>
    <option value="none" selected disabled hidden>
      Pilih Tahun
    </option>
    {getListOfYears().map((years, index) => (
      <option value={years} key={index}>
        {years}
      </option>
    ))}
  </select>
</InputForm>
</div> */
}

{
  /* <InputForm label="Kategori" id="category">
            <select
              id="category"
              required
              {...register("category", { required: "Kategori pengeluaran perlu diisi" })}
              className={
                baseFormStyle + (errors.category ? "border-errorRed focus:border-errorRed" : "")
              }
              // data-te-select-init
            >
              <option value="none" selected disabled hidden>
                Pilih kategori
              </option>
              {categories.map((category, index: number) => (
                <option value={category.id} key={index}>
                  {category.title}
                </option>
              ))}
            </select>
          </InputForm> */
}
