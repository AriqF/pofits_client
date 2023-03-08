import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import Alert from "@/components/tools/alerts/alert";
import FormHelper from "@/components/tools/alerts/form-helper";
import DefaultButton from "@/components/tools/button";
import UserSettingContentBox from "@/components/tools/container/user-settings-content-box";
import { baseAlertStyle, baseFormStyle } from "@/utils/global/style";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { ServerMessage } from "@/utils/interfaces/response-message";
import { IncomeCategory } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form/dist/types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function UserAddIncomeCategory() {
  const [errMessage, setErrMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);

  const router = useRouter();
  const swal = withReactContent(Swal);
  const ref = useRef<any>();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IncomeCategory>();

  const onSubmit: SubmitHandler<IncomeCategory> = async (data: IncomeCategory) => {
    setErrMessage("");
    await requestAxios({
      url: baseUrl + "/income-category/add/user",
      method: "POST",
      data: {
        title: data.title,
        description: data.description,
        income_type: data.income_type,
      },
    })
      .then(() => {
        setIsSuccess(true);
        swal
          .fire({
            ...baseAlertStyle,
            title: "Kategori berhasil ditambahkan!",
            icon: "success",
          })
          .then((res) => {
            if (res.isConfirmed) router.push("/me/settings/income-category");
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
      <UserSettingsHeader backTo="/me/settings/income-category">
        <h3 className="text-2xl font-bold">Tambah Kategori Pemasukan</h3>
      </UserSettingsHeader>
      <UserSettingContentBox>
        <form className="flex" onSubmit={handleSubmit(onSubmit)} ref={ref}>
          <div id="add-inccat-form" className="flex flex-col gap-y-5 w-full">
            <div>
              <label htmlFor="income-type" className="block mb-2 text-md font-medium text-gray-900">
                Kategori Pemasukan
              </label>
              <select
                id="income-type"
                required
                {...register("income_type", { required: "Jenis pemasukan perlu diisi" })}
                className={
                  baseFormStyle +
                  (errors.income_type ? "border-errorRed focus:border-errorRed" : "")
                }>
                <option value="none" selected disabled hidden>
                  Pilih jenis pemasukan
                </option>
                <option value={"aktif"}>Aktif</option>
                <option value={"pasif"}>Pasif</option>
              </select>
              {errors.income_type && (
                <FormHelper textColor="danger" text={errors.income_type?.message} />
              )}
            </div>
            <div>
              <label htmlFor="title" className="block mb-2 text-md font-medium text-gray-900">
                Nama Kategori
              </label>
              <input
                {...register("title", {
                  required: "Nama kategori harus diisi",
                  minLength: {
                    value: 3,
                    message: "Minimal 3 karakter",
                  },
                  maxLength: {
                    value: 75,
                    message: "Maksimal 75 karakter",
                  },
                })}
                type="text"
                id="title"
                placeholder="Berikan nama yang singkat"
                className={
                  baseFormStyle + (errors.title ? "border-errorRed focus:border-errorRed" : "")
                }
              />
              {errors.title && <FormHelper textColor="danger" text={errors.title?.message} />}
            </div>
            <div>
              <label htmlFor="description" className="block mb-2 text-md font-medium text-gray-900">
                Deskripsi {"(Optional)"}
              </label>
              <textarea
                {...register("description", {
                  maxLength: { value: 225, message: "Maksimal 225 karakter" },
                })}
                rows={2}
                id="description"
                placeholder="Deskripsi singkat kategori"
                maxLength={225}
                className={
                  baseFormStyle +
                  (errors.description ? "border-errorRed focus:border-errorRed" : "")
                }
              />
              {errors.description && (
                <FormHelper textColor="danger" text={errors.description?.message} />
              )}
            </div>
            <div id="add-incomecat-button" className="md:w-1/2 flex flex-col md:mx-auto space-y-2">
              <div id="auth-message">{errMessage && <Alert text={errMessage} type="danger" />}</div>
              <DefaultButton text="Simpan" color="default" type="submit" />
            </div>
          </div>
        </form>
      </UserSettingContentBox>
    </UserSettingsLayout>
  );
}
