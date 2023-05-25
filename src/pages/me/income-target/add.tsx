import BudgetPageLayout from "@/components/layouts/user/budget/budget-layout";
import Container from "@/components/tools/container";
import InputForm from "@/components/tools/form/input-form";
import { UserPath } from "@/utils/global/route-path";
import { CustomAlert, numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { IncomeCategory, IncomeEstmationForm } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReactSelect from "react-select";
import {
  baseAlertStyle,
  baseFormStyle,
  checkBoxStyle,
  currencyFormStyle,
  selectFormStyle,
} from "@/utils/global/style";
import Image from "next/image";
import DefaultButton from "@/components/tools/button";
import { ServerMessage } from "@/utils/interfaces/response-message";
import moment from "moment";

export default function AddIncomeTargetPage() {
  const [errMessage, setErrMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [categoriesOpt, setCategoriesOpt] = useState([]);
  const [isRepeat, setIsRepeat] = useState(false);
  const router = useRouter();
  const swal = withReactContent(Swal);
  const ref = useRef<any>();

  const getUserCategory = async () => {
    await requestAxios({
      url: baseUrl + "/income-category/me",
      method: "GET",
    })
      .then((res) => {
        let data: IncomeCategory[] = res.data;
        const cat: any = data.map((item) => {
          return {
            value: item.id,
            label: item.title,
            icon: item.icon,
          };
        });
        setCategoriesOpt(cat);
      })
      .catch((error) => {
        CustomAlert({ linkToConfirm: UserPath.ESTIMATION });
      });
  };

  const onSubmit: SubmitHandler<IncomeEstmationForm> = async (data: IncomeEstmationForm) => {
    setErrMessage("");
    let endDate: Date = new Date();
    if (isRepeat) {
      endDate = new Date(data.end_date + "-01");
    }

    await requestAxios({
      url: baseUrl + "/income-estimation/add",
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
            title: "Target pemasukan berhasil ditambahkan!",
            icon: "success",
            ...baseAlertStyle,
          })
          .then((res) => {
            if (res.isConfirmed) router.push(UserPath.ESTIMATION);
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
  } = useForm<IncomeEstmationForm>({
    defaultValues: {
      start_date: moment(new Date()).format("YYYY-MM"),
    },
  });

  useEffect(() => {
    getUserCategory();
  }, []);
  return (
    <BudgetPageLayout backTo={UserPath.ESTIMATION}>
      <section className="flex flex-col col-span-2">
        <Container className="w-full p-1 md:p-6">
          <h3 className="text-2xl font-semibold mb-3">Tambah Target Pemasukan</h3>
          <form onSubmit={handleSubmit(onSubmit)} ref={ref}>
            <div id="add-income-target" className="flex flex-col gap-y-5 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <InputForm
                  label="Kategori Pemasukan"
                  id="category-select>"
                  errors={errors.category?.message}>
                  <Controller
                    {...register("category")}
                    control={control}
                    render={({ field }) => {
                      return (
                        <ReactSelect
                          styles={{
                            control: (baseStyles, state) => ({
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
                          options={categoriesOpt}
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
                  label="Nominal Target"
                  id="amount-target"
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
                        currencyFormStyle +
                        (errors.amount ? "border-errorRed focus:border-errorRed" : "")
                      }
                      placeholder="Nominal target"
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
              <div
                id="start-date-input"
                className={"grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-5"}>
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
              <div id="checkbox-isrepeat">
                <input
                  id="isRepeat"
                  type="checkbox"
                  {...register("isRepeat")}
                  onChange={() => setIsRepeat(!isRepeat)}
                  className={checkBoxStyle}
                />
                <label htmlFor="keepSigned" className="ml-2 text-sm font-medium text-gray-900">
                  Anggaran Berulang
                </label>
              </div>
              <DefaultButton
                isSubmitting={isSubmitting}
                type={"submit"}
                color={"default"}
                className="text-center flex place-content-center lg:w-[20%] mt-3">
                Simpan
              </DefaultButton>
            </div>
          </form>
        </Container>
      </section>
    </BudgetPageLayout>
  );
}
