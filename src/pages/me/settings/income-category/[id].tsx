import UserSettingsLayout from "@/components/layouts/user/settings";
import Alert from "@/components/tools/alerts/alert";
import FormHelper from "@/components/tools/alerts/form-helper";
import DefaultButton from "@/components/tools/button";
import UserSettingsDeleteBox from "@/components/tools/container/user-settings-delete-box";
import InputForm from "@/components/tools/form/input-form";
import { UserPath } from "@/utils/global/route-path";
import { iconOpt, incomeTypeOpt } from "@/utils/global/select-options";
import {
  baseAlertStyle,
  baseFormStyle,
  deleteAlertStyle,
  deleteButtonStyle,
  selectFormStyle,
} from "@/utils/global/style";
import { CustomAlert } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { ServerMessage } from "@/utils/interfaces/response-message";
import { FormIncomeCategory, IncomeCategory } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";

export default function IncomeCategoryDetails() {
  const [isGlobal, setIsGlobal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const router = useRouter();
  const swal = withReactContent(Swal);
  const dataId = router.query.id;
  const ref = useRef<any>();

  const getCategoryDetail = async () => {
    const res = await requestAxios({
      url: baseUrl + "/income-category/" + dataId,
      method: "GET",
    })
      .then((res) => {
        setValue("id", res.data.id);
        setValue("title", res.data.title);
        setValue("description", res.data.description);
        setValue("created_at", res.data.created_at);
        setValue("updated_at", res.data.updated_at);
        setValue("income_type", {
          value: res.data.income_type,
          label: res.data.income_type == "aktif" ? "Aktif" : "Pasif",
        });
        setValue("icon", {
          value: res.data.icon,
        });
      })
      .catch((err) => {
        return CustomAlert({
          title: "Terjadi kesalahan dalam pengambilan data",
          text: err,
          linkToConfirm: UserPath.INCOME_CATEGORY,
        });
      });
  };

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
      url: baseUrl + "/income-category/update/" + dataId,
      method: "PATCH",
      data: {
        title: data.title,
        income_type: data.income_type.value,
        icon: data.icon.value,
        description: data.description,
      },
    })
      .then((res) => {
        setIsSuccess(true);
        swal
          .fire({
            title: "Kategori berhasil disimpan!",
            icon: "success",
            ...baseAlertStyle,
          })
          .then((res) => {
            if (res.isConfirmed) router.push(UserPath.INCOME_CATEGORY);
          });
      })
      .catch((error) => {
        return CustomAlert({
          linkToConfirm: UserPath.TRANSACTION_INCOME_EDIT + dataId,
          text: error.response?.data?.message,
        });
      });
  };

  useEffect(() => {
    if (router.isReady) {
      getCategoryDetail();
    }
  }, [router.isReady]);

  return (
    <UserSettingsLayout backTo={UserPath.INCOME_CATEGORY}>
      <section className="flex flex-col gap-y-4 col-span-2">
        <div className="grid grid-cols-6 max-[350px]:flex flex-col max-[350px]:gap-y-2 ">
          <h3 className="text-2xl font-bold col-span-4">Ubah kategori</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} ref={ref}>
          <div id="edit-incomecat-form" className="flex flex-col gap-y-5 w-full">
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
                        isSearchable={false}
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
                        options={incomeTypeOpt}
                        value={field.value}
                        placeholder="Pilih kategori"
                        className={
                          errors.income_type ? "border-errorRed focus:border-errorRed" : ""
                        }
                        onChange={field.onChange}
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
                disabled={isGlobal ? true : false}
                {...register("title", {
                  required: "Nama pemasukan harus diisi",
                  minLength: {
                    value: 2,
                    message: "Nama pemasukan minimal 2 karakter",
                  },
                  maxLength: {
                    value: 35,
                    message: "Nama pemasukan maksimal 35 karakter",
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
              label="Deskripsi (optional)"
              errors={errors.description?.message}
              id={"description"}>
              <textarea
                disabled={isGlobal ? true : false}
                {...register("description", {
                  maxLength: {
                    value: 100,
                    message: "Deskripsi maksimal 100 karakter",
                  },
                })}
                rows={2}
                id="description"
                placeholder="Deskripsi singkat kategori"
                maxLength={100}
                className={
                  baseFormStyle +
                  (errors.description ? "border-errorRed focus:border-errorRed" : "")
                }
              />
            </InputForm>
            <div id="add-incomecat-button" className="lg:w-1/2 flex flex-col lg:mx-auto space-y-2">
              <div id="auth-message">{errMessage && <Alert text={errMessage} type="danger" />}</div>
              <DefaultButton
                isSubmitting={isSubmitting}
                type={"submit"}
                color={"default"}
                className="text-center flex place-content-center lg:w-[30%] mt-3">
                Simpan
              </DefaultButton>
            </div>
          </div>
        </form>
      </section>
    </UserSettingsLayout>
  );
}
