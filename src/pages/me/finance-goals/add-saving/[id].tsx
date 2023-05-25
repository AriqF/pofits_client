import GoalsLayout from "@/components/layouts/user/finance-goals/goals-layout";
import InputForm from "@/components/tools/form/input-form";
import { UserPath } from "@/utils/global/route-path";
import {
  baseAlertStyle,
  baseFormStyle,
  checkBoxStyle,
  currencyFormStyle,
  selectFormStyle,
} from "@/utils/global/style";
import {
  CustomAlert,
  currencyFormatter,
  getGoalSeverityStr,
  getNumOnlyFromStr,
  numFormatter,
} from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { AddSavingForm, FinanceGoal, WalletData } from "@/utils/interfaces/server-props";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";
import FormHelper from "@/components/tools/alerts/form-helper";
import DefaultButton from "@/components/tools/button";
import { AxiosError } from "axios";

const getGoalSeverityBg = (severity: number): string => {
  switch (severity) {
    case 0:
      return "bg-moneySafe";
    case 1:
      return "bg-moneyWarn";
    case 2:
      return "bg-moneyDanger";
    default:
      return "bg-moneySafe";
  }
};

export default function AddGoalSavingPage() {
  const swal = withReactContent(Swal);
  const router = useRouter();
  const dataId = router.query.id;
  const [moveWalletBool, setMoveWalletBool] = useState(true);
  const [walletsOpt, setWalletsOpt] = useState([]);
  const [goalData, setGoalData] = useState<FinanceGoal>({
    id: 0,
    title: "",
    isFlexible: true,
    amount_target: 0,
    amount_reached: 0,
    timebound: new Date(),
    frequencies: 0,
    amount_per_frequency: 0,
    isAchieved: false,
    priority: 0,
    percentage: 0,
    estimated_achieved: new Date(),
    times_to_save_left: 0,
    amounts_to_save_left: 0,
    days_to_go: 0,
    wallet: {
      id: 0,
      icon: "wallet",
      name: "",
    },
    created_at: new Date(),
  });

  const fetchData = async () => {
    try {
      const [goalRes, walletRes] = await Promise.all([
        requestAxios({
          url: baseUrl + "/finance-goal/" + dataId,
          method: "GET",
        }),
        requestAxios({
          url: baseUrl + "/wallet/me",
          method: "GET",
        }),
      ]);
      const wallets: any = walletRes.data.map((item: WalletData) => {
        return {
          value: item.id,
          label: item.name,
          icon: item.icon,
        };
      });
      setWalletsOpt(wallets);
      setGoalData(goalRes.data);
      setValue("amount", numFormatter(goalRes.data.amount_per_frequency));
      if (!goalRes.data.wallet) {
        setMoveWalletBool(false);
      }
    } catch (error) {
      CustomAlert({ linkToConfirm: UserPath.FINANCE_GOAL_DETAIL + dataId });
    }
  };

  const changeMoveCheckHandler = async (val: boolean) => {
    if (val) {
      if (!goalData.wallet) {
        swal.fire({
          title: "Dompet pada rencana keuangan ini belum di atur",
          text: "Harap melakukan atur ulang untuk mengatur dompet",
          icon: "warning",
          ...baseAlertStyle,
        });
        setMoveWalletBool(false);
      }
    }
    setMoveWalletBool(val);
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AddSavingForm>({
    defaultValues: {
      amount: numFormatter(goalData.amount_per_frequency),
      date: moment(new Date()).format("YYYY-MM-DD"),
    },
  });

  const submitHandler: SubmitHandler<AddSavingForm> = async (data: AddSavingForm) => {
    try {
      if (moveWalletBool && data.wallet) {
        //move wallet
        console.log({
          from_wallet: data.wallet.value,
          to_wallet: goalData.wallet.id,
          amount: data.amount,
        });

        // await requestAxios({
        //   url: baseUrl + "/wallet/move-amount",
        //   method: "PATCH",
        //   data: {
        //     from_wallet: data.wallet.value,
        //     to_wallet: goalData.wallet.id,
        //     amount: data.amount,
        //   },
        // });
      }

      //add saving
      await requestAxios({
        url: baseUrl + "/finance-goal/add-saving/" + dataId,
        method: "PATCH",
        data: {
          title: data.title,
          date: data.date,
          amount: getNumOnlyFromStr(data.amount),
        },
      });
    } catch (error) {
      return CustomAlert({ linkToConfirm: UserPath.FINANCE_GOAL + dataId, text: String(error) });
    } finally {
      swal
        .fire({
          title: "Berhasil menambahkan tabungan",
          icon: "success",
          ...baseAlertStyle,
        })
        .then((res) => {
          if (res.isConfirmed) router.push(UserPath.FINANCE_GOAL_DETAIL + dataId);
        });
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);

  const FormBox = () => {
    return (
      <form className="grid grid-cols-1 gap-5 order-last" onSubmit={handleSubmit(submitHandler)}>
        <InputForm label="Deskripsi singkat" id={"title"} errors={errors.title?.message}>
          <input
            type="text"
            id="title"
            className={
              baseFormStyle + (errors.title ? "border-errorRed focus:border-errorRed" : "")
            }
            placeholder="Isi deskripsi singkat menabung"
            {...register("title", {
              required: "Deskripsi singat perlu diisi",
            })}
          />
        </InputForm>
        <InputForm label="Nominal menabung" id="form-amount" errors={errors.amount?.message}>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
              Rp
            </span>
            <input
              onFocus={(e) => e.target.select()}
              type="text"
              id="amount"
              className={
                currencyFormStyle + (errors.amount ? "border-errorRed focus:border-errorRed" : "")
              }
              {...register("amount", {
                required: "Nominal menabung perlu diisi",
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
        <InputForm label={"Tanggal menabung"} id="form-date" errors={errors.date?.message}>
          <input
            {...register("date", { required: "Tanggal transaksi perlu diisi" })}
            type="date"
            id="timebound"
            className={baseFormStyle + (errors.date ? "border-errorRed focus:border-errorRed" : "")}
          />
        </InputForm>
        {moveWalletBool ? (
          <InputForm
            label="Tabung dari dompet (opsional)"
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
            <FormHelper
              textColor="info"
              text={`Catatan dana akan dipindahkan dari dompet lain ke dompet tabungan ${goalData.wallet.name}`}
            />
          </InputForm>
        ) : (
          ""
        )}
        <div className="flex items-center">
          <input
            id="check-move-wallet"
            type="checkbox"
            checked={moveWalletBool}
            className={checkBoxStyle}
            onChange={() => changeMoveCheckHandler(!moveWalletBool)}
          />
          <label htmlFor="check-move-wallet" className="ml-2 text-sm font-medium text-gray-900">
            Tabung dana dari dompet lain
          </label>
        </div>
        <DefaultButton
          isSubmitting={isSubmitting}
          type={"submit"}
          color={"default"}
          className="text-center flex place-content-center lg:w-[20%] mt-3">
          Simpan
        </DefaultButton>
      </form>
    );
  };

  const InfoBox = () => {
    return (
      <div className="rounded-md border border-palepurple p-3 flex flex-col">
        <div className="flex flex-row justify-between">
          <h4 className="text-base font-semibold my-auto">{goalData.title}</h4>
          {/* <p className="text-blue font-semibold my-auto">
            Prioritas
          </p> */}
          <p
            className={
              `text-xs text-white my-auto px-2 py-1 rounded-sm max-w-fit min-w-fit ` +
              `${getGoalSeverityBg(goalData.priority)}`
            }>
            Prioritas {getGoalSeverityStr(goalData.priority)}
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-sm text-gray-600 my-auto">
            Estimasi tercapai {goalData.days_to_go} hari lagi
          </p>
          {goalData.isFlexible ? (
            <p className="text-sm text-gray-600">
              Target tanggal: {moment(goalData.timebound).format("D MMM YYYY")}
            </p>
          ) : (
            <p className="text-sm text-gray-600">Tabungan Fleksibel</p>
          )}
        </div>
      </div>
    );
  };

  const AmountInfoBox = () => {
    return (
      <div className="rounded-md border border-palepurple p-3 flex flex-col">
        <div className="flex flex-row justify-between">
          <p className="text-blue font-semibold my-auto">
            {currencyFormatter(goalData.amount_reached ? goalData.amount_reached : 0)}
          </p>
          <p className="text-blue font-semibold my-auto">
            {currencyFormatter(goalData.amount_target ? goalData.amount_target : 0)}
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-sm text-gray-600">Telah terkumpul</p>
          <p className="text-sm text-gray-600 my-auto">Dari target</p>
        </div>
      </div>
    );
  };

  return (
    <GoalsLayout backTo={UserPath.FINANCE_GOAL_DETAIL + dataId}>
      <section
        id="goal-header-add"
        className="flex flex-col md:flex-row md:justify-between gap-y-3 mb-5 select-none">
        <h2 className="text-2xl text-gray-600 my-auto">Tambah Tabungan</h2>
      </section>
      <section
        id="goal-add-saving"
        className="grid grid-cols-1 lg:grid-cols-2 justify-between gap-8">
        <FormBox />
        <div className="flex flex-col gap-4 lg:order-last">
          <InfoBox />
          <AmountInfoBox />
        </div>
      </section>
    </GoalsLayout>
  );
}
