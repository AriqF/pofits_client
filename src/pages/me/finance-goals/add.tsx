import GoalsLayout from "@/components/layouts/user/finance-goals/goals-layout";
import InputForm from "@/components/tools/form/input-form";
import { UserPath } from "@/utils/global/route-path";
import {
  baseAlertStyle,
  baseFormStyle,
  currencyFormStyle,
  selectFormStyle,
} from "@/utils/global/style";
import { CustomAlert, getGoalFrequenceStr, getNumOnlyFromStr, numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { FinanceGoalForm, WalletData } from "@/utils/interfaces/server-props";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm, useFormState } from "react-hook-form";
import Image from "next/image";
import ReactSelect from "react-select";
import moment from "moment";
import { useRouter } from "next/router";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { ServerMessage } from "@/utils/interfaces/response-message";

interface OptionsObject {
  label: string;
  value: number;
}

export default function AddFinanceGoalPage() {
  const router = useRouter();
  const swal = withReactContent(Swal);
  const [errMessage, setErrMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [isFlexible, setIsFlexible] = useState(true);
  const [isTimebound, setIsTimebound] = useState(false);
  const [walletsOpt, setWalletsOpt] = useState([]);
  const [estimatedDate, setEstimatedDate] = useState<Date>(new Date());
  const [hasEstimatedDate, setHasEstimatedDate] = useState(false);
  const frequenciesOpt: OptionsObject[] = [
    {
      label: "Tahunan",
      value: 365,
    },
    {
      label: "Bulanan",
      value: 30,
    },
    {
      label: "Mingguan",
      value: 7,
    },
    {
      label: "Harian",
      value: 1,
    },
  ];
  const prioritiesOpt: OptionsObject[] = [
    { label: "Tinggi", value: 2 },
    { label: "Sedang", value: 1 },
    { label: "Rendah", value: 0 },
  ];

  const fetchUserWallet = async () => {
    await requestAxios({ url: baseUrl + "/wallet/me", method: "GET" })
      .then((res) => {
        const wallets: any = res.data.map((item: WalletData) => {
          return {
            value: item.id,
            label: item.name,
            icon: item.icon,
          };
        });
        setWalletsOpt(wallets);
      })
      .catch((error) => {
        return CustomAlert({ linkToConfirm: UserPath.FINANCE_GOAL });
      });
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FinanceGoalForm>({
    defaultValues: {
      // amount_per_frequency: "0",
      // amount_target: "0",
      timebound: new Date(),
      frequencies: {
        label: "Harian",
        value: 1,
      },
    },
  });

  const wAmountTarget: number = getValues("amount_target")
    ? getNumOnlyFromStr(getValues("amount_target"))
    : 0;
  const wAmountPerFrequence: number = getValues("amount_per_frequency")
    ? getNumOnlyFromStr(getValues("amount_per_frequency"))
    : 0;
  const wTargetDate: Date = getValues("timebound");
  const wFrequency: number = getValues("frequencies.value");

  const switchTimeboundType = (type: "flexible" | "date") => {
    if (type === "flexible") {
      setIsFlexible(true);
      setIsTimebound(false);
      setHasEstimatedDate(true);
    } else {
      setHasEstimatedDate(false);
      setIsTimebound(true);
      setIsFlexible(false);
    }
  };

  const countAmountPerFrequency = (): string => {
    let currDate = new Date();
    currDate.setHours(0);
    const daysToTarget = Math.floor(
      (Date.parse(wTargetDate.toString()) - Date.parse(currDate.toString())) / 86400000
    );
    let numToSaveLeft = Math.floor(daysToTarget / wFrequency) + 1; // +1 (including today)
    if (numToSaveLeft <= 0) numToSaveLeft = 1;
    const result = numFormatter(Number(wAmountTarget / numToSaveLeft).toFixed(0));
    setValue("amount_per_frequency", result);
    return result;
  };

  const countEstimatedDate = (): Date => {
    const currDate = new Date();
    if (wAmountTarget === 0) {
      setHasEstimatedDate(true);
      setEstimatedDate(currDate);
      return currDate;
    }
    const daysToGo = (wAmountTarget / wAmountPerFrequence) * wFrequency - 1; // including today
    const estimatedDate = new Date(currDate.setDate(currDate.getDate() + daysToGo));
    // console.log({ daysToGo, estimatedDate });
    setHasEstimatedDate(true);
    setEstimatedDate(estimatedDate);
    return estimatedDate;
  };

  const submitHandler: SubmitHandler<FinanceGoalForm> = async (data: FinanceGoalForm) => {
    await requestAxios({
      url: baseUrl + "/finance-goal/add",
      method: "POST",
      data: {
        title: data.title,
        isFlexible: isFlexible,
        amount_target: getNumOnlyFromStr(data.amount_target),
        amount_per_frequency: getNumOnlyFromStr(data.amount_per_frequency),
        frequencies: data.frequencies.value,
        wallet: data.wallet ? data.wallet.value : null,
        priority: data.priority.value,
        timebound: isTimebound ? data.timebound : null,
      },
    })
      .then((res) => {
        if (res.status === 201) {
          return swal
            .fire({
              icon: "success",
              title: "Tujuan keuangan berhasil ditambahkan",
              ...baseAlertStyle,
            })
            .then((res) => {
              if (res.isConfirmed) router.push(UserPath.FINANCE_GOAL);
            });
        }
      })
      .catch((error) => {
        setIsServerError(true);
        error.response?.data?.message
          ? setErrMessage(error.response.data.message)
          : setErrMessage(ServerMessage.RequestError);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUserWallet();
    }, 500);

    return () => clearTimeout(timer);
  });

  // useEffect(() => {
  //   console.log(getValues("frequencies"));
  // }, [getValues("frequencies")]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isFlexible) {
        countEstimatedDate();
      } else {
        countAmountPerFrequency();
      }
    }, 1);

    return () => clearTimeout(timer);
  }, [wAmountTarget, wFrequency, wTargetDate, wAmountPerFrequence]);

  const switchStyle =
    "rounded-md shadow-md p-3 border border-gray-300 hover:bg-hovblue hover:text-white " +
    " transition-colors ease-in duration-150 text-sm";
  return (
    <GoalsLayout backTo={UserPath.FINANCE_GOAL}>
      <section
        id="goal-header-add"
        className="flex flex-col md:flex-row md:justify-between gap-y-3 mb-5 select-none">
        <h2 className="text-2xl text-gray-600 my-auto">Tambah Tujuan Keuanganmu</h2>
      </section>
      <section id="goal-add-form" className="flex flex-col">
        <form className="flex flex-col gap-4 gap-y-3" onSubmit={handleSubmit(submitHandler)}>
          <div className="flex flex-col gap-3">
            {hasEstimatedDate ? (
              <article className="rounded-md bg-transparent border border-blue shadow-sm p-3 lg:w-[40%] mb-4 mr-auto">
                <p className="text-sm text-gray-800">
                  Dengan sebesar{" "}
                  <span className="font-semibold text-blue">
                    Rp {getValues("amount_per_frequency")}
                  </span>{" "}
                  per {getGoalFrequenceStr(getValues("frequencies.value"))}. Kamu dapat mencapai
                  target mu pada{" "}
                  <span className="font-semibold text-blue">
                    {moment(estimatedDate).format("D MMMM YYYY")}
                  </span>
                </p>
              </article>
            ) : (
              ""
            )}
            <h4 className="text-lg">Kapan kamu ingin meraih tujuanmu?</h4>
            <div className="flex flex-row gap-3">
              <button
                type="button"
                onClick={() => switchTimeboundType("flexible")}
                className={switchStyle + (isFlexible ? " bg-blue text-white " : "")}>
                Flexibel
              </button>
              <button
                type="button"
                onClick={() => switchTimeboundType("date")}
                className={switchStyle + (isTimebound ? " bg-blue text-white " : "")}>
                Pilih Tanggal
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <InputForm label="Tujuan Keuanganmu" id="form-title" errors={errors.title?.message}>
              <input
                type="text"
                id="title"
                className={
                  baseFormStyle + (errors.title ? "border-errorRed focus:border-errorRed" : "")
                }
                placeholder="Deskripsi singkat"
                {...register("title", {
                  required: "Judul perlu diisi",
                })}
              />
            </InputForm>
            <InputForm
              label="Berapa Targetmu?"
              id="form-amount"
              errors={errors.amount_target?.message}>
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
                    (errors.amount_target ? "border-errorRed focus:border-errorRed" : "")
                  }
                  placeholder="Target tabungan"
                  {...register("amount_target", {
                    required: "Target tabungan perlu diisi",
                    pattern: {
                      value: /^\d+(\.\d+)*$/,
                      message: "Input hanya diperbolehkan angka",
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\./g, "");
                      setValue("amount_target", numFormatter(e.target.value));
                    },
                  })}
                />
              </div>
            </InputForm>
            <InputForm
              label="Tingkat Prioritas"
              id="form-priority"
              errors={errors.priority?.message}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => {
                  return (
                    <ReactSelect
                      classNames={{
                        control: (state) => selectFormStyle,
                        // (errors.category ? " border-errorRed focus:border-errorRed" : ""),
                      }}
                      placeholder="Tingkat Prioritas Tujuan"
                      value={field.value}
                      options={prioritiesOpt}
                      onChange={field.onChange}
                      formatOptionLabel={(item) => (
                        <div className="inline-flex space-x-3 my-auto">
                          <p className="my-auto">{item.label}</p>
                        </div>
                      )}
                    />
                  );
                }}
              />
            </InputForm>
            <InputForm
              label={"Setiap kapan ingin menabung?"}
              id={"form-frequency"}
              errors={errors.frequencies?.message}>
              <Controller
                name="frequencies"
                control={control}
                render={({ field }) => {
                  return (
                    <ReactSelect
                      classNames={{
                        control: (state) => selectFormStyle,
                        // (errors.category ? " border-errorRed focus:border-errorRed" : ""),
                      }}
                      placeholder="Frekuensi Menabung"
                      value={field.value}
                      options={frequenciesOpt}
                      onChange={field.onChange}
                      formatOptionLabel={(item) => (
                        <div className="inline-flex space-x-3 my-auto">
                          <p className="my-auto">{item.label}</p>
                        </div>
                      )}
                    />
                  );
                }}
              />
            </InputForm>
            {isFlexible ? (
              ""
            ) : (
              <InputForm label={"Pilih Tanggal"} id="form-date" errors={errors.timebound?.message}>
                <input
                  {...register("timebound", { required: "Tanggal transaksi perlu diisi" })}
                  type="date"
                  id="timebound"
                  className={
                    baseFormStyle +
                    (errors.timebound ? "border-errorRed focus:border-errorRed" : "")
                  }
                />
              </InputForm>
            )}
            <InputForm
              label="Nominal per Nabung"
              id="form-amount"
              errors={errors.amount_per_frequency?.message}>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                  Rp
                </span>
                <input
                  onFocus={(e) => e.target.select()}
                  type="text"
                  id="amount"
                  disabled={isTimebound}
                  className={
                    (isTimebound ? " text-gray-400 bg-[#f2f2f2] " : "") +
                    currencyFormStyle +
                    (errors.amount_target ? "border-errorRed focus:border-errorRed" : "")
                  }
                  placeholder="Nominal tabungan"
                  {...register("amount_per_frequency", {
                    required: "Nominal tabungan perlu diisi",
                    pattern: {
                      value: /^\d+(\.\d+)*$/,
                      message: "Input hanya diperbolehkan angka",
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\./g, "");
                      setValue("amount_per_frequency", numFormatter(e.target.value));
                    },
                  })}
                />
              </div>
            </InputForm>

            <InputForm
              label="Sumber Keuangan (Opsional)"
              id="wallet-select"
              errors={errors.wallet?.message}>
              <Controller
                name="wallet"
                control={control}
                render={({ field }) => {
                  return (
                    <ReactSelect
                      classNames={{
                        control: (state) => selectFormStyle,
                        // (errors.category ? " border-errorRed focus:border-errorRed" : ""),
                      }}
                      placeholder="Pilih Dompet"
                      value={field.value}
                      options={walletsOpt}
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
          </div>
          <button
            type="submit"
            className={
              "border bg-palepurple text-white hover:bg-hovpalepurple mt-3 " +
              "inline-flex place-content-center text-center font-semibold focus:ring-1 focus:outline-none " +
              "rounded-md text-md px-4 py-3 w-full m-auto transition-colors duration-200 " +
              "w-full md:w-[20%]"
            }>
            Simpan
          </button>
        </form>
      </section>
    </GoalsLayout>
  );
}
