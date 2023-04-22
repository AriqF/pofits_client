import UserSettingsLayout from "@/components/layouts/user/settings";
import Alert from "@/components/tools/alerts/alert";
import DefaultButton from "@/components/tools/button";
import InputForm from "@/components/tools/form/input-form";
import { UserPath } from "@/utils/global/route-path";
import { iconOpt } from "@/utils/global/select-options";
import {
  baseAlertStyle,
  baseFormStyle,
  deleteAlertStyle,
  selectFormStyle,
} from "@/utils/global/style";
import { CustomAlert } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { ServerMessage } from "@/utils/interfaces/response-message";
import { FormExpenseCategory } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";

export default function ExpenseCategoryDetail() {
  const [isGlobal, setIsGlobal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const swal = withReactContent(Swal);
  const ref = useRef<any>();
  const router = useRouter();
  const dataId = router.query.id;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormExpenseCategory>();

  const getCategoryDetail = async () => {
    await requestAxios({
      url: baseUrl + "/expense-category/" + dataId,
      method: "GET",
    })
      .then((res) => {
        setValue("id", res.data.id);
        setValue("title", res.data.title);
        setValue("description", res.data.description);
        setValue("created_at", res.data.created_at);
        setValue("updated_at", res.data.updated_at);
        setValue("icon", { value: res.data.icon });
        setIsGlobal(res.data.isGlobal);
      })
      .catch((err) => {
        return CustomAlert({ linkToConfirm: UserPath.EXPENSE_CATEGORY });
      });
  };

  const onSubmit: SubmitHandler<FormExpenseCategory> = async (data: FormExpenseCategory) => {
    setErrMessage("");
    await requestAxios({
      url: baseUrl + "/expense-category/update/" + dataId,
      method: "PATCH",
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon.value,
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
            if (res.isConfirmed) router.push(UserPath.EXPENSE_CATEGORY);
          });
      })
      .catch((error) => {
        setIsServerError(true);
        error.response?.data?.message
          ? setErrMessage(error.response.data.message)
          : setErrMessage(ServerMessage.RequestError);
      });
  };

  const deleteCategory = () => {
    swal
      .fire({
        title: "Hapus kategori?",
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Hapus kategori",
        cancelButtonText: "Batal",
        ...deleteAlertStyle,
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          await requestAxios({
            url: baseUrl + "/expense-category/soft-delete/" + dataId,
            method: "DELETE",
          })
            .then(() => {
              return swal
                .fire({
                  title: "Kategori berhasil dihapus",
                  icon: "success",
                  showConfirmButton: true,
                  ...baseAlertStyle,
                })
                .then((res) => {
                  if (res.isConfirmed) router.push(UserPath.EXPENSE_CATEGORY);
                });
            })
            .catch(() => {
              setErrMessage(ServerMessage.DeleteError);
            });
        }
      });
  };

  useEffect(() => {
    if (router.isReady) {
      getCategoryDetail();
    }
  }, [router.isReady]);

  return (
    <UserSettingsLayout backTo={UserPath.EXPENSE_CATEGORY}>
      <section className="flex flex-col gap-y-4 col-span-2">
        <div className="grid grid-cols-6 max-[350px]:flex flex-col max-[350px]:gap-y-2 ">
          <h3 className="text-2xl font-bold col-span-4">Ubah kategori</h3>
        </div>
        <form className="flex" onSubmit={handleSubmit(onSubmit)} ref={ref}>
          <div id="add-inccat-form" className="flex flex-col gap-y-5 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-5">
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
            <InputForm label={"Nama Kategori"} id={"category-name"} errors={errors.title?.message}>
              <input
                disabled={isGlobal ? true : false}
                {...register("title", {
                  required: "Nama pemasukan harus diisi",
                  maxLength: {
                    value: 35,
                    message: "Nama kategori maksimal 35 karakter",
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
      {/* <section className="flex flex-col col-span-1">
        <Container className="shadow-md border border-gray-300 gap-y-2 text-center p-3">
          <div className="flex flex-col gap-y-2 ">
            <h4 className="text-xl inline-flex gap-x-2 place-content-center">
              <MdWarningAmber className="my-auto" /> Hapus Kategori
            </h4>
            <p className="text-base text-gray-500">
              Kamu sudah tidak bisa menggunakan kategori ini untuk menambah kategori pada transaksi
              mu selanjutnya
            </p>
          </div>
          <button
            onClick={deleteCategory}
            title="Hapus data"
            className={deleteButtonStyle + " m-auto"}>
            Hapus
          </button>
        </Container>
      </section> */}
    </UserSettingsLayout>
  );
}
