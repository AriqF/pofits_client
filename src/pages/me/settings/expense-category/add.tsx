import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import Alert from "@/components/tools/alerts/alert";
import FormHelper from "@/components/tools/alerts/form-helper";
import DefaultButton from "@/components/tools/button";
import UserSettingContentBox from "@/components/tools/container/user-settings-content-box";
import InputForm from "@/components/tools/form/input-form";
import { UserPath } from "@/utils/global/route-path";
import { iconOpt } from "@/utils/global/select-options";
import { baseAlertStyle, baseFormStyle, selectFormStyle } from "@/utils/global/style";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { ServerMessage } from "@/utils/interfaces/response-message";
import { FormExpenseCategory } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";

export default function UserAddExpenseCategory() {
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
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormExpenseCategory>();

  const onSubmit: SubmitHandler<FormExpenseCategory> = async (data: FormExpenseCategory) => {
    setErrMessage("");
    await requestAxios({
      url: baseUrl + "/expense-category/add/user",
      method: "POST",
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon.value,
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
            if (res.isConfirmed) router.push("/me/settings/expense-category");
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
    <UserSettingsLayout backTo={UserPath.EXPENSE_CATEGORY}>
      <section className="flex flex-col col-span-2 gap-y-4">
        <h3 className="text-2xl font-bold">Tambah Kategori Pengeluaran</h3>
        <form onSubmit={handleSubmit(onSubmit)} ref={ref}>
          <div id="add-form" className="flex flex-col gap-y-5 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-5">
              <InputForm
                label={"Nama Kategori"}
                id={"category-name"}
                errors={errors.title?.message}>
                <input
                  {...register("title", {
                    required: "Nama pemasukan harus diisi",
                    maxLength: {
                      value: 75,
                      message: "Nama kategori maksimal 75 karakter",
                    },
                    minLength: {
                      value: 3,
                      message: "Nama kategori minimal 3 karakter",
                    },
                  })}
                  type="text"
                  id="title"
                  placeholder="Berikan nama yang singkat"
                  className={
                    baseFormStyle + (errors.title ? "border-errorRed focus:border-errorRed" : "")
                  }
                />
              </InputForm>
              <InputForm
                label={"Pilih ikon kategori"}
                id={"income-icon-select"}
                errors={errors.icon?.message}>
                <Controller
                  control={control}
                  {...register("icon", {
                    required: "Ikon pemasukan perlu dipilih",
                  })}
                  render={({ field }) => {
                    return (
                      <ReactSelect
                        styles={{
                          control: (baseStyles, state) => ({
                            borderColor: errors.icon ? "border-errorRed" : "focus:border-errorRed",
                          }),
                        }}
                        classNames={{
                          control: (state) =>
                            selectFormStyle +
                            (errors.icon ? " border-errorRed focus:border-errorRed" : ""),
                        }}
                        placeholder="Pilih ikon"
                        className={errors.icon ? "border-errorRed focus:border-errorRed" : ""}
                        value={field.value}
                        options={iconOpt}
                        onChange={field.onChange}
                        formatOptionLabel={(item) => (
                          <div className="inline-flex space-x-3 my-auto place-content-center">
                            <Image
                              src={`/assets/icons/svg/${item.value}.svg`}
                              alt={`icon-${item.value}`}
                              width={25}
                              height={25}
                              className="my-auto"
                            />
                            <p className="my-auto capitalize">{item.value}</p>
                          </div>
                        )}
                      />
                    );
                  }}
                />
              </InputForm>
            </div>
            <InputForm
              label="Deskripsi (optional)"
              errors={errors.description?.message}
              id={"description"}>
              <textarea
                {...register("description")}
                rows={2}
                id="description"
                placeholder="Deskripsi singkat kategori"
                maxLength={255}
                className={
                  baseFormStyle +
                  (errors.description ? "border-errorRed focus:border-errorRed" : "")
                }
              />
            </InputForm>
            <div id="add-incomecat-button" className="md:w-1/2 flex flex-col md:mx-auto space-y-2">
              <div id="auth-message">{errMessage && <Alert text={errMessage} type="danger" />}</div>
              <DefaultButton
                text="Simpan"
                color="default"
                type="submit"
                className="md:w-1/2 w-full"
              />
            </div>
          </div>
        </form>
      </section>
    </UserSettingsLayout>
  );
}
