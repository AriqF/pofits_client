import UserBaseLayout from "@/components/layouts/user/layouts";
import { ProfileLayout } from ".";
import { UserPath } from "@/utils/global/route-path";
import { SubmitHandler, useForm } from "react-hook-form";
import { ChangePasswordProfileForm } from "@/utils/interfaces/server-props";
import InputForm from "@/components/tools/form/input-form";
import { baseAlertStyle, baseFormStyle } from "@/utils/global/style";
import { regPassword } from "@/utils/interfaces/regex";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { useRouter } from "next/router";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { CustomAlert } from "@/utils/helper";
import { AxiosError } from "axios";

export default function PrivacySettings() {
  const router = useRouter();
  const swal = withReactContent(Swal);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordProfileForm>({
    reValidateMode: "onSubmit",
  });

  const submitHandler: SubmitHandler<ChangePasswordProfileForm> = async (
    data: ChangePasswordProfileForm
  ) => {
    await requestAxios({
      url: baseUrl + "/user/profile/password",
      method: "PATCH",
      data: {
        old_password: data.old_password,
        password: data.password,
        password_confirmation: data.password_confirmation,
      },
    })
      .then((res) => {
        swal
          .fire({
            title: "Kata sandi berhasil dirubah",
            icon: "success",
            ...baseAlertStyle,
          })
          .then((res) => {
            if (res.isConfirmed) {
              router.reload();
              router.push(UserPath.PROFILE_PRIVACY);
            }
          });
      })
      .catch((error) => {
        console.log(error);
        return CustomAlert({
          linkToConfirm: UserPath.PROFILE_PRIVACY,
          text: error.response?.data?.message,
        });
      });
  };

  const PrivacySection = () => {
    return (
      <section id="profile-info" className="flex flex-col gap-y-4">
        <h5 className="text-lg font-semibold text-gray-800">Ubah Kata Sandi</h5>
        <form className="flex flex-col gap-4 lg:w-[40%]" onSubmit={handleSubmit(submitHandler)}>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 ">
            <InputForm
              label={"Konfirmasi kata sandi lama"}
              id={"old_password"}
              errors={errors.old_password?.message}>
              <input
                type="password"
                id="old_password"
                placeholder="Konfirmasi kata sandi lama"
                className={
                  baseFormStyle +
                  (errors.old_password ? "border-errorRed focus:border-errorRed" : "")
                }
                {...register("old_password", {
                  required: {
                    value: true,
                    message: "Masukkan kata sandi anda",
                  },
                })}
              />
            </InputForm>
            <InputForm label={"Kata sandi baru"} id={"password"} errors={errors.password?.message}>
              <input
                type="password"
                id="password"
                placeholder="Buat kata sandi yang kuat"
                className={
                  baseFormStyle + (errors.password ? "border-errorRed focus:border-errorRed" : "")
                }
                {...register("password", {
                  required: {
                    value: true,
                    message: "Harap membuat kata sandi",
                  },
                  minLength: {
                    value: 5,
                    message: "Kata sandi harus minimal 5 huruf",
                  },
                  pattern: {
                    value: regPassword,
                    message:
                      "Kata sandi harus terdapat minimal 1 huruf kecil dan angka atau simbol",
                  },
                })}
              />
            </InputForm>
            <InputForm
              label={"Konfirmasi kata sandi baru"}
              id={"password_confirmation"}
              errors={errors.password_confirmation?.message}>
              <input
                type="password"
                id="password_confirmation"
                placeholder="Konfirmasi kata sandi baru"
                className={
                  baseFormStyle +
                  (errors.password_confirmation ? "border-errorRed focus:border-errorRed" : "")
                }
                {...register("password_confirmation", {
                  required: {
                    value: true,
                    message: "Harap membuat kata sandi",
                  },
                  minLength: {
                    value: 5,
                    message: "Kata sandi harus minimal 5 huruf",
                  },
                  pattern: {
                    value: regPassword,
                    message:
                      "Kata sandi harus terdapat minimal 1 huruf kecil dan angka atau simbol",
                  },
                  validate: (value) => {
                    const { password } = getValues();
                    return password === value || "Kata sandi tidak sama";
                  },
                })}
              />
            </InputForm>
          </div>
          <button
            type="submit"
            className={
              "border bg-palepurple text-white hover:bg-hovpalepurple mt-3 " +
              "inline-flex place-content-center text-center font-semibold focus:ring-1 focus:outline-none " +
              "rounded-md text-md px-4 py-3 w-full m-auto transition-colors duration-200 " +
              "w-full lg:w-[20%]"
            }>
            Simpan
          </button>
        </form>
      </section>
    );
  };

  return (
    <ProfileLayout backTo={UserPath.PROFILE}>
      <h2 className="text-2xl text-gray-600">Pengaturan Privasi Akun</h2>
      <PrivacySection />
    </ProfileLayout>
  );
}
