import UserSettingsLayout from "@/components/layouts/user/settings";
import Alert from "@/components/tools/alerts/alert";
import FormHelper from "@/components/tools/alerts/form-helper";
import DefaultButton from "@/components/tools/button";
import InputForm from "@/components/tools/form/input-form";
import { UserPath } from "@/utils/global/route-path";
import {
  baseAlertStyle,
  baseFormStyle,
  currencyFormStyle,
  formStyle,
  selectFormStyle,
} from "@/utils/global/style";
import { numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { ServerMessage } from "@/utils/interfaces/response-message";
import { FormWalletData } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { SubmitHandler } from "react-hook-form/dist/types";
import ReactSelect from "react-select";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";
import { walletCategoriesOpt } from "@/utils/global/select-options";

export default function AddWallet() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  // const [categoriesOption, setCategoriesOption] = useState(temp);

  const router = useRouter();
  const walletId = router.query.id;
  const ref = useRef<any>();
  const swal = withReactContent(Swal);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
  } = useForm<FormWalletData>();

  const onSubmit: SubmitHandler<FormWalletData> = async (data: FormWalletData) => {
    setErrMessage("");
    await requestAxios({
      url: baseUrl + "/wallet",
      method: "POST",
      data: {
        name: data.name,
        category: data.category.value,
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
            if (res.isConfirmed) router.push(UserPath.WALLETS);
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
    <UserSettingsLayout backTo={UserPath.WALLETS}>
      <section id="wallet-add " className="flex flex-col gap-y-3 col-span-2">
        <h3 className="text-2xl font-bold">Tambah Dompet Manual</h3>
        <div className="bg-white border-gray-500 rounded-sm p-2 min-h-screen md:min-h-fit flex flex-col gap-y-5">
          <form className="flex" onSubmit={handleSubmit(onSubmit)} ref={ref}>
            <div id="add-wallet-form" className="flex flex-col gap-y-5 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-x-5 gap-y-5">
                <InputForm label="Nama Dompet" id="wallet-name" errors={errors.name?.message}>
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
                        value: 20,
                        message: "Nama dompet maksimal terdiri dari 20 karakter",
                      },
                    })}
                  />
                </InputForm>
                <InputForm
                  label="Nominal Saat Ini"
                  id="wallet-name"
                  errors={errors.amount?.message}>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                      Rp
                    </span>
                    <input
                      type="text"
                      id="amount"
                      className={
                        currencyFormStyle +
                        (errors.amount ? "border-errorRed focus:border-errorRed" : "")
                      }
                      placeholder="Nominal pada dompet"
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
                <InputForm
                  label="Kategori"
                  id="wallet-category-select"
                  errors={errors.category?.message}>
                  <Controller
                    {...register("category", { required: "Kategori dompet perlu diisi" })}
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
                          options={walletCategoriesOpt}
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
                    }}></Controller>
                </InputForm>
              </div>
              <InputForm
                label="Deskripsi (optional)"
                id="wallet-description"
                errors={errors.amount?.message}>
                <textarea
                  rows={2}
                  id="description"
                  placeholder="Deskripsi singkat dompet"
                  maxLength={100}
                  className={
                    baseFormStyle +
                    (errors.description ? "border-errorRed focus:border-errorRed" : "")
                  }
                  {...register("description", {
                    maxLength: {
                      value: 100,
                      message: "Deskripsi maksimal 100 karakter",
                    },
                  })}
                />
              </InputForm>
              <div id="add-wallet-button" className="lg:w-1/2 flex flex-col lg:mx-auto space-y-2">
                <div id="auth-message">
                  {errMessage && <Alert text={errMessage} type="danger" />}
                </div>
                <DefaultButton
                  text="Simpan"
                  color="default"
                  type="submit"
                  className="lg:w-1/2 w-full"
                />
              </div>
            </div>
          </form>
        </div>
      </section>
    </UserSettingsLayout>
  );
}
