import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import Alert from "@/components/tools/alerts/alert";
import FormHelper from "@/components/tools/alerts/form-helper";
import DefaultButton from "@/components/tools/button";
import CheckBox from "@/components/tools/checkbox";
import { baseAlertStyle, baseFormStyle } from "@/utils/global/style";
import { CustomAlert, getNumOnlyFromStr, numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { ServerMessage } from "@/utils/interfaces/response-message";
import { WalletData } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  SubmitHandler,
  UseFormRegisterReturn,
  Validate,
  ValidationRule,
} from "react-hook-form/dist/types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface ITransferForm {
  fromWalletId: number;
  toWalletId: number;
  amount: string;
}

const ShowAmountSessionKey = "TransferFundShowAmount";

export default function TransferWallet() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [showAmount, setShowAmount] = useState(false);
  const [wallets, setWallets] = useState<WalletData[]>();
  const ref = useRef<any>();
  const swal = withReactContent(Swal);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ITransferForm>();

  const getWallets = async () => {
    try {
      const response = await requestAxios({
        url: baseUrl + "/wallet/me",
        method: "GET",
      });
      setWallets(response.data);
      console.log(wallets);
    } catch (error) {
      return CustomAlert({
        title: "Terjadi kesalahan dalam mengambil data",
        linkToConfirm: "/me/settings/wallets",
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
        from_wallet: data.fromWalletId,
        to_wallet: data.toWalletId,
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
    <UserSettingsLayout>
      <section id="wallets-index" className="space-y-4">
        <UserSettingsHeader backTo="/me/settings/wallets">
          <h3 className="text-2xl font-bold">Pindah Dana</h3>
          <p className="text-base">Lorem ipsum lor sit amet.</p>
        </UserSettingsHeader>
        <div className="bg-white border-gray-500 rounded-sm p-6 shadow-md min-h-screen md:min-h-fit flex flex-col gap-y-5">
          <form className="flex" ref={ref} onSubmit={handleSubmit(onSubmit)}>
            <div id="transfer-wallet-form" className="flex flex-col gap-y-5 w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-5 gap-y-5">
                <div>
                  <label htmlFor="fromWal" className="block mb-2 text-md font-medium text-gray-900">
                    Dari Dompet
                  </label>
                  <select
                    id="fromWal"
                    required
                    {...register("fromWalletId", { required: "Dompet perlu dipilih" })}
                    defaultValue="Pilih dompet"
                    className={
                      baseFormStyle +
                      (errors.fromWalletId ? "border-errorRed focus:border-errorRed" : "")
                    }>
                    <option value="none" selected disabled hidden>
                      Pilih Dompet
                    </option>
                    {wallets?.map((wallet, index) => (
                      <option value={wallet.id} key={index}>
                        {wallet.name} {showAmount ? "- Rp " + numFormatter(wallet.amount) : ""}
                      </option>
                    ))}
                  </select>
                  {errors.fromWalletId && (
                    <FormHelper textColor="danger" text={errors.toWalletId?.message} />
                  )}
                </div>
                <div>
                  <label htmlFor="toWal" className="block mb-2 text-md font-medium text-gray-900">
                    Ke Dompet
                  </label>
                  <select
                    id="toWal"
                    required
                    {...register("toWalletId", { required: "Dompet perlu Dipilih" })}
                    defaultValue="Pilih dompet"
                    className={
                      baseFormStyle +
                      (errors.toWalletId ? "border-errorRed focus:border-errorRed" : "")
                    }>
                    <option value="none" selected disabled hidden>
                      Pilih Dompet
                    </option>
                    {wallets?.map((wallet, index) => (
                      <option value={wallet.id} key={index}>
                        {wallet.name} {showAmount ? "- Rp " + numFormatter(wallet.amount) : ""}
                      </option>
                    ))}
                  </select>
                  {errors.toWalletId && (
                    <FormHelper textColor="danger" text={errors.toWalletId?.message} />
                  )}
                </div>

                <div>
                  <label htmlFor="amount" className="block mb-2 text-md font-medium text-gray-900 ">
                    Nominal Transfer
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                      Rp
                    </span>
                    <input
                      type="text"
                      id="amount"
                      className={
                        baseFormStyle +
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
                  {errors.amount && <FormHelper textColor="danger" text={errors.amount?.message} />}
                </div>
                <div className="flex items-center">
                  <input
                    id="showamount"
                    type="checkbox"
                    checked={showAmount}
                    onChange={() => ShowAmount(!showAmount)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="showamount" className="ml-2 text-sm font-medium text-gray-900">
                    Tampilkan nominal dompet
                  </label>
                </div>
              </div>
              <div id="add-wallet-button" className="md:w-1/2 flex flex-col md:mx-auto space-y-2">
                <div id="auth-message">
                  {errMessage && <Alert text={errMessage} type="danger" />}
                </div>
                <div className="md:max-w-xs flex">
                  <DefaultButton text="Simpan" color="default" type="submit" />
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </UserSettingsLayout>
  );
}
