import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import Alert from "@/components/tools/alerts/alert";
import FormHelper from "@/components/tools/alerts/form-helper";
import DefaultButton from "@/components/tools/button";
import { baseAlertStyle, baseFormStyle } from "@/utils/global/style";
import { numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { ServerMessage } from "@/utils/interfaces/response-message";
import { WalletData } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form/dist/types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function AddWallet() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const router = useRouter();
  const walletId = router.query.id;
  const ref = useRef<any>();
  const swal = withReactContent(Swal);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<WalletData>();

  const onSubmit: SubmitHandler<WalletData> = async (data: WalletData) => {
    setErrMessage("");
    await requestAxios({
      url: baseUrl + "/wallet",
      method: "POST",
      data: {
        name: data.name,
        category: data.category,
        description: data.description,
        amount: parseInt(data.amount.replace(/\./g, "")),
      },
    })
      .then((res) => {
        setIsSuccess(true);
        swal
          .fire({
            title: "Dompet berhasil ditambahkan!",
            icon: "success",
            ...baseAlertStyle,
          })
          .then((res) => {
            if (res.isConfirmed) router.push("/me/settings/wallets");
          });
      })
      .catch((error) => {
        setIsServerError(true);
        error.response?.data?.message
          ? setErrMessage(error.response.data.message)
          : setErrMessage(ServerMessage.RequestError);
      });
  };

  return (
    <UserSettingsLayout>
      <section id="wallet-add ">
        <UserSettingsHeader backTo="/me/settings/wallets">
          <h3 className="text-2xl font-bold">Tambah Dompet Manual</h3>
        </UserSettingsHeader>
        <div className="bg-white border-gray-500 rounded-sm p-6 shadow-md min-h-screen md:min-h-fit flex flex-col gap-y-5">
          <form className="flex" onSubmit={handleSubmit(onSubmit)} ref={ref}>
            <div id="add-wallet-form" className="flex flex-col gap-y-5 w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-5 gap-y-5">
                <div>
                  <label
                    htmlFor="category"
                    className="block mb-2 text-md font-medium text-gray-900">
                    Kategori Dompet
                  </label>
                  <select
                    id="category"
                    required
                    {...register("category", { required: "Kategori dompet perlu diisi" })}
                    // defaultValue="Pilih kategori dompet"
                    className={
                      baseFormStyle +
                      (errors.category ? "border-errorRed focus:border-errorRed" : "")
                    }>
                    <option value="none" selected disabled hidden>
                      Pilih kategori dompet
                    </option>
                    <option value={"Rekening Bank"}>Rekening Bank</option>
                    <option value={"Tunai"}>Tunai</option>
                    <option value={"E-Money"}>E-Money</option>
                  </select>
                  {errors.category && (
                    <FormHelper textColor="danger" text={errors.category?.message} />
                  )}
                </div>
                <div>
                  <label htmlFor="title" className="block mb-2 text-md font-medium text-gray-900">
                    Nama Dompet
                  </label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Berikan nama yang singkat"
                    className={
                      baseFormStyle + (errors.name ? "border-errorRed focus:border-errorRed" : "")
                    }
                    {...register("name", {
                      required: "Nama dompet perlu diisi",
                      maxLength: {
                        value: 50,
                        message: "Nama dompet maksimal terdiri dari 50 karakter",
                      },
                    })}
                  />
                  {errors.name && <FormHelper textColor="danger" text={errors.name?.message} />}
                </div>
                <div>
                  <label htmlFor="amount" className="block mb-2 text-md font-medium text-gray-900 ">
                    Nominal awal
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
                      placeholder="Nominal awal pada dompet"
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
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-md font-medium text-gray-900">
                  Deskripsi {"(Optional)"}
                </label>
                <textarea
                  rows={2}
                  id="description"
                  placeholder="Deskripsi dengan singkat"
                  maxLength={255}
                  className={
                    baseFormStyle +
                    (errors.description ? "border-errorRed focus:border-errorRed" : "")
                  }
                  {...register("description", {
                    required: false,
                  })}
                />
                {errors.description && (
                  <FormHelper textColor="danger" text={errors.description?.message} />
                )}
              </div>
              <div id="add-wallet-button" className="md:w-1/2 flex flex-col md:mx-auto space-y-2">
                <div id="auth-message">
                  {errMessage && <Alert text={errMessage} type="danger" />}
                </div>
                <DefaultButton text="Simpan" color="default" type="submit" />
              </div>
            </div>
          </form>
        </div>
      </section>
    </UserSettingsLayout>
  );
}
