import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import Alert from "@/components/tools/alerts/alert";
import FormHelper from "@/components/tools/alerts/form-helper";
import DefaultButton from "@/components/tools/button";
import InputForm from "@/components/tools/form/input-form";
import { UserPath } from "@/utils/global/route-path";

import {
  baseAlertStyle,
  baseFormStyle,
  currencyFormStyle,
  selectFormStyle,
} from "@/utils/global/style";
import { CustomAlert, getNumOnlyFromStr, numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { ServerMessage } from "@/utils/interfaces/response-message";
import { WalletData } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form/dist/types";
import ReactSelect from "react-select";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface ITransferForm {
  fromWalletId: {
    label: string;
    value: number;
    amount: number;
  };
  toWalletId: {
    label: string;
    value: number;
    amount: number;
  };
  amount: string;
}

const ShowAmountSessionKey = "TransferFundShowAmount";

export default function TransferWallet() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [showAmount, setShowAmount] = useState(false);
  const [wallets, setWallets] = useState<WalletData[]>();
  const [walletOptions, setWalletOptions] = useState([]);
  const ref = useRef<any>();
  const swal = withReactContent(Swal);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ITransferForm>();

  const getWallets = async () => {
    try {
      const response = await requestAxios({
        url: baseUrl + "/wallet/me",
        method: "GET",
      });
      setWallets(response.data);
      let data: WalletData[] = response.data;
      const options: any = data.map((wallet) => {
        return {
          value: wallet.id,
          label: wallet.name,
          amount: wallet.amount,
        };
      });
      setWalletOptions(options);
    } catch (error) {
      return CustomAlert({
        title: "Terjadi kesalahan dalam mengambil data",
        linkToConfirm: UserPath.WALLETS,
      });
    }
  };

  const onSubmit: SubmitHandler<ITransferForm> = async (data: ITransferForm) => {
    setErrMessage("");
    if (data.fromWalletId == data.toWalletId) {
      throw Error("Dompet yang ingin dipindahkan tidak boleh sama");
    }
    await requestAxios({
      url: baseUrl + "/wallet/move-amount",
      method: "PATCH",
      data: {
        from_wallet: data.fromWalletId.value,
        to_wallet: data.toWalletId.value,
        amount: getNumOnlyFromStr(data.amount),
      },
    })
      .then((res) => {
        setIsSuccess(true);
        swal
          .fire({
            title: "Dana berhasil dipindahkan",
            icon: "success",
            ...baseAlertStyle,
          })
          .then((res) => {
            if (res.isConfirmed) router.reload();
          });
      })
      .catch((error) => {
        setIsServerError(true);
        error.response?.data?.message
          ? setErrMessage(error.response.data.message)
          : setErrMessage(ServerMessage.RequestError);
      });
  };

  const ShowAmount = (val: boolean) => {
    sessionStorage.setItem(ShowAmountSessionKey, String(val));
    setShowAmount(val);
  };

  const getShowAmountFromSession = (): boolean => {
    const val = sessionStorage.getItem(ShowAmountSessionKey);
    if (typeof val === null) return false;
    if (val === "true") return true;
    else return false;
  };

  useEffect(() => {
    if (router.isReady) {
      getWallets();
    }
    setShowAmount(getShowAmountFromSession());
  }, [router.isReady]);

  return (
    <UserSettingsLayout backTo={UserPath.WALLETS}>
      <section id="wallets-index" className="flex flex-col gap-y-3 col-span-2">
        <div className="flex flex-col gap-y-1">
          <h3 className="text-2xl font-bold">Pemindahan Dana</h3>
          {/* <p className="text-base">Lorem ipsum lor sit amet.</p> */}
        </div>
        <div className="bg-white rounded-sm p-2 min-h-screen md:min-h-fit flex flex-col gap-y-5">
          <form className="flex" ref={ref} onSubmit={handleSubmit(onSubmit)}>
            <div id="transfer-wallet-form" className="flex flex-col gap-y-5 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-x-5 gap-y-5">
                <InputForm label="Dari Dompet" id="fromWal" errors={errors.fromWalletId?.message}>
                  <Controller
                    {...register("fromWalletId", { required: "Dompet perlu dipilih" })}
                    control={control}
                    render={({ field }) => {
                      return (
                        <ReactSelect
                          styles={{
                            control: (baseStyles, state) => ({}),
                          }}
                          classNames={{
                            control: (state) =>
                              selectFormStyle +
                              (errors.fromWalletId ? " border-errorRed focus:border-errorRed" : ""),
                          }}
                          placeholder="Pilih dompet"
                          className={errors.amount ? "border-errorRed focus:border-errorRed" : ""}
                          value={field.value}
                          options={walletOptions}
                          onChange={field.onChange}
                          formatOptionLabel={(item) => (
                            <div className="inline-flex space-x-3 my-auto">
                              <p className="my-auto">
                                {item.label}
                                {showAmount ? ` - Rp ${numFormatter(item.amount)}` : ""}
                              </p>
                            </div>
                          )}
                        />
                      );
                    }}
                  />
                </InputForm>
                <InputForm label="Ke Dompet" id="toWal" errors={errors.toWalletId?.message}>
                  <Controller
                    {...register("toWalletId", { required: "Target Dompet perlu dipilih" })}
                    control={control}
                    render={({ field }) => {
                      return (
                        <ReactSelect
                          styles={{
                            control: (baseStyles, state) => ({}),
                          }}
                          classNames={{
                            control: (state) =>
                              selectFormStyle +
                              (errors.toWalletId ? " border-errorRed focus:border-errorRed" : ""),
                          }}
                          placeholder="Pilih dompet"
                          className={errors.amount ? "border-errorRed focus:border-errorRed" : ""}
                          value={field.value}
                          options={walletOptions}
                          onChange={field.onChange}
                          formatOptionLabel={(item) => (
                            <div className="inline-flex space-x-3 my-auto">
                              <p className="my-auto">
                                {item.label}
                                {showAmount ? ` - Rp ${numFormatter(item.amount)}` : ""}
                              </p>
                            </div>
                          )}
                        />
                      );
                    }}
                  />
                </InputForm>
              </div>
              <InputForm
                label="Nominal Pemindahan"
                id="transfer-amount"
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
                    placeholder="Nominal transfer"
                    {...register("amount", {
                      required: "Dompet memerlukan nilai awal",
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
              <div className="flex items-center">
                <input
                  id="showamount"
                  type="checkbox"
                  checked={showAmount}
                  onChange={() => ShowAmount(!showAmount)}
                  className="w-4 h-4 text-blue bg-gray-100 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="showamount" className="ml-2 text-sm font-medium text-gray-900">
                  Tampilkan nominal dompet
                </label>
              </div>
              <div id="add-wallet-button" className="lg:w-1/2 flex flex-col lg:mx-auto space-y-2">
                <div id="auth-message">
                  {errMessage && <Alert text={errMessage} type="danger" />}
                </div>
                <div className="flex">
                  <DefaultButton
                    isSubmitting={isSubmitting}
                    type={"submit"}
                    color={"default"}
                    className="text-center flex place-content-center lg:w-[30%] mt-3">
                    Simpan
                  </DefaultButton>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </UserSettingsLayout>
  );
}
