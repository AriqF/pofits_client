import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import Alert from "@/components/tools/alerts/alert";
import FormHelper from "@/components/tools/alerts/form-helper";
import DefaultButton from "@/components/tools/button";
import UserSettingContentBox from "@/components/tools/container/user-settings-content-box";
import InputForm from "@/components/tools/form/input-form";
import { UserPath } from "@/utils/global/route-path";
import { baseAlertStyle, baseFormStyle, selectFormStyle } from "@/utils/global/style";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { ServerMessage } from "@/utils/interfaces/response-message";
import { FormIncomeCategory } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { SubmitHandler } from "react-hook-form/dist/types";
import ReactSelect from "react-select";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";
import { iconOpt, incomeTypeOpt } from "@/utils/global/select-options";

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
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormIncomeCategory>();

  const onSubmit: SubmitHandler<FormIncomeCategory> = async (data: FormIncomeCategory) => {
    setErrMessage("");
    await requestAxios({
      url: baseUrl + "/income-category/add/user",
      method: "POST",
      data: {
        title: data.title,
        description: data.description,
        income_type: data.income_type.value,
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
    <UserSettingsLayout backTo={UserPath.INCOME_CATEGORY}>
      <section className="flex flex-col col-span-2 gap-y-4">
        <h3 className="text-2xl font-bold">Tambah Kategori Pemasukan</h3>
        <form onSubmit={handleSubmit(onSubmit)} ref={ref}>
          <div id="add-inccat-form" className="flex flex-col gap-y-5 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-5">
              <InputForm
                label={"Jenis Pemasukan"}
                id={"income-type-select"}
                errors={errors.income_type?.message}>
                <Controller
                  control={control}
                  {...register("income_type", {
                    required: "Jenis pemasukan perlu diisi",
                  })}
                  render={({ field }) => {
                    return (
                      <ReactSelect
                        styles={{
                          control: (baseStyles, state) => ({
                            borderColor: errors.income_type
                              ? "border-errorRed"
                              : "focus:border-errorRed",
                          }),
                        }}
                        classNames={{
                          control: (state) =>
                            selectFormStyle +
                            (errors.income_type ? " border-errorRed focus:border-errorRed" : ""),
                        }}
                        placeholder="Pilih kategori"
                        className={
                          errors.income_type ? "border-errorRed focus:border-errorRed" : ""
                        }
                        value={field.value}
                        options={incomeTypeOpt}
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
                          <div className="inline-flex space-x-3 my-auto">
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
            <InputForm label={"Nama Kategori"} id={"category-name"} errors={errors.title?.message}>
              <input
                {...register("title", { required: "Nama pemasukan harus diisi" })}
                type="text"
                id="title"
                placeholder="Berikan nama yang singkat"
                className={
                  baseFormStyle + (errors.title ? "border-errorRed focus:border-errorRed" : "")
                }
              />
            </InputForm>
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
                className="w-full md:w-1/2"
              />
            </div>
          </div>
        </form>
      </section>
    </UserSettingsLayout>
  );
}
