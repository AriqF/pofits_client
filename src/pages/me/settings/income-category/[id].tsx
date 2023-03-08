import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import Alert from "@/components/tools/alerts/alert";
import FormHelper from "@/components/tools/alerts/form-helper";
import DefaultButton from "@/components/tools/button";
import UserSettingContentBox from "@/components/tools/container/user-settings-content-box";
import UserSettingsDeleteBox from "@/components/tools/container/user-settings-delete-box";
import {
  baseAlertStyle,
  baseFormStyle,
  deleteAlertStyle,
  deleteButtonStyle,
} from "@/utils/global/style";
import { CustomAlert } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { ServerMessage } from "@/utils/interfaces/response-message";
import { ExpenseCategory, IncomeCategory } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { FormHTMLAttributes, LegacyRef, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function IncomeCategoryDetails() {
  const [isGlobal, setIsGlobal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const router = useRouter();
  const swal = withReactContent(Swal);
  const dataId = router.query.id;

  const getCategoryDetail = async () => {
    await requestAxios({
      url: baseUrl + "/income-category/" + dataId,
      method: "GET",
    })
      .then((res) => {
        setValue("id", res.data.id);
        setValue("title", res.data.title);
        setValue("description", res.data.description);
        setValue("income_type", res.data.income_type);
        setValue("created_at", res.data.created_at);
        setValue("updated_at", res.data.updated_at);
        setIsGlobal(res.data.isGlobal);
      })
      .catch((err) => {
        return CustomAlert({ linkToConfirm: "/me/settings/income-category" });
      });
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IncomeCategory>();

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
            url: baseUrl + "/income-category/soft-delete/" + dataId,
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
                  if (res.isConfirmed) router.push("/me/settings/income-category");
                });
            })
            .catch((err) => {
              return swal.fire({
                title: "Kategori gagal dihapus",
                text: err,
                icon: "error",
                showConfirmButton: true,
                ...deleteAlertStyle,
              });
            });
        }
      });
  };

  const onSubmit: SubmitHandler<IncomeCategory> = async (data: IncomeCategory) => {
    setErrMessage("");
    await requestAxios({
      url: baseUrl + "/income-category/update/" + dataId,
      method: "PATCH",
      data: {
        title: data.title,
        income_type: data.income_type,
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

  useEffect(() => {
    if (router.isReady) {
      getCategoryDetail();
    }
  }, [router.isReady]);

  return (
    <UserSettingsLayout>
      <UserSettingsHeader backTo="/me/settings/income-category">
        <div className="grid grid-cols-6 max-[350px]:flex flex-col max-[350px]:gap-y-2 ">
          <h3 className="text-2xl font-bold col-span-4">Ubah kategori</h3>
        </div>
      </UserSettingsHeader>
      <UserSettingContentBox>
        <form className="flex" onSubmit={handleSubmit(onSubmit)}>
          <div id="edit-incomecat-form" className="flex flex-col gap-y-5 w-full">
            <div>
              <label htmlFor="income-type" className="block mb-2 text-md font-medium text-gray-900">
                Kategori Pemasukan
              </label>
              <select
                {...register("income_type", { required: "Jenis pemasukan perlu diisi" })}
                id="income-type"
                disabled={isGlobal ? true : false}
                className={
                  baseFormStyle +
                  (errors.income_type ? "border-errorRed focus:border-errorRed" : "")
                }>
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
                disabled={isGlobal ? true : false}
                {...register("title", { required: "Nama pemasukan harus diisi" })}
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
                disabled={isGlobal ? true : false}
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
              {errors.description && (
                <FormHelper textColor="danger" text={errors.description?.message} />
              )}
            </div>
            <div id="add-incomecat-button" className="md:w-1/2 flex flex-col md:mx-auto space-y-2">
              <div id="auth-message">{errMessage && <Alert text={errMessage} type="danger" />}</div>
              <DefaultButton text="Simpan" color="default" type="submit" className="md:w-1/2" />
            </div>
          </div>
        </form>
      </UserSettingContentBox>
      <UserSettingsDeleteBox
        headerText="Hapus kategori"
        headerDesc="Kamu sudah tidak bisa menggunakan kategori ini untuk menambah kategori pada transaksi mu selanjutnya">
        <button onClick={deleteCategory} title="Hapus data" className={deleteButtonStyle}>
          {/* <BiTrash className="text-2xl m-auto" /> */}
          Hapus Data
        </button>
      </UserSettingsDeleteBox>
    </UserSettingsLayout>
  );
}
